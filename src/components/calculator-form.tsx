"use client";

import { useState, useCallback, useRef } from "react";
import type { CalculatorVariant, CalculatorResult } from "@/calculators/types";
import { trackEvent } from "@/lib/analytics";

interface CalculatorFormProps {
  variant: CalculatorVariant;
  calculatorSlug?: string;
  compact?: boolean;
}

export function CalculatorForm({ variant, calculatorSlug, compact }: CalculatorFormProps) {
  const hasTrackedInteraction = useRef(false);
  const [inputs, setInputs] = useState<Record<string, number | string>>(() => {
    const defaults: Record<string, number | string> = {};
    for (const field of variant.fields) {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    }
    return defaults;
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleChange = useCallback(
    (name: string, value: string, type: string) => {
      const newInputs = { ...inputs };
      if (type === "number") {
        const parsed = value === "" ? "" : parseFloat(value);
        newInputs[name] = parsed === "" || isNaN(parsed as number) ? "" : (parsed as number);
      } else {
        newInputs[name] = value;
      }
      setInputs(newInputs);

      // Real-time calculation (like OmniCalculator)
      const cleanedInputs: Record<string, number | string> = {};
      for (const [k, v] of Object.entries(newInputs)) {
        if (v !== "" && v !== undefined) {
          cleanedInputs[k] = v;
        }
      }
      // Track first interaction with this variant
      if (!hasTrackedInteraction.current) {
        hasTrackedInteraction.current = true;
        trackEvent("calculator_interaction", {
          calculator: calculatorSlug || "unknown",
          variant: variant.id,
        });
      }

      const res = variant.calculate(cleanedInputs);
      if (res && !result) {
        // First successful calculation
        trackEvent("calculator_completed", {
          calculator: calculatorSlug || "unknown",
          variant: variant.id,
        });
      }
      setResult(res);
    },
    [inputs, variant]
  );

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 ${compact ? "p-4" : "p-6"}`}
    >
      <h3
        className={`font-semibold text-gray-900 ${compact ? "text-base mb-3" : "text-lg mb-1"}`}
      >
        {variant.name}
      </h3>
      {variant.description && !compact && (
        <p className="text-sm text-gray-500 mb-4">{variant.description}</p>
      )}

      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2 grid-cols-1"}`}>
        {variant.fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`${variant.id}-${field.name}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                id={`${variant.id}-${field.name}`}
                value={(inputs[field.name] as string) ?? field.defaultValue ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value, "select")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                {field.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {field.prefix}
                  </span>
                )}
                <input
                  id={`${variant.id}-${field.name}`}
                  type="number"
                  inputMode="decimal"
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step ?? "any"}
                  value={inputs[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value, "number")}
                  className={`w-full rounded-lg border border-gray-300 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    field.prefix ? "pl-7 pr-3" : "px-3"
                  } ${field.suffix ? "pr-12" : ""}`}
                />
                {field.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {field.suffix}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {result && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-blue-700">{result.primary.label}:</span>
            <span className="text-2xl font-bold text-blue-900">
              {result.primary.value}
              {result.primary.suffix && (
                <span className="text-lg ml-1">{result.primary.suffix}</span>
              )}
            </span>
          </div>
          {result.details && result.details.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.details.map((d, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{d.label}</span>
                  <span className="font-medium text-gray-900">{d.value}</span>
                </div>
              ))}
            </div>
          )}
          {result.note && (
            <p className="mt-2 text-xs text-gray-500">{result.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

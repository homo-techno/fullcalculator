"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { CalculatorVariant, CalculatorResult } from "@/calculators/types";
import {
  trackCalculatorStart,
  trackCalculatorComplete,
  trackCalculatorAbandon,
  trackResultAction,
  trackFeedback,
} from "@/lib/analytics";

interface CalculatorFormProps {
  variant: CalculatorVariant;
  calculatorSlug?: string;
  compact?: boolean;
}

export function CalculatorForm({ variant, calculatorSlug, compact }: CalculatorFormProps) {
  const slug = calculatorSlug || "unknown";
  const hasTrackedStart = useRef(false);
  const hasTrackedComplete = useRef(false);
  const startTime = useRef<number>(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

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

  // Track abandonment on page leave
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        hasTrackedStart.current &&
        !hasTrackedComplete.current
      ) {
        const filledCount = Object.values(inputs).filter(
          (v) => v !== "" && v !== undefined
        ).length;
        trackCalculatorAbandon(slug, filledCount, variant.fields.length);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [inputs, slug, variant.fields.length]);

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

      // Track first interaction
      if (!hasTrackedStart.current) {
        hasTrackedStart.current = true;
        startTime.current = Date.now();
        trackCalculatorStart(slug, variant.id);
      }

      // Real-time calculation
      const cleanedInputs: Record<string, number | string> = {};
      for (const [k, v] of Object.entries(newInputs)) {
        if (v !== "" && v !== undefined) {
          cleanedInputs[k] = v;
        }
      }

      const res = variant.calculate(cleanedInputs);

      // Track first successful result
      if (res && !hasTrackedComplete.current) {
        hasTrackedComplete.current = true;
        const elapsed = startTime.current ? Date.now() - startTime.current : 0;
        trackCalculatorComplete(slug, variant.id, elapsed);
      }

      setResult(res);
    },
    [inputs, variant, slug]
  );

  const handleCopyResult = useCallback(() => {
    if (!result) return;
    const text = `${result.primary.label}: ${result.primary.value}${result.primary.suffix || ""}`;
    navigator.clipboard.writeText(text);
    trackResultAction(slug, "copy");
  }, [result, slug]);

  const handleFeedback = useCallback(
    (helpful: boolean) => {
      trackFeedback(slug, helpful);
      setFeedbackGiven(true);
    },
    [slug]
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
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-blue-700">{result.primary.label}:</span>
              <span className="text-2xl font-bold text-blue-900">
                {result.primary.value}
                {result.primary.suffix && (
                  <span className="text-lg ml-1">{result.primary.suffix}</span>
                )}
              </span>
            </div>
            <button
              onClick={handleCopyResult}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors shrink-0"
              title="Copy result"
            >
              Copy
            </button>
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

          {/* Feedback widget */}
          {!compact && (
            <div className="mt-3 pt-3 border-t border-blue-100">
              {feedbackGiven ? (
                <p className="text-xs text-blue-600">Thanks for your feedback!</p>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback(true)}
                    className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

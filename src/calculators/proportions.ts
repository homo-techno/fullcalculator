import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const proportionsCalculator: CalculatorDefinition = {
  slug: "proportions-calculator",
  title: "Proportions Calculator",
  description: "Free proportions calculator. Solve proportions (a/b = c/d), find the missing value, and check if ratios are proportional.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["proportions calculator", "solve proportion", "cross multiply", "ratio proportion", "missing value proportion"],
  variants: [
    {
      id: "solve",
      name: "Solve a/b = c/d (leave one blank)",
      fields: [
        { name: "a", label: "a", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "b", type: "number", placeholder: "e.g. 4" },
        { name: "c", label: "c", type: "number", placeholder: "e.g. 9" },
        { name: "d", label: "d (leave blank to solve)", type: "number", placeholder: "?" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        const c = inputs.c as number, d = inputs.d as number;
        const defined = [a, b, c, d].filter(v => v !== undefined && v !== null);
        if (defined.length < 3) return null;
        let missing: string, result: number;
        if (d === undefined || d === null || (d === 0 && a !== undefined && b !== undefined && c !== undefined)) {
          if (!b || !a === undefined) return null;
          result = (b * c) / a;
          missing = "d";
        } else if (c === undefined || c === null) {
          if (!b) return null;
          result = (a * d) / b;
          missing = "c";
        } else if (b === undefined || b === null) {
          if (!c) return null;
          result = (a * d) / c;
          missing = "b";
        } else {
          if (!d) return null;
          result = (b * c) / d;
          missing = "a";
        }
        return {
          primary: { label: `${missing} =`, value: formatNumber(result, 6) },
          details: [
            { label: "Proportion", value: `${a ?? "?"} / ${b ?? "?"} = ${c ?? "?"} / ${d ?? "?"}` },
            { label: "Cross products", value: `${formatNumber((a ?? result) * (d ?? result), 4)} = ${formatNumber((b ?? result) * (c ?? result), 4)}` },
          ],
        };
      },
    },
    {
      id: "check",
      name: "Check Proportionality",
      fields: [
        { name: "a", label: "a", type: "number", placeholder: "e.g. 2" },
        { name: "b", label: "b", type: "number", placeholder: "e.g. 3" },
        { name: "c", label: "c", type: "number", placeholder: "e.g. 4" },
        { name: "d", label: "d", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        const c = inputs.c as number, d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined) return null;
        const cross1 = a * d, cross2 = b * c;
        const proportional = Math.abs(cross1 - cross2) < 0.0001;
        return {
          primary: { label: `${a}/${b} = ${c}/${d}?`, value: proportional ? "Yes — Proportional" : "No — Not Proportional" },
          details: [
            { label: "a/b", value: b ? formatNumber(a / b, 6) : "undefined" },
            { label: "c/d", value: d ? formatNumber(c / d, 6) : "undefined" },
            { label: "a×d", value: formatNumber(cross1, 4) },
            { label: "b×c", value: formatNumber(cross2, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ratio-calculator", "percentage-calculator", "fraction-calculator"],
  faq: [{ question: "How do I solve a proportion?", answer: "Cross-multiply: if a/b = c/d, then a×d = b×c. To find d: d = (b×c)/a. For example, 3/4 = 9/d: d = (4×9)/3 = 12." }],
  formula: "a/b = c/d → a×d = b×c",
};

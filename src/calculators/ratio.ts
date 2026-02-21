import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export const ratioCalculator: CalculatorDefinition = {
  slug: "ratio-calculator",
  title: "Ratio Calculator",
  description: "Free ratio calculator. Solve proportions, simplify ratios, and scale ratios up or down. Perfect for recipes, maps, and math problems.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["ratio calculator", "proportion calculator", "ratio solver", "simplify ratio", "scale ratio calculator"],
  variants: [
    {
      id: "proportion",
      name: "Solve Proportion",
      description: "Find the missing value: A/B = C/D (leave one field empty)",
      fields: [
        { name: "a", label: "A", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "B", type: "number", placeholder: "e.g. 4" },
        { name: "c", label: "C", type: "number", placeholder: "e.g. 9" },
        { name: "d", label: "D", type: "number", placeholder: "leave empty" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;

        const hasA = a !== undefined && a !== null && String(a) !== "";
        const hasB = b !== undefined && b !== null && String(b) !== "";
        const hasC = c !== undefined && c !== null && String(c) !== "";
        const hasD = d !== undefined && d !== null && String(d) !== "";

        const count = [hasA, hasB, hasC, hasD].filter(Boolean).length;
        if (count < 3) return null;

        let result: number;
        let label: string;
        if (!hasD && hasA && hasB && hasC) {
          result = (b * c) / a;
          label = "D";
        } else if (!hasC && hasA && hasB && hasD) {
          result = (a * d) / b;
          label = "C";
        } else if (!hasB && hasA && hasC && hasD) {
          result = (a * d) / c;
          label = "B";
        } else if (!hasA && hasB && hasC && hasD) {
          result = (b * c) / d;
          label = "A";
        } else {
          return null;
        }

        const aVal = hasA ? a : result;
        const bVal = hasB ? b : result;
        const cVal = hasC ? c : result;
        const dVal = hasD ? d : result;

        return {
          primary: { label: `Missing value (${label})`, value: formatNumber(result, 4) },
          details: [
            { label: "Proportion", value: `${formatNumber(aVal, 4)}/${formatNumber(bVal, 4)} = ${formatNumber(cVal, 4)}/${formatNumber(dVal, 4)}` },
            { label: "Ratio (left)", value: `${formatNumber(aVal, 4)} : ${formatNumber(bVal, 4)}` },
            { label: "Ratio (right)", value: `${formatNumber(cVal, 4)} : ${formatNumber(dVal, 4)}` },
          ],
        };
      },
    },
    {
      id: "simplify",
      name: "Simplify Ratio",
      description: "Reduce a ratio to its simplest form",
      fields: [
        { name: "a", label: "First Number", type: "number", placeholder: "e.g. 12" },
        { name: "b", label: "Second Number", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        if (!a || !b) return null;
        const g = gcd(a, b);
        const simplA = a / g;
        const simplB = b / g;
        return {
          primary: { label: "Simplified Ratio", value: `${simplA} : ${simplB}` },
          details: [
            { label: "Original ratio", value: `${a} : ${b}` },
            { label: "GCD", value: `${g}` },
            { label: "As fraction", value: `${simplA}/${simplB}` },
            { label: "As decimal", value: formatNumber(a / b, 6) },
          ],
        };
      },
    },
    {
      id: "scale",
      name: "Scale Ratio",
      description: "Scale a ratio to a target value for one side",
      fields: [
        { name: "a", label: "Ratio A", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "Ratio B", type: "number", placeholder: "e.g. 5" },
        { name: "target", label: "Scale A to", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const target = inputs.target as number;
        if (!a || !b || !target) return null;
        const factor = target / a;
        const scaledB = b * factor;
        return {
          primary: { label: "Scaled Ratio", value: `${formatNumber(target)} : ${formatNumber(scaledB, 4)}` },
          details: [
            { label: "Original ratio", value: `${a} : ${b}` },
            { label: "Scale factor", value: `×${formatNumber(factor, 4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "fraction-calculator", "proportion-calculator"],
  faq: [
    { question: "How do I solve a proportion?", answer: "Cross-multiply: if A/B = C/D, then A×D = B×C. To find a missing value, rearrange: D = B×C/A. For example, 3/4 = 9/D → D = 4×9/3 = 12." },
    { question: "How do I simplify a ratio?", answer: "Divide both numbers by their Greatest Common Divisor (GCD). For example, 12:8 → GCD is 4 → 12/4 : 8/4 = 3:2." },
  ],
  formula: "A/B = C/D → A×D = B×C | Simplified: divide by GCD",
};

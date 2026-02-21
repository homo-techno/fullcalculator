import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const numberSequenceCalculator: CalculatorDefinition = {
  slug: "number-sequence-calculator",
  title: "Number Sequence Calculator",
  description: "Free number sequence calculator. Find the nth term and sum of arithmetic and geometric sequences and series.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["number sequence calculator", "arithmetic sequence", "geometric sequence", "series calculator", "nth term calculator"],
  variants: [
    {
      id: "arithmetic",
      name: "Arithmetic Sequence",
      description: "Each term increases by a constant difference (d)",
      fields: [
        { name: "a1", label: "First Term (a₁)", type: "number", placeholder: "e.g. 2" },
        { name: "d", label: "Common Difference (d)", type: "number", placeholder: "e.g. 3" },
        { name: "n", label: "Find Term # (n)", type: "number", placeholder: "e.g. 10", min: 1, max: 1000 },
      ],
      calculate: (inputs) => {
        const a1 = inputs.a1 as number;
        const d = inputs.d as number;
        const n = inputs.n as number;
        if (a1 === undefined || d === undefined || !n) return null;
        const an = a1 + (n - 1) * d;
        const sum = (n / 2) * (a1 + an);
        const first5 = Array.from({ length: Math.min(n, 5) }, (_, i) => a1 + i * d).join(", ");
        return {
          primary: { label: `Term #${n}`, value: formatNumber(an) },
          details: [
            { label: `Sum of first ${n} terms`, value: formatNumber(sum) },
            { label: "First terms", value: `${first5}${n > 5 ? ", ..." : ""}` },
            { label: "Common difference", value: formatNumber(d) },
            { label: "Formula", value: `aₙ = ${a1} + (n-1)×${d}` },
          ],
        };
      },
    },
    {
      id: "geometric",
      name: "Geometric Sequence",
      description: "Each term is multiplied by a constant ratio (r)",
      fields: [
        { name: "a1", label: "First Term (a₁)", type: "number", placeholder: "e.g. 2" },
        { name: "r", label: "Common Ratio (r)", type: "number", placeholder: "e.g. 3" },
        { name: "n", label: "Find Term # (n)", type: "number", placeholder: "e.g. 8", min: 1, max: 50 },
      ],
      calculate: (inputs) => {
        const a1 = inputs.a1 as number;
        const r = inputs.r as number;
        const n = inputs.n as number;
        if (a1 === undefined || !r || !n) return null;
        const an = a1 * Math.pow(r, n - 1);
        const sum = r === 1 ? a1 * n : a1 * (Math.pow(r, n) - 1) / (r - 1);
        const first5 = Array.from({ length: Math.min(n, 5) }, (_, i) => a1 * Math.pow(r, i));
        return {
          primary: { label: `Term #${n}`, value: Math.abs(an) > 1e12 ? an.toExponential(4) : formatNumber(an) },
          details: [
            { label: `Sum of first ${n} terms`, value: Math.abs(sum) > 1e12 ? sum.toExponential(4) : formatNumber(sum) },
            { label: "First terms", value: first5.map(v => formatNumber(v)).join(", ") + (n > 5 ? ", ..." : "") },
            { label: "Common ratio", value: formatNumber(r) },
            ...(Math.abs(r) < 1 ? [{ label: "Infinite sum (|r|<1)", value: formatNumber(a1 / (1 - r), 6) }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["factorial-calculator", "average-calculator", "scientific-calculator"],
  faq: [
    { question: "What is an arithmetic sequence?", answer: "A sequence where each term increases by a constant difference d. Example: 2, 5, 8, 11, 14 (d=3). nth term: aₙ = a₁ + (n-1)d. Sum: Sₙ = n(a₁+aₙ)/2." },
    { question: "What is a geometric sequence?", answer: "A sequence where each term is multiplied by a constant ratio r. Example: 2, 6, 18, 54 (r=3). nth term: aₙ = a₁ × r^(n-1). Sum: Sₙ = a₁(r^n - 1)/(r-1)." },
  ],
  formula: "Arithmetic: aₙ = a₁ + (n-1)d | Geometric: aₙ = a₁ × r^(n-1)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishersExactCalculator: CalculatorDefinition = {
  slug: "fishers-exact-calculator",
  title: "Fisher's Exact Test Calculator",
  description: "Free Fisher's exact test calculator. Analyze 2x2 contingency tables for association between categorical variables with exact probability.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["fishers exact test", "2x2 contingency table", "categorical association", "exact test"],
  variants: [{
    id: "two-by-two", name: "2x2 Contingency Table",
    fields: [
      { name: "a", label: "Cell a (Row 1, Col 1)", type: "number", placeholder: "e.g. 10", min: 0 },
      { name: "b", label: "Cell b (Row 1, Col 2)", type: "number", placeholder: "e.g. 5", min: 0 },
      { name: "c", label: "Cell c (Row 2, Col 1)", type: "number", placeholder: "e.g. 3", min: 0 },
      { name: "dd", label: "Cell d (Row 2, Col 2)", type: "number", placeholder: "e.g. 12", min: 0 },
    ],
    calculate: (inputs) => {
      const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number, dd = inputs.dd as number;
      if ([a, b, c, dd].some((v) => v === undefined || isNaN(v) || v < 0)) return null;
      const n = a + b + c + dd;
      if (n === 0) return null;
      const r1 = a + b, r2 = c + dd, c1 = a + c, c2 = b + dd;
      function logFact(x: number) { let s = 0; for (let i = 2; i <= x; i++) s += Math.log(i); return s; }
      const logP = logFact(r1) + logFact(r2) + logFact(c1) + logFact(c2) - logFact(n) - logFact(a) - logFact(b) - logFact(c) - logFact(dd);
      const pExact = Math.exp(logP);
      const chiSq = n > 0 ? (n * Math.pow(a * dd - b * c, 2)) / ((r1 * r2 * c1 * c2) || 1) : 0;
      const or = (b * c) === 0 ? Infinity : (a * dd) / (b * c);
      return {
        primary: { label: "Fisher Exact p (this table)", value: formatNumber(pExact, 6) },
        details: [
          { label: "Chi-Square", value: formatNumber(chiSq, 4) },
          { label: "Odds Ratio", value: formatNumber(or, 4) },
          { label: "Row 1 Total", value: formatNumber(r1) },
          { label: "Row 2 Total", value: formatNumber(r2) },
          { label: "Grand Total", value: formatNumber(n) },
        ],
      };
    },
  }],
  relatedSlugs: ["odds-ratio-calculator", "relative-risk-calculator"],
  faq: [{ question: "What is Fisher's exact test?", answer: "An exact test for association in 2x2 tables, useful with small sample sizes where chi-square may be unreliable." }],
  formula: "p = (R1! R2! C1! C2!) / (N! a! b! c! d!)",
};

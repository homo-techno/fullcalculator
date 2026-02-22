import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const relativeRiskCalculator: CalculatorDefinition = {
  slug: "relative-risk-calculator",
  title: "Relative Risk Calculator",
  description: "Free relative risk calculator. Calculate risk ratio, confidence interval, and attributable risk from a 2x2 table.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["relative risk calculator", "risk ratio", "attributable risk", "cohort study"],
  variants: [{
    id: "two-by-two", name: "2x2 Table",
    fields: [
      { name: "a", label: "Exposed with Outcome (a)", type: "number", placeholder: "e.g. 30", min: 0 },
      { name: "b", label: "Exposed without Outcome (b)", type: "number", placeholder: "e.g. 70", min: 0 },
      { name: "c", label: "Unexposed with Outcome (c)", type: "number", placeholder: "e.g. 10", min: 0 },
      { name: "dd", label: "Unexposed without Outcome (d)", type: "number", placeholder: "e.g. 90", min: 0 },
    ],
    calculate: (inputs) => {
      const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number, dd = inputs.dd as number;
      if ([a, b, c, dd].some((v) => v === undefined || isNaN(v) || v < 0)) return null;
      const n1 = a + b, n2 = c + dd;
      if (n1 === 0 || n2 === 0) return null;
      const p1 = a / n1, p2 = c / n2;
      if (p2 === 0) return null;
      const rr = p1 / p2;
      const logRR = Math.log(rr);
      const seLnRR = Math.sqrt((1 - p1) / (a || 0.5) + (1 - p2) / (c || 0.5));
      const ciLower = Math.exp(logRR - 1.96 * seLnRR);
      const ciUpper = Math.exp(logRR + 1.96 * seLnRR);
      const ard = p1 - p2;
      return {
        primary: { label: "Relative Risk", value: formatNumber(rr, 4) },
        details: [
          { label: "95% CI Lower", value: formatNumber(ciLower, 4) },
          { label: "95% CI Upper", value: formatNumber(ciUpper, 4) },
          { label: "Risk in Exposed", value: formatNumber(p1, 4) },
          { label: "Risk in Unexposed", value: formatNumber(p2, 4) },
          { label: "Absolute Risk Difference", value: formatNumber(ard, 4) },
          { label: "NNT (approx)", value: formatNumber(ard === 0 ? Infinity : Math.ceil(Math.abs(1 / ard)), 0) },
        ],
      };
    },
  }],
  relatedSlugs: ["odds-ratio-calculator", "number-needed-treat-calculator", "fishers-exact-calculator"],
  faq: [{ question: "What is relative risk?", answer: "Relative risk compares the probability of an outcome in an exposed group to that in an unexposed group. RR > 1 means higher risk with exposure." }],
  formula: "RR = (a/(a+b)) / (c/(c+d))",
};

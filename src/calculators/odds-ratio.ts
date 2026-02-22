import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oddsRatioCalculator: CalculatorDefinition = {
  slug: "odds-ratio-calculator",
  title: "Odds Ratio Calculator",
  description: "Free odds ratio calculator. Calculate odds ratio, confidence interval, and interpretation from a 2x2 contingency table.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["odds ratio calculator", "odds ratio", "2x2 table", "case control", "association measure"],
  variants: [{
    id: "two-by-two", name: "2x2 Table",
    fields: [
      { name: "a", label: "Exposed Cases (a)", type: "number", placeholder: "e.g. 30", min: 0 },
      { name: "b", label: "Exposed Controls (b)", type: "number", placeholder: "e.g. 20", min: 0 },
      { name: "c", label: "Unexposed Cases (c)", type: "number", placeholder: "e.g. 10", min: 0 },
      { name: "dd", label: "Unexposed Controls (d)", type: "number", placeholder: "e.g. 40", min: 0 },
    ],
    calculate: (inputs) => {
      const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number, dd = inputs.dd as number;
      if ([a, b, c, dd].some((v) => v === undefined || isNaN(v) || v < 0)) return null;
      if (b * c === 0) return null;
      const or = (a * dd) / (b * c);
      const logOR = Math.log(or);
      const seLnOR = Math.sqrt(1 / Math.max(a, 0.5) + 1 / Math.max(b, 0.5) + 1 / Math.max(c, 0.5) + 1 / Math.max(dd, 0.5));
      const ciLower = Math.exp(logOR - 1.96 * seLnOR);
      const ciUpper = Math.exp(logOR + 1.96 * seLnOR);
      const interp = or > 1 ? "Exposure increases odds" : or < 1 ? "Exposure decreases odds" : "No association";
      return {
        primary: { label: "Odds Ratio", value: formatNumber(or, 4) },
        details: [
          { label: "95% CI Lower", value: formatNumber(ciLower, 4) },
          { label: "95% CI Upper", value: formatNumber(ciUpper, 4) },
          { label: "ln(OR)", value: formatNumber(logOR, 4) },
          { label: "SE of ln(OR)", value: formatNumber(seLnOR, 4) },
          { label: "Interpretation", value: interp },
        ],
      };
    },
  }],
  relatedSlugs: ["relative-risk-calculator", "fishers-exact-calculator"],
  faq: [{ question: "What is an odds ratio?", answer: "The odds ratio measures association between exposure and outcome. OR > 1 suggests increased odds, OR < 1 decreased odds, OR = 1 no association." }],
  formula: "OR = (a*d)/(b*c). 95% CI = exp(ln(OR) +/- 1.96*SE)",
};

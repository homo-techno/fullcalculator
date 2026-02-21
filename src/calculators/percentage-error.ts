import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percentageErrorCalculator: CalculatorDefinition = {
  slug: "percentage-error-calculator",
  title: "Percentage Error Calculator",
  description: "Free percentage error calculator. Calculate percent error, absolute error, and relative error between experimental and actual values.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["percentage error calculator", "percent error", "absolute error", "relative error", "experimental error"],
  variants: [
    {
      id: "percentError",
      name: "Percent Error",
      fields: [
        { name: "experimental", label: "Experimental (Measured) Value", type: "number", placeholder: "e.g. 10.2" },
        { name: "actual", label: "Actual (Accepted) Value", type: "number", placeholder: "e.g. 10.0" },
      ],
      calculate: (inputs) => {
        const exp = inputs.experimental as number, act = inputs.actual as number;
        if (exp === undefined || act === undefined || act === 0) return null;
        const absErr = Math.abs(exp - act);
        const pctErr = (absErr / Math.abs(act)) * 100;
        const relErr = absErr / Math.abs(act);
        return {
          primary: { label: "Percent Error", value: `${formatNumber(pctErr, 4)}%` },
          details: [
            { label: "Absolute error", value: formatNumber(absErr, 6) },
            { label: "Relative error", value: formatNumber(relErr, 6) },
            { label: "Difference", value: formatNumber(exp - act, 6) },
          ],
        };
      },
    },
    {
      id: "percentDiff",
      name: "Percent Difference",
      fields: [
        { name: "v1", label: "Value 1", type: "number", placeholder: "e.g. 45" },
        { name: "v2", label: "Value 2", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const v1 = inputs.v1 as number, v2 = inputs.v2 as number;
        if (v1 === undefined || v2 === undefined) return null;
        const avg = (Math.abs(v1) + Math.abs(v2)) / 2;
        if (avg === 0) return null;
        const diff = Math.abs(v1 - v2);
        const pctDiff = (diff / avg) * 100;
        return {
          primary: { label: "Percent Difference", value: `${formatNumber(pctDiff, 4)}%` },
          details: [
            { label: "Absolute difference", value: formatNumber(diff, 6) },
            { label: "Average", value: formatNumber(avg, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "percentage-change-calculator", "standard-deviation-calculator"],
  faq: [{ question: "What is percent error?", answer: "Percent error measures how far an experimental value is from the accepted value: |Experimental - Actual| / |Actual| × 100%. Percent difference compares two values without a 'correct' value: |V1-V2| / average × 100%." }],
  formula: "% Error = |Exp - Actual| / |Actual| × 100",
};

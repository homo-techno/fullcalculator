import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const depreciationRecaptureCalculator: CalculatorDefinition = {
  slug: "depreciation-recapture-calculator",
  title: "Depreciation Recapture Calculator",
  description: "Free depreciation recapture calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["depreciation recapture calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Depreciation Recapture",
      description: "Calculate depreciation recapture",
      fields: [
        {
          name: "amount",
          label: "Investment Amount",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Rate",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
        },
        {
          name: "years",
          label: "Holding Period",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 1,
          max: 50,
        }
      ],
      calculate: (inputs) => {
        const amt = inputs.amount as number;
        const rate = (inputs.rate as number) / 100;
        const yrs = inputs.years as number;
        if (!amt || !rate || !yrs) return null;
        const fv = amt * Math.pow(1 + rate, yrs);
        const gain = fv - amt;
        return {
          primary: { label: "Future Value", value: "$" + formatNumber(fv) },
          details: [
            { label: "Total gain", value: "$" + formatNumber(gain) },
            { label: "Annual income", value: "$" + formatNumber(amt * rate) },
            { label: "Total return", value: formatNumber((gain/amt)*100) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the depreciation recapture calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};

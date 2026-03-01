import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parklandFormulaCalculator: CalculatorDefinition = {
  slug: "parkland-formula-calculator",
  title: "Parkland Formula Calculator",
  description: "Calculate burn fluid resuscitation volume.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["parkland formula","burn resuscitation calculator"],
  variants: [{
    id: "standard",
    name: "Parkland Formula",
    description: "Calculate burn fluid resuscitation volume.",
    fields: [
      { name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 300, defaultValue: 70 },
      { name: "burnPercentTBSA", label: "Burn % TBSA", type: "number", min: 1, max: 100, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const wt = inputs.bodyWeight as number;
      const tbsa = inputs.burnPercentTBSA as number;
      if (!wt || !tbsa) return null;
      const total24 = 4 * wt * tbsa;
      const first8 = Math.round(total24 / 2);
      const next16 = total24 - first8;
      const hourlyFirst8 = Math.round(first8 / 8);
      const hourlyNext16 = Math.round(next16 / 16);
      return {
        primary: { label: "Total 24h Fluid", value: formatNumber(total24) + " mL" },
        details: [
          { label: "First 8 Hours", value: formatNumber(first8) + " mL" },
          { label: "Rate (first 8h)", value: formatNumber(hourlyFirst8) + " mL/hr" },
          { label: "Rate (next 16h)", value: formatNumber(hourlyNext16) + " mL/hr" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the Parkland formula?", answer: "4 mL x body weight (kg) x burn % TBSA for 24-hour fluid volume." },
    { question: "How is the fluid distributed?", answer: "Half in the first 8 hours, the remaining half over the next 16 hours." },
  ],
  formula: "Fluid (mL) = 4 x Weight (kg) x %TBSA",
};

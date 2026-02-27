import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breakEvenUnitsCalculator: CalculatorDefinition = {
  slug: "break-even-units-calculator",
  title: "Break Even Units Calculator",
  description: "Calculate break even units with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["break even calculator"],
  variants: [{
    id: "standard",
    name: "Break Even Units",
    description: "",
    fields: [
      { name: "fixedCosts", label: "Fixed Costs ($)", type: "number", min: 1 },
      { name: "pricePerUnit", label: "Price/Unit ($)", type: "number", min: 0.01 },
      { name: "costPerUnit", label: "Cost/Unit ($)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Units to Break Even", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate break even units?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good break even units?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

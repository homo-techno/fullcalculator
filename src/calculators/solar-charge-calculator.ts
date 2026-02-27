import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarChargeCalculator: CalculatorDefinition = {
  slug: "solar-charge-calculator",
  title: "Solar Charge Calculator",
  description: "Calculate solar charge with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["solar charging calculator"],
  variants: [{
    id: "standard",
    name: "Solar Charge",
    description: "",
    fields: [
      { name: "panelWatts", label: "Panel Watts", type: "number", min: 1 },
      { name: "sunHours", label: "Sun Hours", type: "number", defaultValue: 5 },
      { name: "batteryWh", label: "Battery (Wh)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Charge Hours", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate solar charge?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good solar charge?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

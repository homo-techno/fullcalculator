import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const miningElectricityCalculator: CalculatorDefinition = {
  slug: "mining-electricity-calculator",
  title: "Mining Electricity Cost Calculator",
  description: "Free mining electricity cost calculator. Calculate mining electricity cost quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mining electricity"],
  variants: [{
    id: "standard",
    name: "Mining Electricity Cost",
    description: "",
    fields: [
      { name: "watts", label: "Power (W)", type: "number", min: 100 },
      { name: "hours", label: "Hours/Day", type: "number", defaultValue: 24 },
      { name: "rate", label: "Rate ($/kWh)", type: "number", defaultValue: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Daily Cost", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mining electricity cost?", answer: "Enter values and get instant results." },
    { question: "Why use this mining electricity cost calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

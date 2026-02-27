import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yieldFarmingCalculator: CalculatorDefinition = {
  slug: "yield-farming-calculator",
  title: "Yield Farming Calculator",
  description: "Free yield farming calculator. Calculate yield farming quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["yield farming calculator"],
  variants: [{
    id: "standard",
    name: "Yield Farming",
    description: "",
    fields: [
      { name: "deposit", label: "Deposit ($)", type: "number", min: 1 },
      { name: "apy", label: "APY %", type: "number", min: 0.1 },
      { name: "days", label: "Days", type: "number", defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Earnings ($)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate yield farming?", answer: "Enter values and get instant results." },
    { question: "Why use this yield farming calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

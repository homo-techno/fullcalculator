import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thermostatSavingsCalculator: CalculatorDefinition = {
  slug: "thermostat-savings-calculator",
  title: "Smart Thermostat Calculator",
  description: "Free smart thermostat calculator. Calculate smart thermostat quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["thermostat savings"],
  variants: [{
    id: "standard",
    name: "Smart Thermostat",
    description: "",
    fields: [
      { name: "monthlyBill", label: "Monthly HVAC ($)", type: "number", min: 1 },
      { name: "savings", label: "Expected Savings %", type: "number", defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Savings", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate smart thermostat?", answer: "Enter values and get instant results." },
    { question: "Why use this smart thermostat calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostingMethaneCalculator: CalculatorDefinition = {
  slug: "composting-methane",
  title: "Composting Methane Calculator",
  description: "Free composting methane calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["composting emission calculator"],
  variants: [{
    id: "standard",
    name: "Composting Methane",
    description: "",
    fields: [
      { name: "waste", label: "Organic Waste (kg/week)", type: "number", min: 1 },
      { name: "method", label: "Method (1=compost,2=landfill)", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CO2eq Saved (kg/year)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate composting methane?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

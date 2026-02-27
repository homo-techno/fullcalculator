import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carbonFootprintDietCalculator: CalculatorDefinition = {
  slug: "carbon-footprint-diet",
  title: "Diet Carbon Footprint Calculator",
  description: "Free diet carbon footprint calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["diet carbon footprint"],
  variants: [{
    id: "standard",
    name: "Diet Carbon Footprint",
    description: "",
    fields: [
      { name: "meatDays", label: "Meat Days/Week", type: "number", defaultValue: 4 },
      { name: "dairyDays", label: "Dairy Days/Week", type: "number", defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CO2 (kg/year)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate diet carbon footprint?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

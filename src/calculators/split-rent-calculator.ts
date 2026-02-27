import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const splitRentCalculator: CalculatorDefinition = {
  slug: "split-rent-calculator",
  title: "Split Rent by Room Calculator",
  description: "Free split rent by room calculator. Calculate split rent by room quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rent split calculator"],
  variants: [{
    id: "standard",
    name: "Split Rent by Room",
    description: "",
    fields: [
      { name: "totalRent", label: "Total Rent ($)", type: "number", min: 1 },
      { name: "yourSqft", label: "Your Room (sq ft)", type: "number", min: 1 },
      { name: "totalSqft", label: "Total Sq Ft", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Your Share", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate split rent by room?", answer: "Enter values and get instant results." },
    { question: "Why use this split rent by room calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

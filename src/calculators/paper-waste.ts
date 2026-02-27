import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paperWasteCalculator: CalculatorDefinition = {
  slug: "paper-waste",
  title: "Paper Waste Impact Calculator",
  description: "Free paper waste impact calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["paper waste calculator"],
  variants: [{
    id: "standard",
    name: "Paper Waste Impact",
    description: "",
    fields: [
      { name: "sheetsWeek", label: "Sheets/Week", type: "number", min: 1 },
      { name: "weeks", label: "Weeks", type: "number", defaultValue: 52 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Trees Saved", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate paper waste impact?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

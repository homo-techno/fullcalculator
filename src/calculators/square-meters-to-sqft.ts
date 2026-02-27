import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squareMetersToSqftCalculator: CalculatorDefinition = {
  slug: "square-meters-to-sqft",
  title: "Square Meters to Sq Ft Calculator",
  description: "Free square meters to sq ft calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["square meters to square feet"],
  variants: [{
    id: "standard",
    name: "Square Meters to Sq Ft",
    description: "",
    fields: [
      { name: "sqm", label: "Square Meters", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Square Feet", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate square meters to sq ft?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

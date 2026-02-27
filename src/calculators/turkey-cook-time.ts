import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turkeyCookTimeCalculator: CalculatorDefinition = {
  slug: "turkey-cook-time",
  title: "Turkey Cook Time Calculator",
  description: "Free turkey cook time calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["turkey cook time calculator"],
  variants: [{
    id: "standard",
    name: "Turkey Cook Time",
    description: "",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 5 },
      { name: "stuffed", label: "Stuffed (0=no,1=yes)", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cook Hours", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate turkey cook time?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

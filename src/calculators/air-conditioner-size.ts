import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airConditionerSizeCalculator: CalculatorDefinition = {
  slug: "air-conditioner-size",
  title: "Air Conditioner Size Calculator",
  description: "Free air conditioner size calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["air conditioner size calculator"],
  variants: [{
    id: "standard",
    name: "Air Conditioner Size",
    description: "",
    fields: [
      { name: "sqft", label: "Room Sq Ft", type: "number", min: 50 },
      { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "BTU Needed", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate air conditioner size?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

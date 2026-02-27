import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseboardCalcCalculator: CalculatorDefinition = {
  slug: "baseboard-calc",
  title: "Baseboard Calculator",
  description: "Free baseboard calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseboard calculator"],
  variants: [{
    id: "standard",
    name: "Baseboard",
    description: "",
    fields: [
      { name: "perimeter", label: "Room Perimeter (ft)", type: "number", min: 10 },
      { name: "doors", label: "Door Openings (ft)", type: "number", defaultValue: 12 },
      { name: "pricePerFt", label: "Price/Ft ($)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate baseboard?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const colorHexToRgbCalculator: CalculatorDefinition = {
  slug: "color-hex-to-rgb",
  title: "Hex to RGB Calculator",
  description: "Free hex to rgb calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["hex to rgb converter"],
  variants: [{
    id: "standard",
    name: "Hex to RGB",
    description: "",
    fields: [
      { name: "red", label: "Red (0-255)", type: "number", min: 0, max: 255 },
      { name: "green", label: "Green (0-255)", type: "number", min: 0, max: 255 },
      { name: "blue", label: "Blue (0-255)", type: "number", min: 0, max: 255 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Hex Code", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hex to rgb?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

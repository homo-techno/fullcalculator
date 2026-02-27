import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radiationHeatCalculator: CalculatorDefinition = {
  slug: "radiation-heat",
  title: "Radiation Heat Transfer Calculator",
  description: "Free radiation heat transfer calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["radiation heat calculator", "stefan boltzmann"],
  variants: [{
    id: "standard",
    name: "Radiation Heat Transfer",
    description: "",
    fields: [
      { name: "emissivity", label: "Emissivity", type: "number", defaultValue: 0.9 },
      { name: "area", label: "Area (m²)", type: "number", min: 0.001 },
      { name: "temp", label: "Temperature (K)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Power (W)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate radiation heat transfer?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

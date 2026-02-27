import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const idealGasLawCalculator: CalculatorDefinition = {
  slug: "ideal-gas-law",
  title: "Ideal Gas Law Calculator",
  description: "Free ideal gas law calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ideal gas law calculator", "PV=nRT"],
  variants: [{
    id: "standard",
    name: "Ideal Gas Law",
    description: "",
    fields: [
      { name: "pressure", label: "Pressure (atm)", type: "number", defaultValue: 1 },
      { name: "volume", label: "Volume (L)", type: "number", min: 0.001 },
      { name: "moles", label: "Moles", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Temperature (K)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ideal gas law?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "PV = nRT",
};

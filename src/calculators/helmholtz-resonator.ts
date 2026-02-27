import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const helmholtzResonatorCalculator: CalculatorDefinition = {
  slug: "helmholtz-resonator",
  title: "Helmholtz Resonator Calculator",
  description: "Free helmholtz resonator calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["helmholtz resonator calculator"],
  variants: [{
    id: "standard",
    name: "Helmholtz Resonator",
    description: "",
    fields: [
      { name: "volume", label: "Cavity Volume (m³)", type: "number", min: 0.001 },
      { name: "neckArea", label: "Neck Area (m²)", type: "number", min: 0.0001 },
      { name: "neckLength", label: "Neck Length (m)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Frequency (Hz)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate helmholtz resonator?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

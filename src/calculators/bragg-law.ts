import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const braggLawCalculator: CalculatorDefinition = {
  slug: "bragg-law",
  title: "Bragg Law Calculator",
  description: "Free bragg law calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bragg law calculator"],
  variants: [{
    id: "standard",
    name: "Bragg Law",
    description: "",
    fields: [
      { name: "order", label: "Order (n)", type: "number", defaultValue: 1 },
      { name: "wavelength", label: "Wavelength (nm)", type: "number", min: 0.01 },
      { name: "angle", label: "Angle (°)", type: "number", min: 1, max: 89 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "d-spacing (nm)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bragg law?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

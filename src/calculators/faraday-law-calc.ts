import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const faradayLawCalcCalculator: CalculatorDefinition = {
  slug: "faraday-law-calc",
  title: "Faraday Law Calculator",
  description: "Free faraday law calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["faraday law calculator"],
  variants: [{
    id: "standard",
    name: "Faraday Law",
    description: "",
    fields: [
      { name: "turns", label: "Number of Turns", type: "number", min: 1 },
      { name: "fluxChange", label: "Flux Change (Wb)", type: "number" },
      { name: "time", label: "Time (s)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "EMF (V)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate faraday law?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "EMF = -N×ΔΦ/Δt",
};

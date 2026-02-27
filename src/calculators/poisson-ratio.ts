import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poissonRatioCalculator: CalculatorDefinition = {
  slug: "poisson-ratio",
  title: "Poisson Ratio Calculator",
  description: "Free poisson ratio calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["poisson ratio calculator"],
  variants: [{
    id: "standard",
    name: "Poisson Ratio",
    description: "",
    fields: [
      { name: "lateralStrain", label: "Lateral Strain", type: "number" },
      { name: "axialStrain", label: "Axial Strain", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "ν", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate poisson ratio?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "ν = -εlat / εaxial",
};

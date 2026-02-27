import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dosageByBsaCalculator: CalculatorDefinition = {
  slug: "dosage-by-bsa",
  title: "Dosage by BSA Calculator",
  description: "Free dosage by bsa calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bsa dosage calculator"],
  variants: [{
    id: "standard",
    name: "Dosage by BSA",
    description: "",
    fields: [
      { name: "height", label: "Height (cm)", type: "number", min: 50 },
      { name: "weight", label: "Weight (kg)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "BSA (m²)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dosage by bsa?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

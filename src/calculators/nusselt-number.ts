import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nusseltNumberCalculator: CalculatorDefinition = {
  slug: "nusselt-number",
  title: "Nusselt Number Calculator",
  description: "Free nusselt number calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["nusselt number calculator"],
  variants: [{
    id: "standard",
    name: "Nusselt Number",
    description: "",
    fields: [
      { name: "h", label: "h (W/m²·K)", type: "number", min: 0.1 },
      { name: "length", label: "Length (m)", type: "number", min: 0.001 },
      { name: "k", label: "k (W/m·K)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Nu", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate nusselt number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Nu = hL/k",
};

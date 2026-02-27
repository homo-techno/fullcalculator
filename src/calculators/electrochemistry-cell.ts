import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electrochemistryCellCalculator: CalculatorDefinition = {
  slug: "electrochemistry-cell",
  title: "Electrochemistry Cell Calculator",
  description: "Free electrochemistry cell calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cell potential calculator"],
  variants: [{
    id: "standard",
    name: "Electrochemistry Cell",
    description: "",
    fields: [
      { name: "cathode", label: "Cathode E° (V)", type: "number" },
      { name: "anode", label: "Anode E° (V)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cell Potential (V)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate electrochemistry cell?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "E°cell = E°cathode - E°anode",
};

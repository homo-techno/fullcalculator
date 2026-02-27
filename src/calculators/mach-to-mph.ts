import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const machToMphCalculator: CalculatorDefinition = {
  slug: "mach-to-mph",
  title: "Mach to MPH Calculator",
  description: "Free mach to mph calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["mach to mph"],
  variants: [{
    id: "standard",
    name: "Mach to MPH",
    description: "",
    fields: [
      { name: "mach", label: "Mach Number", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "MPH", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mach to mph?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const btuToJouleCalculator: CalculatorDefinition = {
  slug: "btu-to-joule",
  title: "BTU to Joule Calculator",
  description: "Free btu to joule calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["btu to joule"],
  variants: [{
    id: "standard",
    name: "BTU to Joule",
    description: "",
    fields: [
      { name: "btu", label: "BTU", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Joules", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate btu to joule?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

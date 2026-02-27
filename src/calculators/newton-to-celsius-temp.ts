import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newtonToCelsiusTempCalculator: CalculatorDefinition = {
  slug: "newton-to-celsius-temp",
  title: "Newton to Celsius Calculator",
  description: "Free newton to celsius calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["newton to celsius temperature"],
  variants: [{
    id: "standard",
    name: "Newton to Celsius",
    description: "",
    fields: [
      { name: "newton", label: "Newton Scale", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Celsius", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate newton to celsius?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

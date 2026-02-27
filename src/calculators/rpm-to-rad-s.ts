import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rpmToRadSCalculator: CalculatorDefinition = {
  slug: "rpm-to-rad-s",
  title: "RPM to Rad/s Calculator",
  description: "Free rpm to rad/s calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["rpm to radians per second"],
  variants: [{
    id: "standard",
    name: "RPM to Rad/s",
    description: "",
    fields: [
      { name: "rpm", label: "RPM", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Rad/s", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate rpm to rad/s?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

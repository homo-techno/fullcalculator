import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dnsPropagationTimeCalculator: CalculatorDefinition = {
  slug: "dns-propagation-time",
  title: "DNS Propagation Calculator",
  description: "Free dns propagation calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dns propagation calculator"],
  variants: [{
    id: "standard",
    name: "DNS Propagation",
    description: "",
    fields: [
      { name: "ttl", label: "TTL (seconds)", type: "number", defaultValue: 3600 },
      { name: "hops", label: "Estimated Hops", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Max Propagation (hrs)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dns propagation?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

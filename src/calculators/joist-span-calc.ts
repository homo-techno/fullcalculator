import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const joistSpanCalcCalculator: CalculatorDefinition = {
  slug: "joist-span-calc",
  title: "Joist Span Calculator",
  description: "Free joist span calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["joist span calculator"],
  variants: [{
    id: "standard",
    name: "Joist Span",
    description: "",
    fields: [
      { name: "joist", label: "Joist Size (2x)", type: "number", defaultValue: 8 },
      { name: "spacing", label: "Spacing (in)", type: "number", defaultValue: 16 },
      { name: "grade", label: "Lumber Grade (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Max Span (ft)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate joist span?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

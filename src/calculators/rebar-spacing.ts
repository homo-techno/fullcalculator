import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rebarSpacingCalculator: CalculatorDefinition = {
  slug: "rebar-spacing",
  title: "Rebar Spacing Calculator",
  description: "Free rebar spacing calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rebar spacing calculator"],
  variants: [{
    id: "standard",
    name: "Rebar Spacing",
    description: "",
    fields: [
      { name: "slabWidth", label: "Slab Width (in)", type: "number", min: 12 },
      { name: "barSize", label: "Bar Size (#)", type: "number", defaultValue: 4 },
      { name: "coverage", label: "Coverage %", type: "number", defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Spacing (in)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate rebar spacing?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const conduitFillCalcCalculator: CalculatorDefinition = {
  slug: "conduit-fill-calc",
  title: "Conduit Fill Calculator",
  description: "Free conduit fill calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["conduit fill calculator"],
  variants: [{
    id: "standard",
    name: "Conduit Fill",
    description: "",
    fields: [
      { name: "wires", label: "Number of Wires", type: "number", min: 1 },
      { name: "wireArea", label: "Wire Area (sq in)", type: "number", defaultValue: 0.02 },
      { name: "conduitArea", label: "Conduit Area (sq in)", type: "number", defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Fill %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate conduit fill?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

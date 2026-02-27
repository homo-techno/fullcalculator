import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const icingAmountCalculator: CalculatorDefinition = {
  slug: "icing-amount",
  title: "Icing Amount Calculator",
  description: "Free icing amount calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cake icing calculator"],
  variants: [{
    id: "standard",
    name: "Icing Amount",
    description: "",
    fields: [
      { name: "layers", label: "Layers", type: "number", min: 1 },
      { name: "size", label: "Cake Size (in)", type: "number", defaultValue: 9 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Icing (cups)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate icing amount?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

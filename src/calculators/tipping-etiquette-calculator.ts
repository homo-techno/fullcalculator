import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tippingEtiquetteCalculator: CalculatorDefinition = {
  slug: "tipping-etiquette-calculator",
  title: "Tipping Etiquette Calculator",
  description: "Free tipping etiquette calculator. Calculate tipping etiquette quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tipping guide calculator"],
  variants: [{
    id: "standard",
    name: "Tipping Etiquette",
    description: "",
    fields: [
      { name: "bill", label: "Bill Amount ($)", type: "number", min: 1 },
      { name: "service", label: "Service Level (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Suggested Tip", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tipping etiquette?", answer: "Enter values and get instant results." },
    { question: "Why use this tipping etiquette calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

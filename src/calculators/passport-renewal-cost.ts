import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const passportRenewalCostCalculator: CalculatorDefinition = {
  slug: "passport-renewal-cost",
  title: "Passport Renewal Cost Calculator",
  description: "Free passport renewal cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["passport renewal calculator"],
  variants: [{
    id: "standard",
    name: "Passport Renewal Cost",
    description: "",
    fields: [
      { name: "type", label: "Type (1=book,2=card)", type: "number", defaultValue: 1 },
      { name: "expedited", label: "Expedited (0-1)", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate passport renewal cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthdayPartyBudgetCalculator: CalculatorDefinition = {
  slug: "birthday-party-budget",
  title: "Birthday Party Budget Calculator",
  description: "Free birthday party budget calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["birthday party budget"],
  variants: [{
    id: "standard",
    name: "Birthday Party Budget",
    description: "",
    fields: [
      { name: "guests", label: "Guests", type: "number", min: 5 },
      { name: "costPerGuest", label: "Cost/Guest ($)", type: "number", defaultValue: 15 },
      { name: "venue", label: "Venue ($)", type: "number", defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate birthday party budget?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

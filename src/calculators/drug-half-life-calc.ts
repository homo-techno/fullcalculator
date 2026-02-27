import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drugHalfLifeCalcCalculator: CalculatorDefinition = {
  slug: "drug-half-life-calc",
  title: "Drug Half Life Calculator",
  description: "Free drug half life calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["drug half life calculator"],
  variants: [{
    id: "standard",
    name: "Drug Half Life",
    description: "",
    fields: [
      { name: "dose", label: "Initial Dose (mg)", type: "number", min: 0.1 },
      { name: "halfLife", label: "Half Life (hours)", type: "number", min: 0.1 },
      { name: "hours", label: "Hours Elapsed", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Remaining (mg)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate drug half life?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

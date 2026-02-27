import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fundalHeightCalcCalculator: CalculatorDefinition = {
  slug: "fundal-height-calc",
  title: "Fundal Height Calculator",
  description: "Free fundal height calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["fundal height calculator"],
  variants: [{
    id: "standard",
    name: "Fundal Height",
    description: "",
    fields: [
      { name: "weeks", label: "Gestational Weeks", type: "number", min: 12, max: 42 },
      { name: "height", label: "Fundal Height (cm)", type: "number", min: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Expected Height (cm)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fundal height?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

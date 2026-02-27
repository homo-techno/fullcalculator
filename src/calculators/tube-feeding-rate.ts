import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tubeFeedingRateCalculator: CalculatorDefinition = {
  slug: "tube-feeding-rate",
  title: "Tube Feeding Rate Calculator",
  description: "Free tube feeding rate calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["tube feeding calculator"],
  variants: [{
    id: "standard",
    name: "Tube Feeding Rate",
    description: "",
    fields: [
      { name: "calories", label: "Calorie Goal", type: "number", min: 500 },
      { name: "formula", label: "Formula Cal/mL", type: "number", defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Rate (mL/hr)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tube feeding rate?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

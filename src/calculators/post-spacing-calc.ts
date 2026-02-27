import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postSpacingCalcCalculator: CalculatorDefinition = {
  slug: "post-spacing-calc",
  title: "Post Spacing Calculator",
  description: "Free post spacing calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["post spacing calculator"],
  variants: [{
    id: "standard",
    name: "Post Spacing",
    description: "",
    fields: [
      { name: "totalLength", label: "Total Length (ft)", type: "number", min: 4 },
      { name: "maxSpacing", label: "Max Spacing (ft)", type: "number", defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Number of Posts", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate post spacing?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

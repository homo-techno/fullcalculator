import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shoeSizeAgeCalculator: CalculatorDefinition = {
  slug: "shoe-size-age-calculator",
  title: "Kids Shoe Size Calculator",
  description: "Calculate kids shoe size with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kids shoe size"],
  variants: [{
    id: "standard",
    name: "Kids Shoe Size",
    description: "",
    fields: [
      { name: "age", label: "Age (years)", type: "number", min: 1, max: 16 },
      { name: "footLength", label: "Foot Length (cm)", type: "number", min: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "US Shoe Size", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate kids shoe size?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good kids shoe size?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

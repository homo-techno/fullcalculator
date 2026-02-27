import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breadBakingFlourCalculator: CalculatorDefinition = {
  slug: "bread-baking-flour-calculator",
  title: "Bread Flour Calculator",
  description: "Calculate bread flour with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bread flour calculator"],
  variants: [{
    id: "standard",
    name: "Bread Flour",
    description: "",
    fields: [
      { name: "loaves", label: "Loaves", type: "number", min: 1 },
      { name: "flourPerLoaf", label: "Flour/Loaf (cups)", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Flour (cups)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bread flour?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good bread flour?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeStudioCalculator: CalculatorDefinition = {
  slug: "home-studio-calculator",
  title: "Home Studio Calculator",
  description: "Calculate home studio costs and expenses. Free online home studio calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["home studio cost"],
  variants: [{
    id: "standard",
    name: "Home Studio",
    description: "",
    fields: [
      { name: "interface", label: "Audio Interface ($)", type: "number", defaultValue: 200 },
      { name: "monitors", label: "Monitors ($)", type: "number", defaultValue: 300 },
      { name: "treatment", label: "Acoustic Treatment ($)", type: "number", defaultValue: 500 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => !x || x <= 0)) return null;
      const result = v.reduce((a, b) => a * b, 1) / (v.length > 2 ? v[v.length-1] : 1);
      return { primary: { label: "Estimated Cost", value: "$" + formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["budget-calculator"],
  faq: [
    { question: "How much does home studio cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect home studio cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};

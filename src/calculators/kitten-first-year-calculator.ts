import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kittenFirstYearCalculator: CalculatorDefinition = {
  slug: "kitten-first-year-calculator",
  title: "Kitten First Year Calculator",
  description: "Calculate kitten first year costs and expenses. Free online kitten first year calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kitten cost"],
  variants: [{
    id: "standard",
    name: "Kitten First Year",
    description: "",
    fields: [
      { name: "adoption", label: "Adoption ($)", type: "number", defaultValue: 100 },
      { name: "vet", label: "Vet Visits ($)", type: "number", defaultValue: 400 },
      { name: "supplies", label: "Supplies ($)", type: "number", defaultValue: 200 },
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
    { question: "How much does kitten first year cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect kitten first year cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};

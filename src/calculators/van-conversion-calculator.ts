import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vanConversionCalculator: CalculatorDefinition = {
  slug: "van-conversion-calculator",
  title: "Van Conversion Calculator",
  description: "Calculate van conversion costs and expenses. Free online van conversion calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["van life cost", "camper van"],
  variants: [{
    id: "standard",
    name: "Van Conversion",
    description: "",
    fields: [
      { name: "vanCost", label: "Van Cost ($)", type: "number", min: 1000 },
      { name: "buildCost", label: "Build Cost ($)", type: "number", defaultValue: 15000 },
      { name: "months", label: "Build Months", type: "number", defaultValue: 6 },
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
    { question: "How much does van conversion cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect van conversion cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};

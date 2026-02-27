import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beekeepingStartupCalculator: CalculatorDefinition = {
  slug: "beekeeping-startup-calculator",
  title: "Beekeeping Startup Calculator",
  description: "Calculate beekeeping startup costs and expenses. Free online beekeeping startup calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["beekeeping cost"],
  variants: [{
    id: "standard",
    name: "Beekeeping Startup",
    description: "",
    fields: [
      { name: "hives", label: "Number of Hives", type: "number", min: 1 },
      { name: "hiveCost", label: "Hive Kit ($)", type: "number", defaultValue: 250 },
      { name: "bees", label: "Bees/Package ($)", type: "number", defaultValue: 150 },
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
    { question: "How much does beekeeping startup cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect beekeeping startup cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};

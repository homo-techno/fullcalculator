import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inheritanceSplitCalculator: CalculatorDefinition = {
  slug: "inheritance-split-calculator",
  title: "Inheritance Split Calculator",
  description: "Free inheritance split calculator. Calculate inheritance split quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["inheritance split calculator"],
  variants: [{
    id: "standard",
    name: "Inheritance Split",
    description: "",
    fields: [
      { name: "total", label: "Total Inheritance ($)", type: "number", min: 1 },
      { name: "heirs", label: "Number of Heirs", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Per Person", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate inheritance split?", answer: "Enter values and get instant results." },
    { question: "Why use this inheritance split calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

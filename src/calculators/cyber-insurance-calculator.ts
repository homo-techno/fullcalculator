import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cyberInsuranceCalculator: CalculatorDefinition = {
  slug: "cyber-insurance-calculator",
  title: "Cyber Insurance Calculator",
  description: "Free cyber insurance calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cyber insurance cost"],
  variants: [{
    id: "standard",
    name: "Cyber Insurance",
    description: "",
    fields: [
      { name: "revenue", label: "Annual Revenue ($)", type: "number", min: 10000 },
      { name: "employees", label: "Employees", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Premium", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cyber insurance?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};

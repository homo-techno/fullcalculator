import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leaseVsBuyCarCalculator: CalculatorDefinition = {
  slug: "lease-vs-buy-car-calculator",
  title: "Lease vs Buy Car Calculator",
  description: "Free lease vs buy car calculator. Calculate lease vs buy car quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lease vs buy calculator"],
  variants: [{
    id: "standard",
    name: "Lease vs Buy Car",
    description: "",
    fields: [
      { name: "price", label: "Vehicle Price ($)", type: "number", min: 1 },
      { name: "leasePay", label: "Lease Payment ($)", type: "number", min: 1 },
      { name: "months", label: "Months", type: "number", defaultValue: 36 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Lease Cost", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate lease vs buy car?", answer: "Enter values and get instant results." },
    { question: "Why use this lease vs buy car calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

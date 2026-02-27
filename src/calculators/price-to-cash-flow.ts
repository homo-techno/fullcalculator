import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const priceToCashFlowCalculator: CalculatorDefinition = {
  slug: "price-to-cash-flow",
  title: "Price to Cash Flow Calculator",
  description: "Free price to cash flow calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["price to cash flow ratio"],
  variants: [{
    id: "standard",
    name: "Price to Cash Flow",
    description: "",
    fields: [
      { name: "marketCap", label: "Market Cap ($)", type: "number", min: 1 },
      { name: "operatingCF", label: "Operating CF ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "P/CF Ratio", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate price to cash flow?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasPriceOptimizerCalculator: CalculatorDefinition = {
  slug: "gas-price-optimizer-calculator",
  title: "Gas Price Optimizer Calculator",
  description: "Free gas price optimizer calculator. Calculate gas price optimizer quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ethereum gas optimizer"],
  variants: [{
    id: "standard",
    name: "Gas Price Optimizer",
    description: "",
    fields: [
      { name: "gasLimit", label: "Gas Limit", type: "number", defaultValue: 21000 },
      { name: "gasPrice", label: "Gas Price (gwei)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cost (ETH)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gas price optimizer?", answer: "Enter values and get instant results." },
    { question: "Why use this gas price optimizer calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capRateComparisonCalculator: CalculatorDefinition = {
  slug: "cap-rate-comparison-calculator",
  title: "Cap Rate Comparison Calculator",
  description: "Compare the capitalization rates of two investment properties to evaluate relative value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cap rate comparison", "capitalization rate calculator", "compare cap rates"],
  variants: [{
    id: "standard",
    name: "Cap Rate Comparison",
    description: "Compare the capitalization rates of two investment properties to evaluate relative value",
    fields: [
      { name: "price1", label: "Property A Price", type: "number", suffix: "$", min: 50000, max: 10000000, defaultValue: 400000 },
      { name: "noi1", label: "Property A Annual NOI", type: "number", suffix: "$", min: 5000, max: 500000, defaultValue: 32000 },
      { name: "price2", label: "Property B Price", type: "number", suffix: "$", min: 50000, max: 10000000, defaultValue: 550000 },
      { name: "noi2", label: "Property B Annual NOI", type: "number", suffix: "$", min: 5000, max: 500000, defaultValue: 38000 },
    ],
    calculate: (inputs) => {
      const price1 = inputs.price1 as number;
      const noi1 = inputs.noi1 as number;
      const price2 = inputs.price2 as number;
      const noi2 = inputs.noi2 as number;
      if (!price1 || !noi1 || !price2 || !noi2) return null;
      const capA = (noi1 / price1) * 100;
      const capB = (noi2 / price2) * 100;
      const diff = capA - capB;
      const better = diff > 0 ? "Property A" : diff < 0 ? "Property B" : "Equal";
      return {
        primary: { label: "Better Cap Rate", value: better },
        details: [
          { label: "Property A Cap Rate", value: formatNumber(capA) + "%" },
          { label: "Property B Cap Rate", value: formatNumber(capB) + "%" },
          { label: "Difference", value: formatNumber(Math.abs(diff)) + " percentage points" },
          { label: "Property A Price per NOI Dollar", value: "$" + formatNumber(price1 / noi1) },
          { label: "Property B Price per NOI Dollar", value: "$" + formatNumber(price2 / noi2) },
        ],
      };
    },
  }],
  relatedSlugs: ["rental-yield-calculator", "storage-unit-investment-calculator"],
  faq: [
    { question: "What is a good cap rate?", answer: "Cap rates vary by market and property type. Generally, 4 to 6 percent is typical for low-risk properties in strong markets, while 8 to 12 percent indicates higher risk or secondary markets." },
    { question: "Is a higher cap rate better?", answer: "A higher cap rate means a higher return on investment but often indicates higher risk. Lower cap rates suggest safer, more stable investments but with lower returns." },
  ],
  formula: "Cap Rate = (Net Operating Income / Property Price) x 100",
};

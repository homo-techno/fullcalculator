import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fertilizerRateCalculator: CalculatorDefinition = {
  slug: "fertilizer-rate-calculator",
  title: "Fertilizer Rate Calculator",
  description: "Calculate fertilizer needed for your lawn area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fertilizer rate","lawn fertilizer calculator"],
  variants: [{
    id: "standard",
    name: "Fertilizer Rate",
    description: "Calculate fertilizer needed for your lawn area.",
    fields: [
      { name: "lawnArea", label: "Lawn Area (sq ft)", type: "number", min: 100, max: 200000, defaultValue: 5000 },
      { name: "nRatio", label: "Nitrogen % on Bag", type: "number", min: 1, max: 50, defaultValue: 20 },
      { name: "applicationRate", label: "Rate (lbs N per 1000 sq ft)", type: "number", min: 0.25, max: 5, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const area = inputs.lawnArea as number;
      const nPct = inputs.nRatio as number;
      const rate = inputs.applicationRate as number;
      if (!area || !nPct || !rate) return null;
      const nNeeded = (area / 1000) * rate;
      const productNeeded = nNeeded / (nPct / 100);
      const bags = Math.ceil(productNeeded / 25);
      return {
        primary: { label: "Product Needed", value: formatNumber(Math.round(productNeeded * 10) / 10) + " lbs" },
        details: [
          { label: "Nitrogen Needed", value: formatNumber(Math.round(nNeeded * 100) / 100) + " lbs" },
          { label: "Bags (25 lb)", value: formatNumber(bags) },
          { label: "Coverage", value: formatNumber(area) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How often should I fertilize my lawn?", answer: "Most lawns benefit from fertilizing 3 to 4 times per year." },
    { question: "What does the N-P-K ratio mean?", answer: "N is nitrogen, P is phosphorus, K is potassium on the bag label." },
  ],
  formula: "Product (lbs) = (Area / 1000) x Application Rate / (N% / 100)",
};

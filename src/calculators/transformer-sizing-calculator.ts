import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transformerSizingCalculator: CalculatorDefinition = {
  slug: "transformer-sizing-calculator",
  title: "Transformer Sizing Calculator",
  description: "Calculate transformer VA rating for your load.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["transformer VA","transformer sizing","transformer rating"],
  variants: [{
    id: "standard",
    name: "Transformer Sizing",
    description: "Calculate transformer VA rating for your load.",
    fields: [
      { name: "loadWatts", label: "Total Load (W)", type: "number", min: 1, max: 50000, defaultValue: 500 },
      { name: "powerFactor", label: "Power Factor", type: "number", min: 0, max: 1, defaultValue: 0 },
      { name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 0, max: 100, defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const watts = inputs.loadWatts as number;
      const pf = inputs.powerFactor as number;
      const margin = inputs.safetyMargin as number;
      if (!watts) return null;
      const effectivePf = pf > 0 ? pf : 0.8;
      const va = watts / effectivePf;
      const withMargin = va * (1 + margin / 100);
      const standardSizes = [75, 150, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000];
      const recommended = standardSizes.find(s => s >= withMargin) || Math.ceil(withMargin / 1000) * 1000;
      return {
        primary: { label: "Recommended VA", value: formatNumber(recommended) + " VA" },
        details: [
          { label: "Calculated VA", value: formatNumber(Math.round(va)) },
          { label: "With Margin", value: formatNumber(Math.round(withMargin)) + " VA" },
          { label: "Power Factor", value: formatNumber(effectivePf) },
        ],
      };
  },
  }],
  relatedSlugs: ["relay-sizing-calculator","arduino-power-calculator"],
  faq: [
    { question: "How do I size a transformer?", answer: "Divide total watts by power factor and add a 25 percent margin." },
    { question: "What is a good power factor?", answer: "Most mixed loads have a power factor of 0.8 to 0.9." },
  ],
  formula: "VA = Load Watts / Power Factor x (1 + Margin / 100)",
};

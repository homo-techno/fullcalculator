import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seedSpacingCalculator: CalculatorDefinition = {
  slug: "seed-spacing-calculator",
  title: "Seed Spacing Calculator",
  description: "Calculate seed spacing with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["seed spacing calculator"],
  variants: [{
    id: "standard",
    name: "Seed Spacing",
    description: "",
    fields: [
      { name: "rowLength", label: "Row Length (ft)", type: "number", min: 1 },
      { name: "spacing", label: "Spacing (in)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Seeds Needed", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate seed spacing?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good seed spacing?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

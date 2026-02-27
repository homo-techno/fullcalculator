import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sourdoughHydrationCalculator: CalculatorDefinition = {
  slug: "sourdough-hydration-calculator",
  title: "Sourdough Hydration Calculator",
  description: "Calculate sourdough hydration with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sourdough calculator"],
  variants: [{
    id: "standard",
    name: "Sourdough Hydration",
    description: "",
    fields: [
      { name: "flour", label: "Flour (g)", type: "number", min: 100 },
      { name: "water", label: "Water (g)", type: "number", min: 50 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Hydration %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sourdough hydration?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good sourdough hydration?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

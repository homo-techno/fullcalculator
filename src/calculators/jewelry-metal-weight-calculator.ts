import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jewelryMetalWeightCalculator: CalculatorDefinition = {
  slug: "jewelry-metal-weight-calculator",
  title: "Jewelry Metal Calculator",
  description: "Calculate jewelry metal with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["jewelry metal calculator"],
  variants: [{
    id: "standard",
    name: "Jewelry Metal",
    description: "",
    fields: [
      { name: "volume", label: "Volume (cc)", type: "number", min: 0.1 },
      { name: "density", label: "Metal Density (g/cc)", type: "number", defaultValue: 19.3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Weight (g)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate jewelry metal?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good jewelry metal?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

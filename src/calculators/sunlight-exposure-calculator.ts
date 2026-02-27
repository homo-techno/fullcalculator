import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sunlightExposureCalculator: CalculatorDefinition = {
  slug: "sunlight-exposure-calculator",
  title: "Sunlight Exposure Calculator",
  description: "Calculate sunlight exposure with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sun exposure calculator"],
  variants: [{
    id: "standard",
    name: "Sunlight Exposure",
    description: "",
    fields: [
      { name: "latitude", label: "Latitude", type: "number", defaultValue: 40 },
      { name: "skinType", label: "Skin Type (1-6)", type: "number", defaultValue: 3 },
      { name: "month", label: "Month (1-12)", type: "number", defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Minutes", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sunlight exposure?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good sunlight exposure?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

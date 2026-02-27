import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vinylRecordTimeCalculator: CalculatorDefinition = {
  slug: "vinyl-record-time-calculator",
  title: "Vinyl Record Time Calculator",
  description: "Calculate vinyl record time with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vinyl record calculator"],
  variants: [{
    id: "standard",
    name: "Vinyl Record Time",
    description: "",
    fields: [
      { name: "rpm", label: "RPM", type: "number", defaultValue: 33 },
      { name: "diameter", label: "Diameter (in)", type: "number", defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Max Minutes/Side", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate vinyl record time?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good vinyl record time?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

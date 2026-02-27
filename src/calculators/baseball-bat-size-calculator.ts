import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseballBatSizeCalculator: CalculatorDefinition = {
  slug: "baseball-bat-size-calculator",
  title: "Baseball Bat Calculator",
  description: "Calculate baseball bat with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseball bat size"],
  variants: [{
    id: "standard",
    name: "Baseball Bat",
    description: "",
    fields: [
      { name: "height", label: "Height (in)", type: "number", min: 30 },
      { name: "weight", label: "Weight (lbs)", type: "number", min: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Bat Length (in)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate baseball bat?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good baseball bat?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

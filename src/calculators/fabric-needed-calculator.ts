import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fabricNeededCalculator: CalculatorDefinition = {
  slug: "fabric-needed-calculator",
  title: "Fabric Needed Calculator",
  description: "Calculate fabric needed with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fabric calculator for dress"],
  variants: [{
    id: "standard",
    name: "Fabric Needed",
    description: "",
    fields: [
      { name: "length", label: "Garment Length (in)", type: "number", min: 10 },
      { name: "width", label: "Width Needed (in)", type: "number", min: 10 },
      { name: "fabricWidth", label: "Fabric Width (in)", type: "number", defaultValue: 45 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Yards Needed", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fabric needed?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good fabric needed?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

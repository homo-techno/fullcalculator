import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speakerBoxVolumeCalculator: CalculatorDefinition = {
  slug: "speaker-box-volume-calculator",
  title: "Speaker Box Calculator",
  description: "Calculate speaker box with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["speaker box calculator"],
  variants: [{
    id: "standard",
    name: "Speaker Box",
    description: "",
    fields: [
      { name: "driver", label: "Driver Size (in)", type: "number", min: 4 },
      { name: "vas", label: "Vas (L)", type: "number", defaultValue: 30 },
      { name: "qts", label: "Qts", type: "number", defaultValue: 0.4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Box Volume (L)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate speaker box?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good speaker box?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};

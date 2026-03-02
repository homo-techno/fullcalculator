import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const elasticLengthCalculator: CalculatorDefinition = {
  slug: "elastic-length-calculator",
  title: "Elastic Length Calculator",
  description: "Calculate the cutting length for elastic in a garment.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["elastic length","elastic calculator sewing"],
  variants: [{
    id: "standard",
    name: "Elastic Length",
    description: "Calculate the cutting length for elastic in a garment.",
    fields: [
      { name: "bodyMeasure", label: "Body Measurement (inches)", type: "number", min: 5, max: 80, defaultValue: 30 },
      { name: "stretchRatio", label: "Stretch Ratio (%)", type: "number", min: 50, max: 95, defaultValue: 80 },
      { name: "overlapAllowance", label: "Overlap Allowance (inches)", type: "number", min: 0, max: 3, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const body = inputs.bodyMeasure as number;
      const ratio = inputs.stretchRatio as number;
      const overlap = inputs.overlapAllowance as number;
      if (!body || !ratio) return null;
      const relaxedLen = Math.round((body * ratio / 100) * 100) / 100;
      const cutLen = Math.round((relaxedLen + overlap) * 100) / 100;
      const stretch = Math.round((body - relaxedLen) * 100) / 100;
      return {
        primary: { label: "Cut Elastic Length", value: formatNumber(cutLen) + " in" },
        details: [
          { label: "Relaxed Elastic Length", value: formatNumber(relaxedLen) + " in" },
          { label: "Stretch Needed", value: formatNumber(stretch) + " in" },
          { label: "Overlap Included", value: formatNumber(overlap) + " in" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What stretch ratio should I use?", answer: "Use 75 to 85 percent of the body measurement for comfortable elastic fit." },
    { question: "How much overlap do I need?", answer: "Add 0.5 to 1 inch of overlap for joining the elastic ends together." },
  ],
  formula: "Cut Length = (Body Measurement x Stretch Ratio) + Overlap",
};

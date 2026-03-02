import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const signSizeCalculator: CalculatorDefinition = {
  slug: "sign-size-calculator",
  title: "Sign Size Calculator",
  description: "Determine sign dimensions for readability at a distance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sign size","sign visibility calculator"],
  variants: [{
    id: "standard",
    name: "Sign Size",
    description: "Determine sign dimensions for readability at a distance.",
    fields: [
      { name: "viewingDist", label: "Viewing Distance (ft)", type: "number", min: 10, max: 2000, defaultValue: 200 },
      { name: "numChars", label: "Number of Characters", type: "number", min: 1, max: 50, defaultValue: 12 },
      { name: "signType", label: "Sign Type", type: "select", options: [{ value: "1", label: "Roadway (1 in per 50 ft)" }, { value: "0.67", label: "Pedestrian (1 in per 30 ft)" }, { value: "1.5", label: "Highway (1 in per 67 ft)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const dist = inputs.viewingDist as number;
      const chars = inputs.numChars as number;
      const ratio = Number(inputs.signType as number);
      if (!dist || !chars || !ratio) return null;
      const letterHeight = Math.ceil(dist / (50 / ratio));
      const letterWidth = Math.round(letterHeight * 0.6);
      const signWidth = Math.ceil(letterWidth * chars * 1.2 + 12);
      const signHeight = Math.ceil(letterHeight * 2 + 12);
      return {
        primary: { label: "Minimum Sign Size", value: formatNumber(signWidth) + " x " + formatNumber(signHeight) + " in" },
        details: [
          { label: "Letter Height", value: formatNumber(letterHeight) + " in" },
          { label: "Letter Width", value: formatNumber(letterWidth) + " in" },
          { label: "Viewing Distance", value: formatNumber(dist) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How big should sign letters be?", answer: "Use 1 inch of letter height for every 50 feet of viewing distance on roads." },
    { question: "What font is best for signs?", answer: "Sans-serif fonts like Helvetica or Highway Gothic provide the best readability." },
  ],
  formula: "Letter Height = Distance / 50; Sign Size includes margins",
};

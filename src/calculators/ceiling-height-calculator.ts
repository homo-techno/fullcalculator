import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ceilingHeightCalculator: CalculatorDefinition = {
  slug: "ceiling-height-calculator",
  title: "Ceiling Height Calculator",
  description: "Determine ideal ceiling height based on room dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ceiling height","room proportion calculator"],
  variants: [{
    id: "standard",
    name: "Ceiling Height",
    description: "Determine ideal ceiling height based on room dimensions.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 4, max: 100, defaultValue: 16 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 4, max: 100, defaultValue: 12 },
      { name: "actualHeight", label: "Actual Ceiling Height (ft)", type: "number", min: 6, max: 30, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const len = inputs.roomLength as number;
      const wid = inputs.roomWidth as number;
      const actual = inputs.actualHeight as number;
      if (!len || !wid || !actual) return null;
      const avgDim = (len + wid) / 2;
      const idealHeight = Math.round((avgDim * 0.6) * 10) / 10;
      const diff = Math.round((actual - idealHeight) * 10) / 10;
      const roomVol = Math.round(len * wid * actual);
      return {
        primary: { label: "Ideal Ceiling Height", value: formatNumber(idealHeight) + " ft" },
        details: [
          { label: "Actual Height", value: formatNumber(actual) + " ft" },
          { label: "Difference", value: (diff >= 0 ? "+" : "") + formatNumber(diff) + " ft" },
          { label: "Room Volume", value: formatNumber(roomVol) + " cu ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the standard ceiling height?", answer: "Standard ceiling height in most homes is 8 to 9 feet." },
    { question: "Do higher ceilings cost more to heat?", answer: "Yes. Each extra foot of height adds roughly 10% to heating costs." },
  ],
  formula: "Ideal Height = (Room Length + Room Width) / 2 x 0.6",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reverberationDistanceCalculator: CalculatorDefinition = {
  slug: "reverberation-distance-calculator",
  title: "Reverberation Distance Calculator",
  description: "Calculate the critical distance in a room from RT60.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["critical distance","reverberation distance"],
  variants: [{
    id: "standard",
    name: "Reverberation Distance",
    description: "Calculate the critical distance in a room from RT60.",
    fields: [
      { name: "roomVolume", label: "Room Volume (cu m)", type: "number", min: 10, max: 100000, defaultValue: 200 },
      { name: "rt60", label: "RT60 Reverberation Time (s)", type: "number", min: 0.1, max: 10, defaultValue: 1.2 },
    ],
    calculate: (inputs) => {
      const vol = inputs.roomVolume as number;
      const rt = inputs.rt60 as number;
      if (!vol || !rt) return null;
      const absorption = 0.161 * vol / rt;
      const dc = Math.round(0.057 * Math.sqrt(vol / rt) * 1000) / 1000;
      return {
        primary: { label: "Critical Distance", value: formatNumber(dc) + " m" },
        details: [
          { label: "RT60", value: formatNumber(rt) + " s" },
          { label: "Total Absorption", value: formatNumber(Math.round(absorption * 100) / 100) + " sabins" },
          { label: "Room Volume", value: formatNumber(vol) + " cu m" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is critical distance?", answer: "It is the distance where direct sound and reverberant sound are equal." },
    { question: "What is a good RT60 for a studio?", answer: "A recording studio typically targets an RT60 of 0.3 to 0.5 seconds." },
  ],
  formula: "Dc = 0.057 x sqrt(Volume / RT60)",
};

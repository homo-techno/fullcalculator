import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const underCabinetLightingCalculator: CalculatorDefinition = {
  slug: "under-cabinet-lighting-calculator",
  title: "Under Cabinet Lighting Calculator",
  description: "Estimate LED strip length and wattage for under cabinet lights.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["under cabinet lighting","LED strip calculator"],
  variants: [{
    id: "standard",
    name: "Under Cabinet Lighting",
    description: "Estimate LED strip length and wattage for under cabinet lights.",
    fields: [
      { name: "cabinetLength", label: "Total Cabinet Length (ft)", type: "number", min: 1, max: 50, defaultValue: 10 },
      { name: "wattsPerFt", label: "Watts Per Foot", type: "number", min: 1, max: 20, defaultValue: 4 },
      { name: "sections", label: "Number of Sections", type: "number", min: 1, max: 20, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const len = inputs.cabinetLength as number;
      const wpf = inputs.wattsPerFt as number;
      const sec = inputs.sections as number;
      if (!len || !wpf || !sec) return null;
      const totalWatts = len * wpf;
      const perSection = Math.round((len / sec) * 100) / 100;
      const amps12v = Math.round((totalWatts / 12) * 100) / 100;
      return {
        primary: { label: "Total Wattage", value: formatNumber(totalWatts) + " W" },
        details: [
          { label: "Strip Length Per Section", value: formatNumber(perSection) + " ft" },
          { label: "Current at 12V", value: formatNumber(amps12v) + " A" },
          { label: "Recommended PSU", value: formatNumber(Math.ceil(amps12v * 1.2)) + " A" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What wattage do I need for under cabinet lights?", answer: "Most LED strips use 3 to 5 watts per foot for good task lighting." },
    { question: "Should I use 12V or 24V strips?", answer: "Use 12V for short runs under 16 feet and 24V for longer runs." },
  ],
  formula: "Total Wattage = Cabinet Length x Watts Per Foot",
};

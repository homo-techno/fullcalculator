import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sumpPumpSizingCalculator: CalculatorDefinition = {
  slug: "sump-pump-sizing-calculator",
  title: "Sump Pump Sizing Calculator",
  description: "Determine sump pump capacity needed for your pit.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sump pump size","sump pump gph"],
  variants: [{
    id: "standard",
    name: "Sump Pump Sizing",
    description: "Determine sump pump capacity needed for your pit.",
    fields: [
      { name: "pitDiameter", label: "Pit Diameter (in)", type: "number", min: 10, max: 36, defaultValue: 18 },
      { name: "waterRise", label: "Water Rise Rate (in/min)", type: "number", min: 0.1, max: 10, defaultValue: 1 },
      { name: "headHeight", label: "Discharge Head (ft)", type: "number", min: 2, max: 30, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const dia = inputs.pitDiameter as number;
      const rise = inputs.waterRise as number;
      const head = inputs.headHeight as number;
      const pitArea = Math.PI * Math.pow(dia / 2, 2);
      const cubicInPerMin = pitArea * rise;
      const gpm = cubicInPerMin / 231;
      const gph = gpm * 60;
      const recommended = Math.ceil(gph * (1 + head * 0.05));
      return {
        primary: { label: "Recommended GPH", value: formatNumber(recommended) },
        details: [
          { label: "Inflow Rate", value: formatNumber(Math.round(gpm * 100) / 100) + " GPM" },
          { label: "Head Loss Factor", value: formatNumber(Math.round((1 + head * 0.05) * 100) / 100) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What size sump pump do I need?", answer: "Most homes need a pump rated at 2000 to 3000 GPH." },
    { question: "Should I get a backup sump pump?", answer: "A battery backup pump is recommended for power outage protection." },
  ],
  formula: "GPH = Pit Area x Rise Rate / 231 x 60 x Head Factor",
};

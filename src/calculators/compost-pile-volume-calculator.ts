import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostPileVolumeCalculator: CalculatorDefinition = {
  slug: "compost-pile-volume-calculator",
  title: "Compost Pile Volume Calculator",
  description: "Calculate the volume and weight of compost generated from green and brown organic materials, with moisture and carbon-to-nitrogen ratio analysis.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["compost pile volume","compost calculator","composting ratio calculator"],
  variants: [{
    id: "standard",
    name: "Compost Pile Volume",
    description: "Calculate the volume and weight of compost generated from green and brown organic materials, with moisture and carbon-to-nitrogen ratio analysis.",
    fields: [
      { name: "greenMaterial", label: "Green Material (lb/week)", type: "number", min: 1, max: 5000, defaultValue: 50 },
      { name: "brownMaterial", label: "Brown Material (lb/week)", type: "number", min: 1, max: 5000, defaultValue: 100 },
      { name: "weeks", label: "Collection Period (weeks)", type: "number", min: 1, max: 52, defaultValue: 12 },
      { name: "pileHeight", label: "Desired Pile Height (feet)", type: "number", min: 2, max: 8, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const gm = inputs.greenMaterial as number;
      const bm = inputs.brownMaterial as number;
      const wk = inputs.weeks as number;
      const ph = inputs.pileHeight as number;
      if (!gm || !bm || !wk || !ph) return null;
      const totalGreen = gm * wk;
      const totalBrown = bm * wk;
      const totalMaterial = totalGreen + totalBrown;
      const cnRatio = Math.round(((bm * 50 + gm * 15) / (bm + gm)) * 10) / 10;
      var densityLbPerCuFt = 25;
      var volumeCuFt = Math.round(totalMaterial / densityLbPerCuFt);
      var finishedVolume = Math.round(volumeCuFt * 0.4);
      var pileBaseWidth = Math.round(Math.sqrt(volumeCuFt / (ph * 0.5)) * 10) / 10;
      return {
        primary: { label: "Initial Pile Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        details: [
          { label: "Finished Compost Volume", value: formatNumber(finishedVolume) + " cu ft" },
          { label: "Total Material", value: formatNumber(totalMaterial) + " lb" },
          { label: "C:N Ratio", value: formatNumber(cnRatio) + ":1" },
          { label: "Estimated Base Width", value: formatNumber(pileBaseWidth) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["compost-bin-size-calculator","fertilizer-application-rate-calculator"],
  faq: [
    { question: "What is the ideal carbon to nitrogen ratio for composting?", answer: "The ideal C:N ratio for active composting is 25:1 to 35:1. Too much carbon (browns) slows decomposition, while too much nitrogen (greens) causes odor and ammonia loss." },
    { question: "How much does a compost pile shrink?", answer: "A compost pile typically reduces to 40 to 60 percent of its original volume as materials decompose, compact, and lose moisture." },
  ],
  formula: "Pile Volume = Total Material Weight / Density; Finished Volume = Initial Volume x 0.4; C:N Ratio = Weighted average of green and brown carbon ratios",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const silageVolumeCalculator: CalculatorDefinition = {
  slug: "silage-volume-calculator",
  title: "Silage Volume Calculator",
  description: "Calculate silage storage volume needed and estimate tonnage for bunker silos, tower silos, or silage bags.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["silage volume","silage storage calculator","bunker silo capacity"],
  variants: [{
    id: "standard",
    name: "Silage Volume",
    description: "Calculate silage storage volume needed and estimate tonnage for bunker silos, tower silos, or silage bags.",
    fields: [
      { name: "storageType", label: "Storage Type", type: "select", options: [{ value: "1", label: "Bunker Silo" }, { value: "2", label: "Tower Silo" }, { value: "3", label: "Silage Bag" }], defaultValue: "1" },
      { name: "length", label: "Length/Height (feet)", type: "number", min: 10, max: 500, defaultValue: 100 },
      { name: "width", label: "Width/Diameter (feet)", type: "number", min: 5, max: 100, defaultValue: 40 },
      { name: "depth", label: "Depth (feet, bunker only)", type: "number", min: 1, max: 30, defaultValue: 10 },
      { name: "density", label: "Silage Density (lb/cu ft)", type: "number", min: 30, max: 60, defaultValue: 44 },
    ],
    calculate: (inputs) => {
      const st = inputs.storageType as number;
      const len = inputs.length as number;
      const wid = inputs.width as number;
      const dep = inputs.depth as number;
      const dens = inputs.density as number;
      if (!len || !wid || !dens) return null;
      var volume = 0;
      if (st == 1) {
        volume = len * wid * dep;
      } else if (st == 2) {
        var radius = wid / 2;
        volume = Math.round(3.14159 * radius * radius * len);
      } else {
        var radius2 = wid / 2;
        volume = Math.round(3.14159 * radius2 * radius2 * len);
      }
      const totalLbs = Math.round(volume * dens);
      const tons = Math.round(totalLbs / 2000 * 10) / 10;
      return {
        primary: { label: "Storage Volume", value: formatNumber(Math.round(volume)) + " cu ft" },
        details: [
          { label: "Total Weight", value: formatNumber(totalLbs) + " lb" },
          { label: "Tons of Silage", value: formatNumber(tons) + " tons" },
          { label: "Density Used", value: dens + " lb/cu ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["hay-bale-calculator","livestock-feed-calculator"],
  faq: [
    { question: "What is a good silage density?", answer: "Well-packed corn silage should achieve 14 to 16 pounds per cubic foot on a dry matter basis, or 40 to 50 pounds per cubic foot as fed. Higher density reduces spoilage." },
    { question: "How long does silage last in storage?", answer: "Properly stored and sealed silage can last 2 to 3 years. Once opened, a bunker face should be fed out at 6 to 12 inches per day to minimize spoilage." },
  ],
  formula: "Bunker Volume = Length x Width x Depth; Tower/Bag Volume = Pi x (Diameter/2)^2 x Length; Tons = Volume x Density / 2000",
};

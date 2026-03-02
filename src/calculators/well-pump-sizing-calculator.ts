import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wellPumpSizingCalculator: CalculatorDefinition = {
  slug: "well-pump-sizing-calculator",
  title: "Well Pump Sizing Calculator",
  description: "Calculate the horsepower needed for a residential well pump.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["well pump HP","well pump sizing","submersible pump"],
  variants: [{
    id: "standard",
    name: "Well Pump Sizing",
    description: "Calculate the horsepower needed for a residential well pump.",
    fields: [
      { name: "wellDepth", label: "Well Depth (ft)", type: "number", min: 20, max: 1000, defaultValue: 200 },
      { name: "staticLevel", label: "Static Water Level (ft)", type: "number", min: 5, max: 500, defaultValue: 50 },
      { name: "gpmNeeded", label: "Flow Rate Needed (GPM)", type: "number", min: 1, max: 50, defaultValue: 10 },
      { name: "pipeDia", label: "Pipe Diameter (in)", type: "select", options: [{ value: "1", label: "1 inch" }, { value: "1.25", label: "1.25 inch" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const depth = inputs.wellDepth as number;
      const staticLvl = inputs.staticLevel as number;
      const gpm = inputs.gpmNeeded as number;
      const pipe = inputs.pipeDia as string;
      if (!depth || !staticLvl || !gpm) return null;
      const drawdown = 10;
      const totalHead = staticLvl + drawdown + 40;
      const frictionLoss = pipe === "1" ? depth * 0.02 : depth * 0.01;
      const tdh = totalHead + frictionLoss;
      const hp = (gpm * tdh) / (3960 * 0.6);
      const recommended = hp <= 0.5 ? 0.5 : hp <= 0.75 ? 0.75 : hp <= 1 ? 1 : hp <= 1.5 ? 1.5 : 2;
      return {
        primary: { label: "Recommended HP", value: formatNumber(recommended) + " HP" },
        details: [
          { label: "Total Dynamic Head", value: formatNumber(Math.round(tdh)) + " ft" },
          { label: "Calculated HP", value: formatNumber(Math.round(hp * 100) / 100) },
          { label: "Friction Loss", value: formatNumber(Math.round(frictionLoss)) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["septic-tank-size-calculator","water-usage-calculator"],
  faq: [
    { question: "What HP pump do I need for a 200 ft well?", answer: "A 200 ft well typically needs a 0.75 to 1.5 HP submersible pump." },
    { question: "What is total dynamic head?", answer: "It is the sum of static level, drawdown, pressure, and friction loss." },
  ],
  formula: "HP = (GPM x Total Dynamic Head) / (3960 x Efficiency)",
};

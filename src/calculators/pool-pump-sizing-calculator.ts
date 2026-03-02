import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poolPumpSizingCalculator: CalculatorDefinition = {
  slug: "pool-pump-sizing-calculator",
  title: "Pool Pump Sizing Calculator",
  description: "Determine the right pool pump GPM for your pool size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pool pump size","pool pump GPM","pool circulation"],
  variants: [{
    id: "standard",
    name: "Pool Pump Sizing",
    description: "Determine the right pool pump GPM for your pool size.",
    fields: [
      { name: "poolGallons", label: "Pool Volume (gallons)", type: "number", min: 1000, max: 100000, defaultValue: 15000 },
      { name: "turnoverHours", label: "Turnover Time (hours)", type: "number", min: 4, max: 24, defaultValue: 8 },
      { name: "pipeSize", label: "Pipe Diameter (in)", type: "select", options: [{ value: "1.5", label: "1.5 inch" }, { value: "2", label: "2 inch" }], defaultValue: "1.5" },
    ],
    calculate: (inputs) => {
      const gallons = inputs.poolGallons as number;
      const hours = inputs.turnoverHours as number;
      const pipe = inputs.pipeSize as string;
      if (!gallons || !hours) return null;
      const gpm = gallons / (hours * 60);
      const maxGpm = pipe === "2" ? 73 : 43;
      const recommended = Math.min(gpm, maxGpm);
      const hp = gpm <= 30 ? 0.75 : gpm <= 50 ? 1 : gpm <= 70 ? 1.5 : 2;
      return {
        primary: { label: "Required Flow Rate", value: formatNumber(Math.round(gpm * 10) / 10) + " GPM" },
        details: [
          { label: "Max GPM for Pipe", value: formatNumber(maxGpm) + " GPM" },
          { label: "Recommended HP", value: formatNumber(hp) + " HP" },
          { label: "Gallons per Hour", value: formatNumber(Math.round(gpm * 60)) },
        ],
      };
  },
  }],
  relatedSlugs: ["pool-volume-calculator","pool-heater-calculator"],
  faq: [
    { question: "What size pump do I need for my pool?", answer: "Most residential pools need a 1 to 1.5 HP pump with 40 to 60 GPM flow." },
    { question: "How often should pool water turn over?", answer: "Pool water should turn over at least once every 8 to 12 hours." },
  ],
  formula: "GPM = Pool Volume / (Turnover Hours x 60)",
};

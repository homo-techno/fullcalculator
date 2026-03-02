import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tidalRangeCalculator: CalculatorDefinition = {
  slug: "tidal-range-calculator",
  title: "Tidal Range Calculator",
  description: "Estimate tide height at a given time between high and low.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tidal","range","tide","height"],
  variants: [{
    id: "standard",
    name: "Tidal Range",
    description: "Estimate tide height at a given time between high and low.",
    fields: [
      { name: "highTide", label: "High Tide Height (ft)", type: "number", min: 0, max: 30, defaultValue: 8 },
      { name: "lowTide", label: "Low Tide Height (ft)", type: "number", min: -5, max: 20, defaultValue: 2 },
      { name: "hoursAfterHigh", label: "Hours After High Tide", type: "number", min: 0, max: 12, defaultValue: 3 },
      { name: "tidalPeriod", label: "Tidal Period (hours)", type: "number", min: 6, max: 13, defaultValue: 12.42 },
    ],
    calculate: (inputs) => {
    const highTide = inputs.highTide as number;
    const lowTide = inputs.lowTide as number;
    const hoursAfterHigh = inputs.hoursAfterHigh as number;
    const tidalPeriod = inputs.tidalPeriod as number;
    const range = highTide - lowTide;
    const midLevel = (highTide + lowTide) / 2;
    const angle = (2 * Math.PI * hoursAfterHigh) / tidalPeriod;
    const currentHeight = midLevel + (range / 2) * Math.cos(angle);
    return {
      primary: { label: "Current Tide Height", value: formatNumber(currentHeight) + " ft" },
      details: [
        { label: "Tidal Range", value: formatNumber(range) + " ft" },
        { label: "Mid Tide Level", value: formatNumber(midLevel) + " ft" },
        { label: "Hours After High", value: formatNumber(hoursAfterHigh) + " hrs" }
      ]
    };
  },
  }],
  relatedSlugs: ["true-wind-calculator","chart-distance-calculator"],
  faq: [
    { question: "How long is a tidal cycle?", answer: "A typical semidiurnal tidal cycle is about 12 hours 25 minutes." },
    { question: "What is tidal range?", answer: "Tidal range is the height difference between high and low tide." },
  ],
  formula: "Height = MidLevel + (Range / 2) x cos(2 x pi x Hours / Period)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chartDistanceCalculator: CalculatorDefinition = {
  slug: "chart-distance-calculator",
  title: "Chart Distance Calculator",
  description: "Calculate nautical distance from chart measurements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["chart","distance","nautical","navigation"],
  variants: [{
    id: "standard",
    name: "Chart Distance",
    description: "Calculate nautical distance from chart measurements.",
    fields: [
      { name: "chartDist", label: "Chart Distance (cm)", type: "number", min: 0.1, max: 100, defaultValue: 5 },
      { name: "scale", label: "Chart Scale (1:N)", type: "number", min: 1000, max: 10000000, defaultValue: 50000 },
    ],
    calculate: (inputs) => {
    const chartDist = inputs.chartDist as number;
    const scale = inputs.scale as number;
    const realCm = chartDist * scale;
    const realKm = realCm / 100000;
    const nauticalMiles = realKm / 1.852;
    return {
      primary: { label: "Nautical Miles", value: formatNumber(nauticalMiles) + " NM" },
      details: [
        { label: "Real Distance", value: formatNumber(realKm) + " km" },
        { label: "Chart Scale", value: "1:" + formatNumber(scale) },
        { label: "Chart Measurement", value: formatNumber(chartDist) + " cm" }
      ]
    };
  },
  }],
  relatedSlugs: ["nautical-mile-converter-calculator","tidal-range-calculator"],
  faq: [
    { question: "How do I measure distance on a nautical chart?", answer: "Measure with dividers and compare to the latitude scale." },
    { question: "What scale are most coastal charts?", answer: "Coastal charts are typically 1:40000 to 1:80000 scale." },
  ],
  formula: "Real Distance = Chart Distance x Scale; NM = km / 1.852",
};

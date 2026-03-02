import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const conveyorSpeedCalculator: CalculatorDefinition = {
  slug: "conveyor-speed-calculator",
  title: "Conveyor Speed Calculator",
  description: "Calculate conveyor belt throughput and speed.",
  category: "Science",
  categorySlug: "A",
  icon: "Activity",
  keywords: ["conveyor","belt","speed","throughput","material"],
  variants: [{
    id: "standard",
    name: "Conveyor Speed",
    description: "Calculate conveyor belt throughput and speed.",
    fields: [
      { name: "beltSpeed", label: "Belt Speed (ft/min)", type: "number", min: 1, max: 2000, defaultValue: 100 },
      { name: "beltWidth", label: "Belt Width (in)", type: "number", min: 6, max: 96, defaultValue: 24 },
      { name: "materialDepth", label: "Material Depth (in)", type: "number", min: 0.5, max: 24, defaultValue: 3 },
      { name: "materialDensity", label: "Material Density (lbs/cu ft)", type: "number", min: 1, max: 200, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const beltSpeed = inputs.beltSpeed as number;
    const beltWidth = inputs.beltWidth as number;
    const materialDepth = inputs.materialDepth as number;
    const materialDensity = inputs.materialDensity as number;
    const crossSectionSqFt = (beltWidth / 12) * (materialDepth / 12);
    const volumePerMin = crossSectionSqFt * beltSpeed;
    const volumePerHour = volumePerMin * 60;
    const tonsPerHour = (volumePerHour * materialDensity) / 2000;
    return {
      primary: { label: "Throughput (tons/hr)", value: formatNumber(tonsPerHour) },
      details: [
        { label: "Volume Per Minute (cu ft)", value: formatNumber(volumePerMin) },
        { label: "Volume Per Hour (cu ft)", value: formatNumber(volumePerHour) },
        { label: "Cross Section (sq ft)", value: formatNumber(crossSectionSqFt) }
      ]
    };
  },
  }],
  relatedSlugs: ["pick-pack-time-calculator","warehouse-space-calculator","forklift-capacity-calculator"],
  faq: [
    { question: "How is conveyor throughput calculated?", answer: "Multiply cross-sectional area by belt speed and material density." },
    { question: "What is a typical conveyor belt speed?", answer: "Common speeds range from 50 to 400 feet per minute depending on the application." },
  ],
  formula: "Tons/hr = Belt Width x Depth x Speed x Density / 2000",
};

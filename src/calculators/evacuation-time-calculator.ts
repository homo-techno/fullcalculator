import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evacuationTimeCalculator: CalculatorDefinition = {
  slug: "evacuation-time-calculator",
  title: "Evacuation Time Calculator",
  description: "Estimate building evacuation time based on occupancy.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["evacuation time","building evacuation calculator"],
  variants: [{
    id: "standard",
    name: "Evacuation Time",
    description: "Estimate building evacuation time based on occupancy.",
    fields: [
      { name: "occupants", label: "Building Occupants", type: "number", min: 1, max: 10000, defaultValue: 200 },
      { name: "exits", label: "Number of Exits", type: "number", min: 1, max: 20, defaultValue: 4 },
      { name: "exitWidth", label: "Exit Width (inches)", type: "number", min: 20, max: 72, defaultValue: 36 },
      { name: "floors", label: "Number of Floors", type: "number", min: 1, max: 50, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const occ = inputs.occupants as number;
      const exits = inputs.exits as number;
      const ew = inputs.exitWidth as number;
      const floors = inputs.floors as number;
      if (!occ || !exits || !ew || !floors) return null;
      const persPerUnit = ew / 22;
      const flowRate = Math.floor(persPerUnit * 60);
      const totalFlow = flowRate * exits;
      const baseTime = Math.ceil(occ / totalFlow);
      const travelTime = Math.ceil(floors * 0.5);
      const totalMin = baseTime + travelTime;
      return {
        primary: { label: "Estimated Evacuation Time", value: formatNumber(totalMin) + " min" },
        details: [
          { label: "Flow Rate Per Exit", value: formatNumber(flowRate) + " persons/min" },
          { label: "Total Flow Capacity", value: formatNumber(totalFlow) + " persons/min" },
          { label: "Stairwell Travel Time", value: formatNumber(travelTime) + " min" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How fast can a building be evacuated?", answer: "Most commercial buildings target full evacuation in under 3 to 5 minutes." },
    { question: "How wide should exit doors be?", answer: "Fire codes typically require at least 32 to 36 inches of clear exit width." },
  ],
  formula: "Time = ceil(Occupants / (Flow Rate x Exits)) + Floor Travel",
};

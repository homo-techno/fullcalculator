import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bilgePumpSizingCalculator: CalculatorDefinition = {
  slug: "bilge-pump-sizing-calculator",
  title: "Bilge Pump Sizing Calculator",
  description: "Determine the right bilge pump capacity for your boat based on hull size, number of through-hull fittings, and worst-case flooding scenarios.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bilge pump sizing","boat bilge pump capacity","marine bilge pump","bilge pump GPH"],
  variants: [{
    id: "standard",
    name: "Bilge Pump Sizing",
    description: "Determine the right bilge pump capacity for your boat based on hull size, number of through-hull fittings, and worst-case flooding scenarios.",
    fields: [
      { name: "boatLength", label: "Boat Length (feet)", type: "number", min: 10, max: 100, defaultValue: 25 },
      { name: "boatBeam", label: "Beam (feet)", type: "number", min: 4, max: 30, defaultValue: 8 },
      { name: "throughHulls", label: "Number of Through-Hull Fittings", type: "number", min: 1, max: 20, defaultValue: 4 },
      { name: "hullType", label: "Hull Type", type: "select", options: [{ value: "1.0", label: "Flat Bottom" }, { value: "1.2", label: "Modified V" }, { value: "1.4", label: "Deep V" }], defaultValue: "1.2" },
      { name: "pumpHead", label: "Discharge Height (feet)", type: "number", min: 1, max: 10, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const length = inputs.boatLength as number;
    const beam = inputs.boatBeam as number;
    const throughHulls = inputs.throughHulls as number;
    const hullFactor = parseFloat(inputs.hullType as string);
    const head = inputs.pumpHead as number;
    const bilgeVolume = length * beam * 0.5 * hullFactor;
    const minGPH = bilgeVolume * 5 * (1 + throughHulls * 0.1);
    const headLoss = minGPH * (head * 0.05);
    const requiredGPH = minGPH + headLoss;
    const standardSizes = [500, 800, 1000, 1500, 2000, 3000, 3700, 4000];
    let recommended = 4000;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= requiredGPH) { recommended = standardSizes[i]; break; }
    }
    return {
      primary: { label: "Recommended Pump Size", value: formatNumber(recommended) + " GPH" },
      details: [
        { label: "Minimum Required Flow", value: formatNumber(Math.round(requiredGPH)) + " GPH" },
        { label: "Estimated Bilge Volume", value: formatNumber(Math.round(bilgeVolume)) + " gallons" },
        { label: "Head Loss Deduction", value: formatNumber(Math.round(headLoss)) + " GPH" },
        { label: "Through-Hull Risk Factor", value: formatNumber(throughHulls) + " fittings" }
      ]
    };
  },
  }],
  relatedSlugs: ["marine-generator-sizing-calculator","marine-battery-sizing-calculator"],
  faq: [
    { question: "How do I choose a bilge pump size?", answer: "Select a bilge pump that can handle at least the volume of your bilge area times 5 per hour. Consider the discharge head height, as pump capacity drops significantly with increased vertical lift." },
    { question: "Should I have two bilge pumps?", answer: "Yes, the Coast Guard recommends a primary automatic bilge pump and a secondary manual backup. Larger boats should have an additional high-water alarm and a secondary automatic pump." },
    { question: "How much capacity do bilge pumps lose at height?", answer: "Bilge pumps lose 5 to 10 percent of their rated capacity for every foot of vertical lift. A pump rated at 2,000 GPH at zero head may only deliver 1,400 GPH at a 4-foot discharge height." },
  ],
  formula: "Bilge Volume = Length x Beam x 0.5 x Hull Factor
Minimum GPH = Bilge Volume x 5 x (1 + Through-Hulls x 0.1)
Head Loss = Minimum GPH x (Discharge Height x 5%)
Required GPH = Minimum GPH + Head Loss",
};

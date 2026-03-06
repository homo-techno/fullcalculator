import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishingLureWeightCalculator: CalculatorDefinition = {
  slug: "fishing-lure-weight-calculator",
  title: "Fishing Lure Weight Calculator",
  description: "Calculate the optimal lure weight and casting distance based on your rod rating, reel type, line weight, and wind conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fishing lure weight","casting distance calculator","lure selection","fishing tackle weight"],
  variants: [{
    id: "standard",
    name: "Fishing Lure Weight",
    description: "Calculate the optimal lure weight and casting distance based on your rod rating, reel type, line weight, and wind conditions.",
    fields: [
      { name: "rodMaxLure", label: "Rod Max Lure Rating (oz)", type: "number", min: 0.1, max: 16, defaultValue: 1.0 },
      { name: "rodMinLure", label: "Rod Min Lure Rating (oz)", type: "number", min: 0.05, max: 8, defaultValue: 0.25 },
      { name: "lineWeight", label: "Line Weight (lb test)", type: "number", min: 2, max: 100, defaultValue: 10 },
      { name: "lureWeight", label: "Your Lure Weight (oz)", type: "number", min: 0.05, max: 16, defaultValue: 0.5 },
      { name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const maxLure = inputs.rodMaxLure as number;
    const minLure = inputs.rodMinLure as number;
    const line = inputs.lineWeight as number;
    const lure = inputs.lureWeight as number;
    const wind = inputs.windSpeed as number;
    const inRange = lure >= minLure && lure <= maxLure;
    const optimalWeight = (maxLure + minLure) / 2;
    const baseDistance = lure * 80;
    const windPenalty = wind * 0.8;
    const linePenalty = line > 12 ? (line - 12) * 0.5 : 0;
    const castDistance = Math.max(10, baseDistance - windPenalty - linePenalty);
    const matchPercent = inRange ? Math.round(100 - Math.abs(lure - optimalWeight) / optimalWeight * 100) : 0;
    return {
      primary: { label: "Lure Match", value: inRange ? matchPercent + "% Optimal" : "Out of Range" },
      details: [
        { label: "Rod Lure Range", value: minLure + " - " + maxLure + " oz" },
        { label: "Optimal Lure Weight", value: formatNumber(Math.round(optimalWeight * 100) / 100) + " oz" },
        { label: "Estimated Cast Distance", value: formatNumber(Math.round(castDistance)) + " feet" },
        { label: "Within Rod Rating", value: inRange ? "Yes" : "No" },
        { label: "Wind Effect", value: wind > 15 ? "Significant" : wind > 5 ? "Moderate" : "Minimal" }
      ]
    };
  },
  }],
  relatedSlugs: ["fishing-rod-power-calculator","boat-fuel-consumption-calculator"],
  faq: [
    { question: "Does lure weight affect casting distance?", answer: "Yes, heavier lures cast farther because they have more momentum. However, using a lure heavier than your rod rating can stress or damage the rod. Stay within the rated lure weight range printed on your rod." },
    { question: "How do I match lure weight to my rod?", answer: "Check the lure weight rating printed on your rod blank near the handle. The optimal casting performance is usually in the middle of the rated range. Lures at the extremes of the range sacrifice accuracy or distance." },
    { question: "How does wind affect lure selection?", answer: "In windy conditions, use slightly heavier lures and more aerodynamic shapes to maintain casting distance and accuracy. Wind can reduce casting distance by 10 to 30 percent depending on speed and direction." },
  ],
  formula: "Optimal Lure Weight = (Min Rating + Max Rating) / 2
Cast Distance = Lure Weight x 80 - Wind Penalty - Line Penalty
Match % = 100 - |Lure Weight - Optimal| / Optimal x 100",
};

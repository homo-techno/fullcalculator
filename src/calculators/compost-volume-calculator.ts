import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostVolumeCalculator: CalculatorDefinition = {
  slug: "compost-volume-calculator",
  title: "Compost Volume Calculator",
  description: "Calculate the right compost bin dimensions and estimate composting time based on material volume, green-to-brown ratio, and turning frequency.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["compost calculator","compost bin dimensions","composting time","green brown ratio","compost pile"],
  variants: [{
    id: "standard",
    name: "Compost Volume",
    description: "Calculate the right compost bin dimensions and estimate composting time based on material volume, green-to-brown ratio, and turning frequency.",
    fields: [
      { name: "greenLbs", label: "Green Material (lbs/week)", type: "number", min: 1, max: 200, defaultValue: 20 },
      { name: "brownLbs", label: "Brown Material (lbs/week)", type: "number", min: 1, max: 200, defaultValue: 30 },
      { name: "turningFreq", label: "Turning Frequency", type: "select", options: [{ value: "1", label: "Weekly" }, { value: "2", label: "Bi-weekly" }, { value: "3", label: "Monthly" }, { value: "4", label: "Rarely" }], defaultValue: "2" },
      { name: "weeks", label: "Collection Period (weeks)", type: "number", min: 4, max: 52, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const greenLbs = inputs.greenLbs as number;
    const brownLbs = inputs.brownLbs as number;
    const turningFreq = inputs.turningFreq as number;
    const weeks = inputs.weeks as number;
    const totalLbs = (greenLbs + brownLbs) * weeks;
    const volumeCuFt = totalLbs / 25;
    const ratio = brownLbs / Math.max(greenLbs, 0.1);
    const turningDays = [60, 90, 150, 240][turningFreq - 1];
    const ratioAdjust = ratio >= 2 && ratio <= 4 ? 1 : ratio < 2 ? 1.3 : 1.2;
    const compostDays = Math.round(turningDays * ratioAdjust);
    const binSideFt = Math.pow(volumeCuFt, 1 / 3);
    const roundedSide = Math.ceil(binSideFt * 2) / 2;
    const idealRatio = "2:1 to 4:1";
    let ratioStatus = "Optimal";
    if (ratio < 2) ratioStatus = "Too much green - add browns";
    else if (ratio > 4) ratioStatus = "Too much brown - add greens";
    return {
      primary: { label: "Bin Volume Needed", value: formatNumber(Math.round(volumeCuFt)) + " cubic feet" },
      details: [
        { label: "Recommended Bin Size", value: formatNumber(roundedSide) + " x " + formatNumber(roundedSide) + " x " + formatNumber(roundedSide) + " ft" },
        { label: "Brown:Green Ratio", value: formatNumber(Math.round(ratio * 10) / 10) + ":1" },
        { label: "Ratio Status", value: ratioStatus + " (ideal " + idealRatio + ")" },
        { label: "Estimated Composting Time", value: formatNumber(compostDays) + " days" },
        { label: "Total Material Weight", value: formatNumber(totalLbs) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["compost-bin-size-calculator","recycling-savings-calculator","carbon-footprint-offset-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Volume = Total Weight / 25 lbs per cu ft; Bin Side = cube root of Volume; Compost Time = Base Days x Ratio Adjustment; Brown:Green Ratio = Brown lbs / Green lbs",
};

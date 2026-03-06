import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishingRodPowerCalculator: CalculatorDefinition = {
  slug: "fishing-rod-power-calculator",
  title: "Fishing Rod Power Calculator",
  description: "Determine the ideal fishing rod power, action, and line weight based on your target species, fishing technique, and water conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fishing rod power","rod selection guide","fishing rod weight","rod action calculator"],
  variants: [{
    id: "standard",
    name: "Fishing Rod Power",
    description: "Determine the ideal fishing rod power, action, and line weight based on your target species, fishing technique, and water conditions.",
    fields: [
      { name: "targetWeight", label: "Target Fish Weight (lbs)", type: "number", min: 0.5, max: 500, defaultValue: 10 },
      { name: "fishingStyle", label: "Fishing Style", type: "select", options: [{ value: "1", label: "Finesse / Light" }, { value: "2", label: "Casting / Jigging" }, { value: "3", label: "Trolling / Bottom" }, { value: "4", label: "Heavy Offshore" }], defaultValue: "2" },
      { name: "waterType", label: "Water Type", type: "select", options: [{ value: "1", label: "Freshwater" }, { value: "2", label: "Inshore Saltwater" }, { value: "3", label: "Offshore Saltwater" }], defaultValue: "1" },
      { name: "lureWeight", label: "Lure Weight (oz)", type: "number", min: 0.1, max: 32, defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
    const fishWeight = inputs.targetWeight as number;
    const style = parseInt(inputs.fishingStyle as string);
    const water = parseInt(inputs.waterType as string);
    const lure = inputs.lureWeight as number;
    const powers = ["Ultra-Light", "Light", "Medium-Light", "Medium", "Medium-Heavy", "Heavy", "Extra-Heavy"];
    const actions = ["Slow", "Moderate", "Moderate-Fast", "Fast", "Extra-Fast"];
    let powerIdx = 0;
    if (fishWeight <= 2) powerIdx = 0;
    else if (fishWeight <= 5) powerIdx = 1;
    else if (fishWeight <= 10) powerIdx = 2;
    else if (fishWeight <= 20) powerIdx = 3;
    else if (fishWeight <= 40) powerIdx = 4;
    else if (fishWeight <= 100) powerIdx = 5;
    else powerIdx = 6;
    if (water === 3) powerIdx = Math.min(6, powerIdx + 1);
    const actionIdx = Math.min(4, Math.max(0, style));
    const lineMin = Math.max(2, Math.round(fishWeight * 0.8));
    const lineMax = Math.max(4, Math.round(fishWeight * 2.5));
    const rodLength = fishWeight <= 5 ? "5.5 - 6.5" : fishWeight <= 20 ? "6.5 - 7.5" : "7.0 - 9.0";
    return {
      primary: { label: "Recommended Rod Power", value: powers[powerIdx] },
      details: [
        { label: "Recommended Action", value: actions[actionIdx] },
        { label: "Line Weight Range", value: lineMin + " - " + lineMax + " lb test" },
        { label: "Suggested Rod Length", value: rodLength + " feet" },
        { label: "Lure Weight Rating", value: formatNumber(Math.round(lure * 0.5 * 10) / 10) + " - " + formatNumber(Math.round(lure * 2 * 10) / 10) + " oz" }
      ]
    };
  },
  }],
  relatedSlugs: ["fishing-lure-weight-calculator","boat-fuel-consumption-calculator"],
  faq: [
    { question: "What rod power do I need for bass fishing?", answer: "For largemouth bass, a medium to medium-heavy power rod is ideal. Use medium power for finesse techniques and lighter lures, and medium-heavy for flipping, pitching, and heavier baits like jigs and swimbaits." },
    { question: "What is the difference between rod power and action?", answer: "Power refers to the overall stiffness of the rod and determines how much force is needed to bend it. Action describes where along the rod it bends - fast action bends near the tip while slow action bends throughout the rod." },
    { question: "Does water type affect rod selection?", answer: "Yes. Saltwater fishing generally requires heavier rods due to larger fish, stronger currents, and corrosive conditions. Saltwater rods also need corrosion-resistant guides and reel seats." },
  ],
  formula: "Rod Power is matched to target fish weight and fishing conditions; Line Weight Range = Fish Weight x 0.8 to Fish Weight x 2.5; Rod power increases with fish size, water type, and structure density",
};

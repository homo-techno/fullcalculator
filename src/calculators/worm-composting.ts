import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wormCompostingCalculator: CalculatorDefinition = {
  slug: "worm-composting-calculator",
  title: "Worm Composting (Vermicomposting) Calculator",
  description: "Free worm composting calculator. Calculate worm bin size, number of worms, and vermicompost production based on your food waste and household size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["worm composting calculator", "vermicomposting calculator", "worm bin size", "how many worms do I need", "worm farm calculator"],
  variants: [
    {
      id: "by-waste",
      name: "By Food Waste Amount",
      description: "Calculate worm bin needs based on weekly food waste",
      fields: [
        { name: "wastePerWeek", label: "Food Waste per Week (lbs)", type: "number", placeholder: "e.g. 5", min: 0.5, step: 0.5 },
        { name: "binType", label: "Bin Type", type: "select", options: [
          { label: "Stacking Tray System", value: "stacking" },
          { label: "Single Bin (Rubbermaid style)", value: "single" },
          { label: "Flow-Through System", value: "flowthrough" },
          { label: "Outdoor Windrow", value: "windrow" },
        ], defaultValue: "stacking" },
      ],
      calculate: (inputs) => {
        const waste = inputs.wastePerWeek as number;
        const binType = inputs.binType as string;
        if (!waste) return null;

        const wormsNeeded = waste * 1000;
        const lbsOfWorms = wormsNeeded / 1000;
        const binArea = waste * 1;
        const binVolume = binArea * 1;
        const vermicompostPerMonth = waste * 4 * 0.3;
        const wormTeaPerMonth = waste * 0.5;

        const binSizes: Record<string, string> = {
          stacking: `${Math.ceil(binArea)} sq ft surface area (${Math.ceil(Math.sqrt(binArea) * 12)}" × ${Math.ceil(Math.sqrt(binArea) * 12)}" tray)`,
          single: `${Math.ceil(binVolume * 1.5)} gallon bin minimum`,
          flowthrough: `${Math.ceil(binArea)} sq ft surface area × 18" deep`,
          windrow: `${Math.ceil(binArea * 0.5)} ft long × 2 ft wide × 1 ft high`,
        };

        return {
          primary: { label: "Worms Needed", value: `${formatNumber(wormsNeeded, 0)} (~${formatNumber(lbsOfWorms, 1)} lbs)` },
          details: [
            { label: "Food waste processing", value: `${formatNumber(waste, 1)} lbs/week` },
            { label: "Worms (Red Wigglers)", value: `${formatNumber(lbsOfWorms, 1)} lbs to start` },
            { label: "Recommended bin size", value: binSizes[binType] || "4 sq ft minimum" },
            { label: "Vermicompost produced", value: `~${formatNumber(vermicompostPerMonth, 1)} lbs/month` },
            { label: "Worm tea produced", value: `~${formatNumber(wormTeaPerMonth, 1)} gallons/month` },
            { label: "Startup cost estimate", value: `$${formatNumber(lbsOfWorms * 35 + 50, 0)} (worms + bin)` },
          ],
          note: "Red Wiggler worms (Eisenia fetida) eat roughly half their body weight per day. Start with slightly fewer worms; they will multiply to match available food within 3-6 months.",
        };
      },
    },
    {
      id: "by-household",
      name: "By Household Size",
      description: "Estimate worm bin needs based on number of people",
      fields: [
        { name: "numPeople", label: "Number of People", type: "select", options: [
          { label: "1 Person", value: "1" },
          { label: "2 People", value: "2" },
          { label: "3 People", value: "3" },
          { label: "4 People", value: "4" },
          { label: "5+ People", value: "5" },
        ], defaultValue: "2" },
        { name: "dietType", label: "Diet Type", type: "select", options: [
          { label: "Standard (moderate produce)", value: "standard" },
          { label: "Vegetarian/Vegan (lots of produce)", value: "vegan" },
          { label: "Minimal Cooking", value: "minimal" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const people = parseInt(inputs.numPeople as string);
        const diet = inputs.dietType as string;
        if (!people) return null;

        const wastePerPerson: Record<string, number> = {
          standard: 1.5, vegan: 2.5, minimal: 0.75,
        };
        const weeklyWaste = people * (wastePerPerson[diet] || 1.5);
        const wormsNeeded = weeklyWaste * 1000;
        const lbsWorms = wormsNeeded / 1000;
        const binAreaSqFt = weeklyWaste;
        const monthlyCompost = weeklyWaste * 4 * 0.3;
        const yearlyCompost = monthlyCompost * 12;
        const yearlyDiversion = weeklyWaste * 52;

        return {
          primary: { label: "Worms Needed", value: `${formatNumber(lbsWorms, 1)} lbs (~${formatNumber(wormsNeeded, 0)} worms)` },
          details: [
            { label: "Estimated weekly waste", value: `${formatNumber(weeklyWaste, 1)} lbs/week` },
            { label: "Bin surface area needed", value: `${formatNumber(binAreaSqFt, 1)} sq ft` },
            { label: "Monthly compost output", value: `${formatNumber(monthlyCompost, 1)} lbs` },
            { label: "Yearly compost output", value: `${formatNumber(yearlyCompost, 0)} lbs` },
            { label: "Yearly waste diverted", value: `${formatNumber(yearlyDiversion, 0)} lbs from landfill` },
            { label: "Worm population in 6 months", value: `~${formatNumber(wormsNeeded * 2, 0)} (they double)` },
          ],
          note: "Average household produces 1-2 lbs of compostable food waste per person per week. Worms cannot process meat, dairy, citrus, or oily foods.",
        };
      },
    },
  ],
  relatedSlugs: ["compost-ratio-calculator", "compost-calculator", "soil-amendment-calculator"],
  faq: [
    { question: "How many worms do I need for composting?", answer: "The rule of thumb is 1,000 worms (about 1 pound) per pound of food waste per week. A family of 4 producing 6 lbs of waste/week needs about 6,000 worms (6 lbs). Start with fewer; worms double their population every 3-6 months." },
    { question: "What can I feed compost worms?", answer: "Feed worms: fruit/vegetable scraps, coffee grounds and filters, tea bags, crushed eggshells, bread, and shredded paper. Avoid: meat, dairy, oily foods, citrus in large amounts, onions, garlic, and pet waste." },
    { question: "How long does vermicomposting take?", answer: "Worms can process food scraps into vermicompost in 3-6 months. The resulting castings are an incredibly rich fertilizer with 5x the nitrogen, 7x the phosphorus, and 11x the potassium of regular soil." },
  ],
  formula: "Worms Needed = Weekly Food Waste (lbs) × 1,000 | Bin Area = 1 sq ft per lb of weekly waste | Compost Output ≈ 30% of input weight",
};

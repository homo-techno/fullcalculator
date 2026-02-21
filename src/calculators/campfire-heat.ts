import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const campfireHeatCalculator: CalculatorDefinition = {
  slug: "campfire-heat-calculator",
  title: "Campfire Heat Calculator",
  description: "Free campfire heat and BTU calculator. Estimate heat output, firewood consumption, and warming radius for different campfire sizes and wood types.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["campfire heat calculator", "campfire BTU calculator", "campfire temperature", "how hot is a campfire", "firewood burn rate"],
  variants: [
    {
      id: "heat-output",
      name: "Heat Output",
      description: "Estimate campfire heat from size and wood type",
      fields: [
        { name: "fireSize", label: "Fire Size", type: "select", options: [
          { label: "Small (cooking fire, 2 ft wide)", value: "small" },
          { label: "Medium (social fire, 3 ft wide)", value: "medium" },
          { label: "Large (bonfire, 4-5 ft wide)", value: "large" },
          { label: "Very Large (celebration, 6+ ft wide)", value: "very-large" },
        ], defaultValue: "medium" },
        { name: "woodType", label: "Wood Type", type: "select", options: [
          { label: "Hardwood (oak, hickory, maple)", value: "hardwood" },
          { label: "Mixed wood", value: "mixed" },
          { label: "Softwood (pine, spruce, fir)", value: "softwood" },
        ], defaultValue: "mixed" },
        { name: "duration", label: "Duration (hours)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const fireSize = inputs.fireSize as string;
        const woodType = inputs.woodType as string;
        const duration = (inputs.duration as number) || 3;
        if (!fireSize) return null;
        // BTU/hr and wood consumption rates
        const sizeData: Record<string, { btu: number; lbsPerHr: number; warmRadius: number; temp: string }> = {
          small: { btu: 20000, lbsPerHr: 3, warmRadius: 6, temp: "600-900°F" },
          medium: { btu: 60000, lbsPerHr: 8, warmRadius: 10, temp: "900-1200°F" },
          large: { btu: 120000, lbsPerHr: 15, warmRadius: 15, temp: "1200-1500°F" },
          "very-large": { btu: 250000, lbsPerHr: 30, warmRadius: 20, temp: "1500-2000°F" },
        };
        const woodFactor: Record<string, number> = { hardwood: 1.2, mixed: 1.0, softwood: 0.75 };
        const burnRateFactor: Record<string, number> = { hardwood: 0.75, mixed: 1.0, softwood: 1.3 };
        const data = sizeData[fireSize] || sizeData.medium;
        const wf = woodFactor[woodType] || 1.0;
        const bf = burnRateFactor[woodType] || 1.0;
        const totalBTU = data.btu * wf;
        const lbsPerHr = data.lbsPerHr * bf;
        const totalWood = lbsPerHr * duration;
        const cordFraction = totalWood / 3000; // ~3000 lbs per cord average
        return {
          primary: { label: "Heat Output", value: `${formatNumber(totalBTU, 0)} BTU/hr` },
          details: [
            { label: "Core temperature", value: data.temp },
            { label: "Warming radius", value: `${data.warmRadius} feet` },
            { label: "Wood burn rate", value: `${formatNumber(lbsPerHr, 1)} lbs/hr` },
            { label: `Wood for ${duration} hours`, value: `${formatNumber(totalWood, 0)} lbs` },
            { label: "Fraction of a cord", value: `${formatNumber(cordFraction * 100, 1)}% of a cord` },
            { label: "Total BTU produced", value: formatNumber(totalBTU * duration, 0) },
          ],
          note: "A medium campfire burns about 8 lbs of wood per hour. Hardwood burns hotter and longer than softwood. Keep fires at least 15 feet from tents and structures.",
        };
      },
    },
    {
      id: "wood-needed",
      name: "Wood Needed",
      description: "Calculate how much firewood to bring camping",
      fields: [
        { name: "nights", label: "Number of Nights", type: "number", placeholder: "e.g. 2" },
        { name: "hoursPerNight", label: "Hours of Fire per Night", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "fireSize", label: "Fire Size", type: "select", options: [
          { label: "Small (cooking only)", value: "small" },
          { label: "Medium (social/warmth)", value: "medium" },
          { label: "Large (big group)", value: "large" },
        ], defaultValue: "medium" },
      ],
      calculate: (inputs) => {
        const nights = inputs.nights as number;
        const hours = (inputs.hoursPerNight as number) || 4;
        const size = inputs.fireSize as string;
        if (!nights) return null;
        const burnRate: Record<string, number> = { small: 3, medium: 8, large: 15 };
        const rate = burnRate[size] || 8;
        const totalHours = nights * hours;
        const totalLbs = totalHours * rate;
        const bundlesNeeded = Math.ceil(totalLbs / 20); // standard bundle ~20 lbs
        const costEstimate = bundlesNeeded * 7; // ~$7/bundle average
        return {
          primary: { label: "Firewood Needed", value: `${formatNumber(totalLbs, 0)} lbs (${bundlesNeeded} bundles)` },
          details: [
            { label: "Total fire hours", value: `${totalHours} hours` },
            { label: "Burn rate", value: `${rate} lbs/hr` },
            { label: "Bundles (20 lb each)", value: `${bundlesNeeded}` },
            { label: "Estimated cost", value: `$${formatNumber(costEstimate, 0)}` },
            { label: "Per night", value: `${formatNumber(totalLbs / nights, 0)} lbs` },
          ],
          note: "A standard firewood bundle from a store weighs about 20 lbs and lasts 1-2 hours for a medium fire. Buy locally to prevent spread of invasive pests.",
        };
      },
    },
  ],
  relatedSlugs: ["firewood-calculator", "btu-heating-calculator", "trail-distance-calculator"],
  faq: [
    { question: "How hot is a campfire?", answer: "A typical campfire reaches 600-1200°F at the core and 900-1500°F in the flame tips. The hottest part is in the bed of coals, which can exceed 2000°F. At the standard sitting distance of 4-6 feet, you feel pleasant warmth of about 100-120°F radiant heat." },
    { question: "How much firewood do I need for camping?", answer: "Plan for 3-5 lbs per hour for a small cooking fire, 8-10 lbs per hour for a medium social fire, and 15-20 lbs per hour for a large fire. For a typical 2-night camping trip with 4-hour fires, bring about 60-80 lbs (3-4 store bundles)." },
    { question: "What is the best campfire wood?", answer: "Hardwoods (oak, hickory, maple, ash) burn hotter and longer with less smoke. For cooking, fruit woods (apple, cherry) add nice flavor. Avoid pine and spruce for cooking as they create excessive sparks and sooty smoke. Always burn seasoned (dry) wood." },
  ],
  formula: "Wood Needed (lbs) = Burn Rate (lbs/hr) × Duration (hrs) | BTU = Wood Weight × BTU per lb (6,000-8,600 depending on species)",
};

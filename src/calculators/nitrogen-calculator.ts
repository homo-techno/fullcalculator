import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nitrogenCalculator: CalculatorDefinition = {
  slug: "nitrogen-calculator",
  title: "Nitrogen Application Calculator",
  description: "Free nitrogen application calculator. Calculate how much nitrogen fertilizer to apply for lawns, gardens, and crops based on area, crop needs, and fertilizer analysis.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["nitrogen calculator", "nitrogen fertilizer calculator", "nitrogen application rate", "how much nitrogen for lawn", "N fertilizer calculator"],
  variants: [
    {
      id: "by-product",
      name: "By Fertilizer Product",
      description: "Calculate application rate from any nitrogen fertilizer",
      fields: [
        { name: "area", label: "Area to Fertilize (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "targetN", label: "Target Nitrogen (lbs N per 1000 sq ft)", type: "number", placeholder: "e.g. 1", min: 0.1, max: 5, step: 0.1, defaultValue: 1 },
        { name: "fertilizerType", label: "Fertilizer Type", type: "select", options: [
          { label: "Urea (46-0-0)", value: "urea" },
          { label: "Ammonium Sulfate (21-0-0)", value: "ammonium" },
          { label: "Ammonium Nitrate (34-0-0)", value: "ammonium_nitrate" },
          { label: "Blood Meal (12-0-0)", value: "blood" },
          { label: "Feather Meal (13-0-0)", value: "feather" },
          { label: "Fish Emulsion (5-1-1)", value: "fish" },
          { label: "Soybean Meal (7-1-2)", value: "soybean" },
          { label: "Milorganite (6-4-0)", value: "milorganite" },
          { label: "10-10-10 (Balanced)", value: "balanced" },
          { label: "20-5-10 (Lawn)", value: "lawn" },
          { label: "Custom (Enter N%)", value: "custom" },
        ], defaultValue: "urea" },
        { name: "customN", label: "Custom N% (if Custom selected)", type: "number", placeholder: "e.g. 15", min: 1, max: 50 },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const targetN = inputs.targetN as number;
        const fertType = inputs.fertilizerType as string;
        const customN = inputs.customN as number;
        if (!area || !targetN) return null;

        const nPercent: Record<string, number> = {
          urea: 46, ammonium: 21, ammonium_nitrate: 34, blood: 12,
          feather: 13, fish: 5, soybean: 7, milorganite: 6,
          balanced: 10, lawn: 20, custom: customN || 10,
        };
        const releaseType: Record<string, string> = {
          urea: "Quick release (2-4 weeks)", ammonium: "Quick release (2-4 weeks)",
          ammonium_nitrate: "Quick release (1-2 weeks)", blood: "Medium (4-6 weeks)",
          feather: "Slow release (8-12 weeks)", fish: "Quick release (1-2 weeks)",
          soybean: "Slow release (6-10 weeks)", milorganite: "Slow release (8-10 weeks)",
          balanced: "Mixed release", lawn: "Mixed release", custom: "Varies",
        };

        const nPct = nPercent[fertType] || 10;
        const totalN = (area / 1000) * targetN;
        const productNeeded = totalN / (nPct / 100);
        const ratePer1000 = productNeeded / (area / 1000);
        const bags25 = Math.ceil(productNeeded / 25);
        const bags50 = Math.ceil(productNeeded / 50);
        const isOrganic = ["blood", "feather", "fish", "soybean", "milorganite"].includes(fertType);

        return {
          primary: { label: "Product Needed", value: `${formatNumber(productNeeded, 1)} lbs` },
          details: [
            { label: "Nitrogen content", value: `${nPct}%` },
            { label: "Total nitrogen applied", value: `${formatNumber(totalN, 2)} lbs` },
            { label: "Rate per 1000 sq ft", value: `${formatNumber(ratePer1000, 2)} lbs product` },
            { label: "25-lb bags", value: `${bags25}` },
            { label: "50-lb bags", value: `${bags50}` },
            { label: "Release type", value: releaseType[fertType] || "Varies" },
            { label: "Source type", value: isOrganic ? "Organic" : "Synthetic" },
          ],
          note: "Never apply more than 1 lb of quick-release nitrogen per 1000 sq ft at one time. Water in after application. Organic fertilizers release slower and are less likely to burn plants.",
        };
      },
    },
    {
      id: "organic-sources",
      name: "Organic Nitrogen Sources",
      description: "Compare organic nitrogen sources for your garden",
      fields: [
        { name: "area", label: "Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "targetN", label: "Target N (lbs per 1000 sq ft)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "soilTemp", label: "Soil Temperature", type: "select", options: [
          { label: "Cold (Below 50°F) - Slow breakdown", value: "cold" },
          { label: "Moderate (50-70°F) - Normal breakdown", value: "moderate" },
          { label: "Warm (Above 70°F) - Fast breakdown", value: "warm" },
        ], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const targetN = inputs.targetN as number;
        const temp = inputs.soilTemp as string;
        if (!area || !targetN) return null;

        const totalN = (area / 1000) * targetN;
        const tempFactor: Record<string, number> = { cold: 1.5, moderate: 1.0, warm: 0.8 };
        const factor = tempFactor[temp] || 1.0;

        const sources = [
          { name: "Blood Meal (12-0-0)", pct: 12, price: 15, speed: "4-6 weeks" },
          { name: "Feather Meal (13-0-0)", pct: 13, price: 12, speed: "8-12 weeks" },
          { name: "Fish Meal (10-4-0)", pct: 10, price: 18, speed: "4-8 weeks" },
          { name: "Soybean Meal (7-1-2)", pct: 7, price: 8, speed: "6-10 weeks" },
          { name: "Alfalfa Meal (3-1-2)", pct: 3, price: 6, speed: "4-6 weeks" },
          { name: "Aged Chicken Manure (3-2-2)", pct: 3, price: 4, speed: "2-4 weeks" },
        ];

        const details = sources.map(s => {
          const lbs = (totalN / (s.pct / 100)) * factor;
          const cost = (lbs / 25) * s.price;
          return { label: s.name, value: `${formatNumber(lbs, 1)} lbs (~$${formatNumber(cost, 0)}) - Available in ${s.speed}` };
        });

        return {
          primary: { label: "Nitrogen Needed", value: `${formatNumber(totalN * factor, 2)} lbs actual N` },
          details,
          note: "Organic nitrogen sources must be broken down by soil microbes before plants can use them. Cold soil slows this process. Apply organic fertilizers 2-4 weeks before planting for best results.",
        };
      },
    },
  ],
  relatedSlugs: ["lawn-fertilizer-calculator", "fertilizer-calculator", "soil-amendment-calculator"],
  faq: [
    { question: "How do I calculate nitrogen from fertilizer percentage?", answer: "Divide the target nitrogen (lbs) by the fertilizer's N percentage (as a decimal). For example, to apply 1 lb of N using 46-0-0 urea: 1 / 0.46 = 2.17 lbs of urea. For a 20-5-10 fertilizer: 1 / 0.20 = 5 lbs of product." },
    { question: "How much nitrogen does my lawn need per year?", answer: "Most lawns need 2-4 lbs of nitrogen per 1000 sq ft per year, applied in 3-4 split applications of 0.5-1 lb each. Cool-season grasses need 3-4 lbs/year, warm-season grasses need 2-4 lbs/year. Low-maintenance lawns can get by with 1-2 lbs/year." },
    { question: "What are signs of nitrogen deficiency?", answer: "Nitrogen deficiency causes: pale yellow-green leaves (especially older leaves), stunted growth, thin/sparse turf, reduced yields, and poor overall plant vigor. Excess nitrogen causes: dark green lush growth, leggy plants, reduced fruiting, and environmental pollution." },
  ],
  formula: "Product (lbs) = Target N (lbs) / (N% / 100) | Target N = (Area / 1000) × N Rate per 1000 sq ft",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawnFertilizerCalculator: CalculatorDefinition = {
  slug: "lawn-fertilizer-calculator",
  title: "Lawn Fertilizer Calculator (NPK)",
  description: "Free lawn fertilizer calculator. Calculate how much fertilizer to apply based on your lawn size, grass type, NPK ratio, and application rate for a healthy lawn.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lawn fertilizer calculator", "NPK calculator", "fertilizer application rate", "how much fertilizer for lawn", "fertilizer coverage calculator"],
  variants: [
    {
      id: "npk",
      name: "By NPK Ratio",
      description: "Calculate fertilizer amount based on your product's NPK ratio",
      fields: [
        { name: "lawnArea", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "nitrogenRate", label: "Target Nitrogen (lbs N per 1000 sq ft)", type: "select", options: [
          { label: "0.5 lb/1000 (Light feeding)", value: "0.5" },
          { label: "0.75 lb/1000 (Moderate)", value: "0.75" },
          { label: "1.0 lb/1000 (Standard)", value: "1" },
          { label: "1.5 lb/1000 (Heavy feeding)", value: "1.5" },
        ], defaultValue: "1" },
        { name: "nPercent", label: "Fertilizer N (Nitrogen %)", type: "number", placeholder: "e.g. 20", min: 1, max: 50 },
        { name: "pPercent", label: "Fertilizer P (Phosphorus %)", type: "number", placeholder: "e.g. 5", min: 0, max: 50 },
        { name: "kPercent", label: "Fertilizer K (Potassium %)", type: "number", placeholder: "e.g. 10", min: 0, max: 50 },
      ],
      calculate: (inputs) => {
        const area = inputs.lawnArea as number;
        const nRate = parseFloat(inputs.nitrogenRate as string);
        const nPct = inputs.nPercent as number;
        const pPct = inputs.pPercent as number;
        const kPct = inputs.kPercent as number;
        if (!area || !nRate || !nPct) return null;

        const totalNNeeded = (area / 1000) * nRate;
        const fertilizerNeeded = totalNNeeded / (nPct / 100);
        const pDelivered = fertilizerNeeded * ((pPct || 0) / 100);
        const kDelivered = fertilizerNeeded * ((kPct || 0) / 100);
        const applicationRate = (fertilizerNeeded / area) * 1000;
        const bags = Math.ceil(fertilizerNeeded / 25);

        return {
          primary: { label: "Fertilizer Needed", value: `${formatNumber(fertilizerNeeded, 1)} lbs` },
          details: [
            { label: "NPK ratio", value: `${nPct}-${pPct || 0}-${kPct || 0}` },
            { label: "Application rate", value: `${formatNumber(applicationRate, 2)} lbs per 1000 sq ft` },
            { label: "Nitrogen delivered", value: `${formatNumber(totalNNeeded, 2)} lbs total` },
            { label: "Phosphorus delivered", value: `${formatNumber(pDelivered, 2)} lbs total` },
            { label: "Potassium delivered", value: `${formatNumber(kDelivered, 2)} lbs total` },
            { label: "25-lb bags needed", value: `${bags}` },
            { label: "Lawn area", value: `${formatNumber(area, 0)} sq ft` },
          ],
          note: "Apply fertilizer when grass is actively growing. Water in lightly after application. Never apply more than 1 lb of nitrogen per 1,000 sq ft in a single application to prevent burn.",
        };
      },
    },
    {
      id: "by-grass",
      name: "By Grass Type",
      description: "Get annual fertilizer recommendations by grass type",
      fields: [
        { name: "lawnArea", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "grassType", label: "Grass Type", type: "select", options: [
          { label: "Kentucky Bluegrass", value: "kbg" },
          { label: "Tall Fescue", value: "fescue" },
          { label: "Perennial Ryegrass", value: "rye" },
          { label: "Bermuda Grass", value: "bermuda" },
          { label: "Zoysia Grass", value: "zoysia" },
          { label: "St. Augustine", value: "staugustine" },
          { label: "Centipede Grass", value: "centipede" },
          { label: "Buffalo Grass", value: "buffalo" },
        ], defaultValue: "kbg" },
        { name: "condition", label: "Lawn Condition", type: "select", options: [
          { label: "New/Establishing", value: "new" },
          { label: "Maintaining Healthy Lawn", value: "maintain" },
          { label: "Recovering/Stressed", value: "recover" },
        ], defaultValue: "maintain" },
      ],
      calculate: (inputs) => {
        const area = inputs.lawnArea as number;
        const grass = inputs.grassType as string;
        const condition = inputs.condition as string;
        if (!area) return null;

        const annualN: Record<string, number> = {
          kbg: 3.5, fescue: 2.5, rye: 3, bermuda: 4, zoysia: 2.5,
          staugustine: 3, centipede: 1, buffalo: 1.5,
        };
        const applications: Record<string, number> = {
          kbg: 4, fescue: 3, rye: 3, bermuda: 4, zoysia: 3,
          staugustine: 3, centipede: 2, buffalo: 2,
        };
        const conditionMultiplier: Record<string, number> = { new: 0.5, maintain: 1.0, recover: 1.2 };

        const baseN = annualN[grass] || 3;
        const numApps = applications[grass] || 3;
        const totalN = (area / 1000) * baseN * (conditionMultiplier[condition] || 1);
        const nPerApp = totalN / numApps;
        const fertPerApp20 = nPerApp / 0.2;
        const totalFert20 = fertPerApp20 * numApps;

        return {
          primary: { label: "Annual Nitrogen Need", value: `${formatNumber(totalN, 1)} lbs N total` },
          details: [
            { label: "Annual N rate", value: `${baseN} lbs N per 1000 sq ft/year` },
            { label: "Number of applications", value: `${numApps} per year` },
            { label: "N per application", value: `${formatNumber(nPerApp, 2)} lbs` },
            { label: "20-0-10 fertilizer per app", value: `${formatNumber(fertPerApp20, 1)} lbs` },
            { label: "Total 20-0-10 per year", value: `${formatNumber(totalFert20, 1)} lbs` },
            { label: "25-lb bags per year", value: `${Math.ceil(totalFert20 / 25)}` },
          ],
          note: `Cool-season grasses: Fertilize in fall (primary) and spring. Warm-season grasses: Fertilize in late spring through summer. Never fertilize dormant grass.`,
        };
      },
    },
  ],
  relatedSlugs: ["fertilizer-calculator", "nitrogen-calculator", "lawn-calculator"],
  faq: [
    { question: "What does NPK mean on fertilizer?", answer: "NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K). A 20-5-10 fertilizer contains 20% nitrogen, 5% phosphorus, and 10% potassium by weight. Nitrogen promotes green growth, phosphorus supports roots, and potassium improves overall plant health." },
    { question: "How much fertilizer should I put on my lawn?", answer: "Apply 1 lb of actual nitrogen per 1,000 sq ft per application. With a 20-5-10 fertilizer, that is 5 lbs of product per 1,000 sq ft. Apply 3-4 times per year for cool-season grasses, 4-5 times for warm-season grasses." },
    { question: "When should I fertilize my lawn?", answer: "Cool-season grasses (fescue, bluegrass): September is the most important feeding, with a second in late spring. Warm-season grasses (bermuda, zoysia): Feed from late spring through late summer when grass is actively growing. Never fertilize frozen or dormant lawns." },
  ],
  formula: "Fertilizer (lbs) = (Area / 1000 × N Rate) / (N% / 100) | Application Rate = Fertilizer Needed / (Area / 1000)",
};

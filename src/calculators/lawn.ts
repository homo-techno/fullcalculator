import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawnCalculator: CalculatorDefinition = {
  slug: "lawn-calculator",
  title: "Lawn Care Calculator",
  description: "Free lawn care calculator. Calculate fertilizer, seed, and water needs based on your lawn size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lawn calculator", "fertilizer calculator", "grass seed calculator", "lawn care", "lawn watering calculator"],
  variants: [
    {
      id: "fertilizer",
      name: "Fertilizer Needed",
      fields: [
        { name: "sqft", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "nRate", label: "Nitrogen Rate (lbs N per 1000 sq ft)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "nPct", label: "Fertilizer N Percentage", type: "number", suffix: "%", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number, nRate = (inputs.nRate as number) || 1;
        const nPct = inputs.nPct as number;
        if (!sqft || !nPct) return null;
        const totalN = (sqft / 1000) * nRate;
        const fertNeeded = totalN / (nPct / 100);
        return {
          primary: { label: "Fertilizer Needed", value: `${formatNumber(fertNeeded, 1)} lbs` },
          details: [
            { label: "Nitrogen needed", value: `${formatNumber(totalN, 2)} lbs` },
            { label: "Lawn area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "Bags (50 lb)", value: String(Math.ceil(fertNeeded / 50)) },
          ],
        };
      },
    },
    {
      id: "seed",
      name: "Grass Seed Needed",
      fields: [
        { name: "sqft", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "type", label: "Application", type: "select", options: [
          { label: "New lawn (heavy)", value: "new" },
          { label: "Overseeding (light)", value: "over" },
          { label: "Patch repair", value: "patch" },
        ]},
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const type = (inputs.type as string) || "new";
        if (!sqft) return null;
        const rates: Record<string, number> = { new: 8, over: 4, patch: 10 };
        const rate = rates[type] || 8;
        const lbs = (sqft / 1000) * rate;
        return {
          primary: { label: "Seed Needed", value: `${formatNumber(lbs, 1)} lbs` },
          details: [
            { label: "Rate", value: `${rate} lbs per 1,000 sq ft` },
            { label: "Lawn area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "Bags (5 lb)", value: String(Math.ceil(lbs / 5)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["soil-mulch-calculator", "square-footage-calculator", "fence-calculator"],
  faq: [{ question: "How much fertilizer do I need for my lawn?", answer: "Calculate: (Lawn sq ft / 1000) × desired N rate ÷ fertilizer N%. For 5,000 sq ft at 1 lb N per 1,000 sq ft with 20% N fertilizer: (5000/1000) × 1 / 0.20 = 25 lbs of fertilizer." }],
  formula: "Fertilizer (lbs) = (Area/1000) × N Rate / N%",
};

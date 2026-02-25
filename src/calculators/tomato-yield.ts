import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tomatoYieldCalculator: CalculatorDefinition = {
  slug: "tomato-yield-calculator",
  title: "Tomato Yield Calculator",
  description: "Free tomato yield calculator. Estimate tomato production based on variety, plant count, and growing conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tomato yield calculator", "tomato harvest", "tomatoes per plant", "tomato production"],
  variants: [
    {
      id: "basic",
      name: "Basic Yield Estimate",
      description: "Estimate total tomato yield from your plants",
      fields: [
        { name: "plantCount", label: "Number of Plants", type: "number", placeholder: "e.g. 10" },
        { name: "variety", label: "Tomato Variety", type: "select", options: [{ label: "Cherry/Grape", value: "cherry" }, { label: "Roma/Paste", value: "roma" }, { label: "Beefsteak", value: "beefsteak" }, { label: "Heirloom", value: "heirloom" }] },
        { name: "growType", label: "Growth Type", type: "select", options: [{ label: "Determinate", value: "determinate" }, { label: "Indeterminate", value: "indeterminate" }] },
      ],
      calculate: (inputs) => {
        const plantCount = inputs.plantCount as number;
        const variety = inputs.variety as string;
        const growType = inputs.growType as string;
        if (!plantCount || !variety || !growType) return null;
        const yieldLbs: Record<string, number> = { cherry: 10, roma: 15, beefsteak: 20, heirloom: 15 };
        const fruitCt: Record<string, number> = { cherry: 200, roma: 75, beefsteak: 30, heirloom: 40 };
        const mult = growType === "indeterminate" ? 1.3 : 1.0;
        const lpp = (yieldLbs[variety] || 15) * mult;
        const fpp = Math.round((fruitCt[variety] || 50) * mult);
        const totalLbs = lpp * plantCount;
        return {
          primary: { label: "Total Estimated Yield", value: formatNumber(totalLbs, 0) + " lbs" },
          details: [
            { label: "Yield per plant", value: formatNumber(lpp, 1) + " lbs" },
            { label: "Total fruits", value: formatNumber(fpp * plantCount, 0) },
            { label: "Fruits per plant", value: formatNumber(fpp, 0) },
            { label: "Growth type", value: growType.charAt(0).toUpperCase() + growType.slice(1) },
          ],
        };
      },
    },
    {
      id: "advanced",
      name: "Advanced Yield Estimate",
      description: "Include growing conditions for more accuracy",
      fields: [
        { name: "plantCount", label: "Number of Plants", type: "number", placeholder: "e.g. 10" },
        { name: "variety", label: "Variety", type: "select", options: [{ label: "Cherry", value: "cherry" }, { label: "Roma", value: "roma" }, { label: "Beefsteak", value: "beefsteak" }, { label: "Heirloom", value: "heirloom" }] },
        { name: "sunlight", label: "Sunlight", type: "select", options: [{ label: "Low (< 6h)", value: "low" }, { label: "Medium (6-8h)", value: "medium" }, { label: "High (8+h)", value: "high" }] },
        { name: "soilQuality", label: "Soil Quality", type: "select", options: [{ label: "Poor", value: "poor" }, { label: "Average", value: "average" }, { label: "Excellent", value: "excellent" }] },
      ],
      calculate: (inputs) => {
        const c = inputs.plantCount as number;
        const v = inputs.variety as string;
        const s = inputs.sunlight as string;
        const q = inputs.soilQuality as string;
        if (!c || !v || !s || !q) return null;
        const b: Record<string, number> = { cherry: 10, roma: 15, beefsteak: 20, heirloom: 15 };
        const sm: Record<string, number> = { low: 0.6, medium: 0.85, high: 1.0 };
        const qm: Record<string, number> = { poor: 0.6, average: 0.85, excellent: 1.1 };
        const lpp = (b[v] || 15) * (sm[s] || 0.85) * (qm[q] || 0.85);
        const t = lpp * c;
        return {
          primary: { label: "Total Yield", value: formatNumber(t, 0) + " lbs" },
          details: [
            { label: "Per plant", value: formatNumber(lpp, 1) + " lbs" },
            { label: "Plants", value: formatNumber(c, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["plant-spacing-calculator", "garden-yield-calculator", "vegetable-garden-size-calculator"],
  faq: [
    { question: "How many tomatoes does one plant produce?", answer: "A single tomato plant can produce 10-30 lbs of fruit per season depending on variety and conditions." },
    { question: "How long until tomatoes produce fruit?", answer: "Most varieties take 60-85 days from transplant to first harvest." },
  ],
  formula: "Yield = Base Yield per Plant x Variety Factor x Condition Multipliers x Plant Count",
};

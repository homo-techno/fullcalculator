import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const phAdjustmentCalculator: CalculatorDefinition = {
  slug: "ph-adjustment-calculator",
  title: "Soil pH Adjustment Calculator",
  description: "Free soil pH adjustment calculator. Calculate how much lime or sulfur to add to raise or lower your soil pH for optimal plant growth and nutrient availability.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soil pH adjustment calculator", "how much lime to add", "lower soil pH", "raise soil pH", "lime calculator for garden", "sulfur for soil pH"],
  variants: [
    {
      id: "raise-ph",
      name: "Raise pH (Add Lime)",
      description: "Calculate lime needed to raise soil pH",
      fields: [
        { name: "area", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "currentPH", label: "Current Soil pH", type: "number", placeholder: "e.g. 5.5", min: 3.0, max: 8.0, step: 0.1 },
        { name: "targetPH", label: "Target Soil pH", type: "number", placeholder: "e.g. 6.5", min: 4.0, max: 8.0, step: 0.1 },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sandy Soil", value: "sandy" },
          { label: "Loamy Soil", value: "loam" },
          { label: "Clay Soil", value: "clay" },
          { label: "Organic/Peaty Soil", value: "organic" },
        ], defaultValue: "loam" },
        { name: "limeType", label: "Lime Type", type: "select", options: [
          { label: "Ground Limestone (Calcitic)", value: "calcitic" },
          { label: "Dolomitic Limestone", value: "dolomitic" },
          { label: "Hydrated Lime (Fast-Acting)", value: "hydrated" },
          { label: "Wood Ash", value: "woodash" },
        ], defaultValue: "calcitic" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const current = inputs.currentPH as number;
        const target = inputs.targetPH as number;
        const soil = inputs.soilType as string;
        const lime = inputs.limeType as string;
        if (!area || !current || !target || target <= current) return null;

        const phChange = target - current;
        const lbsPer1000PerPoint: Record<string, number> = {
          sandy: 25, loam: 50, clay: 75, organic: 100,
        };
        const limeEfficiency: Record<string, number> = {
          calcitic: 1.0, dolomitic: 1.0, hydrated: 0.75, woodash: 2.5,
        };

        const baseLbs = (area / 1000) * phChange * (lbsPer1000PerPoint[soil] || 50);
        const adjustedLbs = baseLbs * (limeEfficiency[lime] || 1.0);
        const bags50lb = Math.ceil(adjustedLbs / 50);
        const bags40lb = Math.ceil(adjustedLbs / 40);

        return {
          primary: { label: "Lime Needed", value: `${formatNumber(adjustedLbs, 1)} lbs` },
          details: [
            { label: "pH change needed", value: `${formatNumber(current, 1)} → ${formatNumber(target, 1)} (+${formatNumber(phChange, 1)})` },
            { label: "Application rate", value: `${formatNumber(adjustedLbs / (area / 1000), 1)} lbs per 1000 sq ft` },
            { label: "50-lb bags needed", value: `${bags50lb}` },
            { label: "40-lb bags needed", value: `${bags40lb}` },
            { label: "Soil type adjustment", value: `${soil} soil requires ${lbsPer1000PerPoint[soil]} lbs/1000 sq ft per pH point` },
            { label: "Time to take effect", value: lime === "hydrated" ? "2-4 weeks" : lime === "woodash" ? "1-3 months" : "3-6 months" },
          ],
          note: "Apply lime in fall for best results - it needs time to react with soil. Do not apply more than 50 lbs per 1000 sq ft at once. Retest pH in 3-6 months and reapply if needed. Water after application.",
        };
      },
    },
    {
      id: "lower-ph",
      name: "Lower pH (Add Sulfur)",
      description: "Calculate sulfur needed to lower soil pH",
      fields: [
        { name: "area", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "currentPH", label: "Current Soil pH", type: "number", placeholder: "e.g. 7.5", min: 4.0, max: 9.0, step: 0.1 },
        { name: "targetPH", label: "Target Soil pH", type: "number", placeholder: "e.g. 5.5", min: 3.5, max: 8.0, step: 0.1 },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sandy Soil", value: "sandy" },
          { label: "Loamy Soil", value: "loam" },
          { label: "Clay Soil", value: "clay" },
        ], defaultValue: "loam" },
        { name: "acidifier", label: "Acidifier Type", type: "select", options: [
          { label: "Elemental Sulfur (Standard)", value: "sulfur" },
          { label: "Aluminum Sulfate (Fast-Acting)", value: "aluminum" },
          { label: "Iron Sulfate", value: "iron" },
          { label: "Peat Moss (Gentle, Large Volume)", value: "peat" },
        ], defaultValue: "sulfur" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const current = inputs.currentPH as number;
        const target = inputs.targetPH as number;
        const soil = inputs.soilType as string;
        const acidifier = inputs.acidifier as string;
        if (!area || !current || !target || target >= current) return null;

        const phChange = current - target;
        const sulfurPer1000PerPoint: Record<string, number> = {
          sandy: 10, loam: 20, clay: 30,
        };
        const conversionFactor: Record<string, number> = {
          sulfur: 1.0, aluminum: 6.0, iron: 8.5, peat: 50,
        };

        const baseSulfur = (area / 1000) * phChange * (sulfurPer1000PerPoint[soil] || 20);
        const actualAmount = baseSulfur * (conversionFactor[acidifier] || 1.0);
        const bags = Math.ceil(actualAmount / (acidifier === "peat" ? 60 : 25));

        return {
          primary: { label: "Amendment Needed", value: `${formatNumber(actualAmount, 1)} lbs` },
          details: [
            { label: "pH change needed", value: `${formatNumber(current, 1)} → ${formatNumber(target, 1)} (-${formatNumber(phChange, 1)})` },
            { label: "Rate per 1000 sq ft", value: `${formatNumber(actualAmount / (area / 1000), 1)} lbs` },
            { label: "Bags needed", value: `${bags}` },
            { label: "Time to take effect", value: acidifier === "aluminum" ? "2-4 weeks" : acidifier === "iron" ? "3-4 weeks" : "3-6 months" },
            { label: "Common acid-loving plants", value: "Blueberries (4.5-5.5), Azaleas (4.5-6.0), Rhododendrons (4.5-6.0)" },
          ],
          note: "Elemental sulfur is the most effective long-term solution. Apply in spring or fall. Do not exceed 5 lbs sulfur per 1000 sq ft per application. Aluminum sulfate works faster but can build up aluminum toxicity.",
        };
      },
    },
  ],
  relatedSlugs: ["soil-ph-calculator", "soil-amendment-calculator", "nitrogen-calculator"],
  faq: [
    { question: "How do I raise soil pH?", answer: "Add agricultural lime (ground limestone) to raise pH. Sandy soil needs about 25 lbs per 1000 sq ft per pH point, loam needs 50 lbs, and clay needs 75 lbs. Apply in fall and work into the top 6 inches. Dolomitic lime also adds magnesium." },
    { question: "How do I lower soil pH?", answer: "Add elemental sulfur: 10 lbs per 1000 sq ft per pH point for sandy soil, 20 lbs for loam, 30 lbs for clay. Aluminum sulfate works faster but at 6x the rate. Peat moss and pine needles provide gradual acidification." },
    { question: "What pH do most vegetables prefer?", answer: "Most vegetables grow best at pH 6.0-7.0, with 6.5 being ideal. Blueberries need 4.5-5.5. Potatoes prefer 5.0-6.0. Asparagus tolerates 6.5-8.0. Test your soil before planting and amend as needed." },
  ],
  formula: "Lime (lbs) = (Area/1000) × pH Change × Lbs per 1000 sq ft per pH point | Sulfur: Sandy 10, Loam 20, Clay 30 lbs per 1000 sq ft per pH point",
};

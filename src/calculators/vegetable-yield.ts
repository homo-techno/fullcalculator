import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vegetableYieldCalculator: CalculatorDefinition = {
  slug: "vegetable-yield-calculator",
  title: "Vegetable Garden Yield Calculator",
  description: "Free vegetable yield calculator. Estimate how much produce your garden will grow based on garden size, vegetables planted, and growing conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vegetable yield calculator", "garden yield estimator", "how much will my garden produce", "vegetable production calculator", "garden harvest calculator"],
  variants: [
    {
      id: "by-vegetable",
      name: "By Vegetable Type",
      description: "Estimate yield for specific vegetables",
      fields: [
        { name: "vegetable", label: "Vegetable", type: "select", options: [
          { label: "Tomatoes", value: "tomato" },
          { label: "Peppers (Bell)", value: "pepper" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Zucchini/Summer Squash", value: "zucchini" },
          { label: "Green Beans (Bush)", value: "bean" },
          { label: "Peas", value: "pea" },
          { label: "Lettuce", value: "lettuce" },
          { label: "Spinach", value: "spinach" },
          { label: "Kale", value: "kale" },
          { label: "Carrots", value: "carrot" },
          { label: "Potatoes", value: "potato" },
          { label: "Onions", value: "onion" },
          { label: "Corn (Sweet)", value: "corn" },
          { label: "Broccoli", value: "broccoli" },
          { label: "Cabbage", value: "cabbage" },
          { label: "Garlic", value: "garlic" },
        ], defaultValue: "tomato" },
        { name: "numPlants", label: "Number of Plants", type: "number", placeholder: "e.g. 6" },
        { name: "growingConditions", label: "Growing Conditions", type: "select", options: [
          { label: "Excellent (Ideal soil, sun, water)", value: "excellent" },
          { label: "Good (Mostly ideal)", value: "good" },
          { label: "Average (Some limitations)", value: "average" },
          { label: "Poor (Multiple challenges)", value: "poor" },
        ], defaultValue: "good" },
      ],
      calculate: (inputs) => {
        const veg = inputs.vegetable as string;
        const plants = inputs.numPlants as number;
        const conditions = inputs.growingConditions as string;
        if (!veg || !plants) return null;

        const yieldPerPlant: Record<string, number> = {
          tomato: 15, pepper: 6, cucumber: 10, zucchini: 20,
          bean: 2, pea: 1, lettuce: 0.75, spinach: 0.5,
          kale: 2, carrot: 0.5, potato: 5, onion: 0.5,
          corn: 1, broccoli: 1.5, cabbage: 3, garlic: 0.25,
        };
        const harvestPeriod: Record<string, string> = {
          tomato: "8-12 weeks", pepper: "8-10 weeks", cucumber: "6-8 weeks",
          zucchini: "8-10 weeks", bean: "3-4 weeks", pea: "3-4 weeks",
          lettuce: "3-6 weeks", spinach: "4-6 weeks", kale: "12+ weeks",
          carrot: "Single harvest", potato: "Single harvest", onion: "Single harvest",
          corn: "1-2 ears per stalk", broccoli: "1 head + side shoots", cabbage: "Single harvest",
          garlic: "Single harvest",
        };
        const conditionMultiplier: Record<string, number> = {
          excellent: 1.3, good: 1.0, average: 0.7, poor: 0.4,
        };

        const yieldEach = yieldPerPlant[veg] || 5;
        const multiplier = conditionMultiplier[conditions] || 1.0;
        const totalYield = plants * yieldEach * multiplier;
        const pricePerLb: Record<string, number> = {
          tomato: 3.5, pepper: 3, cucumber: 2, zucchini: 2, bean: 3.5,
          pea: 4, lettuce: 3, spinach: 5, kale: 4, carrot: 2, potato: 1.5,
          onion: 1.5, corn: 0.5, broccoli: 3, cabbage: 1.5, garlic: 8,
        };
        const savings = totalYield * (pricePerLb[veg] || 2.5);

        return {
          primary: { label: "Estimated Total Yield", value: `${formatNumber(totalYield, 1)} lbs` },
          details: [
            { label: "Yield per plant", value: `${formatNumber(yieldEach * multiplier, 1)} lbs` },
            { label: "Number of plants", value: `${plants}` },
            { label: "Harvest period", value: harvestPeriod[veg] || "6-8 weeks" },
            { label: "Grocery store value", value: `$${formatNumber(savings, 2)}` },
            { label: "Condition adjustment", value: `${multiplier * 100}% of typical yield` },
          ],
          note: "Yields vary significantly based on variety, climate, soil quality, and care. These estimates assume a typical growing season in a temperate climate.",
        };
      },
    },
    {
      id: "by-area",
      name: "By Garden Area",
      description: "Estimate total production from garden area",
      fields: [
        { name: "area", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "gardenType", label: "Garden Style", type: "select", options: [
          { label: "Mixed Vegetables", value: "mixed" },
          { label: "Salad Garden (Greens/Herbs)", value: "salad" },
          { label: "Salsa Garden (Tomatoes/Peppers)", value: "salsa" },
          { label: "Root Vegetable Garden", value: "root" },
          { label: "High-Intensity (Square Foot)", value: "sqft" },
        ], defaultValue: "mixed" },
        { name: "season", label: "Growing Season", type: "select", options: [
          { label: "Single Season (Spring-Fall)", value: "single" },
          { label: "Extended (Cold Frame/Row Cover)", value: "extended" },
          { label: "Year-Round (Mild Climate)", value: "yearround" },
        ], defaultValue: "single" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const garden = inputs.gardenType as string;
        const season = inputs.season as string;
        if (!area) return null;

        const yieldPerSqFt: Record<string, number> = {
          mixed: 0.75, salad: 0.5, salsa: 1.0, root: 0.8, sqft: 1.2,
        };
        const seasonMultiplier: Record<string, number> = {
          single: 1.0, extended: 1.4, yearround: 2.0,
        };

        const baseYield = area * (yieldPerSqFt[garden] || 0.75);
        const totalYield = baseYield * (seasonMultiplier[season] || 1.0);
        const groceryValue = totalYield * 3;
        const feedsPeople = totalYield / 200;

        return {
          primary: { label: "Estimated Annual Yield", value: `${formatNumber(totalYield, 0)} lbs` },
          details: [
            { label: "Yield per sq ft", value: `${formatNumber(yieldPerSqFt[garden] || 0.75, 2)} lbs` },
            { label: "Garden area", value: `${formatNumber(area, 0)} sq ft` },
            { label: "Season multiplier", value: `${seasonMultiplier[season] || 1}x` },
            { label: "Grocery value (at $3/lb avg)", value: `$${formatNumber(groceryValue, 0)}` },
            { label: "Feeds approximately", value: `${formatNumber(feedsPeople, 1)} people (supplemental)` },
            { label: "Per week (20-week season)", value: `${formatNumber(totalYield / 20, 1)} lbs/week` },
          ],
          note: "A well-maintained 200 sq ft garden can produce 150-300 lbs of vegetables per season, worth $400-900 in grocery savings. Succession planting and intensive methods increase yields significantly.",
        };
      },
    },
  ],
  relatedSlugs: ["garden-yield-calculator", "plant-spacing-calculator", "harvest-date-calculator"],
  faq: [
    { question: "How much will my vegetable garden produce?", answer: "A well-maintained garden produces 0.5-1.5 lbs per square foot per season. A 4x8 raised bed (32 sq ft) can yield 25-50 lbs of vegetables. Using intensive/square foot methods and succession planting can double these numbers." },
    { question: "How much does a tomato plant produce?", answer: "A single indeterminate tomato plant produces 10-20 lbs of tomatoes per season (about 20-40 medium tomatoes). Determinate varieties produce 8-15 lbs in a concentrated harvest period. Cherry tomatoes can yield even more by count." },
    { question: "How big a garden to feed a family of 4?", answer: "A 600-800 sq ft garden can provide a significant portion of a family of 4's summer vegetables. For year-round eating including preserved foods, plan 200 sq ft per person (800 sq ft total). Start small and expand as you gain experience." },
  ],
  formula: "Total Yield = Plants × Yield per Plant × Condition Factor | Area Yield = Area (sq ft) × Yield per sq ft × Season Multiplier",
};

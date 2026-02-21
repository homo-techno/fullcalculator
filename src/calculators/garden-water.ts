import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gardenWaterCalculator: CalculatorDefinition = {
  slug: "garden-water-calculator",
  title: "Garden Water Needs Calculator",
  description: "Free garden watering calculator. Calculate how much water your garden needs per week based on garden size, plant types, climate, and soil conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garden water calculator", "how much to water garden", "garden watering schedule", "vegetable garden water needs", "garden irrigation calculator"],
  variants: [
    {
      id: "weekly-needs",
      name: "Weekly Water Needs",
      description: "Calculate weekly water requirements for your garden",
      fields: [
        { name: "gardenArea", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "plantType", label: "Primary Plant Type", type: "select", options: [
          { label: "Vegetables (Tomatoes, Peppers)", value: "vegetable" },
          { label: "Leafy Greens (Lettuce, Spinach)", value: "leafy" },
          { label: "Root Vegetables (Carrots, Beets)", value: "root" },
          { label: "Herbs", value: "herbs" },
          { label: "Fruit Trees", value: "fruit_tree" },
          { label: "Flower Garden", value: "flowers" },
          { label: "Lawn/Turf", value: "lawn" },
        ], defaultValue: "vegetable" },
        { name: "climate", label: "Climate/Season", type: "select", options: [
          { label: "Hot & Dry (90°F+)", value: "hot" },
          { label: "Warm & Humid (75-90°F)", value: "warm" },
          { label: "Moderate (60-75°F)", value: "moderate" },
          { label: "Cool (Below 60°F)", value: "cool" },
        ], defaultValue: "warm" },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sandy (Drains Fast)", value: "sandy" },
          { label: "Loam (Ideal)", value: "loam" },
          { label: "Clay (Retains Water)", value: "clay" },
          { label: "Raised Bed Mix", value: "raised" },
        ], defaultValue: "loam" },
        { name: "weeklyRain", label: "Expected Weekly Rainfall (inches)", type: "number", placeholder: "e.g. 0.5", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const area = inputs.gardenArea as number;
        const plant = inputs.plantType as string;
        const climate = inputs.climate as string;
        const soil = inputs.soilType as string;
        const rain = inputs.weeklyRain as number;
        if (!area) return null;

        const baseInchesPerWeek: Record<string, number> = {
          vegetable: 1.5, leafy: 1.0, root: 1.0, herbs: 0.75,
          fruit_tree: 2.0, flowers: 1.0, lawn: 1.0,
        };
        const climateMultiplier: Record<string, number> = {
          hot: 1.5, warm: 1.2, moderate: 1.0, cool: 0.7,
        };
        const soilMultiplier: Record<string, number> = {
          sandy: 1.3, loam: 1.0, clay: 0.8, raised: 1.1,
        };

        const baseInches = baseInchesPerWeek[plant] || 1.0;
        const adjustedInches = baseInches * (climateMultiplier[climate] || 1.0) * (soilMultiplier[soil] || 1.0);
        const supplementalInches = Math.max(0, adjustedInches - (rain || 0));
        const gallonsPerInchPerSqFt = 0.623;
        const weeklyGallons = supplementalInches * area * gallonsPerInchPerSqFt;
        const dailyGallons = weeklyGallons / 7;
        const monthlyGallons = weeklyGallons * 4.3;
        const waterCostPer1000 = 5;
        const monthlyCost = (monthlyGallons / 1000) * waterCostPer1000;

        return {
          primary: { label: "Weekly Water Need", value: `${formatNumber(weeklyGallons, 0)} gallons` },
          details: [
            { label: "Inches per week needed", value: `${formatNumber(adjustedInches, 2)}"` },
            { label: "Rainfall credit", value: `${formatNumber(rain || 0, 1)}" per week` },
            { label: "Supplemental irrigation", value: `${formatNumber(supplementalInches, 2)}" per week` },
            { label: "Daily watering", value: `${formatNumber(dailyGallons, 1)} gallons` },
            { label: "Monthly total", value: `${formatNumber(monthlyGallons, 0)} gallons` },
            { label: "Est. monthly water cost", value: `$${formatNumber(monthlyCost, 2)} (at $5/1000 gal)` },
          ],
          note: "Water deeply and less frequently rather than shallow daily watering. Most gardens need 1-1.5 inches of water per week. Water early morning to reduce evaporation.",
        };
      },
    },
    {
      id: "hose-time",
      name: "Watering Time Calculator",
      description: "Calculate how long to water with your hose or sprinkler",
      fields: [
        { name: "area", label: "Area to Water (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "inchesNeeded", label: "Inches of Water Needed", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "waterSource", label: "Watering Method", type: "select", options: [
          { label: "Garden Hose (5 GPM)", value: "hose" },
          { label: "Soaker Hose (2 GPM per 50ft)", value: "soaker" },
          { label: "Oscillating Sprinkler (3 GPM)", value: "oscillating" },
          { label: "Drip Irrigation (0.5 GPH per emitter)", value: "drip" },
          { label: "Watering Can (2 gallons)", value: "can" },
        ], defaultValue: "hose" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const inches = inputs.inchesNeeded as number;
        const method = inputs.waterSource as string;
        if (!area || !inches) return null;

        const totalGallons = area * inches * 0.623;
        const gpmRates: Record<string, number> = {
          hose: 5, soaker: 2, oscillating: 3, drip: 1, can: 0.5,
        };
        const gpm = gpmRates[method] || 3;
        const minutes = totalGallons / gpm;
        const hours = minutes / 60;

        return {
          primary: { label: "Watering Time", value: minutes < 60 ? `${formatNumber(minutes, 0)} minutes` : `${formatNumber(hours, 1)} hours` },
          details: [
            { label: "Total water needed", value: `${formatNumber(totalGallons, 0)} gallons` },
            { label: "Flow rate", value: `${gpm} GPM` },
            { label: "Time in minutes", value: formatNumber(minutes, 1) },
            { label: "Time in hours", value: formatNumber(hours, 2) },
            { label: "Area covered", value: `${formatNumber(area, 0)} sq ft` },
          ],
          note: "Place a tuna can or rain gauge in the watering zone to verify delivery rate. When the can fills to 1 inch, you have delivered 1 inch of water.",
        };
      },
    },
  ],
  relatedSlugs: ["drip-irrigation-calculator", "rain-barrel-calculator", "sprinkler-coverage-calculator"],
  faq: [
    { question: "How much water does a vegetable garden need per week?", answer: "Most vegetable gardens need 1-1.5 inches of water per week, equivalent to about 60-90 gallons per 100 sq ft. In hot weather (90°F+), this can increase to 2 inches. Deep, infrequent watering encourages strong root growth." },
    { question: "When is the best time to water a garden?", answer: "Water early morning (6-10 AM) for best results. Morning watering reduces evaporation and gives foliage time to dry before evening, reducing disease risk. Avoid watering in the heat of midday or late evening." },
    { question: "How do I know if my garden needs water?", answer: "Stick your finger 2-3 inches into the soil. If it feels dry at that depth, it is time to water. Wilting in the afternoon heat is normal, but morning wilting indicates water stress. Mulching reduces water needs by 25-50%." },
  ],
  formula: "Weekly Gallons = (Inches Needed - Rainfall) × Area (sq ft) × 0.623 | 1 inch of water on 1 sq ft = 0.623 gallons",
};

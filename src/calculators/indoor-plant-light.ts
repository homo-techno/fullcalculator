import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indoorPlantLightCalculator: CalculatorDefinition = {
  slug: "indoor-plant-light-calculator",
  title: "Indoor Plant Light Calculator",
  description: "Free indoor plant light calculator. Determine grow light wattage, placement, and duration needed for healthy indoor plants.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["indoor plant light calculator", "grow light calculator", "plant light requirements", "how much light do plants need", "grow light wattage"],
  variants: [
    {
      id: "grow-light",
      name: "Grow Light Requirements",
      description: "Calculate grow light wattage and coverage for your plants",
      fields: [
        { name: "area", label: "Growing Area (sq ft)", type: "number", placeholder: "e.g. 8" },
        { name: "lightLevel", label: "Plant Light Requirement", type: "select", options: [
          { label: "Low light (ferns, pothos) - 20 watts/sq ft", value: "20" },
          { label: "Medium light (herbs, lettuce) - 30 watts/sq ft", value: "30" },
          { label: "High light (tomatoes, peppers) - 40 watts/sq ft", value: "40" },
          { label: "Very high (flowering/fruiting) - 50 watts/sq ft", value: "50" },
        ], defaultValue: "30" },
        { name: "lightType", label: "Light Type", type: "select", options: [
          { label: "LED (most efficient)", value: "1.0" },
          { label: "Fluorescent / CFL", value: "1.5" },
          { label: "HPS / Metal Halide", value: "1.3" },
        ], defaultValue: "1.0" },
        { name: "hours", label: "Daily Light Hours", type: "select", options: [
          { label: "8 hours (low-light plants)", value: "8" },
          { label: "12 hours (most plants)", value: "12" },
          { label: "14 hours (vegetables)", value: "14" },
          { label: "16 hours (seedlings)", value: "16" },
          { label: "18 hours (maximum growth)", value: "18" },
        ], defaultValue: "12" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const wattsPerSqFt = parseInt(inputs.lightLevel as string) || 30;
        const typeMod = parseFloat(inputs.lightType as string) || 1.0;
        const hours = parseInt(inputs.hours as string) || 12;
        if (!area) return null;

        const baseWatts = area * wattsPerSqFt;
        const actualWatts = baseWatts * typeMod;
        const dailyKwh = (actualWatts * hours) / 1000;
        const monthlyKwh = dailyKwh * 30;
        const monthlyCost = monthlyKwh * 0.13;
        const hangHeight = wattsPerSqFt <= 20 ? "24-36" : wattsPerSqFt <= 30 ? "18-24" : "12-18";

        return {
          primary: { label: "Wattage Needed", value: `${formatNumber(actualWatts)} watts` },
          details: [
            { label: "Growing area", value: `${formatNumber(area)} sq ft` },
            { label: "Daily light hours", value: `${hours} hours` },
            { label: "Daily energy use", value: `${formatNumber(dailyKwh, 2)} kWh` },
            { label: "Monthly energy use", value: `${formatNumber(monthlyKwh, 1)} kWh` },
            { label: "Est. monthly cost (@ $0.13/kWh)", value: `$${formatNumber(monthlyCost, 2)}` },
            { label: "Recommended hang height", value: `${hangHeight} inches above plants` },
          ],
          note: "LED grow lights are the most energy efficient. Adjust height as plants grow. Use a timer for consistent light cycles.",
        };
      },
    },
    {
      id: "natural-light",
      name: "Natural Light Assessment",
      description: "Assess if your window provides enough light for plants",
      fields: [
        { name: "direction", label: "Window Direction", type: "select", options: [
          { label: "South-facing (brightest)", value: "6" },
          { label: "East-facing (morning sun)", value: "4" },
          { label: "West-facing (afternoon sun)", value: "4" },
          { label: "North-facing (lowest light)", value: "2" },
        ], defaultValue: "4" },
        { name: "obstruction", label: "Window Obstruction", type: "select", options: [
          { label: "No obstruction (clear view)", value: "1.0" },
          { label: "Partial shade (trees, buildings)", value: "0.6" },
          { label: "Heavy shade (tall buildings)", value: "0.3" },
          { label: "Sheer curtains", value: "0.5" },
        ], defaultValue: "1.0" },
        { name: "distance", label: "Distance from Window (feet)", type: "number", placeholder: "e.g. 3", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const baseHours = parseInt(inputs.direction as string) || 4;
        const obstruction = parseFloat(inputs.obstruction as string) || 1.0;
        const distance = (inputs.distance as number) || 2;

        const distanceFactor = 1 / (1 + (distance - 1) * 0.3);
        const effectiveHours = baseHours * obstruction * distanceFactor;

        let suitablePlants = "";
        if (effectiveHours >= 5) suitablePlants = "Succulents, cacti, herbs, tomatoes, most flowering plants";
        else if (effectiveHours >= 3) suitablePlants = "Herbs, African violets, spider plants, most foliage plants";
        else if (effectiveHours >= 1.5) suitablePlants = "Pothos, peace lily, snake plant, ZZ plant, ferns";
        else suitablePlants = "Very limited - consider a grow light supplement";

        return {
          primary: { label: "Effective Light Hours", value: `${formatNumber(effectiveHours, 1)} hours/day` },
          details: [
            { label: "Base sunlight", value: `${baseHours} hours` },
            { label: "After obstructions", value: `${formatNumber(baseHours * obstruction, 1)} hours` },
            { label: "Distance from window", value: `${distance} feet` },
            { label: "Suitable plants", value: suitablePlants },
          ],
          note: "Light intensity drops dramatically with distance from the window. Rotate plants periodically for even growth.",
        };
      },
    },
  ],
  relatedSlugs: ["pot-size-calculator", "watering-schedule-calculator", "electricity-calculator"],
  faq: [
    { question: "How many watts of grow light per square foot?", answer: "For LEDs: low light plants need 20W/sq ft, vegetables and herbs need 30W/sq ft, and fruiting plants need 40-50W/sq ft. Non-LED lights need 30-50% more wattage." },
    { question: "How far should grow lights be from plants?", answer: "LEDs: 12-24 inches for most plants. Fluorescents: 6-12 inches. HPS/MH: 24-36 inches. Watch for signs of light burn (bleached or curling leaves) and adjust accordingly." },
  ],
  formula: "Wattage = Area (sq ft) \u00D7 Watts/sq ft \u00D7 Light Type Modifier",
};

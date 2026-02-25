import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wateringScheduleCalculator: CalculatorDefinition = {
  slug: "watering-schedule-calculator",
  title: "Watering Schedule Calculator",
  description: "Free watering schedule calculator. Determine how much and how often to water your garden, lawn, or potted plants based on conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["watering schedule calculator", "how often to water plants", "garden watering calculator", "lawn watering schedule", "irrigation calculator"],
  variants: [
    {
      id: "lawn",
      name: "Lawn Watering Schedule",
      description: "Calculate watering needs for your lawn",
      fields: [
        { name: "area", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "grassType", label: "Grass Type", type: "select", options: [
          { label: "Cool-season (fescue, bluegrass, rye)", value: "cool" },
          { label: "Warm-season (bermuda, zoysia, St. Augustine)", value: "warm" },
        ], defaultValue: "cool" },
        { name: "season", label: "Season", type: "select", options: [
          { label: "Spring (moderate)", value: "0.75" },
          { label: "Summer (peak)", value: "1.0" },
          { label: "Fall (moderate)", value: "0.6" },
          { label: "Winter (dormant)", value: "0.2" },
        ], defaultValue: "1.0" },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sandy (drains fast, water more often)", value: "sandy" },
          { label: "Loam (balanced)", value: "loam" },
          { label: "Clay (retains water, water less often)", value: "clay" },
        ], defaultValue: "loam" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const grassType = inputs.grassType as string;
        const seasonMod = parseFloat(inputs.season as string) || 1.0;
        const soilType = inputs.soilType as string;
        if (!area) return null;

        const weeklyInches = grassType === "cool" ? 1.5 * seasonMod : 1.0 * seasonMod;
        const frequency = soilType === "sandy" ? 3 : soilType === "clay" ? 1 : 2;
        const inchesPerSession = weeklyInches / frequency;
        const gallonsPerInch = area * 0.623;
        const weeklyGallons = gallonsPerInch * weeklyInches;
        const minutesPerSession = (inchesPerSession / 1.0) * 30;

        return {
          primary: { label: "Weekly Water Needed", value: `${formatNumber(weeklyInches, 2)} inches` },
          details: [
            { label: "Watering frequency", value: `${frequency} time${frequency > 1 ? "s" : ""} per week` },
            { label: "Per session", value: `${formatNumber(inchesPerSession, 2)} inches` },
            { label: "Sprinkler time per session", value: `~${formatNumber(minutesPerSession)} minutes` },
            { label: "Weekly water volume", value: `${formatNumber(weeklyGallons)} gallons` },
            { label: "Best time to water", value: "Early morning (6-10 AM)" },
          ],
          note: "Water deeply and infrequently to encourage deep roots. Adjust for rainfall - subtract any rain received from weekly needs.",
        };
      },
    },
    {
      id: "garden",
      name: "Garden Watering Schedule",
      description: "Calculate watering needs for vegetable and flower gardens",
      fields: [
        { name: "area", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "plantType", label: "Plant Type", type: "select", options: [
          { label: "Vegetables (1-2 inches/week)", value: "1.5" },
          { label: "Flowers / annuals (1 inch/week)", value: "1.0" },
          { label: "Established perennials (0.5 inch/week)", value: "0.5" },
          { label: "Seedlings (keep moist, 0.5 inch/week)", value: "0.5" },
          { label: "Containers (daily check)", value: "2.0" },
        ], defaultValue: "1.5" },
        { name: "weather", label: "Weather Conditions", type: "select", options: [
          { label: "Cool and cloudy", value: "0.6" },
          { label: "Mild and average", value: "1.0" },
          { label: "Hot and sunny", value: "1.4" },
          { label: "Very hot and windy", value: "1.8" },
        ], defaultValue: "1.0" },
        { name: "mulched", label: "Mulch Coverage", type: "select", options: [
          { label: "No mulch", value: "1.0" },
          { label: "Mulched (2-3 inches)", value: "0.7" },
          { label: "Heavy mulch (4+ inches)", value: "0.5" },
        ], defaultValue: "0.7" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const baseInches = parseFloat(inputs.plantType as string) || 1.5;
        const weatherMod = parseFloat(inputs.weather as string) || 1.0;
        const mulchMod = parseFloat(inputs.mulched as string) || 0.7;
        if (!area) return null;

        const adjustedInches = baseInches * weatherMod * mulchMod;
        const weeklyGallons = area * 0.623 * adjustedInches;
        const dailyGallons = weeklyGallons / 7;

        return {
          primary: { label: "Weekly Water Needed", value: `${formatNumber(adjustedInches, 2)} inches` },
          details: [
            { label: "Weekly volume", value: `${formatNumber(weeklyGallons)} gallons` },
            { label: "Daily average", value: `${formatNumber(dailyGallons, 1)} gallons` },
            { label: "Base requirement", value: `${baseInches} inches/week` },
            { label: "Weather adjustment", value: `\u00D7${weatherMod}` },
            { label: "Mulch savings", value: `\u00D7${mulchMod} (${formatNumber((1 - mulchMod) * 100)}% reduction)` },
          ],
          note: "Use a rain gauge to track natural rainfall. Stick your finger 2 inches into soil - if dry, it is time to water. Water at the base of plants, not the leaves.",
        };
      },
    },
  ],
  relatedSlugs: ["drip-irrigation-layout-calculator", "lawn-overseeding-calculator", "vegetable-garden-size-calculator"],
  faq: [
    { question: "How much water does a garden need per week?", answer: "Most vegetable gardens need 1-2 inches of water per week. This includes rainfall. In hot weather, they may need more. Use mulch to retain moisture and reduce watering needs by 30-50%." },
    { question: "When is the best time to water plants?", answer: "Early morning (6-10 AM) is best. Water has time to soak in before evaporation increases, and leaves dry during the day which prevents disease. Avoid watering in the evening." },
  ],
  formula: "Weekly Water (in) = Base Need \u00D7 Weather Modifier \u00D7 Mulch Modifier | Gallons = Area \u00D7 0.623 \u00D7 Inches",
};

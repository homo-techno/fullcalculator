import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hikingCalorieCalculator: CalculatorDefinition = {
  slug: "hiking-calorie-calculator",
  title: "Hiking Calorie Calculator",
  description:
    "Free hiking calorie burn calculator. Estimate calories burned while hiking based on your weight, duration, terrain, elevation gain, and pack weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "hiking calorie calculator",
    "calories burned hiking",
    "hiking calories per mile",
    "backpacking calories",
    "trail hiking calories",
  ],
  variants: [
    {
      id: "calc",
      name: "Hiking Calorie Burn",
      description: "Calculate calories burned during a hike",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 120", min: 1 },
        {
          name: "terrain",
          label: "Terrain/Difficulty",
          type: "select",
          options: [
            { label: "Flat Trail (easy)", value: "4.0" },
            { label: "Rolling Hills (moderate)", value: "5.5" },
            { label: "Steep/Mountain Trail (hard)", value: "7.0" },
            { label: "Scrambling/Off-trail (very hard)", value: "8.5" },
          ],
          defaultValue: "5.5",
        },
        {
          name: "packWeight",
          label: "Pack Weight",
          type: "select",
          options: [
            { label: "No Pack (0 lbs)", value: "0" },
            { label: "Light Daypack (5-10 lbs)", value: "7.5" },
            { label: "Medium Pack (15-25 lbs)", value: "20" },
            { label: "Heavy Backpack (30-50 lbs)", value: "40" },
            { label: "Very Heavy (50+ lbs)", value: "60" },
          ],
          defaultValue: "7.5",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const baseMet = parseFloat(inputs.terrain as string);
        const packWeight = parseFloat(inputs.packWeight as string);
        if (!weight || !duration) return null;

        const weightKg = weight * 0.453592;
        const packKg = packWeight * 0.453592;

        // Adjust MET for pack weight (approximately 1 MET per 10kg of pack)
        const packAdjustment = packKg / 10;
        const effectiveMet = baseMet + packAdjustment;

        const hours = duration / 60;
        const totalCalories = effectiveMet * weightKg * hours;
        const calPerMinute = totalCalories / duration;

        // Estimate distance based on terrain and speed
        const avgSpeedMph = baseMet <= 4 ? 3.0 : baseMet <= 5.5 ? 2.5 : baseMet <= 7 ? 2.0 : 1.5;
        const distanceMiles = avgSpeedMph * hours;

        // Water needs estimate (oz per hour)
        const waterOzPerHour = effectiveMet > 6 ? 24 : effectiveMet > 4 ? 16 : 12;
        const totalWaterOz = waterOzPerHour * hours;

        return {
          primary: { label: "Calories Burned", value: formatNumber(totalCalories, 0) },
          details: [
            { label: "Calories per Minute", value: formatNumber(calPerMinute, 1) },
            { label: "Effective MET", value: formatNumber(effectiveMet, 1) },
            { label: "Duration", value: `${formatNumber(duration, 0)} min (${formatNumber(hours, 1)} hrs)` },
            { label: "Est. Distance", value: `${formatNumber(distanceMiles, 1)} miles` },
            { label: "Cal per Mile", value: formatNumber(totalCalories / distanceMiles, 0) },
            { label: "Water Needed", value: `${formatNumber(totalWaterOz, 0)} oz (${formatNumber(totalWaterOz / 33.814, 1)} L)` },
          ],
          note: "Calorie burn is heavily influenced by elevation gain, trail conditions, and pack weight. Hot or cold weather and high altitude also increase energy expenditure.",
        };
      },
    },
  ],
  relatedSlugs: ["walking-calorie-calculator", "exercise-calorie-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How many calories does hiking burn per hour?",
      answer:
        "A 170-lb person burns approximately 400-550 calories per hour of moderate hiking with a light daypack. Steep terrain with a heavy pack can burn 600-900+ calories per hour. Flat easy hiking burns about 300-400 calories per hour.",
    },
    {
      question: "Does carrying a backpack burn more calories?",
      answer:
        "Yes. For every 10 lbs of pack weight, calorie burn increases by approximately 5-10%. A 40-lb pack can increase calorie expenditure by 20-30% compared to hiking without a pack.",
    },
    {
      question: "How many calories does a 5-mile hike burn?",
      answer:
        "A 5-mile moderate hike for a 170-lb person takes about 2 hours and burns approximately 800-1000 calories. On steep terrain with a pack, the same distance could burn 1200-1500 calories but take longer to complete.",
    },
  ],
  formula: "Calories = MET × Weight (kg) × Duration (hours) | MET adjusted for pack weight: +1 MET per 10kg of pack",
};

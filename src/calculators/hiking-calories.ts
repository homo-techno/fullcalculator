import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hikingCaloriesCalculator: CalculatorDefinition = {
  slug: "hiking-calories",
  title: "Hiking Calorie Burn Calculator",
  description: "Free online hiking calorie burn calculator. Estimate calories burned while hiking based on duration, terrain, pack weight, and body weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hiking calories", "calories burned hiking", "trail calories", "backpacking calories", "walking uphill calories"],
  variants: [
    {
      id: "hiking-calories",
      name: "Hiking Calories Burned",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 120" },
        {
          name: "terrain",
          label: "Terrain Type",
          type: "select",
          options: [
            { label: "Flat Trail (easy)", value: "4.3" },
            { label: "Rolling Hills (moderate)", value: "5.3" },
            { label: "Steep Uphill (strenuous)", value: "7.0" },
            { label: "Mountain / Scrambling", value: "8.0" },
            { label: "Cross-Country / Off-Trail", value: "6.5" },
          ],
        },
        { name: "packWeight", label: "Pack Weight (lbs)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const duration = parseFloat(inputs.duration as string) || 0;
        const met = parseFloat(inputs.terrain as string) || 5.3;
        const packWeight = parseFloat(inputs.packWeight as string) || 0;

        const totalWeight = weight + packWeight;
        const totalWeightKg = totalWeight * 0.453592;
        const durationHours = duration / 60;

        const calories = met * totalWeightKg * durationHours;
        const calPerMinute = duration > 0 ? calories / duration : 0;
        const calPerHour = calories / (durationHours || 1);

        return {
          primary: { label: "Calories Burned", value: formatNumber(Math.round(calories)) },
          details: [
            { label: "Duration (min)", value: formatNumber(duration) },
            { label: "MET Value", value: formatNumber(met) },
            { label: "Calories per Minute", value: formatNumber(calPerMinute) },
            { label: "Calories per Hour", value: formatNumber(Math.round(calPerHour)) },
            { label: "Total Carried Weight", value: `${formatNumber(totalWeight)} lbs` },
            { label: "Pack Weight", value: `${formatNumber(packWeight)} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steps-to-calories", "cycling-calories", "steps-to-miles"],
  faq: [
    {
      question: "How many calories does hiking burn per hour?",
      answer: "Hiking burns approximately 350-600 calories per hour for a 160-pound person, depending on terrain difficulty. Flat trail hiking burns fewer calories, while steep uphill hiking with a pack can burn 500+ calories per hour.",
    },
    {
      question: "Does carrying a backpack burn more calories?",
      answer: "Yes. Carrying a backpack increases calorie burn because your body has to work harder to support and move the extra weight. Every additional 10 pounds of pack weight increases calorie burn by roughly 5-10%.",
    },
    {
      question: "How do I calculate calories for uphill vs downhill?",
      answer: "Uphill hiking burns significantly more calories than flat or downhill hiking. Use the steep uphill terrain option (MET 7.0) for sustained ascents. Downhill hiking still burns calories but approximately 30-40% less than uphill.",
    },
  ],
  formula: "Calories = MET x Total Weight(kg) x Duration(hours); Total Weight = Body Weight + Pack Weight",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backpackingFoodCalculator: CalculatorDefinition = {
  slug: "backpacking-food-calculator",
  title: "Backpacking Food & Calorie Planner",
  description:
    "Free backpacking food weight and calorie planner. Calculate how much food to pack for your trip based on days, activity level, and calorie density.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "backpacking food calculator",
    "trail food planner",
    "hiking calorie calculator",
    "backpacking meal planning",
    "food weight hiking",
  ],
  variants: [
    {
      id: "food-weight",
      name: "Food Weight Planner",
      description: "Calculate total food weight for your trip",
      fields: [
        {
          name: "tripDays",
          label: "Trip Length (days)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 30,
        },
        {
          name: "bodyWeight",
          label: "Body Weight (lbs)",
          type: "number",
          placeholder: "e.g. 170",
          min: 80,
          max: 350,
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Easy (flat terrain, 5-8 mi/day)", value: "easy" },
            { label: "Moderate (hilly, 8-12 mi/day)", value: "moderate" },
            { label: "Strenuous (mountain, 12-18 mi/day)", value: "strenuous" },
            { label: "Extreme (high altitude, 18+ mi/day)", value: "extreme" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "foodType",
          label: "Food Type",
          type: "select",
          options: [
            { label: "Typical Backpacking Food (~100 cal/oz)", value: "typical" },
            { label: "Ultralight / High Calorie (~125 cal/oz)", value: "ultralight" },
            { label: "Fresh/Heavy Food (~70 cal/oz)", value: "fresh" },
          ],
          defaultValue: "typical",
        },
      ],
      calculate: (inputs) => {
        const days = parseFloat(inputs.tripDays as string);
        const bodyWeight = parseFloat(inputs.bodyWeight as string);
        const activity = inputs.activityLevel as string;
        const foodType = inputs.foodType as string;
        if (!days || !bodyWeight) return null;

        // Daily calorie needs
        const baseCals = bodyWeight * 13; // base metabolic with moderate activity
        const activityMultiplier: Record<string, number> = {
          easy: 1.3,
          moderate: 1.6,
          strenuous: 2.0,
          extreme: 2.4,
        };
        const dailyCals = baseCals * (activityMultiplier[activity] || 1.6);

        // Calories per ounce
        const calPerOz: Record<string, number> = {
          typical: 100,
          ultralight: 125,
          fresh: 70,
        };
        const cpo = calPerOz[foodType] || 100;

        const dailyOz = dailyCals / cpo;
        const dailyLbs = dailyOz / 16;
        const totalOz = dailyOz * days;
        const totalLbs = totalOz / 16;
        const totalKg = totalLbs * 0.4536;
        const totalCals = dailyCals * days;

        return {
          primary: {
            label: "Total Food Weight",
            value: formatNumber(totalLbs, 1) + " lbs",
          },
          details: [
            { label: "Total Food (kg)", value: formatNumber(totalKg, 1) },
            { label: "Daily Food Weight", value: formatNumber(dailyLbs, 1) + " lbs (" + formatNumber(dailyOz, 0) + " oz)" },
            { label: "Daily Calories Needed", value: formatNumber(dailyCals, 0) + " cal" },
            { label: "Total Calories", value: formatNumber(totalCals, 0) + " cal" },
            { label: "Calorie Density", value: formatNumber(cpo, 0) + " cal/oz" },
            { label: "Trip Length", value: formatNumber(days, 0) + " days" },
          ],
          note: "Plan 1.5-2.5 lbs of food per day. Always pack an extra day of emergency food.",
        };
      },
    },
    {
      id: "meal-breakdown",
      name: "Meal Calorie Breakdown",
      description: "Plan meal distribution for a day on trail",
      fields: [
        {
          name: "dailyCalories",
          label: "Target Daily Calories",
          type: "number",
          placeholder: "e.g. 3500",
          min: 1500,
          max: 6000,
        },
        {
          name: "mealsPerDay",
          label: "Meals Per Day",
          type: "select",
          options: [
            { label: "2 meals + snacks", value: "2" },
            { label: "3 meals + snacks", value: "3" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const dailyCals = parseFloat(inputs.dailyCalories as string);
        const mealsStr = inputs.mealsPerDay as string;
        if (!dailyCals) return null;

        const meals = parseInt(mealsStr);
        let breakfast = 0, lunch = 0, dinner = 0, snacks = 0;

        if (meals === 3) {
          breakfast = dailyCals * 0.25;
          lunch = dailyCals * 0.25;
          dinner = dailyCals * 0.3;
          snacks = dailyCals * 0.2;
        } else {
          breakfast = dailyCals * 0.3;
          lunch = 0;
          dinner = dailyCals * 0.35;
          snacks = dailyCals * 0.35;
        }

        const totalOzAt100 = dailyCals / 100;
        const totalLbs = totalOzAt100 / 16;

        const details = [];
        details.push({ label: "Breakfast", value: formatNumber(breakfast, 0) + " cal" });
        if (meals === 3) {
          details.push({ label: "Lunch", value: formatNumber(lunch, 0) + " cal" });
        }
        details.push({ label: "Dinner", value: formatNumber(dinner, 0) + " cal" });
        details.push({ label: "Snacks/Grazing", value: formatNumber(snacks, 0) + " cal" });
        details.push({ label: "Food Weight (~100 cal/oz)", value: formatNumber(totalLbs, 1) + " lbs (" + formatNumber(totalOzAt100, 0) + " oz)" });

        return {
          primary: {
            label: "Daily Calories",
            value: formatNumber(dailyCals, 0) + " cal",
          },
          details,
          note: "Eat snacks frequently while hiking. High-fat foods provide the most calories per ounce (nuts, olive oil, chocolate).",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "protein-calculator"],
  faq: [
    {
      question: "How many calories do you need per day backpacking?",
      answer:
        "Most backpackers need 2,500-4,500 calories per day depending on body weight, terrain, pack weight, and pace. A general rule is 25-30 calories per pound of body weight for moderate activity. Strenuous mountain hiking can require 4,000+ calories.",
    },
    {
      question: "How much food weight should I carry per day?",
      answer:
        "Plan for 1.5-2.5 pounds of food per person per day. Ultralight backpackers aim for 1.5 lbs/day using high calorie-density foods (125+ cal/oz). Typical trail food averages about 100 calories per ounce, which works out to about 2 lbs/day for 3,200 calories.",
    },
  ],
  formula:
    "Daily Calories = Body Weight × 13 × Activity Multiplier | Food Weight (oz) = Daily Calories / Calorie Density (cal/oz)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catFoodCalculator: CalculatorDefinition = {
  slug: "cat-food-calculator",
  title: "Cat Daily Food Calculator",
  description:
    "Free cat daily food calculator. Calculate exactly how much wet and dry food your cat needs per day based on weight, age, activity level, and food type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat food calculator",
    "how much to feed my cat",
    "cat wet food amount",
    "cat dry food amount",
    "cat feeding calculator",
  ],
  variants: [
    {
      id: "catDailyFood",
      name: "Daily Food Amount",
      fields: [
        {
          name: "weight",
          label: "Cat's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 30,
          step: 0.5,
        },
        {
          name: "lifeStage",
          label: "Life Stage",
          type: "select",
          options: [
            { label: "Kitten (under 1 year)", value: "kitten" },
            { label: "Adult (1-10 years)", value: "adult" },
            { label: "Senior (10+ years)", value: "senior" },
          ],
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Indoor / Sedentary", value: "low" },
            { label: "Moderately Active", value: "moderate" },
            { label: "Very Active / Outdoor", value: "high" },
          ],
        },
        {
          name: "foodType",
          label: "Feeding Style",
          type: "select",
          options: [
            { label: "Wet Food Only", value: "wet" },
            { label: "Dry Food Only", value: "dry" },
            { label: "Mixed (Wet + Dry)", value: "mixed" },
          ],
        },
        {
          name: "condition",
          label: "Body Condition",
          type: "select",
          options: [
            { label: "Underweight", value: "underweight" },
            { label: "Ideal Weight", value: "ideal" },
            { label: "Overweight", value: "overweight" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const lifeStage = (inputs.lifeStage as string) || "adult";
        const activity = (inputs.activity as string) || "moderate";
        const foodType = (inputs.foodType as string) || "mixed";
        const condition = (inputs.condition as string) || "ideal";
        if (!weight || weight <= 0) return null;

        const weightKg = weight * 0.453592;
        const rer = 70 * Math.pow(weightKg, 0.75);

        const stageFactors: Record<string, number> = {
          kitten: 2.5,
          adult: 1.2,
          senior: 1.0,
        };

        const activityFactors: Record<string, number> = {
          low: 0.85,
          moderate: 1.0,
          high: 1.2,
        };

        const conditionFactors: Record<string, number> = {
          underweight: 1.2,
          ideal: 1.0,
          overweight: 0.8,
        };

        const dailyCals = rer * stageFactors[lifeStage] * activityFactors[activity] * conditionFactors[condition];

        // Calorie densities
        const wetCalPerOz = 28; // ~28 cal/oz for typical wet food
        const dryCalPerCup = 375; // ~375 cal/cup for typical dry food
        const wetCalPer5oz = wetCalPerOz * 5.5; // standard 5.5 oz can

        let wetFoodDisplay = "";
        let dryFoodDisplay = "";
        let mealsDisplay = "";

        if (foodType === "wet") {
          const totalOz = dailyCals / wetCalPerOz;
          const cans = dailyCals / wetCalPer5oz;
          wetFoodDisplay = formatNumber(totalOz, 1) + " oz (" + formatNumber(cans, 1) + " standard 5.5-oz cans)";
          dryFoodDisplay = "N/A";
        } else if (foodType === "dry") {
          const cups = dailyCals / dryCalPerCup;
          wetFoodDisplay = "N/A";
          dryFoodDisplay = formatNumber(cups, 2) + " cups";
        } else {
          // Mixed: 60% wet, 40% dry calories
          const wetCals = dailyCals * 0.6;
          const dryCals = dailyCals * 0.4;
          const wetOz = wetCals / wetCalPerOz;
          const dryCups = dryCals / dryCalPerCup;
          wetFoodDisplay = formatNumber(wetOz, 1) + " oz wet";
          dryFoodDisplay = formatNumber(dryCups, 2) + " cups dry";
        }

        mealsDisplay = lifeStage === "kitten" ? "3-4 meals" : "2-3 meals";

        return {
          primary: {
            label: "Daily Calories",
            value: formatNumber(dailyCals, 0) + " kcal",
          },
          details: [
            { label: "Wet Food Daily", value: wetFoodDisplay },
            { label: "Dry Food Daily", value: dryFoodDisplay },
            { label: "Meals Per Day", value: mealsDisplay },
            { label: "Resting Energy (RER)", value: formatNumber(rer, 0) + " kcal" },
            { label: "Cat Weight", value: formatNumber(weight, 1) + " lbs (" + formatNumber(weightKg, 1) + " kg)" },
            {
              label: "Tip",
              value: "Wet food provides better hydration. For overweight cats, increase wet food proportion. Always provide fresh water regardless of diet type.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cat-calorie-calculator", "cat-food-amount-calculator", "cat-water-intake-calculator"],
  faq: [
    {
      question: "How much wet food should I feed my cat?",
      answer:
        "An average 10-lb adult cat needs about 200-250 calories per day, which translates to roughly 7-9 oz of wet food daily (about 1.5 standard 5.5-oz cans). This varies by your cat's age, activity level, and the specific food's calorie content.",
    },
    {
      question: "Is wet or dry food better for cats?",
      answer:
        "Both have benefits. Wet food provides better hydration (important since cats have a low thirst drive), higher protein, and fewer carbs. Dry food is more convenient and can help with dental health. Many vets recommend a combination of both for optimal nutrition and hydration.",
    },
    {
      question: "Should I free-feed my cat dry food?",
      answer:
        "Free-feeding (leaving food out all day) can lead to overeating and obesity, especially in indoor cats. Measured meal feeding 2-3 times per day is generally recommended to maintain healthy weight. If you free-feed, carefully measure the daily amount and don't refill until the next day.",
    },
  ],
  formula:
    "RER = 70 x (weight_kg)^0.75. Daily Calories = RER x life stage factor (kitten 2.5, adult 1.2, senior 1.0) x activity factor (low 0.85, moderate 1.0, high 1.2) x condition factor (underweight 1.2, ideal 1.0, overweight 0.8). Wet food ~28 kcal/oz, Dry food ~375 kcal/cup.",
};

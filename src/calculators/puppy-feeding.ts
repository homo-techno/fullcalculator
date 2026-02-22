import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const puppyFeedingCalculator: CalculatorDefinition = {
  slug: "puppy-feeding-calculator",
  title: "Puppy Feeding Schedule Calculator",
  description:
    "Free puppy feeding schedule calculator. Determine how much and how often to feed your puppy based on age, current weight, expected adult weight, and food type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "puppy feeding schedule",
    "how much to feed a puppy",
    "puppy food calculator",
    "puppy feeding guide",
    "puppy portion size",
  ],
  variants: [
    {
      id: "puppyFeeding",
      name: "Puppy Feeding Guide",
      fields: [
        {
          name: "currentWeight",
          label: "Puppy's Current Weight (lbs)",
          type: "number",
          placeholder: "e.g. 15",
          min: 0.5,
          max: 100,
          step: 0.5,
        },
        {
          name: "expectedAdultWeight",
          label: "Expected Adult Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 2,
          max: 250,
          step: 1,
        },
        {
          name: "ageWeeks",
          label: "Puppy's Age",
          type: "select",
          options: [
            { label: "4-8 weeks", value: "4_8" },
            { label: "8-12 weeks", value: "8_12" },
            { label: "12-16 weeks (3-4 months)", value: "12_16" },
            { label: "4-6 months", value: "4_6m" },
            { label: "6-9 months", value: "6_9m" },
            { label: "9-12 months", value: "9_12m" },
          ],
        },
        {
          name: "foodType",
          label: "Food Type",
          type: "select",
          options: [
            { label: "Dry Puppy Kibble", value: "dry" },
            { label: "Wet / Canned Puppy Food", value: "wet" },
            { label: "Mixed (Dry + Wet)", value: "mixed" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentWeight = inputs.currentWeight as number;
        const expectedAdultWeight = inputs.expectedAdultWeight as number;
        const ageWeeks = (inputs.ageWeeks as string) || "8_12";
        const foodType = (inputs.foodType as string) || "dry";
        if (!currentWeight || currentWeight <= 0 || !expectedAdultWeight || expectedAdultWeight <= 0) return null;

        const currentWeightKg = currentWeight * 0.453592;

        // RER for puppies
        const rer = 70 * Math.pow(currentWeightKg, 0.75);

        // Puppy calorie multipliers by age
        const ageMultipliers: Record<string, number> = {
          "4_8": 3.0,
          "8_12": 2.5,
          "12_16": 2.0,
          "4_6m": 1.8,
          "6_9m": 1.6,
          "9_12m": 1.4,
        };

        // Meals per day by age
        const mealsPerDay: Record<string, number> = {
          "4_8": 4,
          "8_12": 4,
          "12_16": 3,
          "4_6m": 3,
          "6_9m": 2,
          "9_12m": 2,
        };

        const dailyCals = rer * ageMultipliers[ageWeeks];
        const meals = mealsPerDay[ageWeeks];
        const calsPerMeal = dailyCals / meals;

        // Food amounts (approximate calorie densities)
        const dryCalPerCup = 380;
        const wetCalPerOz = 30;

        let foodAmountDaily = "";
        let foodAmountPerMeal = "";
        if (foodType === "dry") {
          const cupsDaily = dailyCals / dryCalPerCup;
          foodAmountDaily = formatNumber(cupsDaily, 2) + " cups";
          foodAmountPerMeal = formatNumber(cupsDaily / meals, 2) + " cups";
        } else if (foodType === "wet") {
          const ozDaily = dailyCals / wetCalPerOz;
          foodAmountDaily = formatNumber(ozDaily, 1) + " oz";
          foodAmountPerMeal = formatNumber(ozDaily / meals, 1) + " oz";
        } else {
          const cupsDaily = (dailyCals * 0.6) / dryCalPerCup;
          const ozDaily = (dailyCals * 0.4) / wetCalPerOz;
          foodAmountDaily = formatNumber(cupsDaily, 2) + " cups dry + " + formatNumber(ozDaily, 1) + " oz wet";
          foodAmountPerMeal = formatNumber(cupsDaily / meals, 2) + " cups dry + " + formatNumber(ozDaily / meals, 1) + " oz wet";
        }

        const percentOfAdult = (currentWeight / expectedAdultWeight) * 100;

        const ageLabels: Record<string, string> = {
          "4_8": "4-8 weeks",
          "8_12": "8-12 weeks",
          "12_16": "3-4 months",
          "4_6m": "4-6 months",
          "6_9m": "6-9 months",
          "9_12m": "9-12 months",
        };

        return {
          primary: {
            label: "Daily Food Amount",
            value: foodAmountDaily,
          },
          details: [
            { label: "Daily Calories Needed", value: formatNumber(dailyCals, 0) + " kcal" },
            { label: "Meals Per Day", value: meals.toString() },
            { label: "Amount Per Meal", value: foodAmountPerMeal },
            { label: "Calories Per Meal", value: formatNumber(calsPerMeal, 0) + " kcal" },
            { label: "Puppy Age", value: ageLabels[ageWeeks] },
            { label: "Current Weight", value: formatNumber(currentWeight, 1) + " lbs" },
            { label: "% of Adult Weight", value: formatNumber(percentOfAdult, 0) + "%" },
            {
              label: "Guideline",
              value: "Adjust portions based on body condition. You should feel ribs easily but not see them. Transition to adult food when puppy reaches 80-90% of adult weight.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-calorie-calculator", "dog-food-amount-calculator", "dog-weight-calculator"],
  faq: [
    {
      question: "How often should I feed my puppy?",
      answer:
        "Puppies 4-12 weeks old should eat 4 times per day. From 3-6 months, reduce to 3 meals daily. After 6 months, most puppies can transition to 2 meals per day. Consistent feeding times help with house training and digestion.",
    },
    {
      question: "When should I switch from puppy food to adult food?",
      answer:
        "Small breeds can typically switch at 9-12 months. Medium breeds at 12-14 months. Large breeds at 12-18 months. Giant breeds may need puppy food until 18-24 months. Switch when your puppy has reached about 80-90% of their expected adult weight.",
    },
    {
      question: "Can I overfeed my puppy?",
      answer:
        "Yes, overfeeding puppies is common and can lead to rapid growth, which is especially harmful for large breeds as it increases the risk of skeletal problems. Feed measured portions rather than free-feeding, and monitor body condition regularly. A puppy at a healthy weight has a visible waist and you can feel their ribs.",
    },
  ],
  formula:
    "Daily Calories = RER x age multiplier. RER = 70 x (weight_kg)^0.75. Age multipliers: 4-8 wks 3.0, 8-12 wks 2.5, 3-4 mo 2.0, 4-6 mo 1.8, 6-9 mo 1.6, 9-12 mo 1.4. Meals per day: 4-12 wks = 4 meals, 3-6 mo = 3 meals, 6+ mo = 2 meals. Dry kibble ~380 kcal/cup, wet food ~30 kcal/oz.",
};

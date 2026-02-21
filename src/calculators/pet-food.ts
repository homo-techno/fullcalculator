import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petFoodCalculator: CalculatorDefinition = {
  slug: "pet-food-calculator",
  title: "Pet Food Calculator",
  description:
    "Free pet food calculator. Calculate daily calorie needs and food portions for dogs and cats based on weight and activity level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet food",
    "dog food calculator",
    "cat food",
    "pet calories",
    "feeding guide",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "petWeight",
          label: "Pet Weight (lbs)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Low (sedentary / senior)", value: "low" },
            { label: "Moderate (normal adult)", value: "moderate" },
            { label: "Active (working / puppy)", value: "active" },
          ],
        },
        {
          name: "petType",
          label: "Pet Type",
          type: "select",
          options: [
            { label: "Dog", value: "dog" },
            { label: "Cat", value: "cat" },
          ],
        },
      ],
      calculate: (inputs) => {
        const petWeight = inputs.petWeight as number;
        const activityLevel = (inputs.activityLevel as string) || "moderate";
        const petType = (inputs.petType as string) || "dog";
        if (!petWeight || petWeight <= 0) return null;

        let dailyCals = 0;
        const weightKg = petWeight * 0.453592;

        if (petType === "dog") {
          // RER = 70 x (weight in kg)^0.75, then multiply by activity factor
          const rer = 70 * Math.pow(weightKg, 0.75);
          const factors: Record<string, number> = {
            low: 1.2,
            moderate: 1.6,
            active: 2.0,
          };
          dailyCals = rer * (factors[activityLevel] || 1.6);
        } else {
          // Cats: simplified ~20 cal/lb baseline
          const factors: Record<string, number> = {
            low: 0.8,
            moderate: 1.0,
            active: 1.2,
          };
          dailyCals = petWeight * 20 * (factors[activityLevel] || 1.0);
        }

        // Average dry kibble is about 350-400 cal per cup
        const calsPerCup = 375;
        const cupsPerDay = dailyCals / calsPerCup;
        const monthlyLbs = (cupsPerDay * 30 * 4) / 16; // ~4 oz per cup of kibble

        return {
          primary: {
            label: "Daily Calories",
            value: formatNumber(dailyCals, 0) + " kcal",
          },
          details: [
            {
              label: "Dry Food (cups/day)",
              value: formatNumber(cupsPerDay, 1) + " cups (~375 kcal/cup)",
            },
            {
              label: "Feedings Per Day",
              value: petType === "cat" ? "2 (or free-feed)" : cupsPerDay > 3 ? "2-3" : "2",
            },
            {
              label: "Per Feeding",
              value: formatNumber(cupsPerDay / 2, 1) + " cups",
            },
            {
              label: "Monthly Food (est.)",
              value: formatNumber(monthlyLbs, 1) + " lbs of kibble",
            },
            {
              label: "Pet Weight",
              value:
                formatNumber(petWeight, 1) +
                " lbs (" +
                formatNumber(weightKg, 1) +
                " kg)",
            },
            {
              label: "Note",
              value: "Calorie needs vary by brand. Check your food's label for kcal/cup.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "aquarium-calculator"],
  faq: [
    {
      question: "How much should I feed my dog?",
      answer:
        "A dog's calorie needs depend on weight, age, and activity level. The resting energy requirement (RER) is 70 x (body weight in kg)^0.75, multiplied by an activity factor of 1.2-2.0.",
    },
    {
      question: "How many calories does a cat need per day?",
      answer:
        "An average indoor cat needs about 20 calories per pound of body weight per day. A 10-lb cat needs approximately 200 calories daily, adjusted for activity level.",
    },
  ],
  formula:
    "Dogs: RER = 70 x (weight_kg)^0.75, Daily Calories = RER x activity factor (1.2 low, 1.6 moderate, 2.0 active). Cats: ~20 cal/lb x activity factor (0.8 low, 1.0 moderate, 1.2 active). Cups = calories / 375.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogFoodAmountCalculator: CalculatorDefinition = {
  slug: "dog-food-amount-calculator",
  title: "Dog Food Amount Calculator",
  description:
    "Free dog food amount calculator. Find how much to feed your dog per day in cups based on weight, age, and food type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog food amount calculator",
    "how much to feed my dog",
    "dog food portions",
    "dog feeding chart",
    "cups of dog food per day",
  ],
  variants: [
    {
      id: "dryFood",
      name: "Dry Food (Kibble)",
      fields: [
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
        },
        {
          name: "age",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Puppy (2-6 months)", value: "puppy_young" },
            { label: "Puppy (6-12 months)", value: "puppy_older" },
            { label: "Adult (1-7 years)", value: "adult" },
            { label: "Senior (7+ years)", value: "senior" },
          ],
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Low (mostly resting)", value: "low" },
            { label: "Normal (daily walks)", value: "normal" },
            { label: "Active (running / working)", value: "active" },
          ],
        },
        {
          name: "calPerCup",
          label: "Kibble Calories (kcal/cup)",
          type: "number",
          placeholder: "e.g. 375 (check label)",
          defaultValue: 375,
          min: 200,
          max: 600,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const age = (inputs.age as string) || "adult";
        const activity = (inputs.activity as string) || "normal";
        const calPerCup = (inputs.calPerCup as number) || 375;
        if (!weight || weight <= 0) return null;

        const weightKg = weight * 0.453592;
        const rer = 70 * Math.pow(weightKg, 0.75);

        const factors: Record<string, number> = {
          puppy_young: 3.0,
          puppy_older: 2.0,
          adult: 1.6,
          senior: 1.2,
        };
        const actFactors: Record<string, number> = { low: 0.85, normal: 1.0, active: 1.25 };

        const dailyCals = rer * (factors[age] || 1.6) * (actFactors[activity] || 1.0);
        const cupsPerDay = dailyCals / calPerCup;
        const meals = age.startsWith("puppy") ? 3 : 2;
        const cupsPerMeal = cupsPerDay / meals;
        const monthlyBags = (cupsPerDay * 30) / 60; // ~60 cups in a 15-lb bag

        return {
          primary: {
            label: "Daily Amount",
            value: formatNumber(cupsPerDay, 1) + " cups/day",
          },
          details: [
            { label: "Daily Calories Needed", value: formatNumber(dailyCals, 0) + " kcal" },
            { label: "Meals Per Day", value: String(meals) },
            { label: "Per Meal", value: formatNumber(cupsPerMeal, 1) + " cups" },
            { label: "Monthly (15-lb bags)", value: formatNumber(monthlyBags, 1) + " bags" },
            { label: "Kibble Density", value: calPerCup + " kcal/cup" },
          ],
        };
      },
    },
    {
      id: "wetFood",
      name: "Wet Food (Canned)",
      fields: [
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
        },
        {
          name: "age",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Puppy (2-12 months)", value: "puppy" },
            { label: "Adult (1-7 years)", value: "adult" },
            { label: "Senior (7+ years)", value: "senior" },
          ],
        },
        {
          name: "canSize",
          label: "Can Size (oz)",
          type: "select",
          options: [
            { label: "5.5 oz can", value: "5.5" },
            { label: "13 oz can", value: "13" },
            { label: "13.2 oz can", value: "13.2" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const age = (inputs.age as string) || "adult";
        const canSize = parseFloat((inputs.canSize as string) || "13");
        if (!weight || weight <= 0) return null;

        const weightKg = weight * 0.453592;
        const rer = 70 * Math.pow(weightKg, 0.75);
        const factors: Record<string, number> = { puppy: 2.5, adult: 1.6, senior: 1.2 };
        const dailyCals = rer * (factors[age] || 1.6);

        // Wet food averages ~25 cal/oz
        const calPerOz = 25;
        const totalOz = dailyCals / calPerOz;
        const cansPerDay = totalOz / canSize;

        return {
          primary: {
            label: "Daily Amount",
            value: formatNumber(cansPerDay, 1) + " cans/day",
          },
          details: [
            { label: "Daily Calories", value: formatNumber(dailyCals, 0) + " kcal" },
            { label: "Total Ounces", value: formatNumber(totalOz, 1) + " oz/day" },
            { label: "Can Size", value: canSize + " oz" },
            { label: "Weekly Cans", value: formatNumber(cansPerDay * 7, 0) + " cans" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pet-food-calculator", "dog-calorie-calculator", "dog-bmi-calculator"],
  faq: [
    {
      question: "How many cups of food should I feed my dog?",
      answer:
        "The amount depends on your dog's weight, age, activity level, and the calorie content of the food. A typical 50-lb adult dog eating 375 kcal/cup kibble needs about 2.5-3 cups per day. Always check the calorie content on your specific food's label.",
    },
    {
      question: "Should I feed my dog wet or dry food?",
      answer:
        "Both can provide complete nutrition. Dry food is more economical and supports dental health, while wet food has higher moisture content which is good for hydration. Many owners choose to mix both. The key is choosing food that meets AAFCO nutritional standards.",
    },
    {
      question: "How often should I feed my adult dog?",
      answer:
        "Most adult dogs do well with 2 meals per day, spaced about 12 hours apart. Puppies need 3-4 meals per day. Avoid feeding one large meal daily, as it can increase the risk of bloat, especially in large breeds.",
    },
  ],
  formula:
    "RER = 70 x (weight_kg)^0.75. Daily Calories = RER x age factor. Cups/day = Daily Calories / kcal per cup. Wet food: oz/day = Daily Calories / 25 kcal per oz.",
};

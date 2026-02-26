import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogFoodCalculator: CalculatorDefinition = {
  slug: "dog-food-calculator",
  title: "Dog Food Calculator",
  description:
    "Free online dog food calculator. Determine the right daily food amount for your dog based on weight, age, activity level, and food calorie density.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "dog food calculator",
    "how much to feed my dog",
    "dog feeding guide",
    "dog calorie calculator",
    "pet food calculator",
  ],
  variants: [
    {
      id: "daily-amount",
      name: "Daily Food Amount",
      description: "Calculate daily food amount for your dog",
      fields: [
        { name: "weight", label: "Dog's Weight", type: "number", placeholder: "e.g. 50", suffix: "lbs" },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Puppy (under 1 year)", value: "puppy" },
            { label: "Adult (1-7 years)", value: "adult" },
            { label: "Senior (7+ years)", value: "senior" },
          ],
          defaultValue: "adult",
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Low (mostly resting, senior)", value: "low" },
            { label: "Moderate (daily walks, normal play)", value: "moderate" },
            { label: "High (working dog, very active)", value: "high" },
          ],
          defaultValue: "moderate",
        },
        { name: "caloriesPerCup", label: "Food Calories per Cup", type: "number", placeholder: "e.g. 380", suffix: "kcal", defaultValue: 380 },
        {
          name: "bodyCondition",
          label: "Body Condition",
          type: "select",
          options: [
            { label: "Underweight (needs to gain)", value: "under" },
            { label: "Ideal weight", value: "ideal" },
            { label: "Overweight (needs to lose)", value: "over" },
          ],
          defaultValue: "ideal",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const age = inputs.ageGroup as string;
        const activity = inputs.activityLevel as string;
        const kcalPerCup = parseFloat(inputs.caloriesPerCup as string) || 380;
        const condition = inputs.bodyCondition as string;
        if (!weight) return null;

        // RER (Resting Energy Requirement) = 70 x (weight in kg)^0.75
        const weightKg = weight * 0.4536;
        const rer = 70 * Math.pow(weightKg, 0.75);

        // MER (Maintenance Energy Requirement) multiplier
        let multiplier = 1.6; // typical adult
        if (age === "puppy") multiplier = 2.5;
        else if (age === "senior") multiplier = 1.2;

        if (activity === "low") multiplier *= 0.85;
        else if (activity === "high") multiplier *= 1.3;

        if (condition === "under") multiplier *= 1.15;
        else if (condition === "over") multiplier *= 0.8;

        const dailyCalories = rer * multiplier;
        const cupsPerDay = dailyCalories / kcalPerCup;
        const mealsPerDay = age === "puppy" ? 3 : 2;
        const cupsPerMeal = cupsPerDay / mealsPerDay;

        return {
          primary: { label: "Daily Food Amount", value: `${formatNumber(cupsPerDay)} cups/day` },
          details: [
            { label: "Daily calorie need", value: `${formatNumber(dailyCalories)} kcal` },
            { label: "Resting energy (RER)", value: `${formatNumber(rer)} kcal` },
            { label: "Activity multiplier", value: formatNumber(multiplier) },
            { label: "Recommended meals/day", value: formatNumber(mealsPerDay) },
            { label: "Cups per meal", value: formatNumber(cupsPerMeal) },
            { label: "Dog weight", value: `${formatNumber(weight)} lbs (${formatNumber(weightKg)} kg)` },
          ],
          note: "This is a starting guideline. Adjust portions based on your dog's body condition over time. Consult your vet for specific dietary needs.",
        };
      },
    },
  ],
  relatedSlugs: ["puppy-weight-calculator", "cat-food-calculator", "pet-insurance-calculator"],
  faq: [
    {
      question: "How much should I feed my dog per day?",
      answer:
        "Daily food amount depends on your dog's weight, age, activity level, and the calorie density of the food. A typical 50-lb adult dog needs about 1,000-1,200 calories per day, or roughly 2.5-3 cups of standard dry food.",
    },
    {
      question: "How do I know if I'm feeding my dog the right amount?",
      answer:
        "Monitor your dog's body condition: you should be able to feel (but not see) their ribs, and they should have a visible waist when viewed from above. Adjust portions up or down by 10% as needed and weigh regularly.",
    },
  ],
  formula: "Daily Calories = RER x Activity Multiplier; RER = 70 x (Weight in kg)^0.75",
};

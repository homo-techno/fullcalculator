import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catCalorieCalculator: CalculatorDefinition = {
  slug: "cat-calorie-calculator",
  title: "Cat Calorie Calculator",
  description:
    "Free cat calorie calculator. Determine your cat's daily calorie needs based on weight, age, and activity level using veterinary RER formulas.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat calorie calculator",
    "how many calories does my cat need",
    "cat daily calories",
    "cat feeding calculator",
    "cat nutrition calculator",
  ],
  variants: [
    {
      id: "catCalories",
      name: "Daily Calorie Needs",
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
        const condition = (inputs.condition as string) || "ideal";
        if (!weight || weight <= 0) return null;

        const weightKg = weight * 0.453592;
        // RER = 70 x (weight in kg)^0.75
        const rer = 70 * Math.pow(weightKg, 0.75);

        // Life stage multipliers
        const stageFactors: Record<string, number> = {
          kitten: 2.5,
          adult: 1.2,
          senior: 1.0,
        };

        // Activity adjustment
        const activityFactors: Record<string, number> = {
          low: 0.85,
          moderate: 1.0,
          high: 1.2,
        };

        // Body condition adjustment
        const conditionFactors: Record<string, number> = {
          underweight: 1.2,
          ideal: 1.0,
          overweight: 0.8,
        };

        const dailyCals =
          rer *
          stageFactors[lifeStage] *
          activityFactors[activity] *
          conditionFactors[condition];

        const wetFoodOz = dailyCals / 30; // ~30 cal/oz for wet food
        const dryFoodCups = dailyCals / 375; // ~375 cal/cup for dry food
        const mealsPerDay = lifeStage === "kitten" ? "3-4" : "2";

        return {
          primary: {
            label: "Daily Calories",
            value: formatNumber(dailyCals, 0) + " kcal",
          },
          details: [
            { label: "Resting Energy (RER)", value: formatNumber(rer, 0) + " kcal" },
            { label: "Dry Food", value: formatNumber(dryFoodCups, 1) + " cups/day (~375 kcal/cup)" },
            { label: "Wet Food", value: formatNumber(wetFoodOz, 1) + " oz/day (~30 kcal/oz)" },
            { label: "Recommended Meals/Day", value: mealsPerDay },
            { label: "Weight", value: formatNumber(weight, 1) + " lbs (" + formatNumber(weightKg, 1) + " kg)" },
            {
              label: "Note",
              value: condition === "overweight"
                ? "Gradual weight loss of 1-2% body weight per week is recommended."
                : "Adjust portions based on your cat's response over 2-4 weeks.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pet-food-calculator", "cat-food-amount-calculator", "cat-age-calculator"],
  faq: [
    {
      question: "How many calories does a cat need per day?",
      answer:
        "An average 10-lb adult indoor cat needs about 200-250 calories per day. Kittens need roughly 2.5 times their resting energy requirement, while senior cats may need less. The exact amount depends on weight, age, activity level, and body condition.",
    },
    {
      question: "What is RER for cats?",
      answer:
        "RER (Resting Energy Requirement) is the number of calories a cat needs at rest. It's calculated as 70 x (body weight in kg)^0.75. This baseline is then multiplied by factors for life stage, activity level, and health conditions to determine total daily calorie needs.",
    },
    {
      question: "How do I know if my cat is overweight?",
      answer:
        "A cat at ideal weight should have ribs you can feel but not see, a visible waist when viewed from above, and a slight abdominal tuck. If you can't feel the ribs or there's no waist visible, your cat may be overweight. Consult your veterinarian for a body condition score assessment.",
    },
  ],
  formula:
    "RER = 70 x (weight_kg)^0.75. Daily Calories = RER x life stage factor (kitten 2.5, adult 1.2, senior 1.0) x activity factor (low 0.85, moderate 1.0, high 1.2) x condition factor (underweight 1.2, ideal 1.0, overweight 0.8).",
};

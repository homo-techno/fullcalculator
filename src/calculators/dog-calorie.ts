import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogCalorieCalculator: CalculatorDefinition = {
  slug: "dog-calorie-calculator",
  title: "Dog Calorie Calculator",
  description:
    "Free dog calorie calculator. Calculate your dog's daily caloric needs based on weight, age, activity level, and body condition using veterinary RER formulas.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog calorie calculator",
    "how many calories does my dog need",
    "dog daily calories",
    "dog feeding guide",
    "dog nutrition calculator",
  ],
  variants: [
    {
      id: "dogCalories",
      name: "Daily Calorie Needs",
      fields: [
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
          step: 1,
        },
        {
          name: "lifeStage",
          label: "Life Stage",
          type: "select",
          options: [
            { label: "Puppy (under 4 months)", value: "puppy_young" },
            { label: "Puppy (4-12 months)", value: "puppy_older" },
            { label: "Adult (1-7 years)", value: "adult" },
            { label: "Senior (7+ years)", value: "senior" },
          ],
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Inactive / Sedentary", value: "inactive" },
            { label: "Light (1 walk/day)", value: "light" },
            { label: "Moderate (1-2 hrs exercise)", value: "moderate" },
            { label: "High (working dog / 2+ hrs)", value: "high" },
          ],
        },
        {
          name: "neutered",
          label: "Spayed/Neutered?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No (Intact)", value: "no" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const lifeStage = (inputs.lifeStage as string) || "adult";
        const activity = (inputs.activity as string) || "moderate";
        const neutered = (inputs.neutered as string) || "yes";
        if (!weight || weight <= 0) return null;

        const weightKg = weight * 0.453592;
        const rer = 70 * Math.pow(weightKg, 0.75);

        // Life stage factors
        const stageFactors: Record<string, number> = {
          puppy_young: 3.0,
          puppy_older: 2.0,
          adult: 1.6,
          senior: 1.2,
        };

        // Activity factors applied on top
        const activityFactors: Record<string, number> = {
          inactive: 0.8,
          light: 0.95,
          moderate: 1.0,
          high: 1.3,
        };

        // Neutered dogs need ~20% fewer calories
        const neuteredFactor = neutered === "yes" ? 0.9 : 1.0;

        let dailyCals =
          rer * stageFactors[lifeStage] * activityFactors[activity] * neuteredFactor;

        const dryFoodCups = dailyCals / 375;
        const treatsMax = dailyCals * 0.1; // 10% rule for treats

        return {
          primary: {
            label: "Daily Calories",
            value: formatNumber(dailyCals, 0) + " kcal",
          },
          details: [
            { label: "Resting Energy (RER)", value: formatNumber(rer, 0) + " kcal" },
            { label: "Dry Food", value: formatNumber(dryFoodCups, 1) + " cups/day (~375 kcal/cup)" },
            { label: "Max Treat Calories (10%)", value: formatNumber(treatsMax, 0) + " kcal" },
            { label: "Meals Per Day", value: lifeStage.startsWith("puppy") ? "3-4" : "2" },
            { label: "Weight", value: formatNumber(weight, 1) + " lbs (" + formatNumber(weightKg, 1) + " kg)" },
            {
              label: "Note",
              value: "Individual needs vary. Monitor weight and adjust portions every 2-4 weeks.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pet-food-calculator", "dog-food-amount-calculator", "dog-bmi-calculator"],
  faq: [
    {
      question: "How many calories does my dog need per day?",
      answer:
        "Daily calorie needs depend on your dog's weight, age, activity level, and whether they're spayed/neutered. A typical 50-lb adult dog needs about 1,000-1,200 calories per day. The formula starts with the Resting Energy Requirement (RER) = 70 x (body weight in kg)^0.75, then adjusts for life stage and activity.",
    },
    {
      question: "Do neutered dogs need fewer calories?",
      answer:
        "Yes. Spaying or neutering can reduce a dog's metabolic rate by about 20-30%. Neutered dogs generally need 10-20% fewer calories than intact dogs of the same size and activity level to maintain a healthy weight.",
    },
    {
      question: "How many treats can I give my dog?",
      answer:
        "Veterinarians recommend the 10% rule: treats should make up no more than 10% of your dog's daily caloric intake. The remaining 90% should come from a complete and balanced dog food. For a dog needing 1,000 calories, that's only 100 calories in treats.",
    },
  ],
  formula:
    "RER = 70 x (weight_kg)^0.75. Daily Calories = RER x life stage factor (puppy young 3.0, puppy older 2.0, adult 1.6, senior 1.2) x activity factor (inactive 0.8, light 0.95, moderate 1.0, high 1.3) x neutered factor (0.9 if neutered, 1.0 if intact).",
};

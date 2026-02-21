import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catFoodAmountCalculator: CalculatorDefinition = {
  slug: "cat-food-amount-calculator",
  title: "Cat Food Amount Calculator",
  description:
    "Free cat food amount calculator. Determine how much wet or dry food to feed your cat daily based on weight, age, and food type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat food amount calculator",
    "how much to feed my cat",
    "cat food portions",
    "cat feeding chart",
    "cat food calculator by weight",
  ],
  variants: [
    {
      id: "catFoodCalc",
      name: "Calculate Food Amount",
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
          name: "age",
          label: "Age Group",
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
            { label: "Moderate", value: "moderate" },
            { label: "Active / Outdoor", value: "high" },
          ],
        },
        {
          name: "foodType",
          label: "Primary Food Type",
          type: "select",
          options: [
            { label: "Dry Food Only", value: "dry" },
            { label: "Wet Food Only", value: "wet" },
            { label: "Mixed (50/50)", value: "mixed" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const age = (inputs.age as string) || "adult";
        const activity = (inputs.activity as string) || "moderate";
        const foodType = (inputs.foodType as string) || "dry";
        if (!weight || weight <= 0) return null;

        const weightKg = weight * 0.453592;
        const rer = 70 * Math.pow(weightKg, 0.75);

        const ageFactors: Record<string, number> = { kitten: 2.5, adult: 1.2, senior: 1.0 };
        const actFactors: Record<string, number> = { low: 0.85, moderate: 1.0, high: 1.2 };

        const dailyCals = rer * (ageFactors[age] || 1.2) * (actFactors[activity] || 1.0);

        // Dry food: ~350 kcal/cup, Wet food: ~25 kcal/oz (typical 5.5oz can = ~137 kcal)
        const dryCupsDay = dailyCals / 350;
        const wetCansDay = dailyCals / 137; // 5.5 oz cans
        const wetOzDay = dailyCals / 25;

        let primaryText = "";
        const details: { label: string; value: string }[] = [
          { label: "Daily Calories Needed", value: formatNumber(dailyCals, 0) + " kcal" },
        ];

        if (foodType === "dry") {
          primaryText = formatNumber(dryCupsDay, 2) + " cups/day";
          details.push({ label: "Dry Food", value: formatNumber(dryCupsDay, 2) + " cups (~350 kcal/cup)" });
          details.push({ label: "Per Meal (2 meals)", value: formatNumber(dryCupsDay / 2, 2) + " cups" });
        } else if (foodType === "wet") {
          primaryText = formatNumber(wetCansDay, 1) + " cans/day (5.5 oz)";
          details.push({ label: "Wet Food", value: formatNumber(wetOzDay, 1) + " oz/day" });
          details.push({ label: "5.5 oz Cans/Day", value: formatNumber(wetCansDay, 1) });
        } else {
          const halfDryCups = (dailyCals / 2) / 350;
          const halfWetCans = (dailyCals / 2) / 137;
          primaryText = formatNumber(halfDryCups, 2) + " cups + " + formatNumber(halfWetCans, 1) + " cans";
          details.push({ label: "Dry Portion", value: formatNumber(halfDryCups, 2) + " cups" });
          details.push({ label: "Wet Portion", value: formatNumber(halfWetCans, 1) + " cans (5.5 oz)" });
        }

        details.push({
          label: "Meals Per Day",
          value: age === "kitten" ? "3-4 (kittens)" : "2 (or free-feed dry)",
        });
        details.push({
          label: "Monthly Cost Est.",
          value: foodType === "wet"
            ? "~$" + formatNumber(wetCansDay * 30 * 1.2, 0) + " (at ~$1.20/can)"
            : "~$" + formatNumber((dryCupsDay * 30) / 60 * 25, 0) + " (at ~$25/bag)",
        });

        return {
          primary: { label: "Daily Food Amount", value: primaryText },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["pet-food-calculator", "cat-calorie-calculator", "cat-age-calculator"],
  faq: [
    {
      question: "How much should I feed my cat per day?",
      answer:
        "A typical 10-lb adult indoor cat needs about 200-250 calories per day, which translates to roughly 1/2 to 2/3 cup of dry food or about 1.5 cans of wet food (5.5 oz cans). Kittens need more calories per pound due to growth.",
    },
    {
      question: "Should I free-feed my cat?",
      answer:
        "Free-feeding (leaving dry food out all day) works for some cats who self-regulate, but many cats will overeat. Measured meals 2 times per day are recommended to prevent obesity. Kittens under 6 months may benefit from free-feeding.",
    },
    {
      question: "Is wet or dry food better for cats?",
      answer:
        "Wet food provides better hydration (important for urinary tract health) and is typically higher in protein and lower in carbohydrates. Dry food is convenient and economical. Many vets recommend a combination for optimal nutrition and hydration.",
    },
  ],
  formula:
    "RER = 70 x (weight_kg)^0.75. Daily Calories = RER x age factor x activity factor. Dry food cups = calories / 350. Wet food cans (5.5 oz) = calories / 137.",
};

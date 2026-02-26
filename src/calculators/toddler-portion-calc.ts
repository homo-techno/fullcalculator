import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const toddlerPortionCalculator: CalculatorDefinition = {
  slug: "toddler-portion-calculator",
  title: "Toddler Portion Size Calculator",
  description:
    "Free toddler portion size calculator. Determine appropriate food portion sizes for toddlers and young children based on age and food group.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "toddler portion size",
    "child food portions",
    "toddler serving size",
    "how much to feed toddler",
    "child nutrition calculator",
  ],
  variants: [
    {
      id: "by-food-group",
      name: "By Food Group",
      description: "Get recommended portion sizes by food group and age",
      fields: [
        {
          name: "ageRange",
          label: "Child's Age",
          type: "select",
          options: [
            { label: "1-2 years", value: "1" },
            { label: "2-3 years", value: "2" },
            { label: "3-4 years", value: "3" },
            { label: "4-5 years", value: "4" },
          ],
          defaultValue: "2",
        },
        {
          name: "foodGroup",
          label: "Food Group",
          type: "select",
          options: [
            { label: "Grains (bread, cereal, rice)", value: "grains" },
            { label: "Protein (meat, beans)", value: "protein" },
            { label: "Dairy (milk, cheese)", value: "dairy" },
            { label: "Fruits", value: "fruits" },
            { label: "Vegetables", value: "vegetables" },
          ],
          defaultValue: "grains",
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.ageRange as string);
        const foodGroup = inputs.foodGroup as string;
        if (!age || !foodGroup) return null;

        // Portions in tablespoons per serving, servings per day
        const data: Record<string, { portion: number[]; servings: number[]; unit: string; example: string }> = {
          grains: {
            portion: [2, 3, 4, 4],
            servings: [6, 6, 6, 6],
            unit: "tbsp (or 1/4-1/2 slice bread)",
            example: "1/4 slice bread, 2-4 tbsp cereal, 2-4 tbsp rice or pasta",
          },
          protein: {
            portion: [1, 2, 2, 3],
            servings: [2, 2, 3, 3],
            unit: "tbsp (or 1-2 oz)",
            example: "1-3 tbsp meat/beans, 1/2-1 egg, 1-2 oz fish",
          },
          dairy: {
            portion: [4, 4, 6, 6],
            servings: [3, 3, 3, 3],
            unit: "oz (or tbsp)",
            example: "4-6 oz milk, 1/2-1 oz cheese, 1/3-1/2 cup yogurt",
          },
          fruits: {
            portion: [2, 3, 3, 4],
            servings: [2, 2, 3, 3],
            unit: "tbsp (or small pieces)",
            example: "2-4 tbsp fruit, 1/4-1/2 small banana, 2-4 oz juice",
          },
          vegetables: {
            portion: [2, 3, 3, 4],
            servings: [2, 3, 3, 3],
            unit: "tbsp (cooked/soft)",
            example: "2-4 tbsp cooked veggies, handful soft raw pieces",
          },
        };

        const info = data[foodGroup];
        const idx = age - 1;
        const portionSize = info.portion[idx];
        const servingsPerDay = info.servings[idx];
        const totalDaily = portionSize * servingsPerDay;

        return {
          primary: { label: "Portion per Serving", value: `${formatNumber(portionSize, 0)} ${info.unit}` },
          details: [
            { label: "Servings per Day", value: formatNumber(servingsPerDay, 0) },
            { label: "Total Daily Amount", value: `${formatNumber(totalDaily, 0)} tbsp` },
            { label: "Example Portions", value: info.example },
          ],
          note: "A toddler portion is roughly 1/4 of an adult portion. Portions are guidelines -- let your child's appetite guide actual intake.",
        };
      },
    },
    {
      id: "daily-calories",
      name: "Daily Calorie Needs",
      description: "Estimate daily calorie needs for toddlers",
      fields: [
        {
          name: "ageYears",
          label: "Child's Age",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "4 years", value: "4" },
            { label: "5 years", value: "5" },
          ],
          defaultValue: "2",
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary", value: "sedentary" },
            { label: "Moderate", value: "moderate" },
            { label: "Active", value: "active" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.ageYears as string);
        const activity = inputs.activityLevel as string;
        if (!age) return null;

        // Approximate calorie ranges for young children
        const calorieBase: Record<number, number> = { 1: 900, 2: 1000, 3: 1200, 4: 1300, 5: 1400 };
        const multiplier = activity === "sedentary" ? 0.9 : activity === "active" ? 1.15 : 1.0;

        const calories = Math.round((calorieBase[age] || 1000) * multiplier);
        const meals = 3;
        const snacks = age <= 2 ? 2 : 2;
        const caloriesPerMeal = Math.round(calories * 0.25);
        const caloriesPerSnack = Math.round(calories * 0.125);

        return {
          primary: { label: "Daily Calories", value: `${formatNumber(calories, 0)} kcal` },
          details: [
            { label: "Meals per Day", value: formatNumber(meals, 0) },
            { label: "Snacks per Day", value: formatNumber(snacks, 0) },
            { label: "Calories per Meal", value: `~${formatNumber(caloriesPerMeal, 0)} kcal` },
            { label: "Calories per Snack", value: `~${formatNumber(caloriesPerSnack, 0)} kcal` },
          ],
          note: "These are general estimates. Your pediatrician can provide personalized nutritional guidance.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "protein-calculator", "macro-calculator"],
  faq: [
    {
      question: "How big should a toddler's portion be?",
      answer:
        "A general rule is that a toddler portion is about 1/4 of an adult portion, or roughly 1 tablespoon per year of age per food group per serving. So a 2-year-old might get 2 tablespoons of vegetables per serving.",
    },
    {
      question: "How many calories does a toddler need per day?",
      answer:
        "Toddlers (1-3 years) typically need 900-1,200 calories per day, while preschoolers (3-5 years) need 1,200-1,400 calories. Active children may need more. These should be spread across 3 meals and 2 snacks.",
    },
  ],
  formula:
    "Portion Size ≈ 1 tablespoon per year of age per food group | Daily Calories ≈ 900-1,400 kcal depending on age and activity",
};

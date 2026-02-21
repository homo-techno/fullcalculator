import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealPrepCalculator: CalculatorDefinition = {
  slug: "meal-prep-calculator",
  title: "Meal Prep Calculator",
  description:
    "Free meal prep calculator. Calculate ingredient quantities and portions for weekly meal prep based on number of meals, servings, and dietary goals.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "meal prep calculator",
    "meal prep portions",
    "weekly meal prep",
    "batch cooking calculator",
    "meal prep ingredients",
    "meal planning calculator",
  ],
  variants: [
    {
      id: "protein-meals",
      name: "Protein-Based Meal Prep",
      description: "Calculate ingredients for protein-focused meal prep",
      fields: [
        {
          name: "meals",
          label: "Number of Meals to Prep",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "protein",
          label: "Protein Source",
          type: "select",
          options: [
            { label: "Chicken Breast", value: "chicken" },
            { label: "Ground Turkey", value: "turkey" },
            { label: "Ground Beef (lean)", value: "beef" },
            { label: "Salmon", value: "salmon" },
            { label: "Tofu", value: "tofu" },
            { label: "Shrimp", value: "shrimp" },
          ],
        },
        {
          name: "carb",
          label: "Carb Source",
          type: "select",
          options: [
            { label: "White Rice", value: "white_rice" },
            { label: "Brown Rice", value: "brown_rice" },
            { label: "Sweet Potato", value: "sweet_potato" },
            { label: "Pasta", value: "pasta" },
            { label: "Quinoa", value: "quinoa" },
            { label: "None (Low Carb)", value: "none" },
          ],
        },
        {
          name: "portionSize",
          label: "Portion Size",
          type: "select",
          options: [
            { label: "Small (400 cal)", value: "small" },
            { label: "Medium (550 cal)", value: "medium" },
            { label: "Large (700 cal)", value: "large" },
          ],
        },
      ],
      calculate: (inputs) => {
        const meals = inputs.meals as number;
        const protein = inputs.protein as string;
        const carb = inputs.carb as string;
        const portionSize = inputs.portionSize as string;
        if (!meals || !protein || !carb || !portionSize) return null;

        // Protein serving sizes in oz (raw)
        const proteinOz: Record<string, Record<string, number>> = {
          chicken: { small: 4, medium: 6, large: 8 },
          turkey: { small: 4, medium: 6, large: 8 },
          beef: { small: 4, medium: 5, large: 6 },
          salmon: { small: 4, medium: 6, large: 8 },
          tofu: { small: 5, medium: 7, large: 9 },
          shrimp: { small: 4, medium: 6, large: 8 },
        };

        // Carb serving sizes in cups (dry for grains, raw for potato)
        const carbCups: Record<string, Record<string, number>> = {
          white_rice: { small: 0.33, medium: 0.5, large: 0.67 },
          brown_rice: { small: 0.33, medium: 0.5, large: 0.67 },
          sweet_potato: { small: 0.5, medium: 0.75, large: 1.0 },
          pasta: { small: 0.5, medium: 0.75, large: 1.0 },
          quinoa: { small: 0.33, medium: 0.5, large: 0.67 },
          none: { small: 0, medium: 0, large: 0 },
        };

        const proteinPerMeal = proteinOz[protein]?.[portionSize] || 6;
        const carbPerMeal = carbCups[carb]?.[portionSize] || 0.5;

        const totalProteinOz = proteinPerMeal * meals;
        const totalProteinLbs = totalProteinOz / 16;
        const totalCarbCups = carbPerMeal * meals;
        const vegCupsPerMeal = portionSize === "small" ? 0.75 : portionSize === "medium" ? 1 : 1.5;
        const totalVegCups = vegCupsPerMeal * meals;

        const proteinNames: Record<string, string> = {
          chicken: "Chicken Breast",
          turkey: "Ground Turkey",
          beef: "Ground Beef",
          salmon: "Salmon",
          tofu: "Tofu",
          shrimp: "Shrimp",
        };

        const carbNames: Record<string, string> = {
          white_rice: "White Rice (dry)",
          brown_rice: "Brown Rice (dry)",
          sweet_potato: "Sweet Potato (medium)",
          pasta: "Pasta (dry)",
          quinoa: "Quinoa (dry)",
          none: "None",
        };

        const details = [
          { label: proteinNames[protein], value: formatNumber(totalProteinLbs, 1) + " lbs (" + formatNumber(totalProteinOz, 0) + " oz)" },
        ];

        if (carb !== "none") {
          details.push({ label: carbNames[carb], value: formatNumber(totalCarbCups, 1) + " cups" });
        }

        details.push({ label: "Vegetables", value: formatNumber(totalVegCups, 1) + " cups" });
        details.push({ label: "Meals", value: String(meals) });
        details.push({ label: "Protein per Meal", value: proteinPerMeal + " oz (raw)" });
        if (carb !== "none") {
          details.push({ label: "Carbs per Meal", value: formatNumber(carbPerMeal, 2) + " cups (dry)" });
        }
        details.push({ label: "Veggies per Meal", value: vegCupsPerMeal + " cups" });

        return {
          primary: {
            label: "Total " + proteinNames[protein],
            value: formatNumber(totalProteinLbs, 1) + " lbs",
          },
          details,
          note: "Remember to add cooking oils, seasonings, and sauces. Raw meat shrinks about 25% when cooked.",
        };
      },
    },
  ],
  relatedSlugs: ["pasta-serving-calculator", "rice-water-ratio-calculator", "food-cost-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How many meals should I prep per week?",
      answer:
        "Most people prep 5-10 meals per week, covering lunches and dinners for weekdays. Start with 5 meals if you're new to meal prepping. Prepared meals keep 3-4 days in the fridge or 2-3 months in the freezer.",
    },
    {
      question: "How long does meal prep last in the fridge?",
      answer:
        "Most meal-prepped foods last 3-4 days in the refrigerator when stored in airtight containers. Cooked rice, chicken, and vegetables all follow this guideline. For longer storage, freeze meals for up to 3 months.",
    },
    {
      question: "How much does raw meat shrink when cooked?",
      answer:
        "Raw meat typically shrinks by about 25% when cooked. So 1 pound of raw chicken breast will yield about 12 ounces of cooked chicken. Plan accordingly when calculating portion sizes.",
    },
  ],
  formula:
    "Total Protein (lbs) = (Protein oz per meal x Number of meals) / 16. Total Carbs (cups dry) = Carbs per meal x Number of meals. Raw meat shrinks ~25% when cooked. Standard portions: Small ~400 cal, Medium ~550 cal, Large ~700 cal.",
};

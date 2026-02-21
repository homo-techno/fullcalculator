import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nutritionLabelCalculator: CalculatorDefinition = {
  slug: "nutrition-label-calculator",
  title: "Nutrition Label Calculator",
  description:
    "Free nutrition label calculator. Calculate percent daily values (%DV) based on FDA guidelines. Understand and interpret nutrition facts labels for your diet.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "nutrition label calculator",
    "percent daily value",
    "nutrition facts",
    "daily value percentage",
    "FDA nutrition",
    "food label calculator",
    "DV calculator",
  ],
  variants: [
    {
      id: "percent-dv",
      name: "Calculate % Daily Values",
      description: "Calculate percent daily values for key nutrients based on FDA 2,000 calorie diet",
      fields: [
        {
          name: "calories",
          label: "Calories",
          type: "number",
          placeholder: "e.g. 250",
          suffix: "kcal",
          min: 0,
          max: 5000,
        },
        {
          name: "totalFat",
          label: "Total Fat",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
        {
          name: "saturatedFat",
          label: "Saturated Fat",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "g",
          min: 0,
          max: 100,
          step: 0.5,
        },
        {
          name: "sodium",
          label: "Sodium",
          type: "number",
          placeholder: "e.g. 480",
          suffix: "mg",
          min: 0,
          max: 10000,
        },
        {
          name: "totalCarbs",
          label: "Total Carbohydrates",
          type: "number",
          placeholder: "e.g. 31",
          suffix: "g",
          min: 0,
          max: 500,
          step: 0.5,
        },
        {
          name: "fiber",
          label: "Dietary Fiber",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "g",
          min: 0,
          max: 100,
          step: 0.5,
        },
        {
          name: "totalSugars",
          label: "Total Sugars",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
        {
          name: "addedSugars",
          label: "Added Sugars",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
        {
          name: "protein",
          label: "Protein",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
        {
          name: "cholesterol",
          label: "Cholesterol",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "mg",
          min: 0,
          max: 2000,
        },
      ],
      calculate: (inputs) => {
        const cal = (inputs.calories as number) || 0;
        const fat = (inputs.totalFat as number) || 0;
        const satFat = (inputs.saturatedFat as number) || 0;
        const sodium = (inputs.sodium as number) || 0;
        const carbs = (inputs.totalCarbs as number) || 0;
        const fiber = (inputs.fiber as number) || 0;
        const sugars = (inputs.totalSugars as number) || 0;
        const addedSugars = (inputs.addedSugars as number) || 0;
        const protein = (inputs.protein as number) || 0;
        const chol = (inputs.cholesterol as number) || 0;

        // FDA Daily Values (based on 2,000 calorie diet, updated 2020)
        const dvs = {
          fat: 78, // g
          satFat: 20, // g
          cholesterol: 300, // mg
          sodium: 2300, // mg
          carbs: 275, // g
          fiber: 28, // g
          addedSugars: 50, // g
          protein: 50, // g
        };

        const fatDv = (fat / dvs.fat) * 100;
        const satFatDv = (satFat / dvs.satFat) * 100;
        const cholDv = (chol / dvs.cholesterol) * 100;
        const sodiumDv = (sodium / dvs.sodium) * 100;
        const carbsDv = (carbs / dvs.carbs) * 100;
        const fiberDv = (fiber / dvs.fiber) * 100;
        const addedSugarsDv = (addedSugars / dvs.addedSugars) * 100;
        const proteinDv = (protein / dvs.protein) * 100;
        const calPct = (cal / 2000) * 100;

        // Identify concerning values
        const warnings: string[] = [];
        if (sodiumDv > 20) warnings.push("High sodium");
        if (satFatDv > 20) warnings.push("High saturated fat");
        if (addedSugarsDv > 20) warnings.push("High added sugars");
        if (cholDv > 20) warnings.push("High cholesterol");

        const positives: string[] = [];
        if (fiberDv >= 20) positives.push("Good source of fiber");
        if (proteinDv >= 20) positives.push("Good source of protein");

        return {
          primary: { label: "Calories", value: `${cal} kcal (${formatNumber(calPct, 0)}% of 2,000)` },
          details: [
            { label: "Total Fat", value: `${fat}g — ${formatNumber(fatDv, 0)}% DV` },
            { label: "Saturated Fat", value: `${satFat}g — ${formatNumber(satFatDv, 0)}% DV` },
            { label: "Cholesterol", value: `${chol}mg — ${formatNumber(cholDv, 0)}% DV` },
            { label: "Sodium", value: `${sodium}mg — ${formatNumber(sodiumDv, 0)}% DV` },
            { label: "Total Carbs", value: `${carbs}g — ${formatNumber(carbsDv, 0)}% DV` },
            { label: "Dietary Fiber", value: `${fiber}g — ${formatNumber(fiberDv, 0)}% DV` },
            { label: "Added Sugars", value: `${addedSugars}g — ${formatNumber(addedSugarsDv, 0)}% DV` },
            { label: "Protein", value: `${protein}g — ${formatNumber(proteinDv, 0)}% DV` },
            ...(warnings.length > 0 ? [{ label: "Warnings (>20% DV)", value: warnings.join(", ") }] : []),
            ...(positives.length > 0 ? [{ label: "Positives (>=20% DV)", value: positives.join(", ") }] : []),
          ],
          note: "% Daily Values are based on a 2,000 calorie diet (FDA 2020 reference values). 5% DV or less = low, 20% DV or more = high. Your actual daily needs may vary based on calorie requirements, age, sex, and health conditions.",
        };
      },
    },
    {
      id: "servings",
      name: "Multiple Servings Calculator",
      description: "Calculate nutrition for multiple servings of a food",
      fields: [
        {
          name: "servingCalories",
          label: "Calories per Serving",
          type: "number",
          placeholder: "e.g. 150",
          suffix: "kcal",
          min: 0,
          max: 5000,
        },
        {
          name: "servingFat",
          label: "Fat per Serving",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
        {
          name: "servingCarbs",
          label: "Carbs per Serving",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "g",
          min: 0,
          max: 500,
          step: 0.5,
        },
        {
          name: "servingProtein",
          label: "Protein per Serving",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
        {
          name: "servingSodium",
          label: "Sodium per Serving",
          type: "number",
          placeholder: "e.g. 300",
          suffix: "mg",
          min: 0,
          max: 10000,
        },
        {
          name: "servingsConsumed",
          label: "Number of Servings Consumed",
          type: "number",
          placeholder: "e.g. 2.5",
          min: 0.25,
          max: 20,
          step: 0.25,
        },
      ],
      calculate: (inputs) => {
        const cal = (inputs.servingCalories as number) || 0;
        const fat = (inputs.servingFat as number) || 0;
        const carbs = (inputs.servingCarbs as number) || 0;
        const protein = (inputs.servingProtein as number) || 0;
        const sodium = (inputs.servingSodium as number) || 0;
        const servings = inputs.servingsConsumed as number;
        if (!servings) return null;

        const totalCal = cal * servings;
        const totalFat = fat * servings;
        const totalCarbs = carbs * servings;
        const totalProtein = protein * servings;
        const totalSodium = sodium * servings;

        const fatDv = (totalFat / 78) * 100;
        const carbsDv = (totalCarbs / 275) * 100;
        const proteinDv = (totalProtein / 50) * 100;
        const sodiumDv = (totalSodium / 2300) * 100;

        return {
          primary: { label: "Total Calories", value: `${formatNumber(totalCal, 0)} kcal` },
          details: [
            { label: "Servings consumed", value: String(servings) },
            { label: "Total calories", value: `${formatNumber(totalCal, 0)} kcal` },
            { label: "Total fat", value: `${formatNumber(totalFat, 1)}g (${formatNumber(fatDv, 0)}% DV)` },
            { label: "Total carbs", value: `${formatNumber(totalCarbs, 1)}g (${formatNumber(carbsDv, 0)}% DV)` },
            { label: "Total protein", value: `${formatNumber(totalProtein, 1)}g (${formatNumber(proteinDv, 0)}% DV)` },
            { label: "Total sodium", value: `${formatNumber(totalSodium, 0)}mg (${formatNumber(sodiumDv, 0)}% DV)` },
          ],
          note: "Many people consume more than one serving. Check the serving size on the label and multiply by the number of servings you actually eat. % Daily Values are based on a 2,000 calorie diet.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "protein-calculator"],
  faq: [
    {
      question: "What does % Daily Value mean?",
      answer:
        "% Daily Value (%DV) shows how much a nutrient in one serving contributes to your total daily diet. It is based on a 2,000 calorie diet. 5% DV or less is considered low; 20% DV or more is considered high.",
    },
    {
      question: "What are the FDA Daily Values?",
      answer:
        "Updated 2020 FDA Daily Values (for 2,000 cal diet): Total Fat 78g, Saturated Fat 20g, Cholesterol 300mg, Sodium 2,300mg, Total Carbs 275g, Dietary Fiber 28g, Added Sugars 50g, Protein 50g.",
    },
    {
      question: "How do I read a nutrition label?",
      answer:
        "Start with serving size and servings per container. Check calories. Use %DV: aim for low %DV of saturated fat, sodium, and added sugars. Aim for high %DV of fiber, vitamins, and minerals. Compare products using %DV.",
    },
    {
      question: "What is the difference between total sugars and added sugars?",
      answer:
        "Total sugars include both naturally occurring sugars (in fruit, milk) and added sugars. Added sugars are those added during processing (sucrose, high-fructose corn syrup, honey). The FDA recommends limiting added sugars to less than 10% of daily calories (50g for 2,000 cal diet).",
    },
  ],
  formula:
    "% Daily Value = (Amount per serving / Daily Value) x 100 | FDA 2020 DVs: Fat 78g, Sat Fat 20g, Cholesterol 300mg, Sodium 2300mg, Carbs 275g, Fiber 28g, Added Sugars 50g, Protein 50g | Based on 2,000 calorie diet",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealCalorieCalculator: CalculatorDefinition = {
  slug: "meal-calorie-calculator",
  title: "Meal Calorie Estimator",
  description:
    "Estimate total calories for a meal by building your plate. Select protein, carb, vegetable, and fat components to calculate total calories and macronutrients.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "meal calorie calculator",
    "food calorie estimator",
    "plate calorie counter",
    "meal planner calories",
    "macro calculator meal",
    "lunch calorie counter",
    "dinner calories",
  ],
  variants: [
    {
      id: "build-plate",
      name: "Build-a-Plate Calorie Estimator",
      description: "Select meal components to estimate total calories and macros",
      fields: [
        {
          name: "protein",
          label: "Protein Source",
          type: "select",
          options: [
            { label: "None", value: "0_0_0" },
            { label: "Chicken Breast (4 oz) — 187 cal", value: "187_35_4" },
            { label: "Salmon (4 oz) — 233 cal", value: "233_25_14" },
            { label: "Ground Beef 85% (4 oz) — 243 cal", value: "243_21_17" },
            { label: "Tofu, firm (4 oz) — 88 cal", value: "88_10_5" },
            { label: "Eggs, 2 large — 143 cal", value: "143_12_10" },
            { label: "Shrimp (4 oz) — 120 cal", value: "120_23_2" },
            { label: "Pork Chop (4 oz) — 187 cal", value: "187_30_7" },
            { label: "Turkey Breast (4 oz) — 153 cal", value: "153_34_1" },
          ],
        },
        {
          name: "carb",
          label: "Carb/Starch Source",
          type: "select",
          options: [
            { label: "None", value: "0_0_0_0" },
            { label: "White Rice (1 cup cooked) — 206 cal", value: "206_4_0_45" },
            { label: "Brown Rice (1 cup cooked) — 216 cal", value: "216_5_2_45" },
            { label: "Pasta (1 cup cooked) — 220 cal", value: "220_8_1_43" },
            { label: "Bread, 2 slices — 160 cal", value: "160_6_2_30" },
            { label: "Sweet Potato (1 medium) — 103 cal", value: "103_2_0_24" },
            { label: "Baked Potato (1 medium) — 161 cal", value: "161_4_0_37" },
            { label: "Quinoa (1 cup cooked) — 222 cal", value: "222_8_4_39" },
          ],
        },
        {
          name: "veggie",
          label: "Vegetable/Side",
          type: "select",
          options: [
            { label: "None", value: "0_0_0_0" },
            { label: "Broccoli (1 cup) — 55 cal", value: "55_4_1_11" },
            { label: "Green Salad (2 cups) — 20 cal", value: "20_2_0_4" },
            { label: "Steamed Vegetables (1 cup) — 50 cal", value: "50_3_0_10" },
            { label: "Corn (1 cup) — 132 cal", value: "132_5_2_29" },
            { label: "Green Beans (1 cup) — 44 cal", value: "44_2_0_10" },
            { label: "Roasted Vegetables (1 cup) — 90 cal", value: "90_2_3_14" },
          ],
        },
        {
          name: "fat",
          label: "Added Fat/Sauce/Dressing",
          type: "select",
          options: [
            { label: "None", value: "0_0" },
            { label: "Olive Oil (1 tbsp) — 119 cal", value: "119_14" },
            { label: "Butter (1 tbsp) — 102 cal", value: "102_12" },
            { label: "Salad Dressing (2 tbsp) — 130 cal", value: "130_13" },
            { label: "Cheese (1 oz) — 113 cal", value: "113_9" },
            { label: "Avocado (half) — 161 cal", value: "161_15" },
            { label: "Sour Cream (2 tbsp) — 60 cal", value: "60_5" },
            { label: "Mayonnaise (1 tbsp) — 94 cal", value: "94_10" },
          ],
        },
        {
          name: "drink",
          label: "Beverage",
          type: "select",
          options: [
            { label: "Water / Unsweetened Tea — 0 cal", value: "0" },
            { label: "Soda (12 oz) — 140 cal", value: "140" },
            { label: "Juice (8 oz) — 112 cal", value: "112" },
            { label: "Milk, whole (8 oz) — 149 cal", value: "149" },
            { label: "Milk, skim (8 oz) — 83 cal", value: "83" },
            { label: "Beer (12 oz) — 153 cal", value: "153" },
            { label: "Wine (5 oz) — 125 cal", value: "125" },
          ],
        },
      ],
      calculate: (inputs) => {
        const proteinParts = (inputs.protein as string || "0_0_0").split("_").map(Number);
        const carbParts = (inputs.carb as string || "0_0_0_0").split("_").map(Number);
        const veggieParts = (inputs.veggie as string || "0_0_0_0").split("_").map(Number);
        const fatParts = (inputs.fat as string || "0_0").split("_").map(Number);
        const drinkCals = parseFloat(inputs.drink as string) || 0;

        const proteinCals = proteinParts[0] || 0;
        const proteinG = proteinParts[1] || 0;
        const proteinFatG = proteinParts[2] || 0;

        const carbCals = carbParts[0] || 0;
        const carbProtG = carbParts[1] || 0;
        const carbFatG = carbParts[2] || 0;
        const carbG = carbParts[3] || 0;

        const vegCals = veggieParts[0] || 0;
        const vegProtG = veggieParts[1] || 0;
        const vegFatG = veggieParts[2] || 0;
        const vegCarbG = veggieParts[3] || 0;

        const fatCals = fatParts[0] || 0;
        const fatG = fatParts[1] || 0;

        const totalCals = proteinCals + carbCals + vegCals + fatCals + drinkCals;
        const totalProtein = proteinG + carbProtG + vegProtG;
        const totalFat = proteinFatG + carbFatG + vegFatG + fatG;
        const totalCarbs = carbG + vegCarbG;

        if (totalCals === 0) return null;

        const proteinPercent = (totalProtein * 4 / totalCals) * 100;
        const fatPercent = (totalFat * 9 / totalCals) * 100;
        const carbPercent = (totalCarbs * 4 / totalCals) * 100;

        let mealSize: string;
        if (totalCals < 300) mealSize = "Light meal / snack";
        else if (totalCals < 500) mealSize = "Moderate meal";
        else if (totalCals < 700) mealSize = "Standard meal";
        else if (totalCals < 1000) mealSize = "Large meal";
        else mealSize = "Very large meal";

        return {
          primary: { label: "Total Meal Calories", value: `${formatNumber(totalCals, 0)} kcal` },
          details: [
            { label: "Total Calories", value: `${formatNumber(totalCals, 0)} kcal` },
            { label: "Protein", value: `${formatNumber(totalProtein, 0)} g (${formatNumber(proteinPercent, 0)}%)` },
            { label: "Fat", value: `${formatNumber(totalFat, 0)} g (${formatNumber(fatPercent, 0)}%)` },
            { label: "Carbohydrates", value: `${formatNumber(totalCarbs, 0)} g (${formatNumber(carbPercent, 0)}%)` },
            { label: "Meal Size", value: mealSize },
            { label: "Beverage Calories", value: `${formatNumber(drinkCals, 0)} kcal` },
          ],
          note: "These are estimates based on typical serving sizes. Actual calories vary by preparation method, brand, and exact portion size. Recommended daily intake is typically 1600-2400 kcal for women and 2000-3000 kcal for men.",
        };
      },
    },
  ],
  relatedSlugs: ["weight-watchers-calculator", "glycemic-index-calculator", "nutrition-gap-calculator"],
  faq: [
    {
      question: "How many calories should a meal be?",
      answer:
        "For a typical 2000 calorie diet, meals should be roughly 400-600 calories each (3 meals) plus 200-400 in snacks. Active individuals or those with higher caloric needs may need larger meals. The key is that total daily calories match your goals.",
    },
    {
      question: "What is a good macro ratio for meals?",
      answer:
        "A balanced meal typically has 25-35% protein, 25-35% fat, and 35-50% carbohydrates. For weight loss, higher protein (30-40%) helps with satiety. For athletes, carb ratios may be higher. Individual needs vary based on goals and health conditions.",
    },
    {
      question: "How accurate are calorie estimates?",
      answer:
        "Restaurant and packaged food calorie counts can be off by 10-20%. Home-cooked meal estimates depend heavily on measuring accuracy and cooking methods (frying adds calories vs. grilling). Using a food scale and measuring cups improves accuracy significantly.",
    },
  ],
  formula:
    "Total Calories = Sum of all food component calories | Protein kcal = protein_g x 4 | Fat kcal = fat_g x 9 | Carb kcal = carb_g x 4 | Macro % = (macro kcal / total kcal) x 100",
};

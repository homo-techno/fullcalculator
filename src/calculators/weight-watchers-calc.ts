import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weightWatchersCalculator: CalculatorDefinition = {
  slug: "weight-watchers-calculator",
  title: "Weight Watchers Points Calculator",
  description:
    "Calculate SmartPoints-style values for foods based on calories, saturated fat, sugar, and protein. Track daily points budget for weight management.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "weight watchers points calculator",
    "WW points",
    "SmartPoints calculator",
    "food points calculator",
    "diet points tracker",
    "weight loss points",
    "WW calculator",
  ],
  variants: [
    {
      id: "food-points",
      name: "Food Points Calculator",
      description: "Calculate points value for a food item based on nutritional information",
      fields: [
        {
          name: "calories",
          label: "Calories",
          type: "number",
          placeholder: "e.g. 250",
          suffix: "kcal",
          min: 0,
          max: 5000,
          step: 1,
        },
        {
          name: "saturatedFat",
          label: "Saturated Fat",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "g",
          min: 0,
          max: 100,
          step: 0.5,
        },
        {
          name: "sugar",
          label: "Sugar",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
        {
          name: "protein",
          label: "Protein",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "g",
          min: 0,
          max: 200,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const calories = parseFloat(inputs.calories as string);
        const satFat = parseFloat(inputs.saturatedFat as string);
        const sugar = parseFloat(inputs.sugar as string);
        const protein = parseFloat(inputs.protein as string);

        if (isNaN(calories)) return null;
        const sf = isNaN(satFat) ? 0 : satFat;
        const su = isNaN(sugar) ? 0 : sugar;
        const pr = isNaN(protein) ? 0 : protein;

        // SmartPoints-style formula (approximation):
        // Points = (Calories/33) + (Saturated Fat/9) + (Sugar/9) - (Protein/11)
        // Minimum 0 points (except for certain zero-point foods)
        const rawPoints = (calories / 33) + (sf / 9) + (su / 9) - (pr / 11);
        const points = Math.max(Math.round(rawPoints), 0);

        let calorieEfficiency: string;
        if (points === 0) calorieEfficiency = "Zero-point food";
        else {
          const calPerPoint = calories / points;
          if (calPerPoint > 50) calorieEfficiency = "Efficient — good calories-to-points ratio";
          else if (calPerPoint > 35) calorieEfficiency = "Moderate efficiency";
          else calorieEfficiency = "Low efficiency — high points for the calories";
        }

        const calContribution = calories / 33;
        const fatContribution = sf / 9;
        const sugarContribution = su / 9;
        const proteinDeduction = pr / 11;

        return {
          primary: { label: "Points Value", value: formatNumber(points, 0) },
          details: [
            { label: "Total Points", value: formatNumber(points, 0) },
            { label: "Calorie Contribution", value: `+${formatNumber(calContribution, 1)}` },
            { label: "Sat. Fat Contribution", value: `+${formatNumber(fatContribution, 1)}` },
            { label: "Sugar Contribution", value: `+${formatNumber(sugarContribution, 1)}` },
            { label: "Protein Deduction", value: `-${formatNumber(proteinDeduction, 1)}` },
            { label: "Efficiency", value: calorieEfficiency },
          ],
          note: "This calculator uses a SmartPoints-style formula for estimation purposes. It rewards lean protein and penalizes saturated fat and sugar. Actual WW program values may differ. Many fruits and vegetables are zero points.",
        };
      },
    },
    {
      id: "daily-budget",
      name: "Daily Points Budget",
      description: "Estimate your daily points allowance based on personal information",
      fields: [
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Female", value: "female" },
            { label: "Male", value: "male" },
          ],
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "years",
          min: 18,
          max: 100,
          step: 1,
        },
        {
          name: "weight",
          label: "Current Weight",
          type: "number",
          placeholder: "e.g. 180",
          suffix: "lbs",
          min: 80,
          max: 500,
        },
        {
          name: "heightInches",
          label: "Height",
          type: "number",
          placeholder: "e.g. 66",
          suffix: "inches",
          min: 48,
          max: 84,
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (desk job, little exercise)", value: "sedentary" },
            { label: "Lightly Active (1-3 days/week exercise)", value: "light" },
            { label: "Moderately Active (3-5 days/week)", value: "moderate" },
            { label: "Very Active (6-7 days/week)", value: "active" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const age = parseFloat(inputs.age as string);
        const weight = parseFloat(inputs.weight as string);
        const heightInches = parseFloat(inputs.heightInches as string);
        const activity = inputs.activity as string;

        if (!sex || isNaN(age) || isNaN(weight) || isNaN(heightInches) || !activity) return null;

        const weightKg = weight / 2.205;
        const heightCm = heightInches * 2.54;

        // Calculate TDEE using Mifflin-St Jeor
        let bmr: number;
        if (sex === "male") {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        }

        const activityMultipliers: Record<string, number> = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
        };
        const tdee = bmr * (activityMultipliers[activity] || 1.2);

        // Approximate daily points budget (roughly TDEE/33 adjusted for weight loss)
        const maintenancePoints = Math.round(tdee / 33);
        const weightLossPoints = Math.max(Math.round(maintenancePoints * 0.8), 23); // WW minimum ~23 points
        const weeklyExtra = 35; // Weekly bonus points

        return {
          primary: { label: "Daily Points Budget", value: formatNumber(weightLossPoints, 0) },
          details: [
            { label: "Daily Points (Weight Loss)", value: formatNumber(weightLossPoints, 0) },
            { label: "Maintenance Points", value: formatNumber(maintenancePoints, 0) },
            { label: "Weekly Bonus Points", value: formatNumber(weeklyExtra, 0) },
            { label: "Total Weekly Points", value: formatNumber(weightLossPoints * 7 + weeklyExtra, 0) },
            { label: "Estimated TDEE", value: `${formatNumber(tdee, 0)} kcal/day` },
            { label: "Estimated BMR", value: `${formatNumber(bmr, 0)} kcal/day` },
          ],
          note: "This is an estimate based on SmartPoints-style calculations. Actual WW program budgets are personalized. Minimum daily points is typically 23. Weekly bonus points can be spread across the week or used at once.",
        };
      },
    },
  ],
  relatedSlugs: ["meal-calorie-calculator", "nutrition-gap-calculator", "glycemic-index-calculator"],
  faq: [
    {
      question: "How are SmartPoints calculated?",
      answer:
        "SmartPoints use a formula based on calories, saturated fat, sugar, and protein. Calories and saturated fat increase points, sugar increases points, and protein decreases points. This encourages choosing foods that are lower in sugar and saturated fat and higher in protein.",
    },
    {
      question: "What is a typical daily points budget?",
      answer:
        "Daily points budgets typically range from 23 to 45+ depending on sex, age, weight, height, and activity level. Most people receive 26-35 daily points. In addition, there are usually 35 weekly bonus points that can be used for treats or larger meals.",
    },
    {
      question: "What foods are zero points?",
      answer:
        "Many fruits, vegetables, lean proteins (chicken breast, eggs, fish), and legumes are zero points in the WW system. These foods are nutritious and help you feel full without counting toward your daily budget. The specific zero-point foods vary by program version.",
    },
  ],
  formula:
    "Points = (Calories / 33) + (Saturated Fat / 9) + (Sugar / 9) - (Protein / 11) | Minimum 0 points | Daily Budget based on TDEE / 33 x 0.8 for weight loss",
};

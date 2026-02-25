import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cuttingCalculator: CalculatorDefinition = {
  slug: "cutting-calculator",
  title: "Cutting Calorie Calculator",
  description: "Free cutting calorie calculator. Calculate your ideal caloric deficit, macros, and timeline for losing fat while preserving muscle mass.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cutting calculator", "calorie deficit", "fat loss calories", "cutting diet", "bodybuilding cut", "lean out calculator"],
  variants: [
    {
      id: "cutting-plan",
      name: "Cutting Calorie Plan",
      description: "Calculate calories and macros for a muscle-preserving fat loss phase",
      fields: [
        { name: "weight", label: "Current Weight", type: "number", placeholder: "e.g. 85" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
        { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 178", suffix: "cm" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "activity", label: "Activity Level", type: "select", options: [
          { label: "Sedentary (office job)", value: "1.2" },
          { label: "Light activity (1-2x/week)", value: "1.375" },
          { label: "Moderate (3-5x/week)", value: "1.55" },
          { label: "Very active (6-7x/week)", value: "1.725" },
          { label: "Extremely active (2x/day)", value: "1.9" },
        ], defaultValue: "1.55" },
        { name: "deficit", label: "Deficit Aggressiveness", type: "select", options: [
          { label: "Conservative (-300 kcal)", value: "300" },
          { label: "Moderate (-500 kcal)", value: "500" },
          { label: "Aggressive (-750 kcal)", value: "750" },
          { label: "Very Aggressive (-1000 kcal)", value: "1000" },
        ], defaultValue: "500" },
        { name: "bodyFat", label: "Current Body Fat % (optional)", type: "number", placeholder: "e.g. 20", suffix: "%" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        const height = inputs.height as number;
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        const activityMult = parseFloat(inputs.activity as string);
        const deficit = parseInt(inputs.deficit as string);
        const bf = inputs.bodyFat as number;
        if (!weight || !height || !age) return null;
        const weightKg = unit === "lbs" ? weight * 0.4536 : weight;
        let bmr: number;
        if (gender === "male") {
          bmr = 10 * weightKg + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weightKg + 6.25 * height - 5 * age - 161;
        }
        const tdee = bmr * activityMult;
        const cuttingCals = tdee - deficit;
        const proteinG = weightKg * 2.2;
        const fatG = weightKg * 0.8;
        const proteinCals = proteinG * 4;
        const fatCals = fatG * 9;
        const carbCals = Math.max(0, cuttingCals - proteinCals - fatCals);
        const carbG = carbCals / 4;
        const weeklyLoss = (deficit * 7) / 7700;
        const details: { label: string; value: string }[] = [
          { label: "TDEE (maintenance)", value: `${formatNumber(tdee, 0)} kcal` },
          { label: "Daily Deficit", value: `-${deficit} kcal` },
          { label: "Protein", value: `${formatNumber(proteinG, 0)} g (${formatNumber(proteinCals, 0)} kcal)` },
          { label: "Fat", value: `${formatNumber(fatG, 0)} g (${formatNumber(fatCals, 0)} kcal)` },
          { label: "Carbs", value: `${formatNumber(carbG, 0)} g (${formatNumber(carbCals, 0)} kcal)` },
          { label: "Expected Weekly Loss", value: `${formatNumber(weeklyLoss, 2)} kg/week` },
        ];
        if (bf) {
          const leanMass = weightKg * (1 - bf / 100);
          const fatMass = weightKg * bf / 100;
          const targetBF = gender === "male" ? 12 : 20;
          const targetWeight = leanMass / (1 - targetBF / 100);
          const weightToLose = weightKg - targetWeight;
          const weeksToGoal = weightToLose > 0 ? weightToLose / weeklyLoss : 0;
          details.push(
            { label: "Current Fat Mass", value: `${formatNumber(fatMass, 1)} kg` },
            { label: "Lean Mass", value: `${formatNumber(leanMass, 1)} kg` },
            { label: `Target (${targetBF}% BF)`, value: `${formatNumber(targetWeight, 1)} kg` },
            { label: "Estimated Weeks to Target", value: weeksToGoal > 0 ? `${formatNumber(weeksToGoal, 0)} weeks` : "Already below target" },
          );
        }
        return {
          primary: { label: "Cutting Calories", value: `${formatNumber(cuttingCals, 0)} kcal/day` },
          details,
          note: "High protein (2.2g/kg) during cutting preserves muscle. Moderate fat supports hormones. Do not drop below BMR. Include resistance training.",
        };
      },
    },
    {
      id: "refeed",
      name: "Refeed Day Calculator",
      description: "Calculate refeed/diet break calories to maintain metabolism during cuts",
      fields: [
        { name: "cuttingCals", label: "Cutting Calories", type: "number", placeholder: "e.g. 2000", suffix: "kcal" },
        { name: "tdee", label: "Maintenance Calories (TDEE)", type: "number", placeholder: "e.g. 2500", suffix: "kcal" },
        { name: "weight", label: "Body Weight (kg)", type: "number", placeholder: "e.g. 80", suffix: "kg" },
      ],
      calculate: (inputs) => {
        const cutting = inputs.cuttingCals as number;
        const tdee = inputs.tdee as number;
        const weight = inputs.weight as number;
        if (!cutting || !tdee) return null;
        const refeedCals = tdee;
        const refeedProtein = weight ? weight * 1.8 : 0;
        const refeedFat = weight ? weight * 0.5 : 0;
        const remainingCals = refeedCals - (refeedProtein * 4 + refeedFat * 9);
        const refeedCarbs = Math.max(0, remainingCals / 4);
        return {
          primary: { label: "Refeed Day Calories", value: `${formatNumber(refeedCals, 0)} kcal` },
          details: [
            { label: "Cutting Day Calories", value: `${formatNumber(cutting, 0)} kcal` },
            { label: "Calorie Increase on Refeed", value: `+${formatNumber(tdee - cutting, 0)} kcal` },
            { label: "Refeed Protein", value: `${formatNumber(refeedProtein, 0)} g` },
            { label: "Refeed Fat (low)", value: `${formatNumber(refeedFat, 0)} g` },
            { label: "Refeed Carbs (high)", value: `${formatNumber(refeedCarbs, 0)} g` },
            { label: "Recommended Frequency", value: "1-2x per week" },
          ],
          note: "Refeed days are high-carb, maintenance-calorie days that help restore leptin, glycogen, and training performance during a cut. Keep fat low and carbs high on refeed days.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "protein-intake-calculator"],
  faq: [
    { question: "What is cutting?", answer: "Cutting is a deliberate caloric deficit phase to reduce body fat while maintaining muscle mass. It typically involves a 300-750 calorie deficit, high protein intake, and continued resistance training. Most cuts last 8-16 weeks." },
    { question: "How fast should I lose weight when cutting?", answer: "Aim for 0.5-1% of bodyweight per week. Faster rates risk muscle loss. Leaner individuals should cut more slowly (0.5%/week). Those with more fat can cut faster (1%/week) initially." },
  ],
  formula: "TDEE = BMR x Activity | Cutting = TDEE - deficit | Protein = 2.2g/kg | Fat = 0.8g/kg | Carbs = remaining",
};

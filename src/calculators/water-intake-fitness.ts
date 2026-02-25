import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterIntakeFitnessCalculator: CalculatorDefinition = {
  slug: "water-intake-fitness-calculator",
  title: "Water Intake for Athletes Calculator",
  description: "Free water intake calculator for athletes and active individuals. Calculate hydration needs based on body weight, exercise duration, and climate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["water intake athlete", "hydration calculator", "sports hydration", "water for exercise", "athlete water needs", "fitness hydration"],
  variants: [
    {
      id: "exercise-hydration",
      name: "Exercise Hydration Plan",
      description: "Calculate water needs before, during, and after exercise",
      fields: [
        { name: "weight", label: "Body Weight", type: "number", placeholder: "e.g. 75" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
        { name: "duration", label: "Exercise Duration", type: "number", placeholder: "e.g. 60", suffix: "min" },
        { name: "intensity", label: "Intensity", type: "select", options: [
          { label: "Low (walking, yoga)", value: "low" },
          { label: "Moderate (jogging, cycling)", value: "moderate" },
          { label: "High (running, HIIT)", value: "high" },
          { label: "Very High (competition, extreme)", value: "very_high" },
        ], defaultValue: "moderate" },
        { name: "climate", label: "Climate", type: "select", options: [
          { label: "Cool / Indoor", value: "cool" },
          { label: "Temperate", value: "temperate" },
          { label: "Hot / Humid", value: "hot" },
        ], defaultValue: "temperate" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        const duration = inputs.duration as number;
        const intensity = inputs.intensity as string;
        const climate = inputs.climate as string;
        if (!weight || !duration) return null;
        const weightKg = unit === "lbs" ? weight * 0.4536 : weight;
        const sweatRates: Record<string, number> = { low: 0.4, moderate: 0.8, high: 1.2, very_high: 1.6 };
        const climateMulti: Record<string, number> = { cool: 0.8, temperate: 1.0, hot: 1.3 };
        const sweatRate = (sweatRates[intensity] || 0.8) * (climateMulti[climate] || 1.0);
        const exerciseLiters = sweatRate * (duration / 60);
        const baseDaily = weightKg * 0.033;
        const totalDaily = baseDaily + exerciseLiters;
        const preExercise = 500;
        const duringExercise = sweatRate * 1000 * (duration / 60) * 0.8;
        const postExercise = exerciseLiters * 1.5 * 1000;
        return {
          primary: { label: "Total Daily Water", value: `${formatNumber(totalDaily, 1)} L` },
          details: [
            { label: "Base Daily Need", value: `${formatNumber(baseDaily, 1)} L` },
            { label: "Exercise Water Loss", value: `${formatNumber(exerciseLiters, 1)} L` },
            { label: "Pre-Exercise (2-3 hrs before)", value: `${formatNumber(preExercise, 0)} mL` },
            { label: "During Exercise", value: `${formatNumber(duringExercise, 0)} mL total` },
            { label: "Post-Exercise Recovery", value: `${formatNumber(postExercise, 0)} mL` },
            { label: "Sweat Rate (estimated)", value: `${formatNumber(sweatRate, 1)} L/hr` },
          ],
          note: "Drink 150% of fluid lost during exercise for full rehydration. If exercising >60 min, consider adding electrolytes.",
        };
      },
    },
    {
      id: "sweat-test",
      name: "Sweat Rate Test",
      description: "Calculate your actual sweat rate from pre/post exercise weights",
      fields: [
        { name: "preWeight", label: "Pre-Exercise Weight", type: "number", placeholder: "e.g. 75.0", suffix: "kg" },
        { name: "postWeight", label: "Post-Exercise Weight", type: "number", placeholder: "e.g. 74.2", suffix: "kg" },
        { name: "fluidConsumed", label: "Fluid Consumed During", type: "number", placeholder: "e.g. 500", suffix: "mL" },
        { name: "duration", label: "Exercise Duration", type: "number", placeholder: "e.g. 60", suffix: "min" },
      ],
      calculate: (inputs) => {
        const pre = inputs.preWeight as number;
        const post = inputs.postWeight as number;
        const fluid = (inputs.fluidConsumed as number) || 0;
        const duration = inputs.duration as number;
        if (!pre || !post || !duration) return null;
        const weightLossKg = pre - post;
        const totalSweatL = weightLossKg + (fluid / 1000);
        const sweatRatePerHr = totalSweatL / (duration / 60);
        const dehydrationPct = (weightLossKg / pre) * 100;
        let status: string;
        if (dehydrationPct < 1) status = "Well hydrated";
        else if (dehydrationPct < 2) status = "Mildly dehydrated";
        else if (dehydrationPct < 3) status = "Moderately dehydrated";
        else status = "Significantly dehydrated";
        return {
          primary: { label: "Sweat Rate", value: `${formatNumber(sweatRatePerHr, 2)} L/hr` },
          details: [
            { label: "Total Sweat Loss", value: `${formatNumber(totalSweatL, 2)} L` },
            { label: "Weight Lost", value: `${formatNumber(weightLossKg, 2)} kg` },
            { label: "Dehydration Level", value: `${formatNumber(dehydrationPct, 1)}%` },
            { label: "Status", value: status },
            { label: "Rehydration Needed", value: `${formatNumber(totalSweatL * 1.5 * 1000, 0)} mL` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["water-intake-calculator", "calorie-calculator", "protein-intake-calculator"],
  faq: [
    { question: "How much water should athletes drink?", answer: "Athletes should drink their baseline (33 mL/kg bodyweight) plus fluids lost through sweat. During exercise, aim for 400-800 mL per hour depending on intensity. After exercise, drink 150% of weight lost." },
    { question: "How do I know if I am dehydrated?", answer: "Signs include dark urine, thirst, dry mouth, headache, and fatigue. During exercise, losing more than 2% bodyweight indicates significant dehydration that impairs performance. Monitor urine color: pale yellow is ideal." },
  ],
  formula: "Base: 33 mL/kg/day | Exercise: Sweat rate (L/hr) x duration | Post-exercise: 150% of fluid lost",
};

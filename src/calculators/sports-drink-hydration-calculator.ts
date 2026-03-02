import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sportsDrinkHydrationCalculator: CalculatorDefinition = {
  slug: "sports-drink-hydration-calculator",
  title: "Sports Drink Hydration Calculator",
  description: "Calculate fluid, electrolyte, and carbohydrate needs during exercise based on activity and conditions.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sports drink","exercise hydration","electrolyte needs","fluid replacement"],
  variants: [{
    id: "standard",
    name: "Sports Drink Hydration",
    description: "Calculate fluid, electrolyte, and carbohydrate needs during exercise based on activity and conditions.",
    fields: [
      { name: "duration", label: "Exercise Duration (minutes)", type: "number", min: 15, max: 600, defaultValue: 90 },
      { name: "intensity", label: "Exercise Intensity", type: "select", options: [{ value: "1", label: "Low (walking, yoga)" }, { value: "2", label: "Moderate (jogging, cycling)" }, { value: "3", label: "High (racing, HIIT)" }], defaultValue: "2" },
      { name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 350, defaultValue: 160 },
      { name: "temp", label: "Temperature", type: "select", options: [{ value: "1", label: "Cool (under 60F)" }, { value: "1.3", label: "Moderate (60-80F)" }, { value: "1.6", label: "Hot (over 80F)" }], defaultValue: "1.3" },
    ],
    calculate: (inputs) => {
    const duration = inputs.duration as number;
    const intensity = parseInt(inputs.intensity as string);
    const weight = inputs.weight as number;
    const temp = parseFloat(inputs.temp as string);
    const baseSweatRate = intensity === 1 ? 16 : intensity === 2 ? 28 : 40;
    const sweatOzPerHour = Math.round(baseSweatRate * (weight / 150) * temp);
    const totalFluidOz = Math.round(sweatOzPerHour * (duration / 60));
    const sodiumMg = Math.round(sweatOzPerHour * 30 * (duration / 60));
    const carbGrams = duration > 60 ? Math.round(duration / 60 * 40) : 0;
    const drinkServings = Math.ceil(totalFluidOz / 8);
    return {
      primary: { label: "Fluid Needed", value: formatNumber(totalFluidOz) + " oz" },
      details: [
        { label: "Sweat Rate", value: formatNumber(sweatOzPerHour) + " oz/hr" },
        { label: "Sodium Needed", value: formatNumber(sodiumMg) + " mg" },
        { label: "Carbs Needed", value: formatNumber(carbGrams) + " g" },
        { label: "Drink Servings (8oz)", value: formatNumber(drinkServings) }
      ]
    };
  },
  }],
  relatedSlugs: ["swim-pace-calculator","running-shoe-mileage-calculator"],
  faq: [
    { question: "How much should I drink during exercise?", answer: "General guidelines suggest 4 to 8 ounces every 15 to 20 minutes during exercise. Individual needs vary with sweat rate." },
    { question: "Do I need a sports drink for short workouts?", answer: "For exercise under 60 minutes, water is usually sufficient. Sports drinks help during longer or intense sessions." },
    { question: "How much sodium do I lose in sweat?", answer: "Average sweat contains 800 to 1500 mg of sodium per liter. Heavy sweaters may lose even more." },
  ],
  formula: "Fluid (oz) = Sweat Rate x Weight Factor x Temp Factor x Duration; Sodium = Sweat Rate x 30mg/oz",
};

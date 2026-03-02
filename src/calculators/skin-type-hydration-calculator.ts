import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skinTypeHydrationCalculator: CalculatorDefinition = {
  slug: "skin-type-hydration-calculator",
  title: "Skin Type Hydration Calculator",
  description: "Calculate daily water intake recommendation for your skin type.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["skin hydration","water for skin","skin type water intake"],
  variants: [{
    id: "standard",
    name: "Skin Type Hydration",
    description: "Calculate daily water intake recommendation for your skin type.",
    fields: [
      { name: "skinType", label: "Skin Type", type: "select", options: [{ value: "1", label: "Oily" }, { value: "1.1", label: "Normal" }, { value: "1.2", label: "Combination" }, { value: "1.3", label: "Dry" }, { value: "1.4", label: "Very Dry" }] },
      { name: "bodyWeight", label: "Body Weight (lbs)", type: "number", min: 80, max: 400, defaultValue: 150 },
      { name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Humid" }, { value: "1.1", label: "Temperate" }, { value: "1.2", label: "Dry/Arid" }] },
      { name: "activityLevel", label: "Activity Level", type: "select", options: [{ value: "1", label: "Sedentary" }, { value: "1.15", label: "Moderate" }, { value: "1.3", label: "Active" }] },
    ],
    calculate: (inputs) => {
    const skinType = parseFloat(inputs.skinType as string);
    const bodyWeight = inputs.bodyWeight as number;
    const climate = parseFloat(inputs.climate as string);
    const activityLevel = parseFloat(inputs.activityLevel as string);
    const baseOz = bodyWeight * 0.5;
    const adjustedOz = baseOz * skinType * climate * activityLevel;
    const liters = adjustedOz * 0.0296;
    const glasses = Math.ceil(adjustedOz / 8);
    return {
      primary: { label: "Daily Water Intake", value: formatNumber(adjustedOz) + " oz (" + formatNumber(liters) + " L)" },
      details: [
        { label: "Glasses of Water (8 oz)", value: formatNumber(glasses) },
        { label: "Skin Type Adjustment", value: "x" + formatNumber(skinType) },
        { label: "Climate Adjustment", value: "x" + formatNumber(climate) }
      ]
    };
  },
  }],
  relatedSlugs: ["sunscreen-usage-calculator","hair-growth-calculator"],
  faq: [
    { question: "How much water should I drink for good skin?", answer: "About half your body weight in ounces daily, adjusted for skin type." },
    { question: "Does drinking water improve skin?", answer: "Adequate hydration supports skin elasticity and reduces dryness." },
    { question: "Does dry skin need more water?", answer: "Dry skin types benefit from increased water intake and topical hydration." },
  ],
  formula: "Daily Oz = (Body Weight x 0.5) x Skin Type Factor x Climate Factor x Activity Factor",
};

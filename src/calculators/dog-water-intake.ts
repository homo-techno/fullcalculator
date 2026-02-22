import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogWaterIntakeCalculator: CalculatorDefinition = {
  slug: "dog-water-intake-calculator",
  title: "Dog Water Intake Calculator",
  description:
    "Free dog water intake calculator. Determine how much water your dog needs daily based on weight, activity level, diet type, and weather conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog water intake",
    "how much water should my dog drink",
    "dog hydration calculator",
    "dog daily water needs",
    "dog water requirement",
  ],
  variants: [
    {
      id: "dogWater",
      name: "Daily Water Intake",
      fields: [
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
          step: 1,
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Low (mostly resting)", value: "low" },
            { label: "Moderate (regular walks)", value: "moderate" },
            { label: "High (running, training)", value: "high" },
            { label: "Very High (working dog)", value: "very_high" },
          ],
        },
        {
          name: "diet",
          label: "Diet Type",
          type: "select",
          options: [
            { label: "Dry Kibble", value: "dry" },
            { label: "Wet / Canned Food", value: "wet" },
            { label: "Raw / Fresh Food", value: "raw" },
            { label: "Mixed (Dry + Wet)", value: "mixed" },
          ],
        },
        {
          name: "weather",
          label: "Weather / Temperature",
          type: "select",
          options: [
            { label: "Cool / Cold", value: "cool" },
            { label: "Mild / Moderate", value: "mild" },
            { label: "Warm / Hot", value: "hot" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const activity = (inputs.activity as string) || "moderate";
        const diet = (inputs.diet as string) || "dry";
        const weather = (inputs.weather as string) || "mild";
        if (!weight || weight <= 0) return null;

        // Base: 1 oz of water per pound of body weight per day
        let baseOz = weight * 1.0;

        // Activity multiplier
        const activityFactors: Record<string, number> = {
          low: 0.85,
          moderate: 1.0,
          high: 1.3,
          very_high: 1.6,
        };

        // Diet adjustment (wet food provides ~70-80% moisture)
        const dietFactors: Record<string, number> = {
          dry: 1.0,
          wet: 0.7,
          raw: 0.75,
          mixed: 0.85,
        };

        // Weather adjustment
        const weatherFactors: Record<string, number> = {
          cool: 0.9,
          mild: 1.0,
          hot: 1.4,
        };

        const dailyOz = baseOz * activityFactors[activity] * dietFactors[diet] * weatherFactors[weather];
        const dailyCups = dailyOz / 8;
        const dailyMl = dailyOz * 29.5735;
        const dailyLiters = dailyMl / 1000;

        return {
          primary: {
            label: "Daily Water Intake",
            value: formatNumber(dailyOz, 0) + " oz",
          },
          details: [
            { label: "Cups Per Day", value: formatNumber(dailyCups, 1) + " cups" },
            { label: "Milliliters Per Day", value: formatNumber(dailyMl, 0) + " mL" },
            { label: "Liters Per Day", value: formatNumber(dailyLiters, 1) + " L" },
            { label: "Dog Weight", value: formatNumber(weight, 1) + " lbs" },
            { label: "Bowl Refills (16 oz bowl)", value: formatNumber(dailyOz / 16, 1) + " times" },
            {
              label: "Tip",
              value: "Always provide fresh, clean water. If your dog suddenly drinks much more or less than usual, consult your veterinarian.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-calorie-calculator", "dog-food-amount-calculator", "dog-raw-food-calculator"],
  faq: [
    {
      question: "How much water should a dog drink per day?",
      answer:
        "The general rule is approximately 1 ounce (1/8 cup) of water per pound of body weight per day. A 50-pound dog should drink about 50 ounces (6.25 cups) daily. This varies with activity, diet, and weather conditions.",
    },
    {
      question: "Can a dog drink too much water?",
      answer:
        "Yes, excessive water drinking (polydipsia) can be a sign of health issues like diabetes, kidney disease, or Cushing's disease. Water intoxication is also possible during play with water. If your dog's water consumption suddenly increases without obvious cause, consult your veterinarian.",
    },
    {
      question: "Do dogs on wet food need less water?",
      answer:
        "Yes. Wet/canned food is about 70-80% moisture, so dogs eating wet food get a significant portion of their daily water needs from their diet. Dogs on dry kibble (about 10% moisture) need to drink more water to stay hydrated.",
    },
  ],
  formula:
    "Base Water = 1 oz per lb of body weight per day. Adjusted Water = Base x activity factor (low 0.85, moderate 1.0, high 1.3, very high 1.6) x diet factor (dry 1.0, wet 0.7, raw 0.75, mixed 0.85) x weather factor (cool 0.9, mild 1.0, hot 1.4).",
};

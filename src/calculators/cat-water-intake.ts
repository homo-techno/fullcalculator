import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catWaterIntakeCalculator: CalculatorDefinition = {
  slug: "cat-water-intake-calculator",
  title: "Cat Water Intake Calculator",
  description:
    "Free cat water intake calculator. Estimate your cat's daily water needs based on weight, diet type, activity level, and environmental factors.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat water intake",
    "cat hydration calculator",
    "how much water cat needs",
    "cat daily water",
    "cat water requirements",
  ],
  variants: [
    {
      id: "water-intake",
      name: "Daily Water Intake",
      description: "Calculate your cat's recommended daily water intake",
      fields: [
        {
          name: "catWeight",
          label: "Cat Weight",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "lbs",
          min: 3,
          max: 30,
        },
        {
          name: "dietType",
          label: "Primary Diet",
          type: "select",
          options: [
            { label: "Dry Food (Kibble)", value: "dry" },
            { label: "Wet Food (Canned)", value: "wet" },
            { label: "Mixed (Dry + Wet)", value: "mixed" },
            { label: "Raw Diet", value: "raw" },
          ],
          defaultValue: "dry",
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Indoor / Sedentary", value: "low" },
            { label: "Moderately Active", value: "medium" },
            { label: "Very Active / Outdoor", value: "high" },
          ],
          defaultValue: "medium",
        },
        {
          name: "climate",
          label: "Climate / Temperature",
          type: "select",
          options: [
            { label: "Cool (under 65F)", value: "cool" },
            { label: "Moderate (65-80F)", value: "moderate" },
            { label: "Hot (over 80F)", value: "hot" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const catWeight = inputs.catWeight as number;
        const dietType = inputs.dietType as string;
        const activityLevel = inputs.activityLevel as string;
        const climate = inputs.climate as string;
        if (!catWeight) return null;

        // Base water need: ~3.5-4.5 oz per 5 lbs of body weight per day
        const weightKg = catWeight * 0.4536;
        let baseWaterMl = weightKg * 50; // ~50ml per kg is the baseline

        // Diet adjustments: wet food provides ~80% moisture
        let dietAdjustment = 1.0;
        if (dietType === "wet") {
          dietAdjustment = 0.5; // Wet food provides significant moisture
        } else if (dietType === "mixed") {
          dietAdjustment = 0.75;
        } else if (dietType === "raw") {
          dietAdjustment = 0.6; // Raw diet has high moisture
        }

        // Activity adjustment
        let activityAdjustment = 1.0;
        if (activityLevel === "high") {
          activityAdjustment = 1.2;
        } else if (activityLevel === "low") {
          activityAdjustment = 0.9;
        }

        // Climate adjustment
        let climateAdjustment = 1.0;
        if (climate === "hot") {
          climateAdjustment = 1.3;
        } else if (climate === "cool") {
          climateAdjustment = 0.9;
        }

        const totalWaterMl = Math.round(baseWaterMl * dietAdjustment * activityAdjustment * climateAdjustment);
        const totalWaterOz = totalWaterMl / 29.5735;
        const totalWaterCups = totalWaterOz / 8;

        return {
          primary: {
            label: "Daily Water Intake",
            value: `${formatNumber(totalWaterMl)} mL`,
          },
          details: [
            { label: "In Fluid Ounces", value: `${formatNumber(totalWaterOz, 1)} oz` },
            { label: "In Cups", value: `${formatNumber(totalWaterCups, 2)} cups` },
            { label: "Base Need (before diet adjustment)", value: `${formatNumber(Math.round(baseWaterMl))} mL` },
            { label: "Water from Food Offset", value: `${Math.round((1 - dietAdjustment) * 100)}%` },
            { label: "Number of Water Bowls Recommended", value: `${Math.max(2, Math.ceil(catWeight / 10) + 1)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cat-litter-box-calculator", "water-intake-calculator"],
  faq: [
    {
      question: "How much water should a cat drink per day?",
      answer:
        "A cat should drink approximately 3.5-4.5 ounces of water per 5 pounds of body weight per day. This comes from all sources including food moisture. Cats on dry food diets need to drink more water directly.",
    },
    {
      question: "How do I know if my cat is dehydrated?",
      answer:
        "Signs of dehydration in cats include dry gums, loss of skin elasticity (skin tent test), sunken eyes, lethargy, and decreased appetite. If you suspect dehydration, consult your veterinarian immediately.",
    },
    {
      question: "How can I encourage my cat to drink more water?",
      answer:
        "Try using a cat water fountain (cats prefer running water), placing multiple water bowls around the house, using wide shallow bowls to avoid whisker fatigue, keeping water fresh and clean, and adding wet food to their diet.",
    },
  ],
  formula:
    "Base Water (mL) = Weight (kg) x 50 | Adjusted Water = Base x Diet Factor x Activity Factor x Climate Factor",
};

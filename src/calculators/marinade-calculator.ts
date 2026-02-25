import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marinadeCalculator: CalculatorDefinition = {
  slug: "marinade-calculator",
  title: "Marinade Amount Calculator",
  description:
    "Free marinade calculator. Calculate how much marinade you need based on meat type, weight, and marinating method.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "marinade calculator",
    "how much marinade",
    "marinating time",
    "meat marinade",
    "marinade ratio",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "weight",
          label: "Meat Weight (lbs)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "protein",
          label: "Protein Type",
          type: "select",
          options: [
            { label: "Chicken (boneless)", value: "chicken_boneless" },
            { label: "Chicken (bone-in)", value: "chicken_bone" },
            { label: "Beef Steak", value: "beef_steak" },
            { label: "Pork Chops", value: "pork" },
            { label: "Fish / Seafood", value: "fish" },
            { label: "Tofu / Tempeh", value: "tofu" },
            { label: "Lamb", value: "lamb" },
          ],
        },
        {
          name: "method",
          label: "Marinating Method",
          type: "select",
          options: [
            { label: "Ziplock Bag", value: "bag" },
            { label: "Shallow Dish / Pan", value: "dish" },
            { label: "Deep Container", value: "container" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const protein = inputs.protein as string;
        const method = inputs.method as string;
        if (!weight || weight <= 0) return null;

        const cupPerLb: Record<string, number> = {
          bag: 0.25,
          dish: 0.5,
          container: 0.75,
        };

        const marinateHours: Record<string, { min: number; max: number }> = {
          chicken_boneless: { min: 2, max: 12 },
          chicken_bone: { min: 4, max: 24 },
          beef_steak: { min: 4, max: 24 },
          pork: { min: 2, max: 12 },
          fish: { min: 0.25, max: 1 },
          tofu: { min: 0.5, max: 24 },
          lamb: { min: 4, max: 24 },
        };

        const cupsPerLb = cupPerLb[method] || 0.5;
        const totalCups = weight * cupsPerLb;
        const totalMl = totalCups * 236.6;
        const totalOz = totalCups * 8;
        const times = marinateHours[protein] || { min: 2, max: 12 };

        const oilPortion = totalCups * 0.33;
        const acidPortion = totalCups * 0.33;
        const flavorPortion = totalCups * 0.34;

        return {
          primary: {
            label: "Marinade Needed",
            value: formatNumber(totalCups, 1) + " cups",
          },
          details: [
            { label: "Marinade (ml)", value: formatNumber(totalMl, 0) + " ml" },
            { label: "Marinade (oz)", value: formatNumber(totalOz, 0) + " oz" },
            { label: "Oil Portion (1/3)", value: formatNumber(oilPortion, 2) + " cups" },
            { label: "Acid Portion (1/3)", value: formatNumber(acidPortion, 2) + " cups" },
            { label: "Seasonings/Herbs (1/3)", value: formatNumber(flavorPortion, 2) + " cups" },
            { label: "Marinating Time", value: times.min + " - " + times.max + " hours" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "cooking-calculator"],
  faq: [
    {
      question: "How much marinade do I need per pound of meat?",
      answer:
        "Use about 1/4 cup per pound in a ziplock bag (most efficient), 1/2 cup per pound in a shallow dish, or 3/4 cup per pound in a deep container. The bag method uses less marinade because it coats the meat more evenly.",
    },
    {
      question: "How long should I marinate fish?",
      answer:
        "Fish should only be marinated for 15 minutes to 1 hour maximum. Acidic marinades can start to 'cook' the fish (like ceviche) if left too long, making the texture mushy.",
    },
  ],
  formula:
    "Marinade = Weight × Cups per pound. Cups per pound: Bag 0.25, Dish 0.5, Container 0.75. Basic marinade ratio: 1/3 oil, 1/3 acid, 1/3 seasonings.",
};

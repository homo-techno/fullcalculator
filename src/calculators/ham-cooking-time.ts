import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hamCookingTimeCalculator: CalculatorDefinition = {
  slug: "ham-cooking-time",
  title: "Ham Cooking Time Calculator",
  description: "Free online ham cooking time calculator. Calculate cooking time per pound for baked, smoked, or spiral-cut ham.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ham cooking time", "ham per pound", "bake ham", "ham temperature", "holiday ham", "cooking calculator"],
  variants: [
    {
      id: "ham-time",
      name: "Ham Cooking Time",
      fields: [
        { name: "weight", label: "Ham Weight (lbs)", type: "number", placeholder: "e.g. 10", step: 0.5 },
        {
          name: "hamType",
          label: "Ham Type",
          type: "select",
          options: [
            { label: "Pre-Cooked / Fully Cooked", value: "precooked" },
            { label: "Uncooked (Bone-In)", value: "uncooked_bone" },
            { label: "Uncooked (Boneless)", value: "uncooked_boneless" },
            { label: "Spiral Cut (Pre-Cooked)", value: "spiral" },
            { label: "Country Ham (Dry Cured)", value: "country" },
          ],
        },
        {
          name: "ovenTemp",
          label: "Oven Temperature",
          type: "select",
          options: [
            { label: "300°F (Low & Slow)", value: "300" },
            { label: "325°F (Recommended)", value: "325" },
            { label: "350°F (Standard)", value: "350" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const hamType = inputs.hamType as string;
        const ovenTemp = parseFloat(inputs.ovenTemp as string) || 325;

        // Minutes per pound at 325°F
        const minutesPerPound: Record<string, number> = {
          precooked: 15,
          uncooked_bone: 22,
          uncooked_boneless: 25,
          spiral: 13,
          country: 20,
        };

        const internalTemp: Record<string, number> = {
          precooked: 140,
          uncooked_bone: 145,
          uncooked_boneless: 145,
          spiral: 140,
          country: 160,
        };

        // Adjust for oven temperature
        const tempFactor = ovenTemp === 300 ? 1.15 : ovenTemp === 350 ? 0.88 : 1.0;

        const baseMinPerLb = minutesPerPound[hamType] || 18;
        const adjustedMinPerLb = baseMinPerLb * tempFactor;
        const totalMinutes = adjustedMinPerLb * weight;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        const target = internalTemp[hamType] || 145;
        const servings = Math.round(weight * (hamType === "uncooked_boneless" ? 3.5 : 2.5));

        return {
          primary: { label: "Total Cook Time", value: `${hours}h ${minutes}m` },
          details: [
            { label: "Ham Weight", value: `${formatNumber(weight)} lbs` },
            { label: "Minutes per Pound", value: formatNumber(adjustedMinPerLb) },
            { label: "Oven Temperature", value: `${formatNumber(ovenTemp)}°F` },
            { label: "Internal Temperature Goal", value: `${formatNumber(target)}°F` },
            { label: "Estimated Servings", value: formatNumber(servings) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steak-cooking-time", "thanksgiving-calc", "bbq-smoking-time"],
  faq: [
    {
      question: "How long do you cook a ham per pound?",
      answer: "A pre-cooked ham takes about 15 minutes per pound at 325°F. An uncooked bone-in ham takes about 22 minutes per pound, and a boneless uncooked ham about 25 minutes per pound.",
    },
    {
      question: "What internal temperature should ham reach?",
      answer: "Pre-cooked hams should be heated to an internal temperature of 140°F. Uncooked hams must reach 145°F, and country hams should reach 160°F for food safety.",
    },
    {
      question: "Should I cover ham while baking?",
      answer: "Yes, cover the ham with aluminum foil for most of the cooking time to prevent drying out. Remove the foil during the last 20-30 minutes to allow the glaze to caramelize.",
    },
  ],
  formula: "cook_time = weight_lbs × minutes_per_pound × temperature_adjustment_factor",
};

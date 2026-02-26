import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turkeyDefrostCalculator: CalculatorDefinition = {
  slug: "turkey-defrost-calculator",
  title: "Turkey Defrost Time Calculator",
  description:
    "Free turkey thawing/defrosting time calculator. Find out how long to defrost your turkey in the refrigerator or cold water based on weight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "turkey defrost time",
    "turkey thawing calculator",
    "how long defrost turkey",
    "thaw turkey refrigerator",
    "turkey cold water thaw",
    "defrost turkey time",
  ],
  variants: [
    {
      id: "refrigerator",
      name: "Refrigerator Thawing",
      description:
        "The safest method: thaw turkey in the refrigerator at 40\u00b0F or below",
      fields: [
        {
          name: "weight",
          label: "Turkey Weight (lbs)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        if (!weight || weight <= 0) return null;

        // USDA guideline: 24 hours per 4-5 lbs in refrigerator
        const days = Math.ceil(weight / 4);
        const hoursTotal = days * 24;

        return {
          primary: {
            label: `${formatNumber(weight, 1)} lb turkey (refrigerator)`,
            value: `${formatNumber(days)} days`,
          },
          details: [
            { label: "Total Days", value: formatNumber(days) },
            { label: "Total Hours", value: formatNumber(hoursTotal) },
            {
              label: "Start Defrosting By",
              value: `${formatNumber(days)} days before cooking`,
            },
            {
              label: "Safe After Thawing",
              value: "1-2 additional days in fridge",
            },
          ],
          note: "Keep turkey in its original packaging on a tray in the bottom of the refrigerator to catch drips. Thawed turkey can stay in the fridge 1-2 days before cooking.",
        };
      },
    },
    {
      id: "cold-water",
      name: "Cold Water Thawing",
      description:
        "Faster method: submerge turkey in cold water, changing water every 30 minutes",
      fields: [
        {
          name: "weight",
          label: "Turkey Weight (lbs)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        if (!weight || weight <= 0) return null;

        // USDA guideline: 30 minutes per pound in cold water
        const minutes = weight * 30;
        const hours = minutes / 60;
        const waterChanges = Math.ceil(minutes / 30);

        return {
          primary: {
            label: `${formatNumber(weight, 1)} lb turkey (cold water)`,
            value: `${formatNumber(hours, 1)} hours`,
          },
          details: [
            { label: "Total Hours", value: formatNumber(hours, 1) },
            { label: "Total Minutes", value: formatNumber(minutes) },
            {
              label: "Water Changes Needed",
              value: `Every 30 min (${formatNumber(waterChanges)} changes)`,
            },
          ],
          note: "Submerge turkey in leak-proof packaging in cold tap water. Change the water every 30 minutes. Cook immediately after thawing - do not refreeze.",
        };
      },
    },
    {
      id: "comparison",
      name: "Method Comparison",
      description: "Compare refrigerator and cold water thawing times",
      fields: [
        {
          name: "weight",
          label: "Turkey Weight (lbs)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        if (!weight || weight <= 0) return null;

        const fridgeDays = Math.ceil(weight / 4);
        const coldWaterHours = (weight * 30) / 60;
        const cookTimeHours = weight <= 12 ? weight * (15 / 60) : 12 * (15 / 60) + (weight - 12) * (12 / 60);

        return {
          primary: {
            label: `${formatNumber(weight, 1)} lb turkey`,
            value: `${formatNumber(fridgeDays)} days (fridge)`,
          },
          details: [
            {
              label: "Refrigerator Method",
              value: `${formatNumber(fridgeDays)} days`,
            },
            {
              label: "Cold Water Method",
              value: `${formatNumber(coldWaterHours, 1)} hours`,
            },
            {
              label: "Estimated Cook Time (325\u00b0F)",
              value: `${formatNumber(cookTimeHours, 1)} hours`,
            },
            {
              label: "Total Time (fridge + cook)",
              value: `${formatNumber(fridgeDays)} days + ${formatNumber(cookTimeHours, 1)} hrs`,
            },
          ],
          note: "Never thaw a turkey at room temperature. Both refrigerator and cold water methods keep the turkey at a safe temperature during thawing.",
        };
      },
    },
  ],
  relatedSlugs: [
    "turkey-size-calculator",
    "ham-per-person-calculator",
    "cooking-converter",
  ],
  faq: [
    {
      question: "How long does it take to thaw a turkey in the refrigerator?",
      answer:
        "Allow approximately 24 hours for every 4-5 pounds of turkey in the refrigerator (40\u00b0F). A 16 lb turkey takes about 4 days. This is the safest and most recommended method.",
    },
    {
      question: "Can I thaw a turkey at room temperature?",
      answer:
        "No. The USDA strongly advises against thawing turkey at room temperature. The outer meat reaches the 'danger zone' (40-140\u00b0F) too quickly, allowing bacteria to multiply. Use the refrigerator or cold water method instead.",
    },
  ],
  formula:
    "Refrigerator: Days = ceiling(Weight lbs / 4) | Cold Water: Hours = Weight lbs x 30 min / 60",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightingCalculator: CalculatorDefinition = {
  slug: "lighting-calculator",
  title: "Lighting Calculator",
  description:
    "Free lighting calculator. Estimate lumens needed by room type and calculate the number of bulbs required.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lighting", "lumens", "bulbs", "watts", "room light", "LED"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "sqft",
          label: "Room Size (sq ft)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "roomType",
          label: "Room Type",
          type: "select",
          options: [
            { label: "Kitchen", value: "kitchen" },
            { label: "Bedroom", value: "bedroom" },
            { label: "Bathroom", value: "bathroom" },
            { label: "Living Room", value: "living" },
            { label: "Office / Study", value: "office" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const roomType = inputs.roomType as string;
        if (!sqft || !roomType) return null;

        const lumensPerSqFt: Record<string, [number, number]> = {
          kitchen: [70, 80],
          bedroom: [30, 40],
          bathroom: [70, 80],
          living: [40, 50],
          office: [60, 70],
        };

        const range = lumensPerSqFt[roomType] || [40, 50];
        const minLumens = sqft * range[0];
        const maxLumens = sqft * range[1];
        const avgLumens = (minLumens + maxLumens) / 2;

        // Assume 800 lumens per LED bulb (60W equivalent)
        const bulbLumens = 800;
        const bulbsNeeded = Math.ceil(avgLumens / bulbLumens);

        return {
          primary: {
            label: "Lumens Needed",
            value: formatNumber(minLumens, 0) + " – " + formatNumber(maxLumens, 0),
          },
          details: [
            { label: "Room Area", value: formatNumber(sqft, 0) + " sq ft" },
            { label: "Lumens per Sq Ft", value: range[0] + " – " + range[1] },
            { label: "LED Bulbs Needed (800 lm each)", value: String(bulbsNeeded) },
            { label: "Equivalent Wattage (LED ~10W)", value: formatNumber(bulbsNeeded * 10, 0) + "W total" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-usage-calculator", "electrical-power-calculator"],
  faq: [
    {
      question: "How many lumens do I need per room?",
      answer:
        "Kitchens and bathrooms need 70-80 lumens/sq ft, living rooms 40-50, bedrooms 30-40, and offices 60-70.",
    },
    {
      question: "How do lumens relate to watts?",
      answer:
        "A standard 60W-equivalent LED bulb produces about 800 lumens while using only 8-10 watts.",
    },
  ],
  formula:
    "Lumens = Sq Ft × Lumens per Sq Ft (varies by room type). Bulbs = Total Lumens ÷ 800.",
};

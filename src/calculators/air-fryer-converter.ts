import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airFryerConverterCalculator: CalculatorDefinition = {
  slug: "air-fryer-converter-calculator",
  title: "Air Fryer Converter",
  description:
    "Free air fryer converter. Convert oven cooking times and temperatures to air fryer settings for perfect results every time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "air fryer converter",
    "oven to air fryer",
    "air fryer time",
    "air fryer temperature",
    "cooking conversion",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "ovenTemp",
          label: "Oven Temperature (°F)",
          type: "number",
          placeholder: "e.g. 400",
        },
        {
          name: "ovenTime",
          label: "Oven Cooking Time (minutes)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "foodType",
          label: "Food Type",
          type: "select",
          options: [
            { label: "Meats & Poultry", value: "meat" },
            { label: "Vegetables", value: "vegetable" },
            { label: "Frozen Foods", value: "frozen" },
            { label: "Baked Goods", value: "baked" },
          ],
        },
      ],
      calculate: (inputs) => {
        const ovenTemp = inputs.ovenTemp as number;
        const ovenTime = inputs.ovenTime as number;
        const foodType = inputs.foodType as string;
        if (!ovenTemp || ovenTemp <= 0 || !ovenTime || ovenTime <= 0) return null;

        const tempReduction = 25;
        const airFryerTemp = ovenTemp - tempReduction;
        const timeReduction: Record<string, number> = {
          meat: 0.75,
          vegetable: 0.70,
          frozen: 0.80,
          baked: 0.78,
        };
        const factor = timeReduction[foodType] || 0.75;
        const airFryerTime = Math.round(ovenTime * factor);
        const timeSaved = ovenTime - airFryerTime;

        return {
          primary: {
            label: "Air Fryer Temperature",
            value: formatNumber(airFryerTemp, 0) + " °F",
          },
          details: [
            { label: "Air Fryer Time", value: formatNumber(airFryerTime, 0) + " min" },
            { label: "Original Oven Temp", value: formatNumber(ovenTemp, 0) + " °F" },
            { label: "Original Oven Time", value: formatNumber(ovenTime, 0) + " min" },
            { label: "Time Saved", value: formatNumber(timeSaved, 0) + " min" },
            { label: "Temp Reduction", value: tempReduction + " °F" },
            { label: "Time Reduction", value: Math.round((1 - factor) * 100) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooking-temp-calculator", "meat-cooking-time-calculator"],
  faq: [
    {
      question: "How do I convert oven temperature to air fryer?",
      answer:
        "The general rule is to reduce the oven temperature by 25°F for the air fryer. So if a recipe calls for 400°F in the oven, set your air fryer to 375°F.",
    },
    {
      question: "How much faster does an air fryer cook compared to an oven?",
      answer:
        "Air fryers typically cook 20-30% faster than conventional ovens due to the concentrated circulating hot air. A dish that takes 30 minutes in the oven may only need 20-24 minutes in an air fryer.",
    },
  ],
  formula:
    "Air Fryer Temp = Oven Temp - 25°F. Air Fryer Time = Oven Time × reduction factor (meat 0.75, vegetables 0.70, frozen 0.80, baked goods 0.78).",
};

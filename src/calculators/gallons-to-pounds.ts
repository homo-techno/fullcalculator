import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gallonsToPoundsConverter: CalculatorDefinition = {
  slug: "gallons-to-pounds-converter",
  title: "Gallons to Pounds Converter",
  description: "Free gallons to pounds converter. Convert gallons to pounds based on liquid density. Supports water, milk, gasoline, and custom liquids.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gallons to pounds", "gal to lbs", "how much does a gallon weigh", "gallon of water weight", "liquid weight converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Gallons to Pounds",
      fields: [
        { name: "value", label: "Gallons (US)", type: "number", placeholder: "e.g. 5" },
        { name: "liquid", label: "Liquid Type", type: "select", options: [
          { label: "Water (8.345 lbs/gal)", value: "8.345" },
          { label: "Milk (8.6 lbs/gal)", value: "8.6" },
          { label: "Gasoline (6.073 lbs/gal)", value: "6.073" },
          { label: "Diesel (7.1 lbs/gal)", value: "7.1" },
          { label: "Honey (11.85 lbs/gal)", value: "11.85" },
          { label: "Olive Oil (7.67 lbs/gal)", value: "7.67" },
          { label: "Motor Oil (7.5 lbs/gal)", value: "7.5" },
          { label: "Custom", value: "custom" },
        ], defaultValue: "8.345" },
        { name: "customWeight", label: "Custom Weight (lbs/gal)", type: "number", placeholder: "e.g. 8.0" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const liquidStr = inputs.liquid as string;
        const customWeight = inputs.customWeight as number;
        if (value === undefined) return null;
        const lbsPerGal = liquidStr === "custom" ? (customWeight || 8.345) : parseFloat(liquidStr);
        const pounds = value * lbsPerGal;
        return {
          primary: { label: `${formatNumber(value)} gallons`, value: `${formatNumber(pounds, 2)} lbs` },
          details: [
            { label: "Pounds (lbs)", value: formatNumber(pounds, 3) },
            { label: "Kilograms (kg)", value: formatNumber(pounds * 0.453592, 3) },
            { label: "Ounces (oz)", value: formatNumber(pounds * 16, 1) },
            { label: "Liters", value: formatNumber(value * 3.78541, 3) },
            { label: "Density Used", value: `${formatNumber(lbsPerGal, 3)} lbs/gal` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "cubic-feet-to-gallons-converter", "volume-calculator"],
  faq: [
    { question: "How much does a gallon of water weigh?", answer: "A US gallon of water weighs approximately 8.345 pounds (3.785 kg) at room temperature (62\u00b0F / 17\u00b0C). The weight varies slightly with temperature." },
    { question: "How much does a gallon of gasoline weigh?", answer: "A US gallon of gasoline weighs approximately 6.073 pounds (2.755 kg). Gasoline is lighter than water because it has a lower density." },
  ],
  formula: "Weight (lbs) = Gallons × density (lbs/gal) | Water: 1 gal = 8.345 lbs | Gasoline: 1 gal = 6.073 lbs",
};

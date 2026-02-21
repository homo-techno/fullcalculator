import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const litersToGallonsConverter: CalculatorDefinition = {
  slug: "liters-to-gallons-converter",
  title: "Liters to Gallons Converter",
  description:
    "Free liters to gallons converter. Quickly convert liters to US gallons with our easy calculator. 1 liter = 0.264172 US gallons.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "liters to gallons",
    "l to gal",
    "liter to gallon",
    "convert liters to gallons",
    "liter converter",
  ],
  variants: [
    {
      id: "liters-to-gallons",
      name: "Liters to Gallons",
      fields: [
        {
          name: "liters",
          label: "Liters",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.liters as number;
        if (val === undefined || val === null) return null;
        const gallons = val * 0.264172;
        return {
          primary: {
            label: `${formatNumber(val, 4)} liters`,
            value: `${formatNumber(gallons, 4)} US gallons`,
          },
          details: [
            { label: "US Gallons", value: formatNumber(gallons, 4) },
            { label: "Imperial Gallons", value: formatNumber(val * 0.219969, 4) },
            { label: "Quarts", value: formatNumber(gallons * 4, 4) },
            { label: "Milliliters", value: formatNumber(val * 1000, 2) },
            { label: "Cups", value: formatNumber(val * 1000 / 236.588, 2) },
          ],
        };
      },
    },
    {
      id: "gallons-to-liters",
      name: "Gallons to Liters",
      fields: [
        {
          name: "gallons",
          label: "US Gallons",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.gallons as number;
        if (val === undefined || val === null) return null;
        const liters = val * 3.78541;
        return {
          primary: {
            label: `${formatNumber(val, 4)} US gallons`,
            value: `${formatNumber(liters, 4)} liters`,
          },
          details: [
            { label: "Liters", value: formatNumber(liters, 4) },
            { label: "Milliliters", value: formatNumber(liters * 1000, 2) },
            { label: "Quarts", value: formatNumber(val * 4, 2) },
            { label: "Cups", value: formatNumber(val * 16, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "gallons-to-liters-converter",
    "cups-to-ml-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many gallons in a liter?",
      answer:
        "1 liter = 0.264172 US gallons. Note that 1 liter = 0.219969 imperial gallons (UK).",
    },
    {
      question: "How do I convert liters to gallons?",
      answer:
        "Multiply the number of liters by 0.264172. For example, 10 liters = 10 × 0.264172 = 2.6417 US gallons.",
    },
  ],
  formula: "US gallons = liters × 0.264172",
};

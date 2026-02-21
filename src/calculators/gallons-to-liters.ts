import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gallonsToLitersConverter: CalculatorDefinition = {
  slug: "gallons-to-liters-converter",
  title: "Gallons to Liters Converter",
  description:
    "Free gallons to liters converter. Quickly convert US gallons to liters with our easy calculator. 1 US gallon = 3.78541 liters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "gallons to liters",
    "gal to l",
    "gallon to liter",
    "convert gallons to liters",
    "gallon converter",
  ],
  variants: [
    {
      id: "gallons-to-liters",
      name: "Gallons to Liters",
      fields: [
        {
          name: "gallons",
          label: "US Gallons",
          type: "number",
          placeholder: "e.g. 5",
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
            { label: "Fluid Ounces", value: formatNumber(val * 128, 2) },
          ],
        };
      },
    },
    {
      id: "liters-to-gallons",
      name: "Liters to Gallons",
      fields: [
        {
          name: "liters",
          label: "Liters",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.liters as number;
        if (val === undefined || val === null) return null;
        const gallons = val / 3.78541;
        return {
          primary: {
            label: `${formatNumber(val, 4)} liters`,
            value: `${formatNumber(gallons, 4)} US gallons`,
          },
          details: [
            { label: "US Gallons", value: formatNumber(gallons, 4) },
            { label: "Quarts", value: formatNumber(gallons * 4, 2) },
            { label: "Milliliters", value: formatNumber(val * 1000, 2) },
            { label: "Cups", value: formatNumber(gallons * 16, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "liters-to-gallons-converter",
    "cups-to-ml-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many liters in a gallon?",
      answer:
        "1 US gallon = 3.78541 liters. Note that 1 imperial gallon (UK) = 4.54609 liters.",
    },
    {
      question: "How do I convert gallons to liters?",
      answer:
        "Multiply the number of US gallons by 3.78541. For example, 5 gallons = 5 × 3.78541 = 18.927 liters.",
    },
  ],
  formula: "liters = US gallons × 3.78541",
};

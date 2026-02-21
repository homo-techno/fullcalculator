import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quartsToLitersConverter: CalculatorDefinition = {
  slug: "quarts-to-liters-converter",
  title: "Quarts to Liters Converter",
  description:
    "Free quarts to liters converter. Quickly convert US quarts to liters with our easy calculator. 1 US quart = 0.946353 liters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "quarts to liters",
    "quart to liter",
    "volume converter",
    "liquid converter",
    "quart converter",
  ],
  variants: [
    {
      id: "quarts-to-liters",
      name: "Quarts to Liters",
      fields: [
        {
          name: "quarts",
          label: "US Quarts",
          type: "number",
          placeholder: "e.g. 4",
        },
      ],
      calculate: (inputs) => {
        const quarts = inputs.quarts as number;
        if (quarts === undefined || quarts === null) return null;
        const liters = quarts * 0.946353;
        const ml = liters * 1000;
        const gallons = quarts / 4;
        const pints = quarts * 2;
        const cups = quarts * 4;
        return {
          primary: {
            label: `${formatNumber(quarts, 4)} quarts`,
            value: `${formatNumber(liters, 4)} liters`,
          },
          details: [
            { label: "Liters", value: formatNumber(liters, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
            { label: "Gallons", value: formatNumber(gallons, 4) },
            { label: "Pints", value: formatNumber(pints, 2) },
            { label: "Cups", value: formatNumber(cups, 2) },
          ],
        };
      },
    },
    {
      id: "liters-to-quarts",
      name: "Liters to Quarts",
      fields: [
        {
          name: "liters",
          label: "Liters",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const liters = inputs.liters as number;
        if (liters === undefined || liters === null) return null;
        const quarts = liters / 0.946353;
        const ml = liters * 1000;
        const gallons = quarts / 4;
        const pints = quarts * 2;
        return {
          primary: {
            label: `${formatNumber(liters, 4)} liters`,
            value: `${formatNumber(quarts, 4)} quarts`,
          },
          details: [
            { label: "US Quarts", value: formatNumber(quarts, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
            { label: "Gallons", value: formatNumber(gallons, 4) },
            { label: "Pints", value: formatNumber(pints, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pints-to-liters-converter", "fluid-ounces-to-ml-converter", "unit-converter"],
  faq: [
    {
      question: "How many liters is 1 US quart?",
      answer:
        "1 US quart equals 0.946353 liters (approximately 946 mL). A US quart is made up of 2 pints or 4 cups.",
    },
    {
      question: "How do I convert quarts to liters?",
      answer:
        "Multiply the number of US quarts by 0.946353. For example, 4 quarts (1 gallon) = 4 × 0.946353 = 3.7854 liters.",
    },
  ],
  formula: "liters = quarts × 0.946353 | quarts = liters / 0.946353",
};

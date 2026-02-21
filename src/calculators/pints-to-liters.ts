import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pintsToLitersConverter: CalculatorDefinition = {
  slug: "pints-to-liters-converter",
  title: "Pints to Liters Converter",
  description:
    "Free pints to liters converter. Quickly convert US pints to liters with our easy calculator. 1 US pint = 0.473176 liters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "pints to liters",
    "pint to liter",
    "volume converter",
    "liquid converter",
    "pint converter",
  ],
  variants: [
    {
      id: "pints-to-liters",
      name: "Pints to Liters",
      fields: [
        {
          name: "pints",
          label: "US Pints",
          type: "number",
          placeholder: "e.g. 4",
        },
      ],
      calculate: (inputs) => {
        const pints = inputs.pints as number;
        if (pints === undefined || pints === null) return null;
        const liters = pints * 0.473176;
        const ml = liters * 1000;
        const gallons = pints / 8;
        const quarts = pints / 2;
        const cups = pints * 2;
        return {
          primary: {
            label: `${formatNumber(pints, 4)} pints`,
            value: `${formatNumber(liters, 4)} liters`,
          },
          details: [
            { label: "Liters", value: formatNumber(liters, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
            { label: "Gallons", value: formatNumber(gallons, 4) },
            { label: "Quarts", value: formatNumber(quarts, 4) },
            { label: "Cups", value: formatNumber(cups, 2) },
          ],
        };
      },
    },
    {
      id: "liters-to-pints",
      name: "Liters to Pints",
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
        const pints = liters / 0.473176;
        const ml = liters * 1000;
        const gallons = pints / 8;
        const quarts = pints / 2;
        return {
          primary: {
            label: `${formatNumber(liters, 4)} liters`,
            value: `${formatNumber(pints, 4)} pints`,
          },
          details: [
            { label: "US Pints", value: formatNumber(pints, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
            { label: "Gallons", value: formatNumber(gallons, 4) },
            { label: "Quarts", value: formatNumber(quarts, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["quarts-to-liters-converter", "fluid-ounces-to-ml-converter", "unit-converter"],
  faq: [
    {
      question: "How many liters is 1 US pint?",
      answer:
        "1 US pint equals 0.473176 liters (approximately 473 mL). Note that an Imperial (UK) pint is larger at 0.568261 liters.",
    },
    {
      question: "How do I convert pints to liters?",
      answer:
        "Multiply the number of US pints by 0.473176. For example, 4 pints = 4 × 0.473176 = 1.8927 liters.",
    },
  ],
  formula: "liters = pints × 0.473176 | pints = liters / 0.473176",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pintsToCupsConverter: CalculatorDefinition = {
  slug: "pints-to-cups-converter",
  title: "Pints to Cups Converter",
  description: "Free pints to cups converter. Convert pints to cups instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pints to cups","pt to cups","pint cup converter","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Pints to Cups Converter",
      fields: [
        { name: "value", label: "Pints (pt)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const cups = value * 2;
        return {
          primary: { label: `${formatNumber(value)} pt`, value: `${formatNumber(cups, 4)} cups` },
          details: [
            { label: "Cups", value: formatNumber(cups, 2) },
            { label: "Fluid Ounces", value: formatNumber(value * 16, 2) },
            { label: "Liters", value: formatNumber(value * 0.473176, 4) },
            { label: "Formula", value: "pt x 2 = cups" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cups-to-pints-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How many cups in a pint?", answer: "There are 2 cups in 1 pint. Multiply pints by 2 to get cups." },
  ],
  formula: "1 pt = 2 cups | cups = pt x 2",
};

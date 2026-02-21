import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flOzToMlConverter: CalculatorDefinition = {
  slug: "fluid-ounces-to-ml-converter",
  title: "Fluid Ounces to mL Converter",
  description:
    "Free fluid ounces to milliliters converter. Quickly convert fl oz to mL with our easy calculator. 1 fl oz = 29.5735 mL.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "fluid ounces to ml",
    "fl oz to ml",
    "ounces to milliliters",
    "volume converter",
    "liquid converter",
  ],
  variants: [
    {
      id: "floz-to-ml",
      name: "Fluid Ounces to mL",
      fields: [
        {
          name: "floz",
          label: "Fluid Ounces (fl oz)",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const floz = inputs.floz as number;
        if (floz === undefined || floz === null) return null;
        const ml = floz * 29.5735;
        const liters = ml / 1000;
        const cups = floz / 8;
        const tbsp = floz * 2;
        return {
          primary: {
            label: `${formatNumber(floz, 4)} fl oz`,
            value: `${formatNumber(ml, 4)} mL`,
          },
          details: [
            { label: "Milliliters", value: formatNumber(ml, 4) },
            { label: "Liters", value: formatNumber(liters, 6) },
            { label: "Cups", value: formatNumber(cups, 4) },
            { label: "Tablespoons", value: formatNumber(tbsp, 2) },
          ],
        };
      },
    },
    {
      id: "ml-to-floz",
      name: "mL to Fluid Ounces",
      fields: [
        {
          name: "ml",
          label: "Milliliters (mL)",
          type: "number",
          placeholder: "e.g. 250",
        },
      ],
      calculate: (inputs) => {
        const ml = inputs.ml as number;
        if (ml === undefined || ml === null) return null;
        const floz = ml / 29.5735;
        const liters = ml / 1000;
        const cups = floz / 8;
        return {
          primary: {
            label: `${formatNumber(ml, 4)} mL`,
            value: `${formatNumber(floz, 4)} fl oz`,
          },
          details: [
            { label: "Fluid Ounces", value: formatNumber(floz, 4) },
            { label: "Liters", value: formatNumber(liters, 6) },
            { label: "Cups", value: formatNumber(cups, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tablespoons-to-cups-converter", "pints-to-liters-converter", "unit-converter"],
  faq: [
    {
      question: "How many mL is 1 fluid ounce?",
      answer:
        "1 US fluid ounce equals 29.5735 milliliters. Note that the UK (Imperial) fluid ounce is slightly different at 28.4131 mL.",
    },
    {
      question: "How do I convert fluid ounces to mL?",
      answer:
        "Multiply the number of fluid ounces by 29.5735. For example, 8 fl oz = 8 × 29.5735 = 236.59 mL.",
    },
  ],
  formula: "mL = fl oz × 29.5735 | fl oz = mL / 29.5735",
};

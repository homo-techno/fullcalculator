import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ozToCupsConverter: CalculatorDefinition = {
  slug: "oz-to-cups-converter",
  title: "Ounces to Cups Converter",
  description:
    "Free ounces to cups converter. Instantly convert fluid oz to cups with formula and examples. Formula: cups = fl oz ÷ 8.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "ounces to cups",
    "oz to cups",
    "fluid ounces to cups",
    "convert oz to cups",
    "cooking conversion",
  ],
  variants: [
    {
      id: "oz-to-cups",
      name: "Ounces to Cups",
      fields: [
        {
          name: "ounces",
          label: "Fluid Ounces (fl oz)",
          type: "number",
          placeholder: "e.g. 16",
        },
      ],
      calculate: (inputs) => {
        const oz = inputs.ounces as number;
        if (oz === undefined || oz === null) return null;
        const cups = oz / 8;
        const ml = oz * 29.5735;
        const tablespoons = oz * 2;
        return {
          primary: {
            label: `${formatNumber(oz, 2)} fl oz`,
            value: `${formatNumber(cups, 4)} cups`,
          },
          details: [
            { label: "Cups", value: formatNumber(cups, 4) },
            { label: "Milliliters", value: `${formatNumber(ml, 2)} mL` },
            { label: "Tablespoons", value: formatNumber(tablespoons, 2) },
            { label: "Formula", value: "cups = fl oz ÷ 8" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cups-to-oz-converter",
    "cups-to-ml-converter",
    "fluid-ounces-to-ml-converter",
    "cooking-calculator",
  ],
  faq: [
    {
      question: "How many ounces in a cup?",
      answer:
        "There are 8 fluid ounces in 1 US cup. To convert ounces to cups, divide the number of fluid ounces by 8.",
    },
    {
      question: "How many cups is 16 oz?",
      answer:
        "16 fluid ounces = 2 cups. Since 1 cup = 8 fl oz, divide 16 by 8 to get 2 cups.",
    },
  ],
  formula: "cups = fl oz ÷ 8",
};

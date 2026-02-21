import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mlToTbspConverter: CalculatorDefinition = {
  slug: "ml-to-tbsp-converter",
  title: "mL to Tablespoons Converter",
  description:
    "Free milliliters to tablespoons converter. Instantly convert mL to tbsp with formula and examples. Formula: tbsp = mL ÷ 14.787.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "ml to tablespoons",
    "ml to tbsp",
    "milliliters to tablespoons",
    "convert ml to tbsp",
    "cooking conversion",
  ],
  variants: [
    {
      id: "ml-to-tbsp",
      name: "Milliliters to Tablespoons",
      fields: [
        {
          name: "ml",
          label: "Milliliters (mL)",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const ml = inputs.ml as number;
        if (ml === undefined || ml === null) return null;
        const tbsp = ml / 14.787;
        const tsp = ml / 4.929;
        const flOz = ml / 29.5735;
        return {
          primary: {
            label: `${formatNumber(ml, 2)} mL`,
            value: `${formatNumber(tbsp, 4)} tbsp`,
          },
          details: [
            { label: "Tablespoons", value: formatNumber(tbsp, 4) },
            { label: "Teaspoons", value: formatNumber(tsp, 4) },
            { label: "Fluid Ounces", value: `${formatNumber(flOz, 4)} fl oz` },
            { label: "Formula", value: "tbsp = mL ÷ 14.787" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "tbsp-to-ml-converter",
    "teaspoons-to-tablespoons-converter",
    "cups-to-ml-converter",
    "cooking-calculator",
  ],
  faq: [
    {
      question: "How many tablespoons in a mL?",
      answer:
        "1 mL = 0.0676 tablespoons. To convert mL to tablespoons, divide by 14.787.",
    },
    {
      question: "How many tablespoons is 15 mL?",
      answer:
        "15 mL ≈ 1.014 tablespoons, which is approximately 1 tablespoon.",
    },
  ],
  formula: "tbsp = mL ÷ 14.787",
};

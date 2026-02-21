import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stonesToPoundsConverter: CalculatorDefinition = {
  slug: "stones-to-pounds-converter",
  title: "Stones to Pounds Converter",
  description:
    "Free stones to pounds converter. Quickly convert stones to lbs with our easy calculator. 1 stone = 14 pounds.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "stones to pounds",
    "stone to lbs",
    "st to lbs",
    "convert stones to pounds",
    "stone converter",
  ],
  variants: [
    {
      id: "stones-to-pounds",
      name: "Stones to Pounds",
      fields: [
        {
          name: "stones",
          label: "Stones",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.stones as number;
        if (val === undefined || val === null) return null;
        const pounds = val * 14;
        return {
          primary: {
            label: `${formatNumber(val, 4)} stones`,
            value: `${formatNumber(pounds, 2)} lbs`,
          },
          details: [
            { label: "Pounds", value: formatNumber(pounds, 2) },
            { label: "Kilograms", value: formatNumber(val * 6.35029, 4) },
            { label: "Ounces", value: formatNumber(pounds * 16, 2) },
            { label: "Grams", value: formatNumber(val * 6350.29, 2) },
          ],
        };
      },
    },
    {
      id: "pounds-to-stones",
      name: "Pounds to Stones",
      fields: [
        {
          name: "pounds",
          label: "Pounds",
          type: "number",
          placeholder: "e.g. 150",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.pounds as number;
        if (val === undefined || val === null) return null;
        const stones = val / 14;
        const wholeStones = Math.floor(stones);
        const remainingPounds = val - wholeStones * 14;
        return {
          primary: {
            label: `${formatNumber(val, 2)} lbs`,
            value: `${formatNumber(stones, 4)} stones`,
          },
          details: [
            { label: "Stones", value: formatNumber(stones, 4) },
            { label: "Stones & Pounds", value: `${wholeStones} st ${formatNumber(remainingPounds, 1)} lbs` },
            { label: "Kilograms", value: formatNumber(val * 0.453592, 4) },
            { label: "Ounces", value: formatNumber(val * 16, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "stones-to-kg-converter",
    "pounds-to-kg-converter",
    "kg-to-pounds-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many pounds in a stone?",
      answer:
        "1 stone = 14 pounds exactly. The stone is a unit of weight commonly used in the UK and Ireland.",
    },
    {
      question: "How do I convert stones to pounds?",
      answer:
        "Multiply the number of stones by 14. For example, 10 stones = 10 × 14 = 140 pounds.",
    },
  ],
  formula: "pounds = stones × 14",
};

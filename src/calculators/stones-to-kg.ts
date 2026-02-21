import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stonesToKgConverter: CalculatorDefinition = {
  slug: "stones-to-kg-converter",
  title: "Stones to KG Converter",
  description:
    "Free stones to kilograms converter. Quickly convert stones to kg with our easy calculator. 1 stone = 6.35029 kg.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "stones to kg",
    "stone to kilograms",
    "st to kg",
    "convert stones to kg",
    "stone to kg converter",
  ],
  variants: [
    {
      id: "stones-to-kg",
      name: "Stones to Kilograms",
      fields: [
        {
          name: "stones",
          label: "Stones",
          type: "number",
          placeholder: "e.g. 12",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.stones as number;
        if (val === undefined || val === null) return null;
        const kg = val * 6.35029;
        return {
          primary: {
            label: `${formatNumber(val, 4)} stones`,
            value: `${formatNumber(kg, 4)} kg`,
          },
          details: [
            { label: "Kilograms", value: formatNumber(kg, 4) },
            { label: "Grams", value: formatNumber(kg * 1000, 2) },
            { label: "Pounds", value: formatNumber(val * 14, 2) },
            { label: "Ounces", value: formatNumber(val * 14 * 16, 2) },
          ],
        };
      },
    },
    {
      id: "kg-to-stones",
      name: "Kilograms to Stones",
      fields: [
        {
          name: "kg",
          label: "Kilograms",
          type: "number",
          placeholder: "e.g. 75",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.kg as number;
        if (val === undefined || val === null) return null;
        const stones = val / 6.35029;
        const wholeStones = Math.floor(stones);
        const remainingPounds = (stones - wholeStones) * 14;
        return {
          primary: {
            label: `${formatNumber(val, 4)} kg`,
            value: `${formatNumber(stones, 4)} stones`,
          },
          details: [
            { label: "Stones", value: formatNumber(stones, 4) },
            { label: "Stones & Pounds", value: `${wholeStones} st ${formatNumber(remainingPounds, 1)} lbs` },
            { label: "Pounds", value: formatNumber(val * 2.20462, 4) },
            { label: "Grams", value: formatNumber(val * 1000, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "stones-to-pounds-converter",
    "kg-to-pounds-converter",
    "pounds-to-kg-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many kg in a stone?",
      answer:
        "1 stone = 6.35029 kilograms. The stone is a unit of weight commonly used in the UK and Ireland for body weight.",
    },
    {
      question: "How do I convert stones to kg?",
      answer:
        "Multiply the number of stones by 6.35029. For example, 12 stones = 12 × 6.35029 = 76.203 kg.",
    },
  ],
  formula: "kg = stones × 6.35029",
};

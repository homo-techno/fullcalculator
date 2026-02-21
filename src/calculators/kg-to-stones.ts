import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kgToStonesConverter: CalculatorDefinition = {
  slug: "kg-to-stones-converter",
  title: "KG to Stones Converter",
  description:
    "Free kilograms to stones converter. Instantly convert kg to stones with formula and examples. Formula: stones = kg ÷ 6.35029.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "kg to stones",
    "kilograms to stones",
    "kg to st",
    "convert kg to stones",
    "weight conversion",
  ],
  variants: [
    {
      id: "kg-to-stones",
      name: "Kilograms to Stones",
      fields: [
        {
          name: "kg",
          label: "Kilograms (kg)",
          type: "number",
          placeholder: "e.g. 75",
        },
      ],
      calculate: (inputs) => {
        const kg = inputs.kg as number;
        if (kg === undefined || kg === null) return null;
        const stones = kg / 6.35029;
        const wholeStones = Math.floor(stones);
        const remainingPounds = (stones - wholeStones) * 14;
        const pounds = kg * 2.20462;
        return {
          primary: {
            label: `${formatNumber(kg, 2)} kg`,
            value: `${formatNumber(stones, 4)} stones`,
          },
          details: [
            { label: "Stones", value: formatNumber(stones, 4) },
            { label: "Stones & Pounds", value: `${wholeStones} st ${formatNumber(remainingPounds, 1)} lbs` },
            { label: "Pounds", value: formatNumber(pounds, 4) },
            { label: "Formula", value: "stones = kg ÷ 6.35029" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "stones-to-kg-converter",
    "kg-to-pounds-converter",
    "pounds-to-kg-converter",
    "weight-converter",
  ],
  faq: [
    {
      question: "How do you convert kg to stones?",
      answer:
        "Divide the kilogram value by 6.35029. For example, 75 kg = 75 ÷ 6.35029 ≈ 11.81 stones.",
    },
    {
      question: "How many stones is 100 kg?",
      answer:
        "100 kg ≈ 15.747 stones, or about 15 stones and 10.5 pounds.",
    },
  ],
  formula: "stones = kg ÷ 6.35029",
};

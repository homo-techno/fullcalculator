import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garlicConverterCalculator: CalculatorDefinition = {
  slug: "garlic-converter",
  title: "Garlic Clove to Powder/Minced Converter",
  description: "Free online garlic converter. Convert between garlic cloves, minced garlic, garlic powder, garlic salt, and garlic flakes.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["garlic converter", "garlic cloves to powder", "minced garlic conversion", "garlic substitute", "garlic measurement"],
  variants: [
    {
      id: "cloves-to-others",
      name: "Garlic Cloves to Other Forms",
      fields: [
        { name: "cloves", label: "Number of Garlic Cloves", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const cloves = parseFloat(inputs.cloves as string) || 0;

        // Per 1 clove of garlic:
        const mincedTsp = cloves * 0.5;
        const powderTsp = cloves * 0.125; // 1/8 tsp per clove
        const saltTsp = cloves * 0.5;
        const flakesTsp = cloves * 0.5;
        const pastesTsp = cloves * 0.5;
        const grams = cloves * 3; // average clove ~3g

        return {
          primary: { label: "Minced Garlic", value: `${formatNumber(mincedTsp)} tsp` },
          details: [
            { label: "Garlic Powder", value: `${formatNumber(powderTsp)} tsp` },
            { label: "Garlic Salt", value: `${formatNumber(saltTsp)} tsp` },
            { label: "Garlic Flakes / Granulated", value: `${formatNumber(flakesTsp)} tsp` },
            { label: "Garlic Paste", value: `${formatNumber(pastesTsp)} tsp` },
            { label: "Weight", value: `${formatNumber(grams)} g` },
            { label: "Cloves", value: formatNumber(cloves) },
          ],
        };
      },
    },
    {
      id: "powder-to-cloves",
      name: "Other Forms to Cloves",
      fields: [
        { name: "amount", label: "Amount (teaspoons)", type: "number", placeholder: "e.g. 1", step: 0.25 },
        {
          name: "form",
          label: "Garlic Form",
          type: "select",
          options: [
            { label: "Garlic Powder", value: "powder" },
            { label: "Minced Garlic (jar)", value: "minced" },
            { label: "Garlic Salt", value: "salt" },
            { label: "Garlic Flakes / Granulated", value: "flakes" },
            { label: "Garlic Paste", value: "paste" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = parseFloat(inputs.amount as string) || 0;
        const form = inputs.form as string;

        // Cloves equivalent per teaspoon of each form
        const clovesPerTsp: Record<string, number> = {
          powder: 8,    // 1 tsp powder = 8 cloves
          minced: 2,    // 1 tsp minced = 2 cloves
          salt: 2,      // 1 tsp garlic salt = 2 cloves
          flakes: 2,    // 1 tsp flakes = 2 cloves
          paste: 2,     // 1 tsp paste = 2 cloves
        };

        const factor = clovesPerTsp[form] || 2;
        const cloves = amount * factor;
        const grams = cloves * 3;
        const mincedTsp = cloves * 0.5;
        const powderTsp = cloves * 0.125;

        return {
          primary: { label: "Garlic Cloves", value: formatNumber(cloves) },
          details: [
            { label: "Minced Garlic", value: `${formatNumber(mincedTsp)} tsp` },
            { label: "Garlic Powder", value: `${formatNumber(powderTsp)} tsp` },
            { label: "Fresh Garlic Weight", value: `${formatNumber(grams)} g` },
            { label: "Input Amount", value: `${formatNumber(amount)} tsp` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fresh-to-dry-herb", "grams-to-tablespoons", "grams-to-cups"],
  faq: [
    {
      question: "How much garlic powder equals one clove?",
      answer: "One clove of garlic equals approximately 1/8 teaspoon of garlic powder. So 1 teaspoon of garlic powder equals about 8 cloves of garlic.",
    },
    {
      question: "How much minced garlic equals one clove?",
      answer: "One clove of garlic produces approximately 1/2 teaspoon of minced garlic. A standard jar of minced garlic uses the same ratio.",
    },
    {
      question: "Can I substitute garlic powder for fresh garlic?",
      answer: "Yes, but the flavor will be different. Garlic powder has a milder, more uniform flavor compared to fresh garlic. Use 1/8 teaspoon of garlic powder per clove of fresh garlic called for in the recipe.",
    },
  ],
  formula: "1 clove = 1/2 tsp minced = 1/8 tsp powder = 1/2 tsp garlic salt",
};

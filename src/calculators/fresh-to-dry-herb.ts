import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freshToDryHerbCalculator: CalculatorDefinition = {
  slug: "fresh-to-dry-herb",
  title: "Fresh to Dry Herb Conversion Calculator",
  description: "Free online fresh to dry herb conversion calculator. Convert between fresh and dried herbs for any recipe.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["fresh to dry herb", "herb conversion", "dried herbs", "fresh herbs", "herb substitute", "cooking conversion"],
  variants: [
    {
      id: "fresh-to-dry",
      name: "Fresh to Dried Herbs",
      fields: [
        { name: "amount", label: "Fresh Herb Amount (tablespoons)", type: "number", placeholder: "e.g. 3" },
        {
          name: "herb",
          label: "Herb",
          type: "select",
          options: [
            { label: "Basil", value: "basil" },
            { label: "Oregano", value: "oregano" },
            { label: "Thyme", value: "thyme" },
            { label: "Rosemary", value: "rosemary" },
            { label: "Parsley", value: "parsley" },
            { label: "Cilantro", value: "cilantro" },
            { label: "Dill", value: "dill" },
            { label: "Sage", value: "sage" },
            { label: "Tarragon", value: "tarragon" },
            { label: "Mint", value: "mint" },
            { label: "Chives", value: "chives" },
            { label: "Marjoram", value: "marjoram" },
          ],
        },
      ],
      calculate: (inputs) => {
        const freshTbsp = parseFloat(inputs.amount as string) || 0;
        const herb = inputs.herb as string;

        // Most herbs follow the standard 3:1 ratio, some vary
        const ratios: Record<string, number> = {
          basil: 3,
          oregano: 3,
          thyme: 3,
          rosemary: 3,
          parsley: 4,
          cilantro: 4,
          dill: 3,
          sage: 3,
          tarragon: 3,
          mint: 3,
          chives: 4,
          marjoram: 3,
        };

        const ratio = ratios[herb] || 3;
        const driedTbsp = freshTbsp / ratio;
        const driedTsp = driedTbsp * 3;
        const freshTsp = freshTbsp * 3;

        return {
          primary: { label: "Dried Herb (tbsp)", value: formatNumber(driedTbsp) },
          details: [
            { label: "Fresh Herb (tbsp)", value: formatNumber(freshTbsp) },
            { label: "Dried Herb (tsp)", value: formatNumber(driedTsp) },
            { label: "Fresh Herb (tsp)", value: formatNumber(freshTsp) },
            { label: "Fresh-to-Dry Ratio", value: `${ratio}:1` },
          ],
        };
      },
    },
    {
      id: "dry-to-fresh",
      name: "Dried to Fresh Herbs",
      fields: [
        { name: "amount", label: "Dried Herb Amount (teaspoons)", type: "number", placeholder: "e.g. 1" },
        {
          name: "herb",
          label: "Herb",
          type: "select",
          options: [
            { label: "Basil", value: "basil" },
            { label: "Oregano", value: "oregano" },
            { label: "Thyme", value: "thyme" },
            { label: "Rosemary", value: "rosemary" },
            { label: "Parsley", value: "parsley" },
            { label: "Cilantro", value: "cilantro" },
            { label: "Dill", value: "dill" },
            { label: "Sage", value: "sage" },
            { label: "Tarragon", value: "tarragon" },
            { label: "Mint", value: "mint" },
          ],
        },
      ],
      calculate: (inputs) => {
        const driedTsp = parseFloat(inputs.amount as string) || 0;
        const herb = inputs.herb as string;

        const ratios: Record<string, number> = {
          basil: 3,
          oregano: 3,
          thyme: 3,
          rosemary: 3,
          parsley: 4,
          cilantro: 4,
          dill: 3,
          sage: 3,
          tarragon: 3,
          mint: 3,
        };

        const ratio = ratios[herb] || 3;
        const freshTsp = driedTsp * ratio;
        const freshTbsp = freshTsp / 3;
        const driedTbsp = driedTsp / 3;

        return {
          primary: { label: "Fresh Herb (tsp)", value: formatNumber(freshTsp) },
          details: [
            { label: "Dried Herb (tsp)", value: formatNumber(driedTsp) },
            { label: "Fresh Herb (tbsp)", value: formatNumber(freshTbsp) },
            { label: "Dried Herb (tbsp)", value: formatNumber(driedTbsp) },
            { label: "Dry-to-Fresh Ratio", value: `1:${ratio}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-tablespoons", "grams-to-cups", "garlic-converter"],
  faq: [
    {
      question: "What is the general fresh to dried herb ratio?",
      answer: "The standard ratio is 3:1 — use one-third the amount of dried herb as you would fresh. For example, if a recipe calls for 3 tablespoons of fresh basil, use 1 tablespoon of dried basil.",
    },
    {
      question: "Are dried herbs stronger than fresh?",
      answer: "Yes. Dried herbs are more concentrated in flavor because the water has been removed. That is why you use less dried herb compared to fresh.",
    },
    {
      question: "Can you always substitute dried for fresh herbs?",
      answer: "In most cooked dishes, yes. However, for garnishes, salads, or dishes where fresh flavor and texture are important (like pesto), dried herbs are not an ideal substitute.",
    },
  ],
  formula: "dried_amount = fresh_amount / ratio (typically 3:1 fresh-to-dry)",
};

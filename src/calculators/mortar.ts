import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortarCalculator: CalculatorDefinition = {
  slug: "mortar-calculator",
  title: "Mortar Calculator",
  description:
    "Free mortar calculator. Estimate bags of mortar mix needed based on brick count or block wall area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mortar", "mortar mix", "bricklaying", "masonry", "cement"],
  variants: [
    {
      id: "by-bricks",
      name: "By Brick Count",
      fields: [
        {
          name: "bricks",
          label: "Number of Bricks",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const bricks = inputs.bricks as number;
        if (!bricks) return null;

        // ~7 bags per 1000 bricks (80 lb bags)
        const bagsNeeded = Math.ceil((bricks / 1000) * 7);
        const mortarCuFt = bricks * 0.006; // approx 0.006 cu ft mortar per brick

        return {
          primary: {
            label: "Bags of Mortar Mix (80 lb)",
            value: String(bagsNeeded),
          },
          details: [
            { label: "Number of Bricks", value: formatNumber(bricks, 0) },
            { label: "Mortar Volume", value: formatNumber(mortarCuFt, 1) + " cu ft" },
            { label: "Rate", value: "~7 bags per 1,000 bricks" },
          ],
        };
      },
    },
    {
      id: "by-area",
      name: "By Wall Area",
      fields: [
        {
          name: "area",
          label: "Wall Area (sq ft)",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        if (!area) return null;

        // ~7 bricks per sq ft, ~7 bags per 1000 bricks
        const estimatedBricks = area * 7;
        const bagsNeeded = Math.ceil((estimatedBricks / 1000) * 7);

        return {
          primary: {
            label: "Bags of Mortar Mix (80 lb)",
            value: String(bagsNeeded),
          },
          details: [
            { label: "Wall Area", value: formatNumber(area, 0) + " sq ft" },
            { label: "Estimated Bricks", value: formatNumber(estimatedBricks, 0) },
            { label: "Rate", value: "~7 bricks/sq ft, ~7 bags/1,000 bricks" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["brick-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How many bags of mortar per 1000 bricks?",
      answer:
        "You need approximately 7 bags of 80-pound mortar mix for every 1,000 standard bricks with 3/8-inch joints.",
    },
    {
      question: "What type of mortar should I use?",
      answer:
        "Type N mortar is the most common for general masonry. Type S is stronger and used for below-grade or structural work.",
    },
  ],
  formula:
    "Bags = (Number of Bricks ÷ 1,000) × 7 (for 80 lb bags). By area: Bricks = Area × 7.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brickCalculator: CalculatorDefinition = {
  slug: "brick-calculator",
  title: "Brick Calculator",
  description:
    "Free brick calculator. Estimate bricks needed for a wall including mortar joints and 5% waste factor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["brick", "masonry", "wall", "mortar", "construction"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Wall Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "height",
          label: "Wall Height (feet)",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = inputs.height as number;
        if (!length || !height) return null;

        const wallArea = length * height;
        const bricksPerSqFt = 7;
        const bricksBase = wallArea * bricksPerSqFt;
        const bricksWithWaste = Math.ceil(bricksBase * 1.05);

        return {
          primary: {
            label: "Bricks Needed (with 5% waste)",
            value: formatNumber(bricksWithWaste, 0),
          },
          details: [
            { label: "Wall Area", value: formatNumber(wallArea, 1) + " sq ft" },
            { label: "Bricks (no waste)", value: formatNumber(bricksBase, 0) },
            { label: "Waste Added (5%)", value: formatNumber(bricksBase * 0.05, 0) + " bricks" },
            { label: "Brick Size", value: '8" × 2.25" × 4" (standard)' },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortar-calculator", "retaining-wall-calculator"],
  faq: [
    {
      question: "How many bricks per square foot?",
      answer:
        "With standard bricks (8×2.25×4 inches) and 3/8-inch mortar joints, approximately 7 bricks cover one square foot.",
    },
    {
      question: "Why add 5% for waste?",
      answer:
        "A 5% waste factor accounts for breakage, cutting, and defective bricks during construction.",
    },
  ],
  formula:
    "Bricks = Wall Length × Wall Height × 7 bricks/sq ft × 1.05 waste factor.",
};

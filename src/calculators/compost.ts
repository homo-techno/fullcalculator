import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostCalculator: CalculatorDefinition = {
  slug: "compost-calculator",
  title: "Compost Calculator",
  description:
    "Free compost calculator. Estimate cubic yards of compost needed for your garden area and desired depth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["compost", "garden", "mulch", "soil amendment", "organic"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "area",
          label: "Garden Area (sq ft)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "depth",
          label: "Desired Depth (inches)",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const depth = inputs.depth as number;
        if (!area || !depth) return null;

        const depthFeet = depth / 12;
        const cubicFeet = area * depthFeet;
        const cubicYards = cubicFeet / 27;
        const bags = Math.ceil(cubicFeet / 1.5); // standard 1.5 cu ft bag

        return {
          primary: {
            label: "Compost Needed",
            value: formatNumber(cubicYards, 2) + " cubic yards",
          },
          details: [
            { label: "Garden Area", value: formatNumber(area, 0) + " sq ft" },
            { label: "Depth", value: formatNumber(depth, 1) + " inches" },
            { label: "Volume in Cubic Feet", value: formatNumber(cubicFeet, 1) },
            { label: "Bags (1.5 cu ft each)", value: String(bags) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["raised-garden-bed-calculator", "soil-mulch-calculator"],
  faq: [
    {
      question: "How much compost should I add?",
      answer:
        "For new beds, apply 2-4 inches of compost. For established gardens, 1-2 inches per season is typically sufficient.",
    },
    {
      question: "Is bulk or bagged compost better?",
      answer:
        "Bulk delivery is more economical for areas over 100 sq ft. Bags are convenient for small gardens or spot applications.",
    },
  ],
  formula:
    "Volume (cu ft) = Area × (Depth ÷ 12). Cubic Yards = Volume ÷ 27. Bags = Volume ÷ 1.5.",
};

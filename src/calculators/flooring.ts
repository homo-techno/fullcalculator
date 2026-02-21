import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flooringCalculator: CalculatorDefinition = {
  slug: "flooring-calculator",
  title: "Flooring Calculator",
  description:
    "Free flooring calculator. Estimate square footage, waste factor, and boxes of flooring needed for any room.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flooring", "square footage", "floor", "hardwood", "laminate", "tile"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "width",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        if (!length || !width) return null;

        const area = length * width;
        const wasteArea = area * 1.1;
        const boxesCoverage = 20;
        const boxesNeeded = Math.ceil(wasteArea / boxesCoverage);

        return {
          primary: {
            label: "Flooring Needed (with 10% waste)",
            value: formatNumber(wasteArea, 1) + " sq ft",
          },
          details: [
            { label: "Room Area", value: formatNumber(area, 1) + " sq ft" },
            { label: "Waste Added (10%)", value: formatNumber(area * 0.1, 1) + " sq ft" },
            {
              label: "Boxes Needed (~20 sq ft/box)",
              value: String(boxesNeeded),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tile-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "Why add 10% for waste?",
      answer:
        "A 10% waste factor accounts for cuts, mistakes, and pattern matching during installation.",
    },
    {
      question: "How much does a box of flooring cover?",
      answer:
        "A standard box of laminate or hardwood flooring typically covers about 20 square feet, though this varies by product.",
    },
  ],
  formula:
    "Flooring Needed = (Length × Width) × 1.10. Boxes = Flooring Needed ÷ 20 (rounded up).",
};

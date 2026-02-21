import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const giftWrapCalculator: CalculatorDefinition = {
  slug: "gift-wrap-calculator",
  title: "Gift Wrap Calculator",
  description:
    "Free gift wrap calculator. Calculate exactly how much wrapping paper you need for any box size with overlap.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "gift wrap",
    "wrapping paper",
    "gift box",
    "paper size",
    "present wrapping",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Box Length (inches)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "width",
          label: "Box Width (inches)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "height",
          label: "Box Height (inches)",
          type: "number",
          placeholder: "e.g. 4",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;

        const overlap = 2;
        const paperWidth = length + 2 * height + overlap * 2;
        const paperHeight = width + 2 * height + overlap * 2;
        const surfaceArea = 2 * (length * width + length * height + width * height);
        const paperArea = paperWidth * paperHeight;

        return {
          primary: {
            label: "Paper Size to Cut",
            value:
              formatNumber(paperWidth, 1) +
              '" x ' +
              formatNumber(paperHeight, 1) +
              '"',
          },
          details: [
            {
              label: "Paper Width Needed",
              value: formatNumber(paperWidth, 1) + " inches",
            },
            {
              label: "Paper Height Needed",
              value: formatNumber(paperHeight, 1) + " inches",
            },
            {
              label: "Box Surface Area",
              value: formatNumber(surfaceArea, 1) + " sq in",
            },
            {
              label: "Paper Area",
              value: formatNumber(paperArea, 1) + " sq in",
            },
            {
              label: "Paper Area (sq ft)",
              value: formatNumber(paperArea / 144, 2) + " sq ft",
            },
            { label: "Overlap Allowance", value: overlap + " inches per side" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["moving-box-calculator", "party-food-calculator"],
  faq: [
    {
      question: "How much wrapping paper do I need?",
      answer:
        "Measure the length, width, and height of your box. The paper width needed is the box length plus twice the height plus overlap. The paper height is the box width plus twice the height plus overlap.",
    },
    {
      question: "How much extra wrapping paper should I add?",
      answer:
        "This calculator adds 2 inches of overlap on each side for folding. For tricky shapes or thick paper, you may want to add an extra inch.",
    },
  ],
  formula:
    "Paper Width = Box Length + 2 x Height + 2 x Overlap. Paper Height = Box Width + 2 x Height + 2 x Overlap. Default overlap is 2 inches per side.",
};

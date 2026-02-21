import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plywoodCalculator: CalculatorDefinition = {
  slug: "plywood-calculator",
  title: "Plywood Calculator",
  description:
    "Free plywood calculator. Estimate 4×8 sheets needed to cover an area with adjustable waste factor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["plywood", "sheets", "OSB", "sheathing", "subflooring"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "area",
          label: "Area to Cover (sq ft)",
          type: "number",
          placeholder: "e.g. 320",
        },
        {
          name: "wasteFactor",
          label: "Waste Factor (%)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const wasteFactor = (inputs.wasteFactor as number) || 10;
        if (!area) return null;

        const sheetArea = 32; // 4×8 = 32 sq ft
        const wasteMultiplier = 1 + wasteFactor / 100;
        const areaWithWaste = area * wasteMultiplier;
        const sheetsNeeded = Math.ceil(areaWithWaste / sheetArea);

        return {
          primary: {
            label: "4×8 Sheets Needed",
            value: String(sheetsNeeded),
          },
          details: [
            { label: "Area to Cover", value: formatNumber(area, 0) + " sq ft" },
            { label: "Waste Factor", value: wasteFactor + "%" },
            { label: "Area with Waste", value: formatNumber(areaWithWaste, 1) + " sq ft" },
            { label: "Sheet Size", value: "4' × 8' (32 sq ft)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lumber-calculator", "deck-calculator"],
  faq: [
    {
      question: "How big is a standard plywood sheet?",
      answer:
        "A standard plywood sheet is 4 feet by 8 feet, covering 32 square feet.",
    },
    {
      question: "How much waste should I plan for?",
      answer:
        "Plan for 10% waste for simple rectangular areas. Complex layouts or rooms with many cuts may need 15-20%.",
    },
  ],
  formula:
    "Sheets = (Area × (1 + Waste%/100)) ÷ 32, rounded up.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drywallCalculator: CalculatorDefinition = {
  slug: "drywall-calculator",
  title: "Drywall Calculator",
  description:
    "Free drywall calculator. Estimate wall area, subtract openings, and find 4×8 sheets needed for your room.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drywall", "sheetrock", "gypsum", "wall", "sheets"],
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
        {
          name: "height",
          label: "Wall Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "doors",
          label: "Number of Doors",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "windows",
          label: "Number of Windows",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const doors = (inputs.doors as number) || 0;
        const windows = (inputs.windows as number) || 0;
        if (!length || !width || !height) return null;

        const perimeter = 2 * (length + width);
        const grossWallArea = perimeter * height;
        const doorArea = doors * 21; // ~3ft × 7ft = 21 sq ft
        const windowArea = windows * 15; // ~3ft × 5ft = 15 sq ft
        const netWallArea = grossWallArea - doorArea - windowArea;
        const sheetArea = 32; // 4×8 = 32 sq ft
        const sheetsNeeded = Math.ceil(netWallArea / sheetArea);

        return {
          primary: {
            label: "4×8 Sheets Needed",
            value: String(sheetsNeeded),
          },
          details: [
            { label: "Gross Wall Area", value: formatNumber(grossWallArea, 1) + " sq ft" },
            { label: "Door Openings Subtracted", value: formatNumber(doorArea, 1) + " sq ft" },
            { label: "Window Openings Subtracted", value: formatNumber(windowArea, 1) + " sq ft" },
            { label: "Net Wall Area", value: formatNumber(netWallArea, 1) + " sq ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["paint-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "What size are standard drywall sheets?",
      answer:
        "Standard drywall sheets are 4 feet wide by 8 feet tall, covering 32 square feet each.",
    },
    {
      question: "How are door and window openings estimated?",
      answer:
        "Doors are estimated at 21 sq ft (3×7 ft) and windows at 15 sq ft (3×5 ft) each.",
    },
  ],
  formula:
    "Net Wall Area = (2 × (Length + Width) × Height) − (Doors × 21) − (Windows × 15). Sheets = Net Area ÷ 32 (rounded up).",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lumberCalculator: CalculatorDefinition = {
  slug: "lumber-calculator",
  title: "Lumber Calculator",
  description:
    "Free lumber calculator. Calculate board feet from dimensions and estimate material cost.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lumber", "board feet", "wood", "timber", "woodworking"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "thickness",
          label: "Thickness (inches)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "width",
          label: "Width (inches)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "length",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "quantity",
          label: "Number of Boards",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const thickness = inputs.thickness as number;
        const width = inputs.width as number;
        const length = inputs.length as number;
        const quantity = (inputs.quantity as number) || 1;
        if (!thickness || !width || !length) return null;

        const boardFeetPerPiece = (thickness * width * length) / 12;
        const totalBoardFeet = boardFeetPerPiece * quantity;

        // Approximate costs per board foot
        const pineCost = totalBoardFeet * 3;
        const oakCost = totalBoardFeet * 7;
        const walnutCost = totalBoardFeet * 12;

        return {
          primary: {
            label: "Total Board Feet",
            value: formatNumber(totalBoardFeet, 2),
          },
          details: [
            { label: "Board Feet per Piece", value: formatNumber(boardFeetPerPiece, 2) },
            { label: "Quantity", value: String(quantity) },
            { label: "Pine (~$3/bd ft)", value: "$" + formatNumber(pineCost, 2) },
            { label: "Oak (~$7/bd ft)", value: "$" + formatNumber(oakCost, 2) },
            { label: "Walnut (~$12/bd ft)", value: "$" + formatNumber(walnutCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["plywood-calculator", "deck-calculator"],
  faq: [
    {
      question: "What is a board foot?",
      answer:
        "A board foot is a unit of lumber volume equal to 1 inch thick × 12 inches wide × 12 inches long (144 cubic inches).",
    },
    {
      question: "How do I calculate board feet?",
      answer:
        "Board Feet = (Thickness in inches × Width in inches × Length in feet) ÷ 12.",
    },
  ],
  formula:
    "Board Feet = (Thickness\" × Width\" × Length') ÷ 12. Total = Board Feet × Quantity.",
};

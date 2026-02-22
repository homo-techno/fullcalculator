import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardFootageCalculator: CalculatorDefinition = {
  slug: "board-footage-calculator",
  title: "Board Footage Calculator",
  description: "Free board footage calculator. Calculate board feet for lumber purchases, estimate costs, and convert between measurement systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["board footage calculator", "board feet calculator", "lumber calculator", "board foot", "lumber estimator"],
  variants: [
    {
      id: "single-board",
      name: "Single Board",
      description: "Calculate board footage for a single piece of lumber",
      fields: [
        { name: "thickness", label: "Thickness (inches, nominal)", type: "number", placeholder: "e.g. 1" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "length", label: "Length (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "quantity", label: "Number of Boards", type: "number", placeholder: "e.g. 5" },
        { name: "pricePerBF", label: "Price per Board Foot ($)", type: "number", placeholder: "e.g. 5.50" },
      ],
      calculate: (inputs) => {
        const thickness = inputs.thickness as number;
        const width = inputs.width as number;
        const length = inputs.length as number;
        const quantity = (inputs.quantity as number) || 1;
        const pricePerBF = inputs.pricePerBF as number;
        if (!thickness || !width || !length) return null;
        const boardFeet = (thickness * width * length) / 12;
        const totalBF = boardFeet * quantity;
        const totalCost = pricePerBF ? totalBF * pricePerBF : 0;
        const costPerBoard = pricePerBF ? boardFeet * pricePerBF : 0;
        const sqFt = (width / 12) * length * quantity;
        const cubicFeet = (thickness / 12) * (width / 12) * length * quantity;
        const linearFeet = length * quantity;
        return {
          primary: { label: "Total Board Feet", value: `${formatNumber(totalBF, 2)} BF` },
          details: [
            { label: "Board Feet (per board)", value: `${formatNumber(boardFeet, 2)} BF` },
            { label: "Quantity", value: formatNumber(quantity, 0) },
            { label: "Linear Feet", value: `${formatNumber(linearFeet, 1)} LF` },
            { label: "Square Feet", value: `${formatNumber(sqFt, 1)} sq ft` },
            { label: "Cubic Feet", value: `${formatNumber(cubicFeet, 2)} cu ft` },
            { label: "Cost per Board", value: pricePerBF ? `$${formatNumber(costPerBoard, 2)}` : "Enter price" },
            { label: "Total Cost", value: pricePerBF ? `$${formatNumber(totalCost, 2)}` : "Enter price" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-density-calculator", "cutting-diagram-calculator", "wood-stain-coverage-calculator"],
  faq: [
    { question: "What is a board foot?", answer: "A board foot is a unit of lumber volume equal to 1 inch thick, 12 inches wide, and 12 inches long (144 cubic inches). It is the standard unit for pricing hardwood lumber." },
    { question: "Do I use nominal or actual dimensions?", answer: "Lumber is sold by nominal (rough) dimensions. A 4/4 (four-quarter) board is nominally 1 inch thick. Surfaced (S2S) boards are thinner, but you pay for the nominal size." },
  ],
  formula: "Board Feet = (Thickness x Width x Length) / 12 | where Thickness in inches, Width in inches, Length in feet",
};

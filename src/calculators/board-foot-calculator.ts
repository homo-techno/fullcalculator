import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardFootCalculator: CalculatorDefinition = {
  slug: "board-foot-calculator",
  title: "Board Foot Calculator",
  description: "Free board foot calculator. Calculate board feet for lumber pricing, estimate costs for hardwood, and convert between board feet and lineal feet.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["board foot calculator", "lumber calculator", "hardwood calculator", "board feet calculator", "lumber pricing calculator"],
  variants: [
    {
      id: "single-board",
      name: "Single Board",
      description: "Calculate board feet for a single piece of lumber",
      fields: [
        { name: "thickness", label: "Thickness (inches)", type: "select", options: [
          { label: "4/4 (1 inch)", value: "1" },
          { label: "5/4 (1.25 inches)", value: "1.25" },
          { label: "6/4 (1.5 inches)", value: "1.5" },
          { label: "8/4 (2 inches)", value: "2" },
          { label: "10/4 (2.5 inches)", value: "2.5" },
          { label: "12/4 (3 inches)", value: "3" },
          { label: "16/4 (4 inches)", value: "4" },
        ], defaultValue: "1" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "length", label: "Length (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "quantity", label: "Quantity", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "pricePerBF", label: "Price per Board Foot (optional)", type: "number", placeholder: "e.g. 6.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const thickness = parseFloat(inputs.thickness as string) || 1;
        const width = inputs.width as number;
        const length = inputs.length as number;
        const quantity = (inputs.quantity as number) || 1;
        const price = inputs.pricePerBF as number;
        if (!width || !length) return null;

        const boardFeet = (thickness * width * length) / 12;
        const totalBF = boardFeet * quantity;

        const details = [
          { label: "Board feet per piece", value: formatNumber(boardFeet, 2) },
          { label: "Total board feet", value: formatNumber(totalBF, 2) },
          { label: "Dimensions", value: `${thickness}\" \u00D7 ${width}\" \u00D7 ${length}'` },
          { label: "Quantity", value: `${quantity}` },
        ];

        if (price) {
          details.push({ label: "Cost per piece", value: `$${formatNumber(boardFeet * price, 2)}` });
          details.push({ label: "Total cost", value: `$${formatNumber(totalBF * price, 2)}` });
        }

        return {
          primary: { label: "Board Feet", value: formatNumber(totalBF, 2) },
          details,
          note: "One board foot = 1\" thick \u00D7 12\" wide \u00D7 12\" long (144 cubic inches). Hardwood lumber is sold by the board foot. Thickness is measured in quarters (4/4 = 1\").",
        };
      },
    },
    {
      id: "project",
      name: "Project Lumber List",
      description: "Estimate total board feet for a project with waste factor",
      fields: [
        { name: "totalBoardFeet", label: "Calculated Board Feet Needed", type: "number", placeholder: "e.g. 50" },
        { name: "wasteFactor", label: "Waste Factor", type: "select", options: [
          { label: "10% - Simple cuts", value: "1.10" },
          { label: "15% - Average project", value: "1.15" },
          { label: "20% - Complex cuts/curves", value: "1.20" },
          { label: "25% - Highly figured wood", value: "1.25" },
          { label: "30% - Live edge / natural edge", value: "1.30" },
        ], defaultValue: "1.15" },
        { name: "pricePerBF", label: "Price per Board Foot", type: "number", placeholder: "e.g. 8", prefix: "$" },
      ],
      calculate: (inputs) => {
        const totalBF = inputs.totalBoardFeet as number;
        const waste = parseFloat(inputs.wasteFactor as string) || 1.15;
        const price = inputs.pricePerBF as number;
        if (!totalBF) return null;

        const adjustedBF = totalBF * waste;
        const wastePercent = (waste - 1) * 100;

        const details = [
          { label: "Net board feet needed", value: formatNumber(totalBF, 1) },
          { label: "Waste factor", value: `${wastePercent.toFixed(0)}%` },
          { label: "Board feet to purchase", value: formatNumber(adjustedBF, 1) },
          { label: "Extra for waste", value: `${formatNumber(adjustedBF - totalBF, 1)} BF` },
        ];

        if (price) {
          details.push({ label: "Cost (net)", value: `$${formatNumber(totalBF * price, 2)}` });
          details.push({ label: "Cost (with waste)", value: `$${formatNumber(adjustedBF * price, 2)}` });
        }

        return {
          primary: { label: "Board Feet to Purchase", value: `${formatNumber(adjustedBF, 1)} BF` },
          details,
          note: "Always add waste for defects, saw kerf, and offcuts. Highly figured or expensive woods may have more defects requiring larger waste factors. Buy from the same lot for consistent color.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "deck-board-calculator", "square-footage-calculator"],
  faq: [
    { question: "What is a board foot?", answer: "A board foot (BF) is a unit of volume used for lumber. It equals a piece 1 inch thick, 12 inches wide, and 12 inches long (144 cubic inches). The formula is: BF = Thickness (in) \u00D7 Width (in) \u00D7 Length (ft) / 12. Hardwood lumber is almost always priced per board foot." },
    { question: "What does 4/4, 5/4, 8/4 mean?", answer: "These are quarter fractions indicating rough lumber thickness. 4/4 = 4 quarters = 1 inch thick. 5/4 = 1.25 inches. 8/4 = 2 inches. After surfacing (planing), the board will be thinner. A 4/4 board surfaced on two sides (S2S) will be about 13/16 inch thick." },
  ],
  formula: "Board Feet = Thickness (in) \u00D7 Width (in) \u00D7 Length (ft) / 12",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseboardCalculator: CalculatorDefinition = {
  slug: "baseboard-calculator",
  title: "Baseboard Calculator",
  description: "Free baseboard calculator. Calculate linear feet and number of baseboard pieces needed for your room, accounting for door openings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseboard calculator", "baseboard linear feet", "how much baseboard do I need", "baseboard trim calculator", "molding calculator"],
  variants: [
    {
      id: "perimeter",
      name: "By Room Perimeter",
      description: "Enter room perimeter directly",
      fields: [
        { name: "perimeter", label: "Room Perimeter (ft)", type: "number", placeholder: "e.g. 60" },
        { name: "doors", label: "Number of Door Openings", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "pieceLength", label: "Baseboard Length", type: "select", options: [
          { label: "8 ft pieces", value: "8" },
          { label: "12 ft pieces", value: "12" },
          { label: "16 ft pieces", value: "16" },
        ], defaultValue: "8" },
      ],
      calculate: (inputs) => {
        const perimeter = inputs.perimeter as number;
        const doors = (inputs.doors as number) || 0;
        const pieceLength = parseInt(inputs.pieceLength as string) || 8;
        if (!perimeter) return null;

        const doorWidth = 3; // average door opening width in feet
        const linearFeet = perimeter - (doors * doorWidth);
        const linearFeetWithWaste = linearFeet * 1.10; // 10% waste for cuts
        const pieces = Math.ceil(linearFeetWithWaste / pieceLength);

        return {
          primary: { label: "Baseboard Needed", value: `${formatNumber(linearFeetWithWaste, 1)} linear feet` },
          details: [
            { label: "Room perimeter", value: `${formatNumber(perimeter)} ft` },
            { label: "Door openings deducted", value: `${doors} x ${doorWidth} ft = ${doors * doorWidth} ft` },
            { label: "Net linear feet", value: `${formatNumber(linearFeet, 1)} ft` },
            { label: "With 10% waste", value: `${formatNumber(linearFeetWithWaste, 1)} ft` },
            { label: `${pieceLength}-ft pieces needed`, value: `${pieces}` },
          ],
          note: "Includes 10% waste for miters, corners, and cuts. Average door opening is 3 ft wide. Buy extra pieces for mistakes.",
        };
      },
    },
    {
      id: "dimensions",
      name: "By Room Dimensions",
      description: "Enter room length and width",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "doors", label: "Number of Door Openings", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "pieceLength", label: "Baseboard Length", type: "select", options: [
          { label: "8 ft pieces", value: "8" },
          { label: "12 ft pieces", value: "12" },
          { label: "16 ft pieces", value: "16" },
        ], defaultValue: "8" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const doors = (inputs.doors as number) || 0;
        const pieceLength = parseInt(inputs.pieceLength as string) || 8;
        if (!length || !width) return null;

        const perimeter = 2 * (length + width);
        const doorWidth = 3;
        const linearFeet = perimeter - (doors * doorWidth);
        const linearFeetWithWaste = linearFeet * 1.10;
        const pieces = Math.ceil(linearFeetWithWaste / pieceLength);

        return {
          primary: { label: "Baseboard Needed", value: `${formatNumber(linearFeetWithWaste, 1)} linear feet` },
          details: [
            { label: "Room dimensions", value: `${length} ft x ${width} ft` },
            { label: "Room perimeter", value: `${formatNumber(perimeter)} ft` },
            { label: "Door openings deducted", value: `${doors} x ${doorWidth} ft = ${doors * doorWidth} ft` },
            { label: "Net linear feet", value: `${formatNumber(linearFeet, 1)} ft` },
            { label: "With 10% waste", value: `${formatNumber(linearFeetWithWaste, 1)} ft` },
            { label: `${pieceLength}-ft pieces needed`, value: `${pieces}` },
          ],
          note: "Includes 10% waste for miters, corners, and cuts. Average door opening is 3 ft wide.",
        };
      },
    },
  ],
  relatedSlugs: ["crown-molding-calculator", "paint-calculator", "square-footage-calculator"],
  faq: [
    { question: "How do I calculate baseboard needed?", answer: "Measure the room perimeter (2 x length + 2 x width), subtract 3 feet for each door opening, and add 10% for waste from cuts and miters. Divide by the baseboard piece length to get the number of pieces." },
    { question: "How much extra baseboard should I buy?", answer: "Buy 10% extra to account for miter cuts, inside/outside corners, and mistakes. For rooms with many corners or angles, consider 15% extra." },
    { question: "What length baseboard should I buy?", answer: "8-foot pieces are standard and easiest to transport. 12-foot and 16-foot pieces reduce the number of joints but are harder to handle. Use longer pieces for long, straight walls." },
  ],
  formula: "Linear Feet = Perimeter - (Doors x 3 ft) | Pieces = Linear Feet x 1.10 / Piece Length",
};

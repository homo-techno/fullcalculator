import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crownMoldingCalculator: CalculatorDefinition = {
  slug: "crown-molding-calculator",
  title: "Crown Molding Calculator",
  description: "Free crown molding calculator. Calculate linear feet and number of pieces of crown molding needed for your room with waste for miters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crown molding calculator", "crown moulding calculator", "how much crown molding", "crown molding linear feet", "ceiling trim calculator"],
  variants: [
    {
      id: "perimeter",
      name: "By Room Perimeter",
      description: "Enter room perimeter directly",
      fields: [
        { name: "perimeter", label: "Room Perimeter (ft)", type: "number", placeholder: "e.g. 56" },
        { name: "pieceLength", label: "Molding Length", type: "select", options: [
          { label: "8 ft pieces", value: "8" },
          { label: "12 ft pieces", value: "12" },
          { label: "16 ft pieces", value: "16" },
        ], defaultValue: "12" },
      ],
      calculate: (inputs) => {
        const perimeter = inputs.perimeter as number;
        const pieceLength = parseInt(inputs.pieceLength as string) || 12;
        if (!perimeter) return null;

        const linearFeetWithWaste = perimeter * 1.10; // 10% waste for miters
        const pieces = Math.ceil(linearFeetWithWaste / pieceLength);
        const totalLength = pieces * pieceLength;
        const wasteAmount = totalLength - perimeter;

        return {
          primary: { label: "Crown Molding Needed", value: `${formatNumber(linearFeetWithWaste, 1)} linear feet` },
          details: [
            { label: "Room perimeter", value: `${formatNumber(perimeter)} ft` },
            { label: "With 10% miter waste", value: `${formatNumber(linearFeetWithWaste, 1)} ft` },
            { label: `${pieceLength}-ft pieces needed`, value: `${pieces}` },
            { label: "Total purchased length", value: `${totalLength} ft` },
            { label: "Extra material", value: `${formatNumber(wasteAmount, 1)} ft` },
          ],
          note: "Includes 10% waste for miter cuts at corners. Crown molding requires precise 45-degree miter cuts at each inside and outside corner. Buy 1-2 extra pieces for practice cuts.",
        };
      },
    },
    {
      id: "dimensions",
      name: "By Room Dimensions",
      description: "Enter room length and width",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 13" },
        { name: "pieceLength", label: "Molding Length", type: "select", options: [
          { label: "8 ft pieces", value: "8" },
          { label: "12 ft pieces", value: "12" },
          { label: "16 ft pieces", value: "16" },
        ], defaultValue: "12" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const pieceLength = parseInt(inputs.pieceLength as string) || 12;
        if (!length || !width) return null;

        const perimeter = 2 * (length + width);
        const linearFeetWithWaste = perimeter * 1.10;
        const pieces = Math.ceil(linearFeetWithWaste / pieceLength);

        return {
          primary: { label: "Crown Molding Needed", value: `${formatNumber(linearFeetWithWaste, 1)} linear feet` },
          details: [
            { label: "Room dimensions", value: `${length} ft x ${width} ft` },
            { label: "Room perimeter", value: `${formatNumber(perimeter)} ft` },
            { label: "With 10% miter waste", value: `${formatNumber(linearFeetWithWaste, 1)} ft` },
            { label: `${pieceLength}-ft pieces needed`, value: `${pieces}` },
            { label: "Inside corners", value: "4 (typical rectangle)" },
          ],
          note: "Includes 10% waste for miter cuts. A rectangular room has 4 inside corners requiring miter joints.",
        };
      },
    },
  ],
  relatedSlugs: ["baseboard-calculator", "paint-calculator", "square-footage-calculator"],
  faq: [
    { question: "How do I calculate crown molding needed?", answer: "Measure the room perimeter (or 2 x length + 2 x width) and add 10% for waste from miter cuts at corners. Divide by the molding piece length to get the number of pieces needed." },
    { question: "How much waste should I allow for crown molding?", answer: "Allow at least 10% waste for miter cuts at inside and outside corners. If you are new to installing crown molding, buy 1-2 extra pieces for practice cuts and mistakes." },
    { question: "What size crown molding should I use?", answer: "For standard 8-foot ceilings, use 3.5-5.5 inch crown molding. For 9-10 foot ceilings, use 5-7 inch molding. For ceilings above 10 feet, 7+ inches looks proportional." },
  ],
  formula: "Linear Feet = Perimeter x 1.10 | Pieces = Linear Feet / Piece Length",
};

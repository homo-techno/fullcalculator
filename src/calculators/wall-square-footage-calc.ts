import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wallSquareFootageCalculator: CalculatorDefinition = {
  slug: "wall-square-footage-calculator",
  title: "Wall Square Footage Calculator",
  description:
    "Calculate the square footage of walls for painting, siding, drywall, and insulation projects. Subtract windows and doors automatically.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wall square footage",
    "wall area calculator",
    "wall sqft",
    "siding calculator",
    "drywall area",
  ],
  variants: [
    {
      id: "single-wall",
      name: "Single Wall",
      description: "Calculate square footage of one wall minus openings",
      fields: [
        {
          name: "wallLength",
          label: "Wall Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "wallHeight",
          label: "Wall Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "numWindows",
          label: "Number of Windows",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 0,
        },
        {
          name: "numDoors",
          label: "Number of Doors",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const wallLength = parseFloat(inputs.wallLength as string);
        const wallHeight = parseFloat(inputs.wallHeight as string) || 8;
        const numWindows = parseFloat(inputs.numWindows as string) || 0;
        const numDoors = parseFloat(inputs.numDoors as string) || 0;
        if (!wallLength) return null;

        const grossArea = wallLength * wallHeight;
        const windowArea = numWindows * 15; // avg 3x5 window
        const doorArea = numDoors * 21; // avg 3x7 door
        const netArea = grossArea - windowArea - doorArea;

        return {
          primary: {
            label: "Net Wall Area",
            value: `${formatNumber(Math.max(netArea, 0))} sq ft`,
          },
          details: [
            { label: "Gross wall area", value: `${formatNumber(grossArea)} sq ft` },
            { label: "Window deductions", value: `${formatNumber(windowArea)} sq ft (${formatNumber(numWindows)} windows)` },
            { label: "Door deductions", value: `${formatNumber(doorArea)} sq ft (${formatNumber(numDoors)} doors)` },
            { label: "Net area", value: `${formatNumber(Math.max(netArea, 0))} sq ft` },
          ],
          note: "Uses average window size of 3x5 ft (15 sq ft) and door size of 3x7 ft (21 sq ft). Adjust manually for non-standard openings.",
        };
      },
    },
    {
      id: "room-walls",
      name: "Entire Room (All Walls)",
      description: "Calculate total wall area for a rectangular room",
      fields: [
        {
          name: "roomLength",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 14",
        },
        {
          name: "roomWidth",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "wallHeight",
          label: "Wall Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "numWindows",
          label: "Total Windows",
          type: "number",
          placeholder: "e.g. 3",
          defaultValue: 0,
        },
        {
          name: "numDoors",
          label: "Total Doors",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const roomLength = parseFloat(inputs.roomLength as string);
        const roomWidth = parseFloat(inputs.roomWidth as string);
        const wallHeight = parseFloat(inputs.wallHeight as string) || 8;
        const numWindows = parseFloat(inputs.numWindows as string) || 0;
        const numDoors = parseFloat(inputs.numDoors as string) || 0;
        if (!roomLength || !roomWidth) return null;

        const perimeter = 2 * (roomLength + roomWidth);
        const grossArea = perimeter * wallHeight;
        const windowArea = numWindows * 15;
        const doorArea = numDoors * 21;
        const netArea = grossArea - windowArea - doorArea;

        // Drywall sheets (4x8)
        const drywallSheets = Math.ceil(grossArea / 32);
        // Paint gallons (350 sq ft/gal)
        const paintGallons = Math.ceil(netArea / 350);

        return {
          primary: {
            label: "Net Wall Area",
            value: `${formatNumber(Math.max(netArea, 0))} sq ft`,
          },
          details: [
            { label: "Room perimeter", value: `${formatNumber(perimeter)} linear ft` },
            { label: "Gross wall area", value: `${formatNumber(grossArea)} sq ft` },
            { label: "Openings deducted", value: `${formatNumber(windowArea + doorArea)} sq ft` },
            { label: "Net paintable area", value: `${formatNumber(Math.max(netArea, 0))} sq ft` },
            { label: "Drywall sheets (4x8)", value: formatNumber(drywallSheets) },
            { label: "Paint (gallons, 1 coat)", value: formatNumber(paintGallons) },
          ],
          note: "For a rectangular room with 4 walls. Drywall estimate is for gross area (you cut around openings). Paint estimate is for net area.",
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "paint-calculator", "tile-calculator"],
  faq: [
    {
      question: "How do I calculate wall square footage?",
      answer:
        "Multiply the wall length by the wall height to get the gross area. For a room, add all four walls: 2 x (length + width) x height. Subtract 15 sq ft per standard window and 21 sq ft per standard door to get the net area for painting or siding.",
    },
    {
      question: "How many sheets of drywall do I need for a room?",
      answer:
        "Calculate the total gross wall area (perimeter x height) and divide by 32 (the area of a 4x8 sheet). Add 10% for waste and cuts. For a 12x14 room with 8-foot ceilings: (52 ft perimeter x 8 ft) / 32 = 13 sheets. Order 14-15 sheets.",
    },
  ],
  formula:
    "Wall Area = Length x Height | Room Area = 2(L+W) x H | Net Area = Gross - Windows - Doors",
};

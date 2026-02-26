import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shiplapCalculator: CalculatorDefinition = {
  slug: "shiplap-calc",
  title: "Shiplap Board Calculator",
  description:
    "Free online shiplap calculator. Estimate how many shiplap boards you need for your wall or ceiling project, including waste allowance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "shiplap",
    "board",
    "wall",
    "ceiling",
    "paneling",
    "planks",
    "accent wall",
  ],
  variants: [
    {
      id: "shiplap",
      name: "Shiplap Boards",
      description: "Calculate shiplap boards for a wall or ceiling",
      fields: [
        {
          name: "wallWidth",
          label: "Wall Width",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "ft",
        },
        {
          name: "wallHeight",
          label: "Wall Height",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "ft",
        },
        {
          name: "boardWidth",
          label: "Board Expose Width",
          type: "select",
          options: [
            { label: '5.5" (1x6 nominal)', value: "5.5" },
            { label: '7.25" (1x8 nominal)', value: "7.25" },
            { label: '3.5" (1x4 nominal)', value: "3.5" },
          ],
          defaultValue: "5.5",
        },
        {
          name: "boardLength",
          label: "Board Length",
          type: "select",
          options: [
            { label: "8 ft", value: "8" },
            { label: "10 ft", value: "10" },
            { label: "12 ft", value: "12" },
            { label: "16 ft", value: "16" },
          ],
          defaultValue: "8",
        },
        {
          name: "wastePercent",
          label: "Waste Factor",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "%",
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const wallWidth = parseFloat(inputs.wallWidth as string) || 0;
        const wallHeight = parseFloat(inputs.wallHeight as string) || 0;
        const boardWidth = parseFloat(inputs.boardWidth as string) || 5.5;
        const boardLength = parseFloat(inputs.boardLength as string) || 8;
        const wastePercent = parseFloat(inputs.wastePercent as string) || 10;

        if (wallWidth <= 0 || wallHeight <= 0) return null;

        const wallAreaSqFt = wallWidth * wallHeight;
        const boardWidthFt = boardWidth / 12;
        const boardAreaSqFt = boardWidthFt * boardLength;
        const wasteFactor = 1 + wastePercent / 100;
        const boardsNeeded = Math.ceil((wallAreaSqFt * wasteFactor) / boardAreaSqFt);
        const totalLinearFt = boardsNeeded * boardLength;
        const rowsNeeded = Math.ceil((wallHeight * 12) / boardWidth);

        return {
          primary: {
            label: "Boards Needed",
            value: formatNumber(boardsNeeded) + " boards",
          },
          details: [
            { label: "Wall area", value: formatNumber(wallAreaSqFt) + " sq ft" },
            { label: "Board coverage each", value: formatNumber(boardAreaSqFt) + " sq ft" },
            { label: "Rows of boards", value: formatNumber(rowsNeeded) },
            { label: "Total linear feet", value: formatNumber(totalLinearFt) + " ft" },
            { label: "Waste factor", value: wastePercent + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wainscoting-calc", "board-batten-calc", "plywood-calc"],
  faq: [
    {
      question: "How do I calculate shiplap for a wall?",
      answer:
        "Measure the wall width and height to get total area. Divide by the coverage area of each board (exposed width times board length). Add 10% for waste from cuts and imperfections.",
    },
    {
      question: "What is the most common shiplap size?",
      answer:
        "The most common shiplap board is a 1x6 (5.5 inches exposed width) in 8-foot lengths. For larger walls, 1x8 boards in longer lengths minimize seams.",
    },
  ],
  formula:
    "Boards = ceil((WallWidth × WallHeight × WasteFactor) / (BoardExposeWidth/12 × BoardLength))",
};

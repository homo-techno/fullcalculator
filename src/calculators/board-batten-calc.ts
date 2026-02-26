import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardBattenCalculator: CalculatorDefinition = {
  slug: "board-batten-calc",
  title: "Board and Batten Calculator",
  description:
    "Free online board and batten calculator. Estimate the number of boards, battens, and materials needed for a board and batten wall or exterior.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "board and batten",
    "siding",
    "wall",
    "exterior",
    "batten",
    "vertical",
    "accent wall",
  ],
  variants: [
    {
      id: "board-batten",
      name: "Board & Batten Layout",
      description: "Calculate boards and battens for a wall",
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
          label: "Board Width",
          type: "select",
          options: [
            { label: '5.5" (1x6)', value: "5.5" },
            { label: '7.25" (1x8)', value: "7.25" },
            { label: '9.25" (1x10)', value: "9.25" },
            { label: '11.25" (1x12)', value: "11.25" },
          ],
          defaultValue: "7.25",
        },
        {
          name: "battenWidth",
          label: "Batten Width",
          type: "select",
          options: [
            { label: '1.5" (1x2)', value: "1.5" },
            { label: '2.5" (1x3)', value: "2.5" },
            { label: '3.5" (1x4)', value: "3.5" },
          ],
          defaultValue: "2.5",
        },
        {
          name: "gap",
          label: "Gap Between Boards",
          type: "number",
          placeholder: "e.g. 0.5",
          suffix: "in",
          defaultValue: 0.5,
        },
      ],
      calculate: (inputs) => {
        const wallWidth = parseFloat(inputs.wallWidth as string) || 0;
        const wallHeight = parseFloat(inputs.wallHeight as string) || 0;
        const boardWidth = parseFloat(inputs.boardWidth as string) || 7.25;
        const battenWidth = parseFloat(inputs.battenWidth as string) || 2.5;
        const gap = parseFloat(inputs.gap as string) || 0.5;

        if (wallWidth <= 0 || wallHeight <= 0) return null;

        const wallWidthIn = wallWidth * 12;
        // Pattern repeat = board + gap
        const repeatWidth = boardWidth + gap;
        const numBoards = Math.ceil(wallWidthIn / repeatWidth);
        // Battens cover the gaps (one batten per gap = numBoards - 1, plus optionally the edges)
        const numBattens = numBoards + 1; // battens on edges too
        const totalBoardLinearFt = numBoards * wallHeight;
        const totalBattenLinearFt = numBattens * wallHeight;
        const totalArea = wallWidth * wallHeight;

        return {
          primary: {
            label: "Boards Needed",
            value: formatNumber(numBoards) + " boards",
          },
          details: [
            { label: "Battens needed", value: formatNumber(numBattens) },
            {
              label: "Board linear feet",
              value: formatNumber(totalBoardLinearFt) + " ft",
            },
            {
              label: "Batten linear feet",
              value: formatNumber(totalBattenLinearFt) + " ft",
            },
            { label: "Wall area", value: formatNumber(totalArea) + " sq ft" },
            {
              label: "Pattern repeat",
              value: formatNumber(repeatWidth) + " in",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["shiplap-calc", "wainscoting-calc", "plywood-calc"],
  faq: [
    {
      question: "What is board and batten?",
      answer:
        "Board and batten is a type of wall or siding treatment where wide boards are placed vertically with narrow strips (battens) covering the seams or gaps between them. It creates a classic, textured look.",
    },
    {
      question: "What size boards and battens should I use?",
      answer:
        "A common combination is 1x8 boards with 1x3 battens. For a more dramatic look, use wider boards (1x10 or 1x12). The battens are typically 1x2 or 1x3.",
    },
  ],
  formula:
    "Boards = ceil(WallWidth × 12 / (BoardWidth + Gap)); Battens = Boards + 1",
};

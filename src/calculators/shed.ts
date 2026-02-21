import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shedCalculator: CalculatorDefinition = {
  slug: "shed-calculator",
  title: "Shed Calculator",
  description:
    "Free shed calculator. Estimate floor, wall, and roof areas with plywood sheet counts for your shed build.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shed", "outbuilding", "storage", "building materials", "plywood"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Shed Length (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "width",
          label: "Shed Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "height",
          label: "Wall Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;

        const sheetArea = 32; // 4×8 sheet

        // Floor
        const floorArea = length * width;
        const floorSheets = Math.ceil(floorArea / sheetArea);

        // Walls: 2 long walls + 2 short walls
        const wallArea = 2 * (length * height) + 2 * (width * height);
        const wallSheets = Math.ceil(wallArea / sheetArea);

        // Roof: simple gable, each side = length × (width/2 + 1ft overhang)
        const roofSideWidth = width / 2 + 1;
        const roofArea = 2 * (length + 2) * roofSideWidth; // +2 for eave overhang
        const roofSheets = Math.ceil(roofArea / sheetArea);

        const totalSheets = floorSheets + wallSheets + roofSheets;

        return {
          primary: {
            label: "Total Plywood Sheets (4×8)",
            value: String(totalSheets),
          },
          details: [
            { label: "Floor Area", value: formatNumber(floorArea, 1) + " sq ft (" + floorSheets + " sheets)" },
            { label: "Wall Area", value: formatNumber(wallArea, 1) + " sq ft (" + wallSheets + " sheets)" },
            { label: "Roof Area (gable + overhang)", value: formatNumber(roofArea, 1) + " sq ft (" + roofSheets + " sheets)" },
            { label: "Shed Dimensions", value: length + "' × " + width + "' × " + height + "'" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["plywood-calculator", "lumber-calculator"],
  faq: [
    {
      question: "What is included in the roof area?",
      answer:
        "The calculation assumes a simple gable roof with 1-foot eave overhang on all sides.",
    },
    {
      question: "Does this include doors and windows?",
      answer:
        "No. This estimates the full wall area. You may need slightly fewer wall sheets if you have large openings, but it is wise to buy the full count for framing waste.",
    },
  ],
  formula:
    "Floor = L × W. Walls = 2(L×H) + 2(W×H). Roof = 2 × (L+2) × (W/2 + 1). Sheets = Area ÷ 32.",
};

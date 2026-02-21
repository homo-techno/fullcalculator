import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plantSpacingCalculator: CalculatorDefinition = {
  slug: "plant-spacing-calculator",
  title: "Plant Spacing Calculator",
  description: "Free plant spacing calculator. Calculate how many plants fit in your garden bed with proper spacing for rows, grids, and triangular patterns.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["plant spacing calculator", "garden plant calculator", "how many plants", "plant spacing chart", "garden spacing calculator"],
  variants: [
    {
      id: "row",
      name: "Row Planting",
      description: "Calculate plants in traditional rows",
      fields: [
        { name: "bedLength", label: "Bed Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "bedWidth", label: "Bed Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "spacingInRow", label: "Spacing Between Plants (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "rowSpacing", label: "Spacing Between Rows (inches)", type: "number", placeholder: "e.g. 24" },
      ],
      calculate: (inputs) => {
        const length = inputs.bedLength as number;
        const width = inputs.bedWidth as number;
        const spacePlant = inputs.spacingInRow as number;
        const spaceRow = inputs.rowSpacing as number;
        if (!length || !width || !spacePlant || !spaceRow) return null;
        const lengthIn = length * 12;
        const widthIn = width * 12;
        const plantsPerRow = Math.floor(lengthIn / spacePlant) + 1;
        const numRows = Math.floor(widthIn / spaceRow) + 1;
        const totalPlants = plantsPerRow * numRows;
        const bedArea = length * width;
        const plantsPerSqFt = totalPlants / bedArea;
        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details: [
            { label: "Plants per row", value: `${plantsPerRow}` },
            { label: "Number of rows", value: `${numRows}` },
            { label: "Bed area", value: `${formatNumber(bedArea, 0)} sq ft` },
            { label: "Plants per sq ft", value: formatNumber(plantsPerSqFt, 1) },
          ],
        };
      },
    },
    {
      id: "grid",
      name: "Square Grid (Square Foot)",
      description: "Calculate plants using square grid/square foot gardening",
      fields: [
        { name: "bedLength", label: "Bed Length (ft)", type: "number", placeholder: "e.g. 8" },
        { name: "bedWidth", label: "Bed Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "spacing", label: "Plant Spacing (inches)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const length = inputs.bedLength as number;
        const width = inputs.bedWidth as number;
        const spacing = inputs.spacing as number;
        if (!length || !width || !spacing) return null;
        const lengthIn = length * 12;
        const widthIn = width * 12;
        const cols = Math.floor(lengthIn / spacing) + 1;
        const rows = Math.floor(widthIn / spacing) + 1;
        const totalPlants = cols * rows;
        const perSqFt = (12 / spacing) * (12 / spacing);
        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details: [
            { label: "Grid columns", value: `${cols}` },
            { label: "Grid rows", value: `${rows}` },
            { label: "Plants per sq ft", value: formatNumber(perSqFt, 1) },
            { label: "Bed area", value: `${formatNumber(length * width, 0)} sq ft` },
          ],
          note: "Square foot gardening: 3\" spacing = 16/sqft, 4\" = 9/sqft, 6\" = 4/sqft, 12\" = 1/sqft, 18\" = 1 per 2 sqft.",
        };
      },
    },
    {
      id: "triangular",
      name: "Triangular/Offset Pattern",
      description: "Maximize plants using staggered triangular spacing",
      fields: [
        { name: "bedLength", label: "Bed Length (ft)", type: "number", placeholder: "e.g. 10" },
        { name: "bedWidth", label: "Bed Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "spacing", label: "Plant Spacing (inches)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const length = inputs.bedLength as number;
        const width = inputs.bedWidth as number;
        const spacing = inputs.spacing as number;
        if (!length || !width || !spacing) return null;
        const lengthIn = length * 12;
        const widthIn = width * 12;
        const rowSpacing = spacing * Math.sqrt(3) / 2;
        const numRows = Math.floor(widthIn / rowSpacing) + 1;
        let totalPlants = 0;
        for (let r = 0; r < numRows; r++) {
          const offset = r % 2 === 1 ? spacing / 2 : 0;
          const plantsInRow = Math.floor((lengthIn - offset) / spacing) + 1;
          totalPlants += plantsInRow;
        }
        const gridPlants = (Math.floor(lengthIn / spacing) + 1) * (Math.floor(widthIn / spacing) + 1);
        const extraPlants = totalPlants - gridPlants;
        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details: [
            { label: "Number of rows", value: `${numRows}` },
            { label: "Row spacing", value: `${formatNumber(rowSpacing, 1)} inches` },
            { label: "vs. square grid", value: `${gridPlants} plants (+${Math.max(0, extraPlants)} extra)` },
            { label: "Efficiency gain", value: `~15% more plants than square grid` },
          ],
          note: "Triangular spacing fits about 15% more plants than a square grid with the same minimum spacing between plants.",
        };
      },
    },
  ],
  relatedSlugs: ["garden-yield-calculator", "raised-garden-bed-calculator", "grass-seed-calculator"],
  faq: [
    { question: "What spacing should I use for common vegetables?", answer: "Common spacing: Tomatoes 24-36\", Peppers 18-24\", Lettuce 6-12\", Beans 4-6\", Corn 12\", Squash 36-48\", Carrots 2-3\", Onions 4-6\", Cucumbers 12-18\" (with trellis). Always check seed packet recommendations." },
    { question: "What is square foot gardening?", answer: "Square foot gardening divides beds into 1-foot squares, each planted with a specific number of plants based on spacing: 1 plant per square (12\" spacing), 4 per square (6\"), 9 per square (4\"), or 16 per square (3\")." },
    { question: "Does triangular spacing really help?", answer: "Yes, triangular (offset/staggered) spacing fits about 15% more plants than a square grid while maintaining the same minimum distance between plants. It is especially useful for ground covers, flowers, and dense plantings." },
  ],
  formula: "Row: Plants = (Length/Spacing + 1) × (Width/RowSpacing + 1) | Triangular Row Spacing = PlantSpacing × √3/2",
};

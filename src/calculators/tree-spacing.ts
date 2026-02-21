import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treeSpacingCalculator: CalculatorDefinition = {
  slug: "tree-spacing-calculator",
  title: "Tree Spacing Calculator (Orchard)",
  description: "Free tree spacing calculator for orchards. Calculate how many trees fit in your space, optimal spacing by fruit tree type, and orchard layout for maximum production.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tree spacing calculator", "orchard tree spacing", "fruit tree spacing", "how many trees per acre", "orchard layout calculator"],
  variants: [
    {
      id: "by-tree-type",
      name: "By Tree Type",
      description: "Get spacing recommendations based on fruit tree type",
      fields: [
        { name: "plotLength", label: "Plot Length (ft)", type: "number", placeholder: "e.g. 100" },
        { name: "plotWidth", label: "Plot Width (ft)", type: "number", placeholder: "e.g. 100" },
        { name: "treeType", label: "Tree Type", type: "select", options: [
          { label: "Apple (Standard)", value: "apple_standard" },
          { label: "Apple (Semi-Dwarf)", value: "apple_semidwarf" },
          { label: "Apple (Dwarf)", value: "apple_dwarf" },
          { label: "Peach/Nectarine", value: "peach" },
          { label: "Pear (Standard)", value: "pear" },
          { label: "Cherry (Sweet)", value: "cherry_sweet" },
          { label: "Cherry (Sour)", value: "cherry_sour" },
          { label: "Plum", value: "plum" },
          { label: "Citrus (Orange/Lemon)", value: "citrus" },
          { label: "Avocado", value: "avocado" },
          { label: "Fig", value: "fig" },
          { label: "Pecan", value: "pecan" },
        ], defaultValue: "apple_semidwarf" },
        { name: "layout", label: "Planting Pattern", type: "select", options: [
          { label: "Square Grid", value: "square" },
          { label: "Triangular/Offset", value: "triangular" },
          { label: "Hedgerow (High Density)", value: "hedgerow" },
        ], defaultValue: "square" },
      ],
      calculate: (inputs) => {
        const plotLength = inputs.plotLength as number;
        const plotWidth = inputs.plotWidth as number;
        const treeType = inputs.treeType as string;
        const layout = inputs.layout as string;
        if (!plotLength || !plotWidth) return null;

        const spacingData: Record<string, { inRow: number; betweenRows: number }> = {
          apple_standard: { inRow: 25, betweenRows: 30 },
          apple_semidwarf: { inRow: 15, betweenRows: 20 },
          apple_dwarf: { inRow: 8, betweenRows: 14 },
          peach: { inRow: 18, betweenRows: 22 },
          pear: { inRow: 20, betweenRows: 25 },
          cherry_sweet: { inRow: 22, betweenRows: 25 },
          cherry_sour: { inRow: 18, betweenRows: 22 },
          plum: { inRow: 18, betweenRows: 22 },
          citrus: { inRow: 15, betweenRows: 20 },
          avocado: { inRow: 25, betweenRows: 25 },
          fig: { inRow: 15, betweenRows: 20 },
          pecan: { inRow: 40, betweenRows: 40 },
        };

        const spacing = spacingData[treeType] || { inRow: 20, betweenRows: 25 };
        let inRow = spacing.inRow;
        let betweenRows = spacing.betweenRows;

        if (layout === "hedgerow") {
          inRow = Math.max(4, inRow * 0.5);
          betweenRows = betweenRows * 0.8;
        }

        const treesPerRow = Math.floor(plotLength / inRow) + 1;
        const numRows = Math.floor(plotWidth / betweenRows) + 1;
        let totalTrees = treesPerRow * numRows;

        if (layout === "triangular") {
          totalTrees = Math.floor(totalTrees * 1.15);
        }

        const plotArea = plotLength * plotWidth;
        const acres = plotArea / 43560;
        const treesPerAcre = acres > 0 ? totalTrees / acres : 0;

        return {
          primary: { label: "Total Trees", value: `${totalTrees}` },
          details: [
            { label: "In-row spacing", value: `${formatNumber(inRow, 0)} ft` },
            { label: "Between-row spacing", value: `${formatNumber(betweenRows, 0)} ft` },
            { label: "Trees per row", value: `${treesPerRow}` },
            { label: "Number of rows", value: `${numRows}` },
            { label: "Plot area", value: `${formatNumber(plotArea, 0)} sq ft (${formatNumber(acres, 2)} acres)` },
            { label: "Trees per acre", value: formatNumber(treesPerAcre, 0) },
          ],
          note: "Leave a buffer of 5-10 feet from property lines and structures. Trees need adequate spacing for air circulation, sunlight, and equipment access.",
        };
      },
    },
    {
      id: "custom-spacing",
      name: "Custom Spacing",
      description: "Calculate trees with custom spacing distances",
      fields: [
        { name: "plotLength", label: "Plot Length (ft)", type: "number", placeholder: "e.g. 200" },
        { name: "plotWidth", label: "Plot Width (ft)", type: "number", placeholder: "e.g. 200" },
        { name: "inRowSpacing", label: "Spacing Within Rows (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "rowSpacing", label: "Spacing Between Rows (ft)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const length = inputs.plotLength as number;
        const width = inputs.plotWidth as number;
        const inRow = inputs.inRowSpacing as number;
        const betweenRow = inputs.rowSpacing as number;
        if (!length || !width || !inRow || !betweenRow) return null;

        const treesPerRow = Math.floor(length / inRow) + 1;
        const numRows = Math.floor(width / betweenRow) + 1;
        const totalTrees = treesPerRow * numRows;
        const acres = (length * width) / 43560;
        const treesPerAcre = acres > 0 ? totalTrees / acres : 0;

        return {
          primary: { label: "Total Trees", value: `${totalTrees}` },
          details: [
            { label: "Trees per row", value: `${treesPerRow}` },
            { label: "Number of rows", value: `${numRows}` },
            { label: "Trees per acre", value: formatNumber(treesPerAcre, 0) },
            { label: "Plot area", value: `${formatNumber(length * width, 0)} sq ft (${formatNumber(acres, 2)} acres)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fruit-tree-yield-calculator", "plant-spacing-calculator", "tree-height-calculator"],
  faq: [
    { question: "How far apart should fruit trees be planted?", answer: "Standard fruit trees: 20-30 ft apart. Semi-dwarf: 12-18 ft. Dwarf: 6-10 ft. Spacing depends on mature canopy size. Closer spacing increases density but requires more pruning. Allow enough space for air circulation to prevent disease." },
    { question: "How many fruit trees per acre?", answer: "Standard trees: 50-70 per acre. Semi-dwarf: 100-200 per acre. Dwarf: 200-500 per acre. High-density hedgerow plantings can fit 500-1,000+ dwarf trees per acre, commonly used in commercial apple production." },
    { question: "What is the best layout for an orchard?", answer: "Square grid is simplest for small orchards. Triangular/offset fits 15% more trees. Hedgerow/high-density is best for commercial production with dwarf rootstocks. Orient rows north-south for even sunlight distribution." },
  ],
  formula: "Trees = (Plot Length / In-Row Spacing + 1) × (Plot Width / Row Spacing + 1) | Trees/Acre = Total Trees / (Area / 43,560)",
};

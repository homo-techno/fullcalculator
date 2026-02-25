import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gardenRowSpacingCalculator: CalculatorDefinition = {
  slug: "garden-row-spacing-calculator",
  title: "Garden Row Spacing Calculator",
  description: "Free garden row spacing calculator. Determine proper row spacing, plant count, and layout for your vegetable or flower garden rows.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garden row spacing", "vegetable row spacing", "how far apart rows", "garden layout calculator", "planting row calculator"],
  variants: [
    {
      id: "by-vegetable",
      name: "Row Spacing by Vegetable",
      description: "Get recommended row and plant spacing for common vegetables",
      fields: [
        { name: "vegetable", label: "Vegetable", type: "select", options: [
          { label: "Tomatoes", value: "tomato" },
          { label: "Peppers", value: "pepper" },
          { label: "Beans (bush)", value: "bush-bean" },
          { label: "Beans (pole)", value: "pole-bean" },
          { label: "Peas", value: "pea" },
          { label: "Corn", value: "corn" },
          { label: "Squash / Pumpkin", value: "squash" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Carrots", value: "carrot" },
          { label: "Lettuce", value: "lettuce" },
          { label: "Onions", value: "onion" },
          { label: "Potatoes", value: "potato" },
        ], defaultValue: "tomato" },
        { name: "rowLength", label: "Row Length (feet)", type: "number", placeholder: "e.g. 25" },
        { name: "numRows", label: "Number of Rows", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const vegetable = inputs.vegetable as string;
        const rowLength = inputs.rowLength as number;
        const numRows = (inputs.numRows as number) || 1;

        const vegData: Record<string, { rowSpace: number; plantSpace: number; depth: string; daysToHarvest: string }> = {
          tomato: { rowSpace: 48, plantSpace: 24, depth: "1/4 inch", daysToHarvest: "60-85 days" },
          pepper: { rowSpace: 30, plantSpace: 18, depth: "1/4 inch", daysToHarvest: "60-90 days" },
          "bush-bean": { rowSpace: 24, plantSpace: 4, depth: "1 inch", daysToHarvest: "50-60 days" },
          "pole-bean": { rowSpace: 36, plantSpace: 6, depth: "1 inch", daysToHarvest: "60-70 days" },
          pea: { rowSpace: 24, plantSpace: 3, depth: "1 inch", daysToHarvest: "55-70 days" },
          corn: { rowSpace: 36, plantSpace: 12, depth: "1.5 inches", daysToHarvest: "60-100 days" },
          squash: { rowSpace: 72, plantSpace: 36, depth: "1 inch", daysToHarvest: "50-100 days" },
          cucumber: { rowSpace: 48, plantSpace: 12, depth: "1/2 inch", daysToHarvest: "50-70 days" },
          carrot: { rowSpace: 18, plantSpace: 2, depth: "1/4 inch", daysToHarvest: "70-80 days" },
          lettuce: { rowSpace: 18, plantSpace: 6, depth: "1/4 inch", daysToHarvest: "30-60 days" },
          onion: { rowSpace: 18, plantSpace: 4, depth: "1/2 inch", daysToHarvest: "90-120 days" },
          potato: { rowSpace: 36, plantSpace: 12, depth: "4 inches", daysToHarvest: "70-120 days" },
        };

        const data = vegData[vegetable];
        if (!data || !rowLength) return null;

        const plantsPerRow = Math.floor((rowLength * 12) / data.plantSpace);
        const totalPlants = plantsPerRow * numRows;
        const gardenWidth = (numRows - 1) * (data.rowSpace / 12) + 1;
        const gardenArea = gardenWidth * rowLength;

        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details: [
            { label: "Row spacing", value: `${data.rowSpace} inches (${formatNumber(data.rowSpace / 12, 1)} ft)` },
            { label: "Plant spacing in row", value: `${data.plantSpace} inches` },
            { label: "Plants per row", value: `${plantsPerRow}` },
            { label: "Planting depth", value: data.depth },
            { label: "Days to harvest", value: data.daysToHarvest },
            { label: "Garden area needed", value: `${formatNumber(gardenArea, 1)} sq ft` },
          ],
          note: "Spacing may be reduced for intensive gardening methods. Leave enough room between rows for walking and maintenance.",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Row Layout",
      description: "Calculate plant count for any custom spacing",
      fields: [
        { name: "rowLength", label: "Row Length (feet)", type: "number", placeholder: "e.g. 25" },
        { name: "numRows", label: "Number of Rows", type: "number", placeholder: "e.g. 6" },
        { name: "rowSpacing", label: "Space Between Rows (inches)", type: "number", placeholder: "e.g. 30" },
        { name: "plantSpacing", label: "Space Between Plants (inches)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const rowLength = inputs.rowLength as number;
        const numRows = inputs.numRows as number;
        const rowSpacing = inputs.rowSpacing as number;
        const plantSpacing = inputs.plantSpacing as number;
        if (!rowLength || !numRows || !rowSpacing || !plantSpacing) return null;

        const plantsPerRow = Math.floor((rowLength * 12) / plantSpacing);
        const totalPlants = plantsPerRow * numRows;
        const gardenWidth = ((numRows - 1) * rowSpacing) / 12;
        const gardenArea = (gardenWidth + 1) * rowLength;

        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details: [
            { label: "Plants per row", value: `${plantsPerRow}` },
            { label: "Number of rows", value: `${numRows}` },
            { label: "Garden width", value: `${formatNumber(gardenWidth + 1, 1)} ft` },
            { label: "Total garden area", value: `${formatNumber(gardenArea, 1)} sq ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["vegetable-garden-size-calculator", "square-foot-garden-calculator", "seed-germination-calculator"],
  faq: [
    { question: "How far apart should vegetable rows be?", answer: "It depends on the crop: small crops (lettuce, carrots) need 18\" between rows, medium (peppers, beans) need 24-36\", and large (tomatoes, squash) need 36-72\". Leave enough space for walking." },
    { question: "Can rows be closer together in raised beds?", answer: "Yes, raised beds allow intensive spacing since you do not walk between plants. You can typically reduce row spacing by 25-50% compared to traditional row gardens." },
  ],
  formula: "Plants per Row = (Row Length \u00D7 12) / Plant Spacing | Total = Plants per Row \u00D7 Rows",
};

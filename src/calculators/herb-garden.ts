import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const herbGardenCalculator: CalculatorDefinition = {
  slug: "herb-garden-calculator",
  title: "Herb Garden Spacing Calculator",
  description: "Free herb garden spacing calculator. Determine how many herb plants fit in your garden space with proper spacing for healthy growth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["herb garden spacing", "herb planting calculator", "herb garden planner", "how far apart to plant herbs", "herb spacing guide"],
  variants: [
    {
      id: "by-area",
      name: "Herbs by Garden Area",
      description: "Calculate how many herb plants fit in a given area",
      fields: [
        { name: "length", label: "Garden Length (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "width", label: "Garden Width (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "herb", label: "Herb Type", type: "select", options: [
          { label: "Basil (12\" spacing)", value: "12" },
          { label: "Parsley (8\" spacing)", value: "8" },
          { label: "Cilantro (6\" spacing)", value: "6" },
          { label: "Rosemary (18\" spacing)", value: "18" },
          { label: "Thyme (9\" spacing)", value: "9" },
          { label: "Mint (18\" spacing)", value: "18" },
          { label: "Oregano (12\" spacing)", value: "12" },
          { label: "Chives (6\" spacing)", value: "6" },
          { label: "Dill (10\" spacing)", value: "10" },
          { label: "Sage (18\" spacing)", value: "18" },
        ], defaultValue: "12" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const spacing = parseInt(inputs.herb as string) || 12;
        if (!length || !width) return null;

        const rows = Math.floor(width / spacing);
        const plantsPerRow = Math.floor(length / spacing);
        const totalPlants = rows * plantsPerRow;
        const areaSqFt = (length * width) / 144;

        return {
          primary: { label: "Number of Plants", value: `${totalPlants}` },
          details: [
            { label: "Rows", value: `${rows}` },
            { label: "Plants per row", value: `${plantsPerRow}` },
            { label: "Spacing", value: `${spacing} inches apart` },
            { label: "Garden area", value: `${formatNumber(areaSqFt, 1)} sq ft` },
          ],
          note: "Allow herbs room to spread. Mint should be planted in containers as it spreads aggressively.",
        };
      },
    },
    {
      id: "by-plants",
      name: "Space Needed for Herbs",
      description: "Calculate the space needed for a specific number of herb plants",
      fields: [
        { name: "plants", label: "Number of Plants", type: "number", placeholder: "e.g. 10" },
        { name: "herb", label: "Herb Type", type: "select", options: [
          { label: "Basil (12\" spacing)", value: "12" },
          { label: "Parsley (8\" spacing)", value: "8" },
          { label: "Cilantro (6\" spacing)", value: "6" },
          { label: "Rosemary (18\" spacing)", value: "18" },
          { label: "Thyme (9\" spacing)", value: "9" },
          { label: "Mint (18\" spacing)", value: "18" },
          { label: "Oregano (12\" spacing)", value: "12" },
          { label: "Chives (6\" spacing)", value: "6" },
        ], defaultValue: "12" },
      ],
      calculate: (inputs) => {
        const plants = inputs.plants as number;
        const spacing = parseInt(inputs.herb as string) || 12;
        if (!plants) return null;

        const areaPerPlant = spacing * spacing;
        const totalAreaSqIn = plants * areaPerPlant;
        const totalAreaSqFt = totalAreaSqIn / 144;
        const sideLengthIn = Math.ceil(Math.sqrt(totalAreaSqIn));

        return {
          primary: { label: "Space Needed", value: `${formatNumber(totalAreaSqFt, 1)} sq ft` },
          details: [
            { label: "Total area (sq inches)", value: formatNumber(totalAreaSqIn) },
            { label: "Minimum square dimension", value: `${sideLengthIn}\" × ${sideLengthIn}\"` },
            { label: "Spacing per plant", value: `${spacing}\" × ${spacing}\"` },
            { label: "Number of plants", value: `${plants}` },
          ],
          note: "Consider companion planting: basil pairs well with tomatoes, chives with carrots, and dill with lettuce.",
        };
      },
    },
  ],
  relatedSlugs: ["vegetable-garden-size-calculator", "garden-row-spacing-calculator", "square-foot-garden-calculator"],
  faq: [
    { question: "How far apart should herbs be planted?", answer: "Small herbs like chives and cilantro need 6 inches. Medium herbs like basil and oregano need 12 inches. Large herbs like rosemary and sage need 18-24 inches." },
    { question: "Can herbs be planted close together?", answer: "Some herbs grow well together (basil and parsley), but many compete for resources. Follow spacing guidelines and keep aggressive spreaders like mint in separate containers." },
  ],
  formula: "Plants = (Length / Spacing) × (Width / Spacing)",
};

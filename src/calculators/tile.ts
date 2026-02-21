import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tileCalculator: CalculatorDefinition = {
  slug: "tile-calculator",
  title: "Tile Calculator",
  description: "Free tile calculator. Calculate how many tiles you need for floors, walls, and backsplashes. Estimate cost and account for waste.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tile calculator", "how many tiles do I need", "tile area calculator", "flooring tile calculator", "tile cost estimator"],
  variants: [
    {
      id: "tiles",
      name: "Tiles Needed",
      fields: [
        { name: "areaLength", label: "Area Length (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "areaWidth", label: "Area Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "tileSize", label: "Tile Size", type: "select", options: [
          { label: "12×12 inches", value: "1" }, { label: "18×18 inches", value: "2.25" },
          { label: "24×24 inches", value: "4" }, { label: "6×6 inches", value: "0.25" },
          { label: "4×12 inches (subway)", value: "0.333" }, { label: "3×6 inches", value: "0.125" },
        ], defaultValue: "1" },
        { name: "waste", label: "Waste Factor", type: "select", options: [
          { label: "10% (standard)", value: "10" }, { label: "15% (diagonal/complex)", value: "15" }, { label: "5% (simple layout)", value: "5" },
        ], defaultValue: "10" },
        { name: "price", label: "Price per Tile (optional)", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.areaLength as number;
        const width = inputs.areaWidth as number;
        const tileSqFt = parseFloat(inputs.tileSize as string) || 1;
        const wastePct = parseInt(inputs.waste as string) || 10;
        const price = inputs.price as number;
        if (!length || !width) return null;
        const areaSqFt = length * width;
        const tilesExact = areaSqFt / tileSqFt;
        const tilesWithWaste = Math.ceil(tilesExact * (1 + wastePct / 100));
        const details = [
          { label: "Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Tiles (exact)", value: formatNumber(tilesExact, 0) },
          { label: "With waste", value: `${tilesWithWaste} tiles` },
          { label: "Waste factor", value: `${wastePct}%` },
        ];
        if (price) {
          details.push({ label: "Tile cost", value: `$${formatNumber(tilesWithWaste * price)}` });
        }
        return {
          primary: { label: "Tiles Needed", value: `${tilesWithWaste}` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "paint-calculator", "concrete-calculator"],
  faq: [
    { question: "How much extra tile should I buy?", answer: "Buy 10% extra for standard layouts, 15% for diagonal or complex patterns. Keep a few spare tiles for future repairs." },
  ],
  formula: "Tiles = (Area ÷ Tile Size) × (1 + Waste%)",
};

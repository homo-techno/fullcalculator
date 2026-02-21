import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const showerTileCalculator: CalculatorDefinition = {
  slug: "shower-tile-calculator",
  title: "Shower Tile Calculator",
  description: "Free shower tile calculator. Calculate how many tiles you need for shower walls, floor, ceiling, and niches with accurate waste estimates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shower tile calculator", "shower wall tile", "shower floor tile", "tile for shower", "how much tile for shower"],
  variants: [
    {
      id: "shower-walls",
      name: "Shower Wall Tiles",
      description: "Calculate tiles for shower enclosure walls",
      fields: [
        { name: "showerWidth", label: "Shower Width (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "showerDepth", label: "Shower Depth (inches)", type: "number", placeholder: "e.g. 32" },
        { name: "showerHeight", label: "Tile Height (inches)", type: "number", placeholder: "e.g. 84", defaultValue: 84 },
        { name: "showerType", label: "Shower Type", type: "select", options: [
          { label: "3-Wall Alcove (tub/shower)", value: "alcove" },
          { label: "Corner (2 walls + 2 glass)", value: "corner" },
          { label: "Walk-In (3 walls + glass)", value: "walkin" },
        ], defaultValue: "alcove" },
        { name: "tileSize", label: "Tile Size", type: "select", options: [
          { label: "3\" × 6\" (Subway)", value: "18" },
          { label: "4\" × 12\"", value: "48" },
          { label: "6\" × 6\"", value: "36" },
          { label: "12\" × 12\"", value: "144" },
          { label: "12\" × 24\"", value: "288" },
          { label: "4\" × 16\"", value: "64" },
        ], defaultValue: "18" },
        { name: "includeNiche", label: "Include Shower Niche?", type: "select", options: [
          { label: "No Niche", value: "0" },
          { label: "Small Niche (12\"×12\")", value: "3" },
          { label: "Large Niche (12\"×24\")", value: "5" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const showerWidth = inputs.showerWidth as number;
        const showerDepth = inputs.showerDepth as number;
        const showerHeight = (inputs.showerHeight as number) || 84;
        const showerType = inputs.showerType as string;
        const tileSqIn = parseInt(inputs.tileSize as string) || 18;
        const nicheSqFt = parseInt(inputs.includeNiche as string) || 0;
        if (!showerWidth || !showerDepth) return null;

        let wallSqIn: number;
        switch (showerType) {
          case "alcove":
            wallSqIn = (showerWidth + showerDepth * 2) * showerHeight;
            break;
          case "corner":
            wallSqIn = (showerWidth + showerDepth) * showerHeight;
            break;
          case "walkin":
            wallSqIn = (showerWidth + showerDepth * 2) * showerHeight;
            break;
          default:
            wallSqIn = (showerWidth + showerDepth * 2) * showerHeight;
        }

        const wallSqFt = wallSqIn / 144 + nicheSqFt;
        const tileSqFt = tileSqIn / 144;
        const tilesExact = Math.ceil(wallSqFt / tileSqFt);
        const tilesWithWaste = Math.ceil(tilesExact * 1.15); // 15% waste for shower cuts

        return {
          primary: { label: "Shower Wall Tiles", value: `${tilesWithWaste} tiles` },
          details: [
            { label: "Wall area", value: `${formatNumber(wallSqFt, 1)} sq ft` },
            { label: "Tiles (exact)", value: `${tilesExact}` },
            { label: "Tiles (with 15% waste)", value: `${tilesWithWaste}` },
            { label: "Square feet of tile", value: `${formatNumber(tilesWithWaste * tileSqFt, 1)} sq ft` },
            { label: "Shower niche tile", value: nicheSqFt > 0 ? `${nicheSqFt} sq ft extra` : "Not included" },
          ],
          note: "Shower tile typically requires 15% waste factor due to cuts around fixtures, corners, and edges. Use waterproof membrane (Kerdi, RedGard) behind all shower tile.",
        };
      },
    },
    {
      id: "shower-floor",
      name: "Shower Floor Tiles",
      description: "Calculate tiles for the shower pan / floor",
      fields: [
        { name: "showerWidth", label: "Shower Width (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "showerDepth", label: "Shower Depth (inches)", type: "number", placeholder: "e.g. 32" },
        { name: "tileSize", label: "Floor Tile Size", type: "select", options: [
          { label: "1\" × 1\" Mosaic (12\"×12\" sheet)", value: "144" },
          { label: "2\" × 2\" Mosaic (12\"×12\" sheet)", value: "144" },
          { label: "Hexagon 2\" (12\"×12\" sheet)", value: "144" },
          { label: "4\" × 4\"", value: "16" },
          { label: "6\" × 6\"", value: "36" },
        ], defaultValue: "144" },
        { name: "curb", label: "Include Shower Curb?", type: "select", options: [
          { label: "Yes (standard 5\" × 3\" curb)", value: "yes" },
          { label: "No (curbless / linear drain)", value: "no" },
        ], defaultValue: "yes" },
      ],
      calculate: (inputs) => {
        const showerWidth = inputs.showerWidth as number;
        const showerDepth = inputs.showerDepth as number;
        const tileSqIn = parseInt(inputs.tileSize as string) || 144;
        const curb = inputs.curb as string;
        if (!showerWidth || !showerDepth) return null;

        const floorSqIn = showerWidth * showerDepth;
        let floorSqFt = floorSqIn / 144;

        let curbSqFt = 0;
        if (curb === "yes") {
          // Curb: top (5" wide × shower width) + 2 sides (3" × shower width)
          curbSqFt = (showerWidth * (5 + 3 + 3)) / 144;
          floorSqFt += curbSqFt;
        }

        const tileSqFt = tileSqIn / 144;
        const tilesExact = Math.ceil(floorSqFt / tileSqFt);
        const tilesWithWaste = Math.ceil(tilesExact * 1.15);

        return {
          primary: { label: "Shower Floor Tiles", value: `${tilesWithWaste} tiles/sheets` },
          details: [
            { label: "Shower floor area", value: `${formatNumber(floorSqIn / 144, 2)} sq ft` },
            { label: "Curb tile area", value: curbSqFt > 0 ? `${formatNumber(curbSqFt, 2)} sq ft` : "Not included" },
            { label: "Total tile area", value: `${formatNumber(floorSqFt, 2)} sq ft` },
            { label: "Tiles/sheets (exact)", value: `${tilesExact}` },
            { label: "Tiles/sheets (with 15% waste)", value: `${tilesWithWaste}` },
          ],
          note: "Shower floors must slope toward the drain at 1/4\" per foot. Use small tiles (2\" or less) for better drainage slope conformity. Larger tiles won't follow the slope properly.",
        };
      },
    },
  ],
  relatedSlugs: ["bathroom-tile-calculator", "tile-calculator", "grout-calculator"],
  faq: [
    { question: "What size tile is best for shower walls?", answer: "Subway tile (3\"×6\") is the most popular. Larger tiles (12\"×24\") create a modern look with fewer grout lines. For shower floors, use small tiles (2\"×2\" or smaller) that can follow the drain slope. Avoid large floor tiles in showers." },
    { question: "How much extra tile should I buy for a shower?", answer: "Buy 15% extra tile for showers. The many cuts around fixtures (showerhead, valve, niche, corners) create more waste than flat wall tiling. Keep leftover tiles for future repairs." },
  ],
  formula: "Wall Area = (Width + 2 × Depth) × Height / 144 | Floor Area = Width × Depth / 144 | Tiles = Area / Tile Size × 1.15",
};

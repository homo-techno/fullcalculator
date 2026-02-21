import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bathroomTileCalculator: CalculatorDefinition = {
  slug: "bathroom-tile-calculator",
  title: "Bathroom Tile Calculator",
  description: "Free bathroom tile calculator. Calculate tiles needed for bathroom floors and walls, including waste factor and grout coverage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bathroom tile calculator", "bathroom floor tile", "bathroom wall tile", "tile for bathroom", "how much tile for bathroom"],
  variants: [
    {
      id: "bathroom-floor",
      name: "Bathroom Floor Tiles",
      description: "Calculate tiles needed for the bathroom floor",
      fields: [
        { name: "length", label: "Bathroom Length (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Bathroom Width (feet)", type: "number", placeholder: "e.g. 5" },
        { name: "tileSize", label: "Floor Tile Size", type: "select", options: [
          { label: "12\" × 12\"", value: "144" },
          { label: "12\" × 24\"", value: "288" },
          { label: "6\" × 6\"", value: "36" },
          { label: "18\" × 18\"", value: "324" },
          { label: "24\" × 24\"", value: "576" },
          { label: "Hexagon (6\" across)", value: "31" },
          { label: "Penny Round (1\" mosaic sheet 12\"×12\")", value: "144" },
        ], defaultValue: "144" },
        { name: "waste", label: "Waste Factor", type: "select", options: [
          { label: "10% (Standard)", value: "10" },
          { label: "15% (Diagonal / Complex)", value: "15" },
          { label: "20% (Intricate Pattern)", value: "20" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const tileSqIn = parseInt(inputs.tileSize as string) || 144;
        const wastePct = parseInt(inputs.waste as string) || 10;
        if (!length || !width) return null;

        const floorSqFt = length * width;
        // Deduct toilet footprint (~2 sq ft) and vanity (~4.5 sq ft)
        const adjustedSqFt = Math.max(floorSqFt - 6.5, floorSqFt * 0.85);
        const tileSqFt = tileSqIn / 144;
        const tilesNeeded = Math.ceil(adjustedSqFt / tileSqFt);
        const tilesWithWaste = Math.ceil(tilesNeeded * (1 + wastePct / 100));
        const boxesNeeded = Math.ceil(tilesWithWaste / (tileSqIn <= 36 ? 25 : tileSqIn <= 144 ? 12 : 6));

        return {
          primary: { label: "Tiles Needed", value: `${tilesWithWaste} tiles` },
          details: [
            { label: "Floor area (total)", value: `${formatNumber(floorSqFt, 1)} sq ft` },
            { label: "Tileable area (minus fixtures)", value: `${formatNumber(adjustedSqFt, 1)} sq ft` },
            { label: "Tiles (without waste)", value: `${tilesNeeded}` },
            { label: "Tiles (with " + wastePct + "% waste)", value: `${tilesWithWaste}` },
            { label: "Estimated boxes", value: `${boxesNeeded}` },
            { label: "Tile size", value: `${formatNumber(tileSqFt, 2)} sq ft each` },
          ],
          note: "Floor area is adjusted for toilet (~2 sq ft) and vanity (~4.5 sq ft). Order extra tiles for future repairs.",
        };
      },
    },
    {
      id: "bathroom-walls",
      name: "Bathroom Wall Tiles",
      description: "Calculate tiles for bathroom walls (full or partial height)",
      fields: [
        { name: "perimeter", label: "Wall Perimeter / Total Wall Length (feet)", type: "number", placeholder: "e.g. 26" },
        { name: "tileHeight", label: "Tile Height on Wall", type: "select", options: [
          { label: "Wainscot (4 feet)", value: "4" },
          { label: "Half Wall (5 feet)", value: "5" },
          { label: "3/4 Wall (6 feet)", value: "6" },
          { label: "Full Wall (8 feet)", value: "8" },
          { label: "Full Wall (9 feet)", value: "9" },
        ], defaultValue: "8" },
        { name: "tileSize", label: "Wall Tile Size", type: "select", options: [
          { label: "3\" × 6\" (Subway)", value: "18" },
          { label: "4\" × 8\"", value: "32" },
          { label: "4\" × 12\"", value: "48" },
          { label: "6\" × 6\"", value: "36" },
          { label: "12\" × 12\"", value: "144" },
          { label: "12\" × 24\"", value: "288" },
          { label: "1\" × 1\" Mosaic (12\"×12\" sheet)", value: "144" },
        ], defaultValue: "18" },
        { name: "deductions", label: "Deductions for Door/Window", type: "select", options: [
          { label: "None", value: "0" },
          { label: "1 Door (~21 sq ft)", value: "21" },
          { label: "1 Door + 1 Window (~35 sq ft)", value: "35" },
          { label: "1 Door + 2 Windows (~49 sq ft)", value: "49" },
        ], defaultValue: "21" },
        { name: "waste", label: "Waste Factor", type: "select", options: [
          { label: "10% (Standard)", value: "10" },
          { label: "15% (Complex Pattern)", value: "15" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const perimeter = inputs.perimeter as number;
        const tileHeight = parseFloat(inputs.tileHeight as string) || 8;
        const tileSqIn = parseInt(inputs.tileSize as string) || 18;
        const deductions = parseInt(inputs.deductions as string) || 0;
        const wastePct = parseInt(inputs.waste as string) || 10;
        if (!perimeter) return null;

        const wallSqFt = perimeter * tileHeight - deductions;
        const tileSqFt = tileSqIn / 144;
        const tilesNeeded = Math.ceil(wallSqFt / tileSqFt);
        const tilesWithWaste = Math.ceil(tilesNeeded * (1 + wastePct / 100));

        return {
          primary: { label: "Wall Tiles Needed", value: `${tilesWithWaste} tiles` },
          details: [
            { label: "Total wall area", value: `${formatNumber(perimeter * tileHeight, 1)} sq ft` },
            { label: "After deductions", value: `${formatNumber(wallSqFt, 1)} sq ft` },
            { label: "Tiles (without waste)", value: `${tilesNeeded}` },
            { label: "Tiles (with " + wastePct + "% waste)", value: `${tilesWithWaste}` },
            { label: "Tile coverage height", value: `${tileHeight} feet` },
          ],
          note: "For subway tile patterns (brick lay), add an extra 5% waste due to offset cuts. Accent tiles and borders are not included.",
        };
      },
    },
  ],
  relatedSlugs: ["tile-calculator", "shower-tile-calculator", "grout-calculator"],
  faq: [
    { question: "How much tile do I need for a small bathroom?", answer: "A typical 5'×8' bathroom needs about 40 sq ft of floor tile and 150-200 sq ft of wall tile (for full-height walls). With a 10% waste factor, plan for 44 sq ft of floor tile and 165-220 sq ft of wall tile." },
    { question: "Should I use the same tile on bathroom floors and walls?", answer: "You can, but floor tiles must have a slip-resistant rating (COF ≥ 0.42 for wet areas). Smaller floor tiles (2\"×2\" mosaics) provide more grout lines for grip. Wall tiles can be any finish since slip resistance is not a concern." },
  ],
  formula: "Floor Tiles = (L × W - Fixtures) / Tile Area × (1 + Waste%) | Wall Tiles = (Perimeter × Height - Openings) / Tile Area × (1 + Waste%)",
};

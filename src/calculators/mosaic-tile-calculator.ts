import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mosaicTileCalculator: CalculatorDefinition = {
  slug: "mosaic-tile-calculator",
  title: "Mosaic Tile Calculator",
  description: "Calculate the number of mosaic tiles, grout, and adhesive needed for mosaic art projects based on area and tile size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mosaic tile calculator","mosaic art supplies","tessera count","mosaic grout"],
  variants: [{
    id: "standard",
    name: "Mosaic Tile",
    description: "Calculate the number of mosaic tiles, grout, and adhesive needed for mosaic art projects based on area and tile size.",
    fields: [
      { name: "projectWidth", label: "Project Width (inches)", type: "number", min: 2, max: 120, defaultValue: 18 },
      { name: "projectHeight", label: "Project Height (inches)", type: "number", min: 2, max: 120, defaultValue: 18 },
      { name: "tileSize", label: "Tile Size", type: "select", options: [{ value: "0.375", label: "3/8 inch Micro" }, { value: "0.5", label: "1/2 inch Mini" }, { value: "0.75", label: "3/4 inch Standard" }, { value: "1", label: "1 inch Large" }], defaultValue: "0.75" },
      { name: "groutGap", label: "Grout Gap (inches)", type: "number", min: 0.03, max: 0.25, defaultValue: 0.0625 },
      { name: "coverage", label: "Coverage (%)", type: "number", min: 50, max: 100, defaultValue: 95 },
    ],
    calculate: (inputs) => {
    const pw = inputs.projectWidth as number;
    const ph = inputs.projectHeight as number;
    const tileSize = parseFloat(inputs.tileSize as string);
    const gap = inputs.groutGap as number;
    const coverage = inputs.coverage as number;
    const projectArea = pw * ph;
    const coveredArea = projectArea * (coverage / 100);
    const tileWithGap = tileSize + gap;
    const tilesAcross = Math.floor(pw / tileWithGap);
    const tilesDown = Math.floor(ph / tileWithGap);
    const totalTiles = Math.ceil(tilesAcross * tilesDown * (coverage / 100));
    const wasteTiles = Math.ceil(totalTiles * 0.15);
    const tilesToBuy = totalTiles + wasteTiles;
    const groutArea = coveredArea - (totalTiles * tileSize * tileSize);
    const groutOz = Math.round(Math.max(groutArea, 0) * 0.5 * 10) / 10;
    return {
      primary: { label: "Tiles Needed (with waste)", value: formatNumber(tilesToBuy) },
      details: [
        { label: "Exact Tile Count", value: formatNumber(totalTiles) },
        { label: "Extra for Waste (15%)", value: formatNumber(wasteTiles) },
        { label: "Grout Needed", value: formatNumber(groutOz) + " oz" },
        { label: "Project Area", value: formatNumber(Math.round(projectArea * 10) / 10) + " sq in" }
      ]
    };
  },
  }],
  relatedSlugs: ["stained-glass-area-calculator","resin-art-volume-calculator"],
  faq: [
    { question: "How many mosaic tiles do I need?", answer: "Divide your project area by the tile area (including grout gaps), then add 10 to 15 percent for breakage and waste during cutting." },
    { question: "What size mosaic tile is best for beginners?", answer: "Three quarter inch tiles are the most versatile for beginners. They are large enough to handle easily but small enough for good detail." },
    { question: "How much grout do I need for mosaics?", answer: "Grout amount depends on gap width and tile thickness. A general rule is about 0.5 ounces per square inch of grout area for standard craft mosaics." },
  ],
  formula: "Tiles = floor(Width / (Tile + Gap)) x floor(Height / (Tile + Gap)) x Coverage%; Tiles to Buy = Tiles + 15% waste; Grout = Grout Area x 0.5 oz per sq inch",
};

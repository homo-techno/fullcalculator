import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backsplashTileCalculator: CalculatorDefinition = {
  slug: "backsplash-tile-calculator",
  title: "Backsplash Tile Calculator",
  description: "Calculate tiles needed for a kitchen backsplash area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backsplash tile","kitchen backsplash","backsplash tile count"],
  variants: [{
    id: "standard",
    name: "Backsplash Tile",
    description: "Calculate tiles needed for a kitchen backsplash area.",
    fields: [
      { name: "bsLength", label: "Backsplash Length (in)", type: "number", min: 12, max: 360, defaultValue: 120 },
      { name: "bsHeight", label: "Backsplash Height (in)", type: "number", min: 4, max: 48, defaultValue: 18 },
      { name: "tileWidth", label: "Tile Width (in)", type: "number", min: 1, max: 24, defaultValue: 4 },
      { name: "tileHeight", label: "Tile Height (in)", type: "number", min: 1, max: 24, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const bl = inputs.bsLength as number;
      const bh = inputs.bsHeight as number;
      const tw = inputs.tileWidth as number;
      const th = inputs.tileHeight as number;
      if (!bl || !bh || !tw || !th) return null;
      const totalArea = bl * bh;
      const tileArea = tw * th;
      const tiles = Math.ceil((totalArea / tileArea) * 1.1);
      const sqFt = Math.round(totalArea / 144);
      return {
        primary: { label: "Tiles Needed", value: formatNumber(tiles) + " tiles" },
        details: [
          { label: "Backsplash Area", value: formatNumber(sqFt) + " sq ft" },
          { label: "Tile Size", value: formatNumber(tw) + "x" + formatNumber(th) + " in" },
          { label: "Includes 10% Waste", value: "Yes" },
        ],
      };
  },
  }],
  relatedSlugs: ["tile-grout-calculator","shower-tile-calculator"],
  faq: [
    { question: "How tall should a kitchen backsplash be?", answer: "A standard backsplash is 15 to 18 inches tall between counter and cabinets." },
    { question: "What tile size is best for a backsplash?", answer: "Subway tile (3x6) and 4x4 tiles are popular choices for backsplashes." },
  ],
  formula: "Tiles = (Length x Height / Tile Area) x 1.10",
};

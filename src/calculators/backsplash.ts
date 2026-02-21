import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backsplashCalculator: CalculatorDefinition = {
  slug: "backsplash-calculator",
  title: "Backsplash Calculator",
  description:
    "Free backsplash calculator. Estimate square footage, tile count for common sizes, and waste factor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backsplash", "tile", "subway tile", "kitchen", "wall tile"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Backsplash Length (inches)",
          type: "number",
          placeholder: "e.g. 96",
        },
        {
          name: "height",
          label: "Backsplash Height (inches)",
          type: "number",
          placeholder: "e.g. 18",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = inputs.height as number;
        if (!length || !height) return null;

        const areaSqIn = length * height;
        const areaSqFt = areaSqIn / 144;
        const areaWithWaste = areaSqFt * 1.1;

        // Tile counts for common sizes (in sq inches per tile)
        const subway3x6 = 3 * 6; // 18 sq in
        const tile4x4 = 4 * 4;   // 16 sq in
        const tile2x2 = 2 * 2;   // 4 sq in

        const tilesSubway = Math.ceil((areaSqIn * 1.1) / subway3x6);
        const tiles4x4 = Math.ceil((areaSqIn * 1.1) / tile4x4);
        const tiles2x2 = Math.ceil((areaSqIn * 1.1) / tile2x2);

        return {
          primary: {
            label: "Area Needed (with 10% waste)",
            value: formatNumber(areaWithWaste, 2) + " sq ft",
          },
          details: [
            { label: "Base Area", value: formatNumber(areaSqFt, 2) + " sq ft" },
            { label: '3×6" Subway Tiles Needed', value: formatNumber(tilesSubway, 0) },
            { label: '4×4" Tiles Needed', value: formatNumber(tiles4x4, 0) },
            { label: '2×2" Tiles Needed', value: formatNumber(tiles2x2, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["countertop-calculator", "tile-calculator"],
  faq: [
    {
      question: "How high should a backsplash be?",
      answer:
        "Standard backsplash height is 4 inches, but full backsplashes run 18 inches or all the way to the upper cabinets.",
    },
    {
      question: "What is the most popular backsplash tile size?",
      answer:
        "3×6 inch subway tiles are the most popular backsplash choice due to their classic, versatile look.",
    },
  ],
  formula:
    "Area = Length × Height ÷ 144 (sq ft). With Waste = Area × 1.10. Tiles = Total Area (sq in) ÷ Tile Area (sq in).",
};

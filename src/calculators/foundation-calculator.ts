import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foundationCalculator: CalculatorDefinition = {
  slug: "foundation-calculator",
  title: "Foundation Calculator",
  description: "Free foundation calculator. Calculate concrete needed for slab foundations, crawl space walls, and basement foundations with footing estimates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["foundation calculator", "foundation concrete calculator", "slab foundation calculator", "basement foundation", "crawl space foundation"],
  variants: [
    {
      id: "slab-foundation",
      name: "Slab Foundation",
      description: "Calculate concrete for a monolithic or stem-wall slab foundation",
      fields: [
        { name: "length", label: "Foundation Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Foundation Width (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "slabThickness", label: "Slab Thickness (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "foundationType", label: "Foundation Type", type: "select", options: [
          { label: "Monolithic Slab (thickened edge)", value: "monolithic" },
          { label: "Stem Wall + Slab", value: "stemwall" },
          { label: "Floating Slab (no footings)", value: "floating" },
        ], defaultValue: "monolithic" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const slabThickness = (inputs.slabThickness as number) || 4;
        const foundationType = inputs.foundationType as string;
        if (!length || !width) return null;

        const slabArea = length * width;
        const slabCuFt = slabArea * (slabThickness / 12);
        const perimeter = 2 * (length + width);

        let footingCuFt = 0;
        let wallCuFt = 0;

        switch (foundationType) {
          case "monolithic":
            // Thickened edge: 12" wide × 12" deep around perimeter
            footingCuFt = perimeter * 1 * 1; // 1 ft wide × 1 ft deep
            break;
          case "stemwall":
            // Footing: 20" wide × 8" deep, Wall: 8" wide × 18" tall
            footingCuFt = perimeter * (20 / 12) * (8 / 12);
            wallCuFt = perimeter * (8 / 12) * (18 / 12);
            break;
          case "floating":
            footingCuFt = 0;
            break;
        }

        const totalCuFt = slabCuFt + footingCuFt + wallCuFt;
        const cubicYards = totalCuFt / 27;
        const cubicYardsWithWaste = cubicYards * 1.10;
        const bags80lb = Math.ceil(totalCuFt / 0.6);

        return {
          primary: { label: "Concrete Needed", value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards` },
          details: [
            { label: "Slab concrete", value: `${formatNumber(slabCuFt / 27, 2)} cu yd (${formatNumber(slabCuFt, 1)} cu ft)` },
            { label: "Footing concrete", value: `${formatNumber(footingCuFt / 27, 2)} cu yd (${formatNumber(footingCuFt, 1)} cu ft)` },
            { label: "Stem wall concrete", value: wallCuFt > 0 ? `${formatNumber(wallCuFt / 27, 2)} cu yd` : "N/A" },
            { label: "Total (without waste)", value: `${formatNumber(cubicYards, 2)} cu yd` },
            { label: "Total (with 10% waste)", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "80-lb bags (if not ready-mix)", value: `${bags80lb}` },
            { label: "Foundation perimeter", value: `${formatNumber(perimeter, 0)} ft` },
            { label: "Slab area", value: `${formatNumber(slabArea, 0)} sq ft` },
          ],
          note: "Order ready-mix concrete for foundations over 1 cubic yard. Slab foundations require proper compacted gravel base and vapor barrier. Check local frost depth for footing requirements.",
        };
      },
    },
    {
      id: "basement-foundation",
      name: "Basement Foundation Walls",
      description: "Calculate concrete for poured basement foundation walls",
      fields: [
        { name: "perimeter", label: "Foundation Perimeter (feet)", type: "number", placeholder: "e.g. 140" },
        { name: "wallHeight", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "wallThickness", label: "Wall Thickness (inches)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "footingWidth", label: "Footing Width (inches)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "footingDepth", label: "Footing Depth (inches)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const perimeter = inputs.perimeter as number;
        const wallHeight = (inputs.wallHeight as number) || 8;
        const wallThickness = (inputs.wallThickness as number) || 8;
        const footingWidth = (inputs.footingWidth as number) || 20;
        const footingDepth = (inputs.footingDepth as number) || 8;
        if (!perimeter) return null;

        const wallCuFt = perimeter * wallHeight * (wallThickness / 12);
        const footingCuFt = perimeter * (footingWidth / 12) * (footingDepth / 12);
        const totalCuFt = wallCuFt + footingCuFt;
        const cubicYards = totalCuFt / 27;
        const cubicYardsWithWaste = cubicYards * 1.05; // 5% waste for formed walls

        // Estimate rebar
        const horizontalBars = Math.ceil(wallHeight * 12 / 12) * perimeter; // Every 12" vertical spacing
        const verticalBars = Math.ceil(perimeter / 2) * wallHeight; // Every 24" horizontal spacing
        const totalRebarFt = horizontalBars + verticalBars;

        return {
          primary: { label: "Total Concrete", value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards` },
          details: [
            { label: "Wall concrete", value: `${formatNumber(wallCuFt / 27, 2)} cu yd` },
            { label: "Footing concrete", value: `${formatNumber(footingCuFt / 27, 2)} cu yd` },
            { label: "Total (with 5% waste)", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "Rebar needed (estimated)", value: `${formatNumber(totalRebarFt, 0)} linear ft` },
            { label: "Wall area (for waterproofing)", value: `${formatNumber(perimeter * wallHeight, 0)} sq ft` },
          ],
          note: "Poured concrete walls require forms and rebar. Waterproof exterior walls below grade. Footing must be below frost line per local code. Consider hiring a structural engineer for basement design.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "footing-calculator", "rebar-calculator"],
  faq: [
    { question: "How thick should a house foundation be?", answer: "Slab: 4\" thick with thickened edges of 12\". Basement walls: 8\" minimum (10\" for tall walls or heavy loads). Footings: typically 8\" deep and 20\" wide for residential. Always consult local building codes and a structural engineer." },
    { question: "What type of foundation do I need?", answer: "Slab-on-grade: Warm climates, flat lots, budget-friendly. Crawl space: Moderate climates, sloped lots, access to plumbing. Basement: Cold climates (footing below frost line anyway), adds living space. Pier/post: Flood zones, steep slopes, minimal footprint." },
  ],
  formula: "Slab = L × W × Thickness/12 | Wall = Perimeter × Height × Thickness/12 | Footing = Perimeter × Width/12 × Depth/12 | Cu Yd = Cu Ft / 27",
};

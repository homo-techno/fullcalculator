import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greenhouseSizeCalculator: CalculatorDefinition = {
  slug: "greenhouse-size-calculator",
  title: "Greenhouse Size Calculator",
  description: "Free greenhouse size calculator. Calculate the ideal greenhouse dimensions, floor area, and growing capacity based on your gardening needs and available space.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["greenhouse size calculator", "greenhouse dimensions", "greenhouse square footage", "how big greenhouse", "greenhouse capacity calculator"],
  variants: [
    {
      id: "by-plants",
      name: "By Number of Plants",
      description: "Calculate greenhouse size based on how many plants you want to grow",
      fields: [
        { name: "numPlants", label: "Number of Plants", type: "number", placeholder: "e.g. 50", min: 1 },
        { name: "plantType", label: "Primary Plant Type", type: "select", options: [
          { label: "Tomatoes/Peppers (4 sq ft each)", value: "large" },
          { label: "Lettuce/Herbs (1 sq ft each)", value: "small" },
          { label: "Seedling Trays (0.5 sq ft each)", value: "seedling" },
          { label: "Mixed Vegetables (2.5 sq ft avg)", value: "mixed" },
          { label: "Potted Flowers (2 sq ft each)", value: "flower" },
        ], defaultValue: "mixed" },
        { name: "walkwayPercent", label: "Walkway/Access Space", type: "select", options: [
          { label: "20% (Minimal walkways)", value: "20" },
          { label: "30% (Standard)", value: "30" },
          { label: "40% (Wheelchair accessible)", value: "40" },
        ], defaultValue: "30" },
      ],
      calculate: (inputs) => {
        const numPlants = inputs.numPlants as number;
        const plantType = inputs.plantType as string;
        const walkwayPct = parseInt(inputs.walkwayPercent as string);
        if (!numPlants || !plantType || !walkwayPct) return null;

        const sqFtPerPlant: Record<string, number> = {
          large: 4, small: 1, seedling: 0.5, mixed: 2.5, flower: 2,
        };
        const plantArea = numPlants * (sqFtPerPlant[plantType] || 2.5);
        const totalArea = plantArea / (1 - walkwayPct / 100);
        const suggestedWidth = totalArea <= 80 ? 8 : totalArea <= 160 ? 10 : 12;
        const suggestedLength = Math.ceil(totalArea / suggestedWidth);
        const cubicFeet = totalArea * 8;
        const estimatedCostLow = totalArea * 15;
        const estimatedCostHigh = totalArea * 40;

        return {
          primary: { label: "Recommended Size", value: `${suggestedWidth}' × ${suggestedLength}' (${formatNumber(suggestedWidth * suggestedLength, 0)} sq ft)` },
          details: [
            { label: "Growing area needed", value: `${formatNumber(plantArea, 0)} sq ft` },
            { label: "Total area with walkways", value: `${formatNumber(totalArea, 0)} sq ft` },
            { label: "Suggested dimensions", value: `${suggestedWidth} ft wide × ${suggestedLength} ft long` },
            { label: "Volume (8ft peak)", value: `${formatNumber(cubicFeet, 0)} cu ft` },
            { label: "Estimated cost range", value: `$${formatNumber(estimatedCostLow, 0)} - $${formatNumber(estimatedCostHigh, 0)}` },
            { label: "Plant capacity", value: `${numPlants} plants` },
          ],
          note: "Standard greenhouse widths: 8ft (hobby), 10-12ft (small farm), 14-30ft (commercial). Minimum height should be 7-8 feet at the ridge for proper air circulation.",
        };
      },
    },
    {
      id: "by-dimensions",
      name: "By Known Dimensions",
      description: "Calculate capacity of a greenhouse with known dimensions",
      fields: [
        { name: "length", label: "Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Width (ft)", type: "number", placeholder: "e.g. 10" },
        { name: "height", label: "Peak Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "benchWidth", label: "Bench Width (ft)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const benchWidth = inputs.benchWidth as number;
        if (!length || !width || !height || !benchWidth) return null;

        const totalArea = length * width;
        const walkwayWidth = 3;
        const numBenches = width >= 10 ? 2 : 1;
        const growingArea = numBenches * benchWidth * length;
        const walkwayArea = totalArea - growingArea;
        const largePerBench = Math.floor(length / 2) * Math.floor(benchWidth / 2);
        const largePlants = largePerBench * numBenches;
        const smallPlants = Math.floor(growingArea / 0.5);
        const volume = totalArea * height * 0.7;

        return {
          primary: { label: "Growing Area", value: `${formatNumber(growingArea, 0)} sq ft` },
          details: [
            { label: "Total floor area", value: `${formatNumber(totalArea, 0)} sq ft` },
            { label: "Number of benches", value: `${numBenches} (${benchWidth}ft wide)` },
            { label: "Walkway area", value: `${formatNumber(walkwayArea, 0)} sq ft` },
            { label: "Large plant capacity", value: `${largePlants} (tomatoes/peppers)` },
            { label: "Small plant capacity", value: `${smallPlants} (lettuce/herbs)` },
            { label: "Approx. volume", value: `${formatNumber(volume, 0)} cu ft` },
          ],
          note: "A greenhouse this size will need approximately " + formatNumber(volume / 50, 0) + " BTU/hr heating for cold climates. Consider adding a thermal mass (water barrels) for passive heat storage.",
        };
      },
    },
  ],
  relatedSlugs: ["grow-light-calculator", "plant-spacing-calculator", "garden-water-calculator"],
  faq: [
    { question: "What size greenhouse do I need for a family garden?", answer: "A 10×12 foot (120 sq ft) greenhouse is ideal for most family gardens, fitting 40-60 vegetable plants. For seed starting only, an 8×10 (80 sq ft) works well. Serious growers may want 12×20 (240 sq ft) or larger." },
    { question: "How much does a greenhouse cost per square foot?", answer: "Hobby greenhouses cost $15-25/sq ft for basic hoop houses, $25-40/sq ft for polycarbonate kits, and $40-75/sq ft for glass greenhouses. A typical 10×12 polycarbonate greenhouse kit runs $2,000-5,000." },
    { question: "What is the best orientation for a greenhouse?", answer: "Orient the longest side east-west to maximize winter sun exposure. In the northern hemisphere, place the greenhouse where it gets full southern sun. Avoid locations shaded by buildings or trees, especially in winter." },
  ],
  formula: "Growing Area = Total Area × (1 - Walkway%) | Plant Capacity = Growing Area / Sq Ft per Plant | Volume ≈ Length × Width × Height × 0.7",
};

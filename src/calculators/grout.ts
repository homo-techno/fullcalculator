import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groutCalculator: CalculatorDefinition = {
  slug: "grout-calculator",
  title: "Grout Calculator",
  description: "Free grout calculator. Calculate how many pounds of grout you need based on tile size, area, and grout line width.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["grout calculator", "how much grout do I need", "tile grout calculator", "grout coverage calculator", "grout estimator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Grout Needed",
      description: "Calculate pounds of grout for your tile project",
      fields: [
        { name: "tileSize", label: "Tile Size", type: "select", options: [
          { label: "2\" x 2\"", value: "2x2" },
          { label: "4\" x 4\"", value: "4x4" },
          { label: "6\" x 6\"", value: "6x6" },
          { label: "12\" x 12\"", value: "12x12" },
          { label: "12\" x 24\"", value: "12x24" },
          { label: "18\" x 18\"", value: "18x18" },
          { label: "24\" x 24\"", value: "24x24" },
        ], defaultValue: "12x12" },
        { name: "area", label: "Area (sq ft)", type: "number", placeholder: "e.g. 100" },
        { name: "groutWidth", label: "Grout Line Width", type: "select", options: [
          { label: "1/16\" (1.5 mm)", value: "0.0625" },
          { label: "1/8\" (3 mm)", value: "0.125" },
          { label: "1/4\" (6 mm)", value: "0.25" },
          { label: "3/8\" (10 mm)", value: "0.375" },
        ], defaultValue: "0.125" },
        { name: "tileThickness", label: "Tile Thickness (inches)", type: "number", placeholder: "e.g. 0.375", defaultValue: 0.375 },
      ],
      calculate: (inputs) => {
        const tileSizeStr = inputs.tileSize as string;
        const area = inputs.area as number;
        const groutWidth = parseFloat(inputs.groutWidth as string);
        const tileThickness = (inputs.tileThickness as number) || 0.375;
        if (!tileSizeStr || !area || !groutWidth) return null;

        const parts = tileSizeStr.split("x");
        const tileL = parseInt(parts[0]);
        const tileW = parseInt(parts[1]);

        // Grout volume formula:
        // Linear inches of grout per sq ft = (12/tileL + 12/tileW) x 12
        // But simplified: grout joint length per sq ft
        const jointsPerSqFtLong = 12 / tileL; // number of horizontal joints per foot
        const jointsPerSqFtWide = 12 / tileW; // number of vertical joints per foot
        // Total linear inches of joint per sq ft of tile
        const linearInchesPerSqFt = (jointsPerSqFtLong * 12) + (jointsPerSqFtWide * 12);
        // Volume of grout per sq ft (cubic inches)
        const groutVolPerSqFt = linearInchesPerSqFt * groutWidth * tileThickness;
        const totalCubicInches = groutVolPerSqFt * area;
        // Grout density: ~100 lbs per cubic foot = 0.0579 lbs per cubic inch
        const densityLbsPerCuIn = 100 / 1728;
        const totalLbs = totalCubicInches * densityLbsPerCuIn;
        const totalLbsWithWaste = totalLbs * 1.10;
        const bags25lb = Math.ceil(totalLbsWithWaste / 25);
        const bags10lb = Math.ceil(totalLbsWithWaste / 10);

        return {
          primary: { label: "Grout Needed", value: `${formatNumber(totalLbsWithWaste, 1)} lbs` },
          details: [
            { label: "Tile size", value: `${tileL}" x ${tileW}"` },
            { label: "Area", value: `${formatNumber(area)} sq ft` },
            { label: "Grout line width", value: `${groutWidth}" (${formatNumber(groutWidth * 25.4, 1)} mm)` },
            { label: "Tile thickness", value: `${tileThickness}"` },
            { label: "Grout (exact)", value: `${formatNumber(totalLbs, 1)} lbs` },
            { label: "With 10% waste", value: `${formatNumber(totalLbsWithWaste, 1)} lbs` },
            { label: "25-lb bags", value: `${bags25lb}` },
            { label: "10-lb bags", value: `${bags10lb}` },
          ],
          note: "Includes 10% waste for uneven joints and cleanup. Actual usage varies with tile spacing consistency and application technique. Sanded grout is used for joints wider than 1/8 inch.",
        };
      },
    },
  ],
  relatedSlugs: ["tile-calculator", "mortar-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much grout do I need per square foot?", answer: "Grout quantity depends on tile size, grout line width, and tile thickness. Smaller tiles need more grout per sq ft. A 12x12 tile with 1/8\" grout lines needs about 0.5-0.7 lbs per sq ft." },
    { question: "Should I use sanded or unsanded grout?", answer: "Use sanded grout for joints wider than 1/8 inch (3mm). Use unsanded grout for joints 1/8 inch or narrower. Unsanded grout is also preferred for polished stone to prevent scratching." },
    { question: "How many square feet does a bag of grout cover?", answer: "A 25-lb bag of grout covers approximately 35-90 sq ft depending on tile size and grout joint width. Larger tiles with narrower joints use less grout." },
  ],
  formula: "Grout (lbs) = Linear Joint Inches per sq ft x Joint Width x Tile Thickness x Area x Density x 1.10",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rampCalculator: CalculatorDefinition = {
  slug: "ramp-calculator",
  title: "Wheelchair Ramp Calculator",
  description: "Free wheelchair ramp calculator. Calculate ramp length, slope, and materials needed for ADA-compliant wheelchair and accessibility ramps.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wheelchair ramp calculator", "ADA ramp calculator", "ramp slope calculator", "ramp length calculator", "accessibility ramp"],
  variants: [
    {
      id: "ada-ramp",
      name: "ADA Ramp Length",
      description: "Calculate ramp length for ADA compliance (1:12 slope ratio)",
      fields: [
        { name: "rise", label: "Total Rise / Height (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "slopeRatio", label: "Slope Ratio", type: "select", options: [
          { label: "1:12 (ADA Commercial)", value: "12" },
          { label: "1:10 (ADA Max with approval)", value: "10" },
          { label: "1:8 (Residential common)", value: "8" },
          { label: "1:16 (Gentle / Preferred)", value: "16" },
          { label: "1:20 (Very Gentle)", value: "20" },
        ], defaultValue: "12" },
        { name: "width", label: "Ramp Width (inches)", type: "number", placeholder: "e.g. 36", defaultValue: 36 },
      ],
      calculate: (inputs) => {
        const rise = inputs.rise as number;
        const ratio = parseInt(inputs.slopeRatio as string) || 12;
        const width = (inputs.width as number) || 36;
        if (!rise) return null;

        const rampLengthIn = rise * ratio;
        const rampLengthFt = rampLengthIn / 12;
        const slopePct = (1 / ratio) * 100;
        const slopeDegrees = Math.atan(1 / ratio) * (180 / Math.PI);
        const landings = Math.ceil(rampLengthFt / 30);
        const totalLengthFt = rampLengthFt + landings * 5;
        const surfaceAreaSqFt = totalLengthFt * (width / 12);

        return {
          primary: { label: "Ramp Length", value: `${formatNumber(rampLengthFt, 1)} feet` },
          details: [
            { label: "Ramp length (no landings)", value: `${formatNumber(rampLengthFt, 1)} ft (${formatNumber(rampLengthIn, 0)} in)` },
            { label: "Slope ratio", value: `1:${ratio}` },
            { label: "Slope percentage", value: `${formatNumber(slopePct, 1)}%` },
            { label: "Slope angle", value: `${formatNumber(slopeDegrees, 1)}°` },
            { label: "Landings required (every 30 ft)", value: `${landings}` },
            { label: "Total length with landings", value: `${formatNumber(totalLengthFt, 1)} ft` },
            { label: "Surface area", value: `${formatNumber(surfaceAreaSqFt, 1)} sq ft` },
          ],
          note: "ADA requires 1:12 slope for commercial, 36\" minimum width, 5' × 5' landings every 30 feet, and handrails on both sides for rises over 6 inches.",
        };
      },
    },
    {
      id: "ramp-materials",
      name: "Ramp Materials Estimate",
      description: "Estimate lumber and materials for a wooden ramp",
      fields: [
        { name: "length", label: "Ramp Length (feet)", type: "number", placeholder: "e.g. 24" },
        { name: "width", label: "Ramp Width (inches)", type: "number", placeholder: "e.g. 36", defaultValue: 36 },
        { name: "material", label: "Decking Material", type: "select", options: [
          { label: "Pressure-Treated Lumber", value: "pt" },
          { label: "Composite Decking", value: "composite" },
          { label: "Aluminum", value: "aluminum" },
        ], defaultValue: "pt" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = (inputs.width as number) || 36;
        const material = inputs.material as string;
        if (!length) return null;

        const widthFt = width / 12;
        const surfaceArea = length * widthFt;
        const deckBoards = Math.ceil(surfaceArea / 4.67); // 2x6 boards 8ft long
        const joists = Math.ceil(length / 1.33) + 1; // 16" OC
        const posts = Math.ceil(length / 6) * 2 + 2;
        const handrailLength = length * 2;

        const costPerSqFt = material === "composite" ? 12 : material === "aluminum" ? 18 : 7;
        const estimatedCost = surfaceArea * costPerSqFt;

        return {
          primary: { label: "Surface Area", value: `${formatNumber(surfaceArea, 1)} sq ft` },
          details: [
            { label: "Deck boards (2×6×8')", value: `${deckBoards}` },
            { label: "Joists (2×6)", value: `${joists}` },
            { label: "Support posts (4×4)", value: `${posts}` },
            { label: "Handrail length", value: `${formatNumber(handrailLength, 0)} linear ft` },
            { label: "Estimated cost", value: `$${formatNumber(estimatedCost, 0)}` },
          ],
          note: "Costs are approximate. Check local building codes for ramp construction requirements. ADA requires handrails on both sides.",
        };
      },
    },
  ],
  relatedSlugs: ["staircase-calculator", "concrete-calculator", "deck-calculator"],
  faq: [
    { question: "What is the ADA slope requirement for wheelchair ramps?", answer: "ADA requires a maximum slope of 1:12 (one inch of rise for every 12 inches of run). This means a 24-inch rise requires a minimum 24-foot ramp. For existing buildings, a 1:10 slope may be permitted with approval." },
    { question: "How wide does a wheelchair ramp need to be?", answer: "ADA requires a minimum clear width of 36 inches (3 feet). A 48-inch width is recommended for two-way traffic or easier maneuvering. Handrails cannot encroach on this clear width." },
    { question: "Do I need landings on my ramp?", answer: "Yes, ADA requires a level landing (5' × 5' minimum) at the top, bottom, and every 30 feet of ramp run. Landings are also required at turns and where doors open onto the ramp." },
  ],
  formula: "Ramp Length = Rise × Slope Ratio | Slope % = (Rise / Run) × 100 | Landings = Length / 30",
};

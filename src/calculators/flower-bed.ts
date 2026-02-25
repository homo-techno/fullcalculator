import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flowerBedCalculator: CalculatorDefinition = {
  slug: "flower-bed-calculator",
  title: "Flower Bed Calculator",
  description: "Free flower bed calculator. Calculate the number of plants, soil, and mulch needed for your flower bed based on shape and plant spacing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flower bed calculator", "flower bed planner", "how many plants for flower bed", "flower bed soil calculator", "garden bed calculator"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Flower Bed",
      description: "Calculate plants and materials for a rectangular flower bed",
      fields: [
        { name: "length", label: "Bed Length (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "width", label: "Bed Width (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "spacing", label: "Plant Spacing (inches)", type: "select", options: [
          { label: "6 inches (ground cover)", value: "6" },
          { label: "8 inches (dense annuals)", value: "8" },
          { label: "10 inches (standard annuals)", value: "10" },
          { label: "12 inches (perennials)", value: "12" },
          { label: "18 inches (large perennials)", value: "18" },
          { label: "24 inches (shrubs)", value: "24" },
        ], defaultValue: "12" },
        { name: "mulchDepth", label: "Mulch Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const spacing = parseInt(inputs.spacing as string) || 12;
        const mulchDepth = (inputs.mulchDepth as number) || 3;
        if (!length || !width) return null;

        const areaSqFt = length * width;
        const spacingFt = spacing / 12;
        const rows = Math.floor(width / spacingFt);
        const plantsPerRow = Math.floor(length / spacingFt);
        const totalPlants = rows * plantsPerRow;
        const mulchCuYd = (areaSqFt * (mulchDepth / 12)) / 27;
        const soilCuYd = (areaSqFt * 0.5) / 27;

        return {
          primary: { label: "Plants Needed", value: `${totalPlants}` },
          details: [
            { label: "Bed area", value: `${formatNumber(areaSqFt)} sq ft` },
            { label: "Rows × Plants per row", value: `${rows} × ${plantsPerRow}` },
            { label: "Plant spacing", value: `${spacing} inches` },
            { label: "Mulch needed", value: `${formatNumber(mulchCuYd, 2)} cu yd` },
            { label: "Soil amendment (6\" deep)", value: `${formatNumber(soilCuYd, 2)} cu yd` },
          ],
          note: "Plant count assumes grid spacing. For a more natural look, stagger rows and add 10-15% more plants.",
        };
      },
    },
    {
      id: "circular",
      name: "Circular Flower Bed",
      description: "Calculate plants and materials for a circular flower bed",
      fields: [
        { name: "diameter", label: "Bed Diameter (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "spacing", label: "Plant Spacing (inches)", type: "select", options: [
          { label: "6 inches (ground cover)", value: "6" },
          { label: "10 inches (annuals)", value: "10" },
          { label: "12 inches (perennials)", value: "12" },
          { label: "18 inches (large perennials)", value: "18" },
          { label: "24 inches (shrubs)", value: "24" },
        ], defaultValue: "12" },
        { name: "mulchDepth", label: "Mulch Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const spacing = parseInt(inputs.spacing as string) || 12;
        const mulchDepth = (inputs.mulchDepth as number) || 3;
        if (!diameter) return null;

        const radius = diameter / 2;
        const areaSqFt = Math.PI * radius * radius;
        const spacingSqFt = (spacing / 12) * (spacing / 12);
        const totalPlants = Math.floor(areaSqFt / spacingSqFt);
        const mulchCuYd = (areaSqFt * (mulchDepth / 12)) / 27;
        const edgingFt = Math.PI * diameter;

        return {
          primary: { label: "Plants Needed", value: `${totalPlants}` },
          details: [
            { label: "Bed area", value: `${formatNumber(areaSqFt, 1)} sq ft` },
            { label: "Edging needed", value: `${formatNumber(edgingFt, 1)} linear ft` },
            { label: "Mulch needed", value: `${formatNumber(mulchCuYd, 2)} cu yd` },
            { label: "Plant spacing", value: `${spacing} inches` },
          ],
          note: "Circular beds look best with taller plants in the center graduating to shorter plants at the edges.",
        };
      },
    },
  ],
  relatedSlugs: ["garden-row-spacing-calculator", "soil-volume-calculator", "mulch-calculator"],
  faq: [
    { question: "How many plants do I need per square foot?", answer: "It depends on spacing: 6\" spacing = 4 plants/sq ft, 12\" spacing = 1 plant/sq ft, 18\" spacing = 0.44 plants/sq ft, 24\" spacing = 0.25 plants/sq ft." },
    { question: "How deep should flower bed soil be?", answer: "Most flowers need 6-12 inches of good soil. Annuals can thrive in 6 inches, while perennials and shrubs need 12-18 inches for root development." },
  ],
  formula: "Plants = (Length / Spacing) × (Width / Spacing) | Mulch (cu yd) = Area × Depth / 324",
};

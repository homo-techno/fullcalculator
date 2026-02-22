import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aggregateCalculator: CalculatorDefinition = {
  slug: "aggregate-calculator",
  title: "Aggregate Calculator",
  description: "Free aggregate calculator. Calculate how much gravel, crushed stone, road base, or fill material you need in tons and cubic yards for construction projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["aggregate calculator", "gravel calculator", "crushed stone calculator", "road base calculator", "fill material calculator"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Area",
      description: "Calculate aggregate for a rectangular area like a driveway or parking pad",
      fields: [
        { name: "length", label: "Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "material", label: "Aggregate Type", type: "select", options: [
          { label: "Crushed Limestone (2,700 lbs/cu yd)", value: "2700" },
          { label: "Gravel (2,800 lbs/cu yd)", value: "2800" },
          { label: "Crushed Granite (2,900 lbs/cu yd)", value: "2900" },
          { label: "Road Base / ABC (2,600 lbs/cu yd)", value: "2600" },
          { label: "Pea Gravel (2,600 lbs/cu yd)", value: "2600" },
          { label: "River Rock (2,700 lbs/cu yd)", value: "2700" },
          { label: "Recycled Concrete (2,400 lbs/cu yd)", value: "2400" },
          { label: "Slag (2,500 lbs/cu yd)", value: "2500" },
        ], defaultValue: "2700" },
        { name: "compaction", label: "Compaction Factor", type: "select", options: [
          { label: "None (surface coverage)", value: "1.0" },
          { label: "Light (10% extra)", value: "1.10" },
          { label: "Standard (15% extra)", value: "1.15" },
          { label: "Heavy (25% extra)", value: "1.25" },
        ], defaultValue: "1.15" },
        { name: "pricePerTon", label: "Price per Ton (optional)", type: "number", placeholder: "e.g. 30", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 4;
        const density = parseInt(inputs.material as string) || 2700;
        const compaction = parseFloat(inputs.compaction as string) || 1.15;
        const price = inputs.pricePerTon as number;
        if (!length || !width) return null;

        const cubicFeet = length * width * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const adjustedCY = cubicYards * compaction;
        const tons = (adjustedCY * density) / 2000;
        const area = length * width;

        const details = [
          { label: "Cubic yards (before compaction)", value: formatNumber(cubicYards, 2) },
          { label: "Cubic yards (after compaction)", value: formatNumber(adjustedCY, 2) },
          { label: "Weight", value: `${formatNumber(tons, 2)} tons` },
          { label: "Coverage area", value: `${formatNumber(area)} sq ft` },
          { label: "Depth", value: `${depth} inches` },
        ];

        if (price) {
          details.push({ label: "Estimated cost", value: `$${formatNumber(tons * price, 2)}` });
        }

        return {
          primary: { label: "Aggregate Needed", value: `${formatNumber(tons, 2)} tons (${formatNumber(adjustedCY, 2)} cu yd)` },
          details,
          note: "Compaction factor accounts for material settling when compacted. Most aggregate suppliers sell by the ton. One truck load is typically 15-20 tons.",
        };
      },
    },
    {
      id: "circular",
      name: "Circular Area",
      description: "Calculate aggregate for a circular area like a turnaround or fire pit base",
      fields: [
        { name: "diameter", label: "Diameter (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "material", label: "Aggregate Type", type: "select", options: [
          { label: "Crushed Limestone (2,700 lbs/cu yd)", value: "2700" },
          { label: "Gravel (2,800 lbs/cu yd)", value: "2800" },
          { label: "Road Base / ABC (2,600 lbs/cu yd)", value: "2600" },
          { label: "Pea Gravel (2,600 lbs/cu yd)", value: "2600" },
        ], defaultValue: "2700" },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const depth = (inputs.depth as number) || 4;
        const density = parseInt(inputs.material as string) || 2700;
        if (!diameter) return null;

        const radius = diameter / 2;
        const area = Math.PI * radius * radius;
        const cubicFeet = area * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const adjustedCY = cubicYards * 1.15;
        const tons = (adjustedCY * density) / 2000;

        return {
          primary: { label: "Aggregate Needed", value: `${formatNumber(tons, 2)} tons (${formatNumber(adjustedCY, 2)} cu yd)` },
          details: [
            { label: "Area", value: `${formatNumber(area, 1)} sq ft` },
            { label: "Cubic yards (with 15% compaction)", value: formatNumber(adjustedCY, 2) },
            { label: "Weight", value: `${formatNumber(tons, 2)} tons` },
          ],
          note: "Includes 15% compaction factor. Circular area = \u03C0r\u00B2.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "gravel-calculator", "excavation-volume-calculator"],
  faq: [
    { question: "How deep should aggregate base be?", answer: "For driveways: 4-6 inches of compacted base. Patios: 4 inches. Walkways: 2-3 inches. Structural foundations: 6-12 inches depending on soil conditions. Always compact in lifts of no more than 4-6 inches at a time." },
    { question: "What is the difference between tons and cubic yards?", answer: "Cubic yards measure volume while tons measure weight. The conversion depends on the material density. One cubic yard of crushed limestone weighs approximately 1.35 tons (2,700 lbs). Always order by tons for accuracy since loose material can vary in volume." },
  ],
  formula: "Volume = L \u00D7 W \u00D7 D/12 \u00F7 27 (cu yd) | Tons = Cu Yd \u00D7 Density / 2000",
};

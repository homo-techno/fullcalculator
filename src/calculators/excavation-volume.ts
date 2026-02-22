import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const excavationVolumeCalculator: CalculatorDefinition = {
  slug: "excavation-volume-calculator",
  title: "Excavation Volume Calculator",
  description: "Free excavation volume calculator. Calculate the volume of soil to be excavated for foundations, trenches, ponds, and general earthwork in cubic yards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["excavation calculator", "dig volume calculator", "earthwork calculator", "trench volume calculator", "foundation excavation"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Excavation",
      description: "Calculate volume for a rectangular dig such as a foundation or pond",
      fields: [
        { name: "length", label: "Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Width (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "depth", label: "Depth (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "swellFactor", label: "Swell Factor", type: "select", options: [
          { label: "Sand / Gravel (10% swell)", value: "1.10" },
          { label: "Common Earth (25% swell)", value: "1.25" },
          { label: "Clay (35% swell)", value: "1.35" },
          { label: "Rock (50% swell)", value: "1.50" },
        ], defaultValue: "1.25" },
        { name: "haulPrice", label: "Haul Cost per Cubic Yard (optional)", type: "number", placeholder: "e.g. 15", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = inputs.depth as number;
        const swell = parseFloat(inputs.swellFactor as string) || 1.25;
        const haulPrice = inputs.haulPrice as number;
        if (!length || !width || !depth) return null;

        const bankCubicYards = (length * width * depth) / 27;
        const looseCubicYards = bankCubicYards * swell;
        const truckLoads = Math.ceil(looseCubicYards / 15);

        const details = [
          { label: "Bank cubic yards (in-place)", value: formatNumber(bankCubicYards, 1) },
          { label: "Loose cubic yards (hauled)", value: formatNumber(looseCubicYards, 1) },
          { label: "Swell factor", value: `${((swell - 1) * 100).toFixed(0)}%` },
          { label: "Truck loads (15 cu yd each)", value: `${truckLoads}` },
          { label: "Excavation area", value: `${formatNumber(length * width)} sq ft` },
        ];

        if (haulPrice) {
          details.push({ label: "Estimated haul cost", value: `$${formatNumber(looseCubicYards * haulPrice, 2)}` });
        }

        return {
          primary: { label: "Excavation Volume", value: `${formatNumber(looseCubicYards, 1)} loose cubic yards` },
          details,
          note: "Bank volume is the in-place soil volume. Loose volume accounts for swell when soil is dug up and expands. Always quote hauling in loose cubic yards.",
        };
      },
    },
    {
      id: "trench",
      name: "Trench Excavation",
      description: "Calculate volume for a linear trench (utilities, footings, drainage)",
      fields: [
        { name: "length", label: "Trench Length (feet)", type: "number", placeholder: "e.g. 100" },
        { name: "width", label: "Trench Width (inches)", type: "number", placeholder: "e.g. 24", defaultValue: 24 },
        { name: "depth", label: "Trench Depth (feet)", type: "number", placeholder: "e.g. 3" },
        { name: "swellFactor", label: "Soil Type / Swell", type: "select", options: [
          { label: "Sand / Gravel (10% swell)", value: "1.10" },
          { label: "Common Earth (25% swell)", value: "1.25" },
          { label: "Clay (35% swell)", value: "1.35" },
        ], defaultValue: "1.25" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const widthIn = (inputs.width as number) || 24;
        const depth = inputs.depth as number;
        const swell = parseFloat(inputs.swellFactor as string) || 1.25;
        if (!length || !depth) return null;

        const widthFt = widthIn / 12;
        const bankCY = (length * widthFt * depth) / 27;
        const looseCY = bankCY * swell;
        const truckLoads = Math.ceil(looseCY / 15);

        return {
          primary: { label: "Trench Volume", value: `${formatNumber(looseCY, 1)} loose cubic yards` },
          details: [
            { label: "Bank cubic yards", value: formatNumber(bankCY, 1) },
            { label: "Loose cubic yards", value: formatNumber(looseCY, 1) },
            { label: "Trench width", value: `${widthIn} in (${formatNumber(widthFt, 2)} ft)` },
            { label: "Trench cross-section", value: `${formatNumber(widthFt * depth, 2)} sq ft` },
            { label: "Truck loads (15 cu yd)", value: `${truckLoads}` },
          ],
          note: "For utility trenches, add extra width for bedding material and working space. Check local utility depth requirements before digging.",
        };
      },
    },
  ],
  relatedSlugs: ["backfill-calculator", "soil-compaction-calculator", "concrete-calculator"],
  faq: [
    { question: "What is the swell factor in excavation?", answer: "Swell factor is the percentage by which soil volume increases when dug out. Soil is compacted in the ground (bank state) and expands when excavated (loose state). Common earth swells about 25%, clay about 35%, and rock up to 50%. This affects how much material you need to haul away." },
    { question: "How do I calculate truck loads for excavation?", answer: "Divide the loose cubic yards by the truck capacity. A standard dump truck holds about 10-15 cubic yards. A tandem axle truck holds 15-18 cubic yards. Always calculate using loose volume (after swell), not bank volume." },
  ],
  formula: "Bank Volume = L \u00D7 W \u00D7 D / 27 | Loose Volume = Bank Volume \u00D7 Swell Factor",
};

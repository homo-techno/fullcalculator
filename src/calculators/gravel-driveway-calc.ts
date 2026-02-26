import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gravelDrivewayCalculator: CalculatorDefinition = {
  slug: "gravel-driveway-calculator",
  title: "Gravel Driveway Material Calculator",
  description:
    "Calculate the amount of gravel needed for a driveway including base, middle, and top layers. Estimate tonnage, cubic yards, and cost for driveway gravel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "gravel driveway calculator",
    "driveway gravel",
    "gravel tonnage",
    "driveway stone calculator",
    "gravel amount",
  ],
  variants: [
    {
      id: "single-layer",
      name: "Single Layer Gravel",
      description: "Calculate gravel for a single uniform layer",
      fields: [
        {
          name: "length",
          label: "Driveway Length (feet)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "width",
          label: "Driveway Width (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "depth",
          label: "Gravel Depth (inches)",
          type: "select",
          options: [
            { label: '2"', value: "2" },
            { label: '3"', value: "3" },
            { label: '4"', value: "4" },
            { label: '6"', value: "6" },
            { label: '8"', value: "8" },
            { label: '12"', value: "12" },
          ],
          defaultValue: "4",
        },
        {
          name: "gravelType",
          label: "Gravel Type",
          type: "select",
          options: [
            { label: "Pea Gravel (2,800 lbs/yd)", value: "2800" },
            { label: "Crushed Limestone (2,700 lbs/yd)", value: "2700" },
            { label: "Crusher Run (2,500 lbs/yd)", value: "2500" },
            { label: "River Rock (2,600 lbs/yd)", value: "2600" },
          ],
          defaultValue: "2700",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const depth = parseFloat(inputs.depth as string);
        const densityPerYd = parseFloat(inputs.gravelType as string);
        if (!length || !width || !depth || !densityPerYd) return null;

        const sqFt = length * width;
        const cubicFeet = sqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithCompaction = cubicYards * 1.15; // 15% compaction factor
        const tons = (cubicYardsWithCompaction * densityPerYd) / 2000;
        const truckLoads = Math.ceil(tons / 20); // 20-ton dump truck

        return {
          primary: {
            label: "Gravel Needed",
            value: `${formatNumber(cubicYardsWithCompaction, 1)} cubic yards`,
          },
          details: [
            { label: "Area", value: `${formatNumber(sqFt)} sq ft` },
            { label: "Cubic yards (exact)", value: formatNumber(cubicYards, 1) },
            { label: "With compaction factor (15%)", value: `${formatNumber(cubicYardsWithCompaction, 1)} cu yd` },
            { label: "Tonnage", value: `${formatNumber(tons, 1)} tons` },
            { label: "Dump truck loads (20-ton)", value: formatNumber(truckLoads) },
          ],
          note: "Includes 15% extra for compaction. Gravel compacts significantly when driven on. Order by cubic yard or ton depending on your supplier.",
        };
      },
    },
    {
      id: "three-layer",
      name: "Three-Layer Driveway",
      description: "Proper 3-layer gravel driveway (base, middle, top)",
      fields: [
        {
          name: "length",
          label: "Driveway Length (feet)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "width",
          label: "Driveway Width (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "costPerTon",
          label: "Average Cost per Ton ($)",
          type: "number",
          placeholder: "e.g. 30",
          defaultValue: 30,
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const costPerTon = parseFloat(inputs.costPerTon as string) || 30;
        if (!length || !width) return null;

        const sqFt = length * width;

        // Layer 1: Base - 4" of #3 crushed stone
        const baseDepth = 4;
        const baseCuYd = (sqFt * (baseDepth / 12)) / 27 * 1.15;
        const baseTons = (baseCuYd * 2500) / 2000;

        // Layer 2: Middle - 4" of #57 stone
        const midDepth = 4;
        const midCuYd = (sqFt * (midDepth / 12)) / 27 * 1.15;
        const midTons = (midCuYd * 2700) / 2000;

        // Layer 3: Top - 2" of #21A crusher run
        const topDepth = 2;
        const topCuYd = (sqFt * (topDepth / 12)) / 27 * 1.15;
        const topTons = (topCuYd * 2700) / 2000;

        const totalCuYd = baseCuYd + midCuYd + topCuYd;
        const totalTons = baseTons + midTons + topTons;
        const totalCost = totalTons * costPerTon;

        return {
          primary: {
            label: "Total Gravel Needed",
            value: `${formatNumber(totalTons, 1)} tons`,
          },
          details: [
            { label: "Area", value: `${formatNumber(sqFt)} sq ft` },
            { label: 'Base layer (4" #3 stone)', value: `${formatNumber(baseTons, 1)} tons` },
            { label: 'Middle layer (4" #57 stone)', value: `${formatNumber(midTons, 1)} tons` },
            { label: 'Top layer (2" crusher run)', value: `${formatNumber(topTons, 1)} tons` },
            { label: "Total cubic yards", value: formatNumber(totalCuYd, 1) },
            { label: "Estimated material cost", value: `$${formatNumber(totalCost)}` },
          ],
          note: "A proper 3-layer driveway lasts 15-25 years. Total depth is 10 inches. Each layer should be compacted before adding the next.",
        };
      },
    },
  ],
  relatedSlugs: ["crushed-stone-calculator", "asphalt-calculator", "gravel-calculator"],
  faq: [
    {
      question: "How much gravel do I need for a driveway?",
      answer:
        "For a standard 12ft x 100ft driveway with 4 inches of gravel, you need about 6 cubic yards or roughly 8 tons. A properly built gravel driveway has three layers totaling 10-12 inches, requiring about 20 tons for the same size.",
    },
    {
      question: "What is the best gravel for a driveway?",
      answer:
        "The best driveway gravel is a 3-layer system: #3 crushed stone for the base (4 inches), #57 stone for the middle (4 inches), and #21A crusher run for the top (2-3 inches). The crusher run compacts into a firm, smooth surface.",
    },
    {
      question: "How thick should driveway gravel be?",
      answer:
        "A minimum of 4 inches of compacted gravel is needed, but 8-12 inches in three layers is ideal for longevity. The base layer provides drainage, the middle prevents mixing, and the top layer creates the driving surface.",
    },
  ],
  formula:
    "Volume (cu yd) = (Length x Width x Depth/12) / 27 | Tons = Cu Yd x Density / 2000 | Add 15% for compaction",
};

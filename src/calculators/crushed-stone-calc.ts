import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crushedStoneCalculator: CalculatorDefinition = {
  slug: "crushed-stone-calculator",
  title: "Crushed Stone Tonnage Calculator",
  description:
    "Calculate the tonnage and cubic yards of crushed stone needed for your project. Covers gravel, limestone, granite, and other aggregate materials.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "crushed stone calculator",
    "stone tonnage",
    "aggregate calculator",
    "crushed gravel",
    "stone delivery calculator",
  ],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Area",
      description: "Calculate crushed stone for a rectangular area",
      fields: [
        {
          name: "length",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "width",
          label: "Width (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "depth",
          label: "Depth (inches)",
          type: "number",
          placeholder: "e.g. 4",
          defaultValue: 4,
        },
        {
          name: "stoneType",
          label: "Stone Type",
          type: "select",
          options: [
            { label: "Crushed Limestone (2,700 lbs/yd)", value: "2700" },
            { label: "Crushed Granite (2,800 lbs/yd)", value: "2800" },
            { label: "Pea Gravel (2,800 lbs/yd)", value: "2800" },
            { label: "Crusher Run / DGA (2,500 lbs/yd)", value: "2500" },
            { label: "Rip Rap (2,900 lbs/yd)", value: "2900" },
            { label: "Slag (2,400 lbs/yd)", value: "2400" },
          ],
          defaultValue: "2700",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const depth = parseFloat(inputs.depth as string);
        const density = parseFloat(inputs.stoneType as string);
        if (!length || !width || !depth || !density) return null;

        const sqFt = length * width;
        const cubicFeet = sqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const tons = (cubicYards * density) / 2000;
        const tonsWithExtra = tons * 1.1;

        return {
          primary: {
            label: "Stone Needed",
            value: `${formatNumber(tonsWithExtra, 1)} tons`,
          },
          details: [
            { label: "Area", value: `${formatNumber(sqFt)} sq ft` },
            { label: "Cubic yards (exact)", value: formatNumber(cubicYards, 2) },
            { label: "Tonnage (exact)", value: `${formatNumber(tons, 2)} tons` },
            { label: "With 10% extra", value: `${formatNumber(tonsWithExtra, 2)} tons` },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
          ],
          note: "Includes 10% extra for spreading and settling. Actual weight varies by moisture content and exact stone type.",
        };
      },
    },
    {
      id: "circular",
      name: "Circular Area",
      description: "Calculate crushed stone for a circular area",
      fields: [
        {
          name: "diameter",
          label: "Diameter (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "depth",
          label: "Depth (inches)",
          type: "number",
          placeholder: "e.g. 4",
          defaultValue: 4,
        },
        {
          name: "stoneType",
          label: "Stone Type",
          type: "select",
          options: [
            { label: "Crushed Limestone (2,700 lbs/yd)", value: "2700" },
            { label: "Crushed Granite (2,800 lbs/yd)", value: "2800" },
            { label: "Pea Gravel (2,800 lbs/yd)", value: "2800" },
            { label: "Crusher Run (2,500 lbs/yd)", value: "2500" },
          ],
          defaultValue: "2700",
        },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string);
        const depth = parseFloat(inputs.depth as string);
        const density = parseFloat(inputs.stoneType as string);
        if (!diameter || !depth || !density) return null;

        const radius = diameter / 2;
        const sqFt = Math.PI * radius * radius;
        const cubicFeet = sqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const tons = (cubicYards * density) / 2000;
        const tonsWithExtra = tons * 1.1;

        return {
          primary: {
            label: "Stone Needed",
            value: `${formatNumber(tonsWithExtra, 1)} tons`,
          },
          details: [
            { label: "Area", value: `${formatNumber(sqFt, 1)} sq ft` },
            { label: "Cubic yards", value: formatNumber(cubicYards, 2) },
            { label: "Tonnage (exact)", value: `${formatNumber(tons, 2)} tons` },
            { label: "With 10% extra", value: `${formatNumber(tonsWithExtra, 2)} tons` },
          ],
          note: "Includes 10% extra for irregular edges and settling.",
        };
      },
    },
    {
      id: "by-cubic-yards",
      name: "Convert Cubic Yards to Tons",
      description: "Convert a known volume to tonnage",
      fields: [
        {
          name: "cubicYards",
          label: "Cubic Yards",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "stoneType",
          label: "Stone Type",
          type: "select",
          options: [
            { label: "Crushed Limestone (2,700 lbs/yd)", value: "2700" },
            { label: "Crushed Granite (2,800 lbs/yd)", value: "2800" },
            { label: "Pea Gravel (2,800 lbs/yd)", value: "2800" },
            { label: "Crusher Run (2,500 lbs/yd)", value: "2500" },
            { label: "Rip Rap (2,900 lbs/yd)", value: "2900" },
          ],
          defaultValue: "2700",
        },
      ],
      calculate: (inputs) => {
        const cubicYards = parseFloat(inputs.cubicYards as string);
        const density = parseFloat(inputs.stoneType as string);
        if (!cubicYards || !density) return null;

        const tons = (cubicYards * density) / 2000;
        const lbs = cubicYards * density;

        return {
          primary: {
            label: "Weight",
            value: `${formatNumber(tons, 2)} tons`,
          },
          details: [
            { label: "Cubic yards", value: formatNumber(cubicYards, 2) },
            { label: "Tons", value: formatNumber(tons, 2) },
            { label: "Pounds", value: formatNumber(lbs) },
            { label: "Density", value: `${formatNumber(density)} lbs/cu yd` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gravel-calculator", "gravel-driveway-calculator", "asphalt-calculator"],
  faq: [
    {
      question: "How many tons are in a cubic yard of crushed stone?",
      answer:
        "One cubic yard of crushed stone weighs approximately 1.35 tons (2,700 lbs) for limestone and about 1.4 tons (2,800 lbs) for granite. Crusher run is lighter at about 1.25 tons per cubic yard. Weight varies by stone type and moisture.",
    },
    {
      question: "How much area does a ton of crushed stone cover?",
      answer:
        "One ton of crushed stone covers approximately 100 square feet at 2 inches deep, 65 square feet at 3 inches deep, or 50 square feet at 4 inches deep. The exact coverage depends on the stone type and size.",
    },
  ],
  formula:
    "Cu Yd = (L x W x Depth/12) / 27 | Tons = Cu Yd x Density / 2000 | Add 10% for waste",
};

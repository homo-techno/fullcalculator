import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const resinArtCalculator: CalculatorDefinition = {
  slug: "resin-art-calculator",
  title: "Resin Art Volume Calculator",
  description:
    "Free resin art volume calculator. Calculate the exact amount of epoxy resin needed for molds, coatings, river tables, and art projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "resin calculator",
    "epoxy resin volume",
    "resin art calculator",
    "how much resin",
    "resin mold calculator",
  ],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular / Flat Pour",
      description: "Calculate resin for rectangular molds and coatings",
      fields: [
        {
          name: "length",
          label: "Length (inches)",
          type: "number",
          placeholder: "e.g. 12",
          min: 0.5,
          step: 0.25,
        },
        {
          name: "width",
          label: "Width (inches)",
          type: "number",
          placeholder: "e.g. 8",
          min: 0.5,
          step: 0.25,
        },
        {
          name: "depth",
          label: "Depth / Thickness (inches)",
          type: "number",
          placeholder: "e.g. 0.125",
          min: 0.01,
          step: 0.01,
        },
        {
          name: "mixRatio",
          label: "Mix Ratio (Resin:Hardener)",
          type: "select",
          options: [
            { label: "1:1 by volume", value: "1:1" },
            { label: "2:1 by volume", value: "2:1" },
            { label: "3:1 by volume", value: "3:1" },
          ],
          defaultValue: "1:1",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const depth = parseFloat(inputs.depth as string);
        const ratio = inputs.mixRatio as string;
        if (!length || !width || !depth) return null;

        const cubicInches = length * width * depth;
        const flOz = cubicInches * 0.554; // 1 cubic inch = 0.554 fl oz
        const mlTotal = flOz * 29.574;
        const liters = mlTotal / 1000;
        const gallons = flOz / 128;

        // Add 10% waste/overflow
        const totalWithWaste = flOz * 1.1;

        // Mix ratio split
        let resinPart = 0;
        let hardenerPart = 0;
        if (ratio === "1:1") {
          resinPart = totalWithWaste / 2;
          hardenerPart = totalWithWaste / 2;
        } else if (ratio === "2:1") {
          resinPart = (totalWithWaste * 2) / 3;
          hardenerPart = totalWithWaste / 3;
        } else {
          resinPart = (totalWithWaste * 3) / 4;
          hardenerPart = totalWithWaste / 4;
        }

        return {
          primary: {
            label: "Total Resin Needed",
            value: formatNumber(totalWithWaste, 1) + " fl oz",
          },
          details: [
            { label: "Volume (exact)", value: formatNumber(flOz, 1) + " fl oz" },
            { label: "With 10% Overage", value: formatNumber(totalWithWaste, 1) + " fl oz" },
            { label: "Milliliters", value: formatNumber(mlTotal * 1.1, 0) + " mL" },
            { label: "Resin Part (A)", value: formatNumber(resinPart, 1) + " fl oz" },
            { label: "Hardener Part (B)", value: formatNumber(hardenerPart, 1) + " fl oz" },
            { label: "Surface Area", value: formatNumber(length * width, 1) + " sq in" },
            { label: "Cubic Inches", value: formatNumber(cubicInches, 2) },
          ],
          note: "Always mix slightly more than calculated. Resin left on mixing cups and sticks accounts for 5-10% loss. Measure by volume, not weight, unless manufacturer specifies weight ratio.",
        };
      },
    },
    {
      id: "cylindrical",
      name: "Cylindrical Mold",
      description: "Calculate resin for round molds (coasters, paperweights)",
      fields: [
        {
          name: "diameter",
          label: "Diameter (inches)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0.5,
          step: 0.25,
        },
        {
          name: "depth",
          label: "Depth (inches)",
          type: "number",
          placeholder: "e.g. 0.5",
          min: 0.01,
          step: 0.01,
        },
        {
          name: "quantity",
          label: "Number of Pieces",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string);
        const depth = parseFloat(inputs.depth as string);
        const qty = parseFloat(inputs.quantity as string);
        if (!diameter || !depth || !qty) return null;

        const radius = diameter / 2;
        const cubicInchesEach = Math.PI * radius * radius * depth;
        const cubicInchesTotal = cubicInchesEach * qty;
        const flOzEach = cubicInchesEach * 0.554;
        const flOzTotal = cubicInchesTotal * 0.554;
        const totalWithWaste = flOzTotal * 1.1;
        const mlTotal = totalWithWaste * 29.574;

        return {
          primary: {
            label: "Total Resin Needed",
            value: formatNumber(totalWithWaste, 1) + " fl oz",
          },
          details: [
            { label: "Per Piece", value: formatNumber(flOzEach, 1) + " fl oz" },
            { label: "All Pieces (exact)", value: formatNumber(flOzTotal, 1) + " fl oz" },
            { label: "With 10% Overage", value: formatNumber(totalWithWaste, 1) + " fl oz" },
            { label: "Total (mL)", value: formatNumber(mlTotal, 0) + " mL" },
            { label: "Quantity", value: formatNumber(qty, 0) + " pieces" },
            { label: "Volume Each", value: formatNumber(cubicInchesEach, 2) + " cu in" },
          ],
          note: "For coasters and small molds, mix in small batches to maintain pot life. Use a torch or heat gun to pop surface bubbles within 10 minutes of pouring.",
        };
      },
    },
    {
      id: "river-table",
      name: "River Table",
      description: "Calculate resin for a river table void",
      fields: [
        {
          name: "tableLength",
          label: "Table Length (inches)",
          type: "number",
          placeholder: "e.g. 72",
          min: 12,
        },
        {
          name: "riverWidth",
          label: "Average River Width (inches)",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
        },
        {
          name: "thickness",
          label: "Slab Thickness (inches)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0.5,
          step: 0.25,
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.tableLength as string);
        const riverWidth = parseFloat(inputs.riverWidth as string);
        const thickness = parseFloat(inputs.thickness as string);
        if (!length || !riverWidth || !thickness) return null;

        // River tables are roughly 70% filled (irregular edges)
        const cubicInches = length * riverWidth * thickness * 0.7;
        const flOz = cubicInches * 0.554;
        const gallons = flOz / 128;
        const totalWithWaste = flOz * 1.15; // 15% waste for river tables
        const gallonsWithWaste = totalWithWaste / 128;
        const liters = totalWithWaste * 0.0296;

        // Deep pour resin layers (max 1-2 inches per pour)
        const numPours = Math.ceil(thickness / 1.5);

        return {
          primary: {
            label: "Total Resin Needed",
            value: formatNumber(gallonsWithWaste, 1) + " gallons",
          },
          details: [
            { label: "Fluid Ounces", value: formatNumber(totalWithWaste, 0) },
            { label: "Liters", value: formatNumber(liters, 1) },
            { label: "Exact Volume", value: formatNumber(flOz, 0) + " fl oz" },
            { label: "With 15% Overage", value: formatNumber(totalWithWaste, 0) + " fl oz" },
            { label: "Number of Pours", value: formatNumber(numPours, 0) + " (1.5\" max per pour)" },
            { label: "Per Pour", value: formatNumber(totalWithWaste / numPours, 0) + " fl oz" },
          ],
          note: "Use deep-pour epoxy rated for 2\"+ thickness. Standard table-top epoxy can overheat in deep pours. Allow 12-24 hours between pours.",
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "unit-converter", "square-footage-calculator"],
  faq: [
    {
      question: "How much resin do I need per square foot?",
      answer:
        "For a thin coating (1/8 inch or 3mm), you need approximately 8 fl oz (237 mL) per square foot. For 1/4 inch thickness, double that to about 16 fl oz per square foot. Always add 10% extra for mixing waste.",
    },
    {
      question: "What is the difference between coating and deep pour resin?",
      answer:
        "Coating/table-top resin is designed for thin layers (up to 1/4 inch) and cures quickly with high hardness. Deep-pour (casting) resin can be poured 1-2+ inches thick without overheating, but takes 24-72 hours to cure and is slightly softer.",
    },
  ],
  formula:
    "Volume (fl oz) = Length × Width × Depth (cubic inches) × 0.554 | Total = Volume × 1.1 (10% waste)",
};

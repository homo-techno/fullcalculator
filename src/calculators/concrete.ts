import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteCalculator: CalculatorDefinition = {
  slug: "concrete-calculator",
  title: "Concrete Calculator",
  description: "Free concrete calculator. Calculate how many bags or cubic yards of concrete you need for slabs, footings, columns, and stairs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["concrete calculator", "how much concrete do I need", "concrete yard calculator", "concrete bag calculator", "cement calculator"],
  variants: [
    {
      id: "slab",
      name: "Concrete Slab",
      description: "Calculate concrete needed for a rectangular slab or patio",
      fields: [
        { name: "length", label: "Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "depth", label: "Thickness (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 4;
        if (!length || !width) return null;

        const cubicFeet = length * width * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.10;
        const bags80lb = Math.ceil(cubicFeet / 0.6);
        const bags60lb = Math.ceil(cubicFeet / 0.45);
        const sqFt = length * width;

        return {
          primary: { label: "Concrete Needed", value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards` },
          details: [
            { label: "Without waste (exact)", value: `${formatNumber(cubicYards, 2)} cu yd` },
            { label: "With 10% waste", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "80-lb bags needed", value: `${bags80lb}` },
            { label: "60-lb bags needed", value: `${bags60lb}` },
            { label: "Area", value: `${formatNumber(sqFt)} sq ft` },
          ],
          note: "Includes 10% extra for waste. One 80-lb bag ≈ 0.6 cu ft. Order ready-mix concrete for anything over 1 cubic yard.",
        };
      },
    },
    {
      id: "column",
      name: "Concrete Column / Post Hole",
      description: "Calculate concrete for round columns or post holes",
      fields: [
        { name: "diameter", label: "Diameter (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "count", label: "Number of Holes", type: "number", placeholder: "e.g. 4", min: 1, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const depth = inputs.depth as number;
        const count = (inputs.count as number) || 1;
        if (!diameter || !depth) return null;

        const radiusFt = diameter / 2 / 12;
        const depthFt = depth / 12;
        const volumePerHole = Math.PI * radiusFt * radiusFt * depthFt;
        const totalCF = volumePerHole * count;
        const cubicYards = totalCF / 27;
        const bags80lb = Math.ceil(totalCF / 0.6);

        return {
          primary: { label: "Concrete Needed", value: `${formatNumber(cubicYards * 1.1, 2)} cubic yards` },
          details: [
            { label: "Per hole", value: `${formatNumber(volumePerHole, 2)} cu ft` },
            { label: "Total cubic feet", value: formatNumber(totalCF, 2) },
            { label: "80-lb bags needed", value: `${bags80lb}` },
            { label: "Number of holes", value: `${count}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "paint-calculator", "volume-calculator"],
  faq: [
    { question: "How do I calculate concrete for a slab?", answer: "Multiply length × width × thickness (in feet). Divide by 27 to get cubic yards. Add 10% for waste. Example: 20ft × 10ft × 4in thick = 200 × 0.333 = 66.7 cu ft = 2.47 cu yd + 10% = 2.72 cu yd." },
    { question: "How many bags of concrete do I need?", answer: "One 80-lb bag covers about 0.6 cubic feet. For a 4' × 4' × 4\" slab: 4 × 4 × 0.333 = 5.33 cu ft → 9 bags. For large projects (over 1 cubic yard), order ready-mix delivery instead." },
  ],
  formula: "Volume = L × W × D (in feet) | Cubic Yards = Volume / 27 | Bags = Volume / 0.6",
};

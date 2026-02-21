import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gravelCalculator: CalculatorDefinition = {
  slug: "gravel-calculator",
  title: "Gravel Calculator",
  description: "Free gravel calculator. Calculate how much gravel, crushed stone, or mulch you need in tons and cubic yards for your landscaping project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gravel calculator", "how much gravel do I need", "crushed stone calculator", "mulch calculator", "landscaping calculator"],
  variants: [
    {
      id: "gravel",
      name: "Gravel / Mulch Needed",
      fields: [
        { name: "length", label: "Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "material", label: "Material", type: "select", options: [
          { label: "Gravel / Crushed Stone", value: "2700" },
          { label: "Pea Gravel", value: "2600" },
          { label: "Sand", value: "2700" },
          { label: "Mulch (wood chips)", value: "800" },
          { label: "Topsoil", value: "2200" },
          { label: "River Rock", value: "2600" },
        ], defaultValue: "2700" },
        { name: "price", label: "Price per Cubic Yard (optional)", type: "number", placeholder: "e.g. 45", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 3;
        const density = parseInt(inputs.material as string) || 2700;
        const price = inputs.price as number;
        if (!length || !width) return null;
        const cubicFeet = length * width * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const tons = (cubicYards * density) / 2000;
        const details = [
          { label: "Cubic yards", value: formatNumber(cubicYards, 2) },
          { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
          { label: "Estimated weight", value: `${formatNumber(tons, 2)} tons` },
          { label: "Area", value: `${formatNumber(length * width)} sq ft` },
        ];
        if (price) {
          details.push({ label: "Estimated cost", value: `$${formatNumber(cubicYards * price)}` });
        }
        return {
          primary: { label: "Material Needed", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          details,
          note: "Most suppliers sell by the cubic yard or ton. Add 5-10% for uneven coverage.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "square-footage-calculator", "paint-calculator"],
  faq: [
    { question: "How deep should I lay gravel?", answer: "Driveways: 4-6 inches. Pathways: 2-3 inches. Mulch: 2-4 inches. French drain: 12+ inches. Deeper layers provide better stability and weed prevention." },
  ],
  formula: "Cu Yd = (L × W × Depth/12) / 27 | Tons = Cu Yd × Density / 2000",
};

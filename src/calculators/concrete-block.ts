import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteBlockCalculator: CalculatorDefinition = {
  slug: "concrete-block-calculator",
  title: "Concrete Block Calculator",
  description: "Free concrete block calculator. Calculate how many CMU blocks, mortar bags, and materials you need for your wall project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["concrete block calculator", "CMU calculator", "cinder block calculator", "block wall calculator", "masonry block calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Blocks Needed",
      description: "Calculate concrete blocks and mortar for a wall",
      fields: [
        { name: "length", label: "Wall Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "height", label: "Wall Height (ft)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = inputs.height as number;
        if (!length || !height) return null;

        const wallArea = length * height;
        // Standard CMU block: 16" x 8" (with mortar joint = 1.125 blocks per sq ft)
        const blocksPerSqFt = 1.125;
        const blocksExact = wallArea * blocksPerSqFt;
        const blocksWithWaste = Math.ceil(blocksExact * 1.05);
        // Mortar: approximately 3 bags (80-lb) per 100 blocks
        const mortarBags = Math.ceil((blocksWithWaste / 100) * 3);
        // Sand: approximately 200 lbs per 100 blocks (when mixed with mortar)
        const sandLbs = Math.ceil((blocksWithWaste / 100) * 200);
        // Rebar: typically every 4 ft vertically and horizontally
        const verticalRebar = Math.ceil(length / 4) + 1;
        const horizontalCourses = Math.ceil(height / (8 / 12)); // 8-inch courses
        const courses = Math.ceil(height / (8 / 12));

        return {
          primary: { label: "Blocks Needed", value: `${blocksWithWaste} blocks` },
          details: [
            { label: "Wall area", value: `${formatNumber(wallArea)} sq ft` },
            { label: "Blocks (exact)", value: formatNumber(blocksExact, 0) },
            { label: "Blocks (with 5% waste)", value: `${blocksWithWaste}` },
            { label: "Mortar bags (80-lb)", value: `${mortarBags}` },
            { label: "Sand needed", value: `${formatNumber(sandLbs)} lbs` },
            { label: "Block courses high", value: `${courses}` },
            { label: "Block size", value: "16\" x 8\" (standard CMU)" },
          ],
          note: "Based on standard 8x8x16 inch CMU blocks at 1.125 blocks per sq ft (includes mortar joints). Includes 5% waste. Mortar estimate is ~3 bags per 100 blocks.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "brick-calculator", "mortar-calculator"],
  faq: [
    { question: "How many concrete blocks per square foot?", answer: "Standard 8x8x16 inch CMU blocks require 1.125 blocks per square foot of wall area, accounting for the 3/8-inch mortar joint." },
    { question: "How much mortar do I need for concrete blocks?", answer: "Plan for approximately 3 bags (80-lb) of mortar mix per 100 blocks. This covers bed joints and head joints for standard 8x8x16 CMU blocks." },
    { question: "How many courses of block for an 8-foot wall?", answer: "An 8-foot wall requires 12 courses of standard 8-inch CMU blocks (8 feet / 8 inches per course = 12 courses)." },
  ],
  formula: "Blocks = Wall Area (sq ft) x 1.125 x 1.05 | Mortar Bags = Blocks / 100 x 3",
};

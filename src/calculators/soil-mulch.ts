import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilMulchCalculator: CalculatorDefinition = {
  slug: "soil-mulch-calculator",
  title: "Soil & Mulch Calculator",
  description: "Free soil and mulch calculator. Calculate how many cubic yards or bags of soil, mulch, or compost you need for your project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soil calculator", "mulch calculator", "cubic yards calculator", "topsoil calculator", "compost calculator"],
  variants: [
    {
      id: "cubicYards",
      name: "Calculate Volume Needed",
      fields: [
        { name: "length", label: "Area Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Area Width (ft)", type: "number", placeholder: "e.g. 10" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number, w = inputs.width as number, d = inputs.depth as number;
        if (!l || !w || !d) return null;
        const sqft = l * w;
        const cubicFeet = sqft * (d / 12);
        const cubicYards = cubicFeet / 27;
        const bags2cuft = Math.ceil(cubicFeet / 2);
        const bags1cuft = Math.ceil(cubicFeet);
        const weightTons = cubicYards * 1.1;
        return {
          primary: { label: "Cubic Yards", value: formatNumber(cubicYards, 2) },
          details: [
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "Area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "2 cu ft bags", value: String(bags2cuft) },
            { label: "1 cu ft bags", value: String(bags1cuft) },
            { label: "Est. weight", value: `${formatNumber(weightTons, 1)} tons` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gravel-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [{ question: "How much mulch do I need?", answer: "Calculate: Length × Width × Depth(in) / 12 = cubic feet. Divide by 27 for cubic yards. Typical mulch depth: 2-3 inches. For a 200 sq ft area at 3\" deep: 200 × 3/12 = 50 cu ft = 1.85 cubic yards." }],
  formula: "Cubic yards = (L × W × Depth/12) / 27",
};

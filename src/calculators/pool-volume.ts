import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poolVolumeCalculator: CalculatorDefinition = {
  slug: "pool-volume-calculator",
  title: "Pool Volume Calculator",
  description: "Free pool volume calculator. Calculate the water volume of rectangular, circular, and oval swimming pools in gallons and liters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pool volume calculator", "pool water calculator", "how many gallons in my pool", "swimming pool calculator", "pool capacity"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Pool",
      fields: [
        { name: "length", label: "Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "width", label: "Width (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "depthShallow", label: "Shallow End Depth (feet)", type: "number", placeholder: "e.g. 3" },
        { name: "depthDeep", label: "Deep End Depth (feet)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number;
        const w = inputs.width as number;
        const d1 = (inputs.depthShallow as number) || 0;
        const d2 = (inputs.depthDeep as number) || d1;
        if (!l || !w || !d1) return null;
        const avgDepth = (d1 + d2) / 2;
        const cubicFeet = l * w * avgDepth;
        const gallons = cubicFeet * 7.481;
        const liters = gallons * 3.785;
        return {
          primary: { label: "Pool Volume", value: `${formatNumber(gallons, 0)} gallons` },
          details: [
            { label: "Liters", value: formatNumber(liters, 0) },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 0) },
            { label: "Average depth", value: `${formatNumber(avgDepth, 1)} ft` },
            { label: "Surface area", value: `${formatNumber(l * w)} sq ft` },
          ],
        };
      },
    },
    {
      id: "circular",
      name: "Circular Pool",
      fields: [
        { name: "diameter", label: "Diameter (feet)", type: "number", placeholder: "e.g. 18" },
        { name: "depth", label: "Depth (feet)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const d = inputs.diameter as number;
        const depth = inputs.depth as number;
        if (!d || !depth) return null;
        const r = d / 2;
        const cubicFeet = Math.PI * r * r * depth;
        const gallons = cubicFeet * 7.481;
        return {
          primary: { label: "Pool Volume", value: `${formatNumber(gallons, 0)} gallons` },
          details: [
            { label: "Liters", value: formatNumber(gallons * 3.785, 0) },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 0) },
            { label: "Surface area", value: `${formatNumber(Math.PI * r * r)} sq ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many gallons is a typical pool?", answer: "Small above-ground (12ft round, 4ft deep): ~3,400 gallons. Medium (15×30, avg 5ft): ~16,800. Large (20×40, avg 5.5ft): ~33,000. Olympic size: ~660,000 gallons." },
  ],
  formula: "Rectangle: L × W × AvgDepth × 7.481 gal/ft³ | Circle: π × r² × D × 7.481",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicleLayoutCalculator: CalculatorDefinition = {
  slug: "cubicle-layout-calculator",
  title: "Cubicle Layout Calculator",
  description: "Calculate the number of cubicles that fit in an office space.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cubicle","layout","office","workspace"],
  variants: [{
    id: "standard",
    name: "Cubicle Layout",
    description: "Calculate the number of cubicles that fit in an office space.",
    fields: [
      { name: "floorLength", label: "Floor Length (ft)", type: "number", min: 20, max: 500, defaultValue: 60 },
      { name: "floorWidth", label: "Floor Width (ft)", type: "number", min: 20, max: 300, defaultValue: 40 },
      { name: "cubicleSize", label: "Cubicle Size", type: "select", options: [{ value: "36", label: "6x6 Small (36 sqft)" }, { value: "48", label: "6x8 Medium (48 sqft)" }, { value: "64", label: "8x8 Standard (64 sqft)" }] },
      { name: "aisleWidth", label: "Aisle Width (ft)", type: "number", min: 3, max: 8, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const floorLength = inputs.floorLength as number;
    const floorWidth = inputs.floorWidth as number;
    const cubicleSize = inputs.cubicleSize as number;
    const aisleWidth = inputs.aisleWidth as number;
    const totalSqft = floorLength * floorWidth;
    const usablePct = 0.70;
    const usableSqft = totalSqft * usablePct;
    const totalCubicles = Math.floor(usableSqft / cubicleSize);
    const cubicleWidth = Math.sqrt(cubicleSize);
    const rows = Math.floor(floorLength / (cubicleWidth + aisleWidth));
    const perRow = Math.floor(floorWidth / cubicleWidth);
    return { primary: { label: "Total Cubicles", value: formatNumber(totalCubicles) }, details: [{ label: "Total Floor Area", value: formatNumber(totalSqft) + " sq ft" }, { label: "Usable Area (70%)", value: formatNumber(usableSqft) + " sq ft" }, { label: "Estimated Rows", value: formatNumber(rows) }, { label: "Cubicles Per Row", value: formatNumber(perRow) }] };
  },
  }],
  relatedSlugs: ["office-space-per-employee-calculator","conference-room-calculator","standing-desk-height-calculator"],
  faq: [
    { question: "What is the standard cubicle size?", answer: "The most common sizes are 6x8 feet and 8x8 feet per workstation." },
    { question: "How much aisle space is needed between cubicles?", answer: "Main aisles should be 4 to 5 feet; secondary paths at least 3 feet." },
    { question: "What percentage of office space is usable for cubicles?", answer: "About 65% to 75% after accounting for aisles, exits, and common areas." },
  ],
  formula: "Cubicles = (FloorArea * 0.70) / CubicleSize",
};

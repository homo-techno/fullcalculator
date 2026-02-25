import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ceilingFanSizeCalculator: CalculatorDefinition = {
  slug: "ceiling-fan-size-calculator",
  title: "Ceiling Fan Size Calculator",
  description: "Free ceiling fan size calculator. Find the right ceiling fan blade span and downrod length for any room size and ceiling height.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ceiling fan size calculator", "ceiling fan for room size", "fan blade span", "ceiling fan downrod", "what size ceiling fan"],
  variants: [
    {
      id: "roomSize",
      name: "By Room Size",
      fields: [
        { name: "length", label: "Room Length (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "ceilingHeight", label: "Ceiling Height (feet)", type: "number", placeholder: "e.g. 9", defaultValue: 9 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const ceiling = (inputs.ceilingHeight as number) || 9;
        if (!length || !width) return null;
        const area = length * width;
        let fanSize: string;
        let fanRange: string;
        if (area <= 75) { fanSize = "29-36"; fanRange = "Small"; }
        else if (area <= 144) { fanSize = "36-42"; fanRange = "Medium"; }
        else if (area <= 225) { fanSize = "44-50"; fanRange = "Standard"; }
        else if (area <= 400) { fanSize = "50-54"; fanRange = "Large"; }
        else { fanSize = "56-72"; fanRange = "Extra Large"; }
        const idealHeight = 8; // fan blades 8ft from floor
        const fanHousing = 1; // approx 1 ft for fan itself
        const downrod = Math.max(0, ceiling - idealHeight - fanHousing);
        const mountType = ceiling <= 8 ? "Flush/Hugger Mount" : downrod <= 0.5 ? "Standard Mount" : `${formatNumber(downrod * 12, 0)}" Downrod`;
        return {
          primary: { label: "Recommended Fan Size", value: `${fanSize} inches` },
          details: [
            { label: "Size category", value: fanRange },
            { label: "Room area", value: `${formatNumber(area)} sq ft` },
            { label: "Ceiling height", value: `${ceiling} ft` },
            { label: "Mount type", value: mountType },
            { label: "Blades from floor", value: `~${formatNumber(ceiling - downrod - fanHousing, 1)} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "electricity-cost-calculator", "central-ac-cost-calculator"],
  faq: [
    { question: "How do I choose the right ceiling fan size?", answer: "Match fan blade span to room size: Under 75 sq ft use 29-36\", 76-144 sq ft use 36-42\", 145-225 sq ft use 44-50\", 226-400 sq ft use 50-54\", over 400 sq ft use 56-72\". Fan blades should be 7-9 feet from the floor and at least 18 inches from walls." },
  ],
  formula: "Fan Size based on room area (sq ft) | Downrod = Ceiling Height - 8ft - 1ft (fan housing)",
};

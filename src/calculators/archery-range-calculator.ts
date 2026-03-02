import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const archeryRangeCalculator: CalculatorDefinition = {
  slug: "archery-range-calculator",
  title: "Archery Range Calculator",
  description: "Calculate archery range safety zone dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["archery","range","safety","shooting"],
  variants: [{
    id: "standard",
    name: "Archery Range",
    description: "Calculate archery range safety zone dimensions.",
    fields: [
      { name: "distance", label: "Shooting Distance (yards)", type: "number", min: 10, max: 100, defaultValue: 20 },
      { name: "lanes", label: "Number of Lanes", type: "number", min: 1, max: 20, defaultValue: 4 },
      { name: "laneWidth", label: "Lane Width (ft)", type: "number", min: 4, max: 10, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const distance = inputs.distance as number;
    const lanes = inputs.lanes as number;
    const laneWidth = inputs.laneWidth as number;
    const rangeLengthFt = distance * 3 + 30;
    const rangeWidth = lanes * laneWidth + 10;
    const totalArea = rangeLengthFt * rangeWidth;
    return {
      primary: { label: "Range Length", value: formatNumber(rangeLengthFt) + " ft" },
      details: [
        { label: "Range Width", value: formatNumber(rangeWidth) + " ft" },
        { label: "Total Area Needed", value: formatNumber(totalArea) + " sq ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["batting-cage-size-calculator","dart-board-height-calculator"],
  faq: [
    { question: "How far behind the target is the safety zone?", answer: "Allow at least 30 feet of buffer behind the target backstop." },
    { question: "How wide should an archery lane be?", answer: "Each archery lane should be at least 5 feet wide." },
  ],
  formula: "Range Length = (Distance in yards x 3) + 30 ft buffer; Width = Lanes x Lane Width + 10",
};

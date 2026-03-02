import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const basketballCourtDimensionsCalculator: CalculatorDefinition = {
  slug: "basketball-court-dimensions-calculator",
  title: "Basketball Court Dimensions Calculator",
  description: "Calculate total area, paint zone, three-point area, and markings for various basketball court types.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["basketball court dimensions","court area","basketball measurements","court markings"],
  variants: [{
    id: "standard",
    name: "Basketball Court Dimensions",
    description: "Calculate total area, paint zone, three-point area, and markings for various basketball court types.",
    fields: [
      { name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "NBA (94x50 ft)" }, { value: "2", label: "NCAA (94x50 ft)" }, { value: "3", label: "High School (84x50 ft)" }, { value: "4", label: "FIBA (91.9x49.2 ft)" }], defaultValue: "1" },
      { name: "includeRunout", label: "Include Runout Area (ft)", type: "number", min: 0, max: 15, defaultValue: 6 },
      { name: "surfaceCost", label: "Surface Cost per Sq Ft ($)", type: "number", min: 1, max: 50, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const courtType = parseInt(inputs.courtType as string);
    const runout = inputs.includeRunout as number;
    const surfaceCost = inputs.surfaceCost as number;
    const dims = courtType === 1 ? [94, 50] : courtType === 2 ? [94, 50] : courtType === 3 ? [84, 50] : [91.9, 49.2];
    const length = dims[0];
    const width = dims[1];
    const courtArea = length * width;
    const totalLength = length + 2 * runout;
    const totalWidth = width + 2 * runout;
    const totalArea = totalLength * totalWidth;
    const totalCost = Math.round(totalArea * surfaceCost);
    const threePointDist = courtType === 1 ? 23.75 : courtType === 2 ? 22.15 : courtType === 3 ? 19.75 : 22.15;
    return {
      primary: { label: "Court Area", value: formatNumber(Math.round(courtArea)) + " sq ft" },
      details: [
        { label: "Dimensions", value: formatNumber(length) + " x " + formatNumber(width) + " ft" },
        { label: "Total Area with Runout", value: formatNumber(Math.round(totalArea)) + " sq ft" },
        { label: "Three-Point Distance", value: formatNumber(threePointDist) + " ft" },
        { label: "Estimated Surface Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["soccer-field-area-calculator","football-field-goal-distance-calculator"],
  faq: [
    { question: "How big is a standard basketball court?", answer: "An NBA and NCAA court is 94 feet long by 50 feet wide. High school courts are 84 by 50 feet." },
    { question: "What is the three-point line distance?", answer: "The NBA three-point line is 23 feet 9 inches from the basket. College is 22 feet 1.75 inches." },
    { question: "How much does a basketball court cost to build?", answer: "An outdoor court costs $10,000 to $40,000. Indoor courts can cost $100,000 or more depending on materials." },
  ],
  formula: "Court Area = Length x Width; Total Area = (Length + 2 x Runout) x (Width + 2 x Runout)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soccerFieldAreaCalculator: CalculatorDefinition = {
  slug: "soccer-field-area-calculator",
  title: "Soccer Field Area Calculator",
  description: "Calculate soccer field area, penalty box dimensions, and turf requirements for different standards.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["soccer field area","soccer pitch size","football pitch dimensions","soccer field calculator"],
  variants: [{
    id: "standard",
    name: "Soccer Field Area",
    description: "Calculate soccer field area, penalty box dimensions, and turf requirements for different standards.",
    fields: [
      { name: "fieldStandard", label: "Field Standard", type: "select", options: [{ value: "1", label: "FIFA International (110x75 yd)" }, { value: "2", label: "MLS/Premier League (115x75 yd)" }, { value: "3", label: "Youth U12 (80x50 yd)" }, { value: "4", label: "Youth U8 (40x30 yd)" }], defaultValue: "1" },
      { name: "turfCost", label: "Turf Cost per Sq Yd ($)", type: "number", min: 1, max: 30, defaultValue: 8 },
      { name: "unit", label: "Display Units", type: "select", options: [{ value: "1", label: "Yards" }, { value: "2", label: "Meters" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const standard = parseInt(inputs.fieldStandard as string);
    const turfCost = inputs.turfCost as number;
    const unit = parseInt(inputs.unit as string);
    const dims = standard === 1 ? [110, 75] : standard === 2 ? [115, 75] : standard === 3 ? [80, 50] : [40, 30];
    var length = dims[0];
    var width = dims[1];
    const areaYd = length * width;
    const areaSqFt = areaYd * 9;
    const totalTurfCost = Math.round(areaYd * turfCost);
    const penaltyBoxL = standard <= 2 ? 18 : standard === 3 ? 14 : 10;
    const penaltyBoxW = standard <= 2 ? 44 : standard === 3 ? 32 : 20;
    const label = unit === 2 ? "meters" : "yards";
    const factor = unit === 2 ? 0.9144 : 1;
    return {
      primary: { label: "Field Area", value: formatNumber(Math.round(areaYd * factor * factor)) + " sq " + label },
      details: [
        { label: "Dimensions", value: formatNumber(Math.round(length * factor)) + " x " + formatNumber(Math.round(width * factor)) + " " + label },
        { label: "Penalty Box", value: formatNumber(Math.round(penaltyBoxL * factor)) + " x " + formatNumber(Math.round(penaltyBoxW * factor)) + " " + label },
        { label: "Estimated Turf Cost", value: "$" + formatNumber(totalTurfCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["basketball-court-dimensions-calculator","football-field-goal-distance-calculator"],
  faq: [
    { question: "How big is a standard soccer field?", answer: "A FIFA international field is 110 to 120 yards long and 70 to 80 yards wide. The most common size is 110 by 75 yards." },
    { question: "Are all soccer fields the same size?", answer: "No, FIFA allows a range of dimensions. Youth fields are significantly smaller than professional fields." },
    { question: "How big is the penalty box?", answer: "The standard penalty area is 18 yards deep by 44 yards wide on a full-size field." },
  ],
  formula: "Field Area = Length x Width; Turf Cost = Area x Cost per Sq Yd",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radiantFloorHeatingCalculator: CalculatorDefinition = {
  slug: "radiant-floor-heating-calculator",
  title: "Radiant Floor Heating Calculator",
  description: "Calculate radiant floor heating requirements including tube spacing, water temperature, and BTU output per square foot for hydronic or electric radiant systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["radiant floor heating","hydronic floor heating calculator","in-floor heating","radiant heat BTU"],
  variants: [{
    id: "standard",
    name: "Radiant Floor Heating",
    description: "Calculate radiant floor heating requirements including tube spacing, water temperature, and BTU output per square foot for hydronic or electric radiant systems.",
    fields: [
      { name: "floorArea", label: "Floor Area (sq ft)", type: "number", min: 50, max: 10000, defaultValue: 500 },
      { name: "heatLoss", label: "Room Heat Loss (BTU/sq ft/hr)", type: "number", min: 10, max: 60, defaultValue: 25 },
      { name: "floorType", label: "Floor Covering", type: "select", options: [{ value: "1", label: "Tile/Stone" }, { value: "2", label: "Hardwood" }, { value: "3", label: "Carpet" }, { value: "4", label: "Laminate" }], defaultValue: "1" },
      { name: "systemType", label: "System Type", type: "select", options: [{ value: "1", label: "Hydronic (water)" }, { value: "2", label: "Electric" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const area = inputs.floorArea as number;
    const heatLoss = inputs.heatLoss as number;
    const floorType = parseInt(inputs.floorType as string);
    const sysType = parseInt(inputs.systemType as string);
    const totalBtu = area * heatLoss;
    const rValue = { 1: 0.5, 2: 1.0, 3: 2.0, 4: 0.8 };
    const floorR = rValue[floorType] || 1.0;
    const waterTemp = 85 + floorR * 15 + heatLoss * 0.5;
    const tubeSpacing = heatLoss <= 20 ? 12 : heatLoss <= 35 ? 9 : 6;
    const tubeLength = (area / tubeSpacing) * 12;
    const wattsPerSqFt = sysType === 2 ? heatLoss / 3.412 : 0;
    const electricWatts = wattsPerSqFt * area;
    const monthlyCost = sysType === 2 ? (electricWatts / 1000) * 0.12 * 8 * 30 : (totalBtu / 100000) * 1.0 * 8 * 30;
    return {
      primary: { label: "Total Heating Capacity", value: formatNumber(Math.round(totalBtu)) + " BTU/hr" },
      details: [
        { label: sysType === 1 ? "Water Temperature" : "Watts Per Sq Ft", value: sysType === 1 ? formatNumber(Math.round(waterTemp)) + " F" : formatNumber(Math.round(wattsPerSqFt * 10) / 10) + " W/sq ft" },
        { label: "Tube Spacing", value: formatNumber(tubeSpacing) + " inches" },
        { label: sysType === 1 ? "Total Tube Length" : "Total Wattage", value: sysType === 1 ? formatNumber(Math.round(tubeLength)) + " ft" : formatNumber(Math.round(electricWatts)) + " W" },
        { label: "Est. Monthly Cost (8hr/day)", value: "$" + formatNumber(Math.round(monthlyCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["btu-heating-calculator","boiler-efficiency-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total BTU = Floor Area x Heat Loss Per Sq Ft
Water Temp = 85 + (Floor R-Value x 15) + (Heat Loss x 0.5)
Tube Spacing = 12 in (low), 9 in (medium), 6 in (high heat loss)
Tube Length = (Area / Spacing) x 12",
};

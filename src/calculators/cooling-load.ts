import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coolingLoadCalculator: CalculatorDefinition = {
  slug: "cooling-load-calculator",
  title: "Cooling Load Calculator",
  description: "Free cooling load calculator. Estimate room or building cooling requirements in BTU/hr for air conditioning sizing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cooling load calculator", "BTU calculator room", "AC sizing calculator", "air conditioning BTU", "cooling capacity"],
  variants: [
    {
      id: "room-cooling",
      name: "Room Cooling Load",
      description: "Estimate BTU cooling needed for a room",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "sunExposure", label: "Sun Exposure", type: "select", options: [
          { label: "Heavy (south/west facing)", value: "heavy" },
          { label: "Moderate (some sun)", value: "moderate" },
          { label: "Light (north facing, shaded)", value: "light" },
        ], defaultValue: "moderate" },
        { name: "occupants", label: "Number of Occupants", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const ceilingHeight = inputs.ceilingHeight as number;
        const sunExposure = inputs.sunExposure as string;
        const occupants = inputs.occupants as number;
        if (!length || !width || !ceilingHeight) return null;
        const area = length * width;
        let baseBtu = area * 25;
        if (ceilingHeight > 8) baseBtu *= ceilingHeight / 8;
        const sunMult: Record<string, number> = { heavy: 1.15, moderate: 1.0, light: 0.9 };
        baseBtu *= sunMult[sunExposure] || 1.0;
        const occupantBtu = ((occupants || 2) > 2 ? ((occupants || 2) - 2) * 600 : 0);
        baseBtu += occupantBtu;
        const tonnage = baseBtu / 12000;
        const kw = baseBtu / 3412;
        return {
          primary: { label: "Cooling Load", value: `${formatNumber(baseBtu, 0)}` + " BTU/hr" },
          details: [
            { label: "Room Area", value: `${formatNumber(area, 0)}` + " sq ft" },
            { label: "Tonnage", value: `${formatNumber(tonnage, 2)}` + " tons" },
            { label: "Equivalent kW", value: `${formatNumber(kw, 2)}` + " kW" },
            { label: "Occupant Load", value: `${formatNumber(occupantBtu, 0)}` + " BTU/hr" },
          ],
        };
      },
    },
    {
      id: "whole-house",
      name: "Whole House Estimate",
      description: "Quick whole-house cooling estimate",
      fields: [
        { name: "totalArea", label: "Total Conditioned Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "insulation", label: "Insulation Quality", type: "select", options: [
          { label: "Poor", value: "poor" },
          { label: "Average", value: "average" },
          { label: "Good", value: "good" },
          { label: "Excellent", value: "excellent" },
        ], defaultValue: "average" },
        { name: "tempDiff", label: "Design Temp Difference (F)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const totalArea = inputs.totalArea as number;
        const insulation = inputs.insulation as string;
        const tempDiff = inputs.tempDiff as number;
        if (!totalArea || !tempDiff) return null;
        const factor: Record<string, number> = { poor: 35, average: 28, good: 22, excellent: 18 };
        const f = factor[insulation] || 28;
        let btu = totalArea * f * (tempDiff / 20);
        const tonnage = btu / 12000;
        const roundedTons = Math.ceil(tonnage * 2) / 2;
        return {
          primary: { label: "Estimated Cooling Load", value: `${formatNumber(btu, 0)}` + " BTU/hr" },
          details: [
            { label: "Tonnage (exact)", value: `${formatNumber(tonnage, 2)}` + " tons" },
            { label: "Recommended System Size", value: `${formatNumber(roundedTons, 1)}` + " tons" },
            { label: "Factor Used", value: `${formatNumber(f, 0)}` + " BTU/sq ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-loss-calculator", "airflow-cfm-calculator", "air-handler-size-calculator"],
  faq: [
    { question: "How many BTU do I need per square foot?", answer: "A general rule is 20-30 BTU per square foot for cooling. Poorly insulated homes may need 35+ BTU/sq ft." },
    { question: "What size AC do I need?", answer: "Multiply room area by 25 BTU/sq ft as a starting point. Adjust for sun exposure, ceiling height, and occupants." },
    { question: "What is a ton of cooling?", answer: "One ton of cooling equals 12,000 BTU/hr. A typical residential AC system is 1.5-5 tons." },
  ],
  formula: "BTU = Area x Factor x Sun Multiplier + Occupant Load | 1 Ton = 12,000 BTU/hr",
};
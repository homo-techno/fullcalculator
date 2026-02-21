import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const btuHeatingCalculator: CalculatorDefinition = {
  slug: "btu-heating-calculator",
  title: "BTU Heating Calculator",
  description: "Free BTU calculator. Calculate the BTU heating capacity needed for your room or home based on size, insulation, climate, and other factors.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["BTU calculator", "heating calculator", "BTU per square foot", "furnace size calculator", "how many BTU do I need"],
  variants: [
    {
      id: "room",
      name: "Single Room",
      description: "Calculate BTU needed for one room",
      fields: [
        { name: "length", label: "Room Length (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "ceilingHeight", label: "Ceiling Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "insulation", label: "Insulation Level", type: "select", options: [
          { label: "Poor (old/no insulation)", value: "poor" },
          { label: "Average", value: "average" },
          { label: "Good (well-insulated)", value: "good" },
          { label: "Excellent (new construction)", value: "excellent" },
        ], defaultValue: "average" },
        { name: "climate", label: "Climate Zone", type: "select", options: [
          { label: "Hot (Zone 1-2: FL, TX coast)", value: "hot" },
          { label: "Warm (Zone 3: Southeast)", value: "warm" },
          { label: "Moderate (Zone 4: Mid-Atlantic)", value: "moderate" },
          { label: "Cold (Zone 5-6: Northeast, Midwest)", value: "cold" },
          { label: "Very Cold (Zone 7: MN, WI, MT)", value: "very-cold" },
        ], defaultValue: "cold" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number;
        const w = inputs.width as number;
        const ceil = (inputs.ceilingHeight as number) || 8;
        const insulation = inputs.insulation as string;
        const climate = inputs.climate as string;
        if (!l || !w) return null;
        const sqft = l * w;
        const cubicFeet = sqft * ceil;
        // Base BTU per sq ft depends on climate
        const baseBTU: Record<string, number> = { hot: 20, warm: 25, moderate: 35, cold: 45, "very-cold": 55 };
        const insulationFactor: Record<string, number> = { poor: 1.4, average: 1.0, good: 0.8, excellent: 0.65 };
        const ceilingFactor = ceil > 8 ? 1 + (ceil - 8) * 0.04 : 1.0;
        const base = baseBTU[climate] || 40;
        const insFactor = insulationFactor[insulation] || 1.0;
        const btuNeeded = sqft * base * insFactor * ceilingFactor;
        // Suggest heater size (round up to nearest 5000)
        const heaterSize = Math.ceil(btuNeeded / 5000) * 5000;
        return {
          primary: { label: "BTU Required", value: `${formatNumber(btuNeeded, 0)} BTU/hr` },
          details: [
            { label: "Room area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "Room volume", value: `${formatNumber(cubicFeet, 0)} cu ft` },
            { label: "BTU per sq ft", value: formatNumber(base * insFactor * ceilingFactor, 0) },
            { label: "Suggested heater size", value: `${formatNumber(heaterSize, 0)} BTU` },
            { label: "Equivalent kW", value: `${formatNumber(btuNeeded / 3412, 1)} kW` },
            { label: "Equivalent tons (AC)", value: formatNumber(btuNeeded / 12000, 1) },
          ],
        };
      },
    },
    {
      id: "whole-home",
      name: "Whole Home",
      description: "Calculate furnace/heating system size for entire home",
      fields: [
        { name: "totalSqFt", label: "Total Heated Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "insulation", label: "Insulation Level", type: "select", options: [
          { label: "Poor (old/no insulation)", value: "poor" },
          { label: "Average", value: "average" },
          { label: "Good (well-insulated)", value: "good" },
          { label: "Excellent (new construction)", value: "excellent" },
        ], defaultValue: "average" },
        { name: "climate", label: "Climate Zone", type: "select", options: [
          { label: "Hot (Zone 1-2)", value: "hot" },
          { label: "Warm (Zone 3)", value: "warm" },
          { label: "Moderate (Zone 4)", value: "moderate" },
          { label: "Cold (Zone 5-6)", value: "cold" },
          { label: "Very Cold (Zone 7)", value: "very-cold" },
        ], defaultValue: "cold" },
        { name: "windows", label: "Window Area", type: "select", options: [
          { label: "Few/small windows", value: "few" },
          { label: "Average windows", value: "average" },
          { label: "Many/large windows", value: "many" },
        ], defaultValue: "average" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.totalSqFt as number;
        const insulation = inputs.insulation as string;
        const climate = inputs.climate as string;
        const windows = inputs.windows as string;
        if (!sqft) return null;
        const baseBTU: Record<string, number> = { hot: 20, warm: 25, moderate: 35, cold: 45, "very-cold": 55 };
        const insFactor: Record<string, number> = { poor: 1.4, average: 1.0, good: 0.8, excellent: 0.65 };
        const winFactor: Record<string, number> = { few: 0.9, average: 1.0, many: 1.15 };
        const base = baseBTU[climate] || 40;
        const btu = sqft * base * (insFactor[insulation] || 1) * (winFactor[windows] || 1);
        const furnaceSize = Math.ceil(btu / 10000) * 10000;
        const furnaceEfficiency80 = Math.ceil(btu / 0.8 / 10000) * 10000;
        const furnaceEfficiency95 = Math.ceil(btu / 0.95 / 10000) * 10000;
        return {
          primary: { label: "Heating Load", value: `${formatNumber(btu, 0)} BTU/hr` },
          details: [
            { label: "Furnace size (80% AFUE)", value: `${formatNumber(furnaceEfficiency80, 0)} BTU input` },
            { label: "Furnace size (95% AFUE)", value: `${formatNumber(furnaceEfficiency95, 0)} BTU input` },
            { label: "Heat pump equivalent", value: `${formatNumber(btu / 12000, 1)} tons` },
            { label: "Heated area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "Monthly gas estimate", value: `${formatNumber(btu * 720 / 100000, 0)} therms (at full load)` },
          ],
          note: "Furnace input BTU must be higher than heating load to account for efficiency losses. An 80% AFUE furnace delivers 80% of its rated BTU as heat.",
        };
      },
    },
  ],
  relatedSlugs: ["firewood-calculator", "electricity-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many BTU per square foot do I need?", answer: "General guidelines by climate: Hot regions need 20-25 BTU/sq ft, moderate climates 30-40 BTU/sq ft, and cold climates 45-60 BTU/sq ft. Poorly insulated homes may need 40% more, while well-insulated homes need 20-35% less." },
    { question: "What size furnace do I need?", answer: "For a 2,000 sq ft well-insulated home in a cold climate: 2,000 × 45 × 0.8 = 72,000 BTU heating load. For an 80% AFUE furnace, you would need a 90,000 BTU input furnace. For a 95% AFUE, about 76,000 BTU input." },
    { question: "What is AFUE?", answer: "AFUE (Annual Fuel Utilization Efficiency) measures furnace efficiency. An 80% AFUE furnace converts 80% of fuel energy to heat. High-efficiency furnaces are 90-98% AFUE. The minimum federal standard is 80% for non-weatherized gas furnaces." },
  ],
  formula: "BTU = Square Feet × Base BTU/sqft × Insulation Factor × Climate Factor | Furnace Size = BTU Load / AFUE Efficiency",
};

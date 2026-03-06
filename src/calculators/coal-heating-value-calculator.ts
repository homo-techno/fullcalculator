import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coalHeatingValueCalculator: CalculatorDefinition = {
  slug: "coal-heating-value-calculator",
  title: "Coal Heating Value Calculator",
  description: "Calculate the heating value and energy content of coal based on rank, moisture content, ash content, and sulfur percentage.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["coal heating value","BTU coal","coal energy","coal rank","calorific value"],
  variants: [{
    id: "standard",
    name: "Coal Heating Value",
    description: "Calculate the heating value and energy content of coal based on rank, moisture content, ash content, and sulfur percentage.",
    fields: [
      { name: "coalRank", label: "Coal Rank", type: "select", options: [{ value: "14000", label: "Anthracite (14,000 BTU/lb)" }, { value: "12500", label: "Bituminous (12,500 BTU/lb)" }, { value: "9500", label: "Sub-bituminous (9,500 BTU/lb)" }, { value: "6500", label: "Lignite (6,500 BTU/lb)" }], defaultValue: "12500" },
      { name: "tonnage", label: "Coal Quantity (tonnes)", type: "number", min: 1, max: 1000000, defaultValue: 1000 },
      { name: "moisture", label: "Moisture Content (%)", type: "number", min: 0, max: 50, defaultValue: 8 },
      { name: "ash", label: "Ash Content (%)", type: "number", min: 0, max: 40, defaultValue: 10 },
      { name: "sulfur", label: "Sulfur Content (%)", type: "number", min: 0, max: 8, defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
    const baseBTU = parseFloat(inputs.coalRank as unknown as string);
    const tonnes = inputs.tonnage as number;
    const moisture = inputs.moisture as number / 100;
    const ash = inputs.ash as number / 100;
    const sulfur = inputs.sulfur as number / 100;
    const effectiveFraction = 1 - moisture - ash;
    const actualBTU = baseBTU * effectiveFraction;
    const totalBTU = actualBTU * tonnes * 2204.62;
    const totalGJ = totalBTU * 0.001055 / 1000;
    const totalMWh = totalGJ / 3.6;
    const co2Tons = tonnes * effectiveFraction * 0.75 * 3.667;
    const so2Tons = tonnes * sulfur * 2;
    const pricePerTon = actualBTU > 10000 ? 80 : actualBTU > 7000 ? 50 : 30;
    return {
      primary: { label: "Effective Heating Value", value: formatNumber(Math.round(actualBTU)) + " BTU/lb" },
      details: [
        { label: "Total Energy", value: formatNumber(Math.round(totalGJ)) + " GJ" },
        { label: "Electrical Equivalent", value: formatNumber(Math.round(totalMWh)) + " MWh" },
        { label: "Combustible Fraction", value: (effectiveFraction * 100).toFixed(1) + "%" },
        { label: "CO2 Emissions", value: formatNumber(Math.round(co2Tons)) + " tonnes" },
        { label: "SO2 Emissions", value: formatNumber(parseFloat(so2Tons.toFixed(1))) + " tonnes" }
      ]
    };
  },
  }],
  relatedSlugs: ["gold-ore-grade-value-calculator","mining-equipment-cost-per-ton-calculator","geothermal-gradient-calculator"],
  faq: [
    { question: "What is coal heating value?", answer: "Heating value (calorific value) is the amount of energy released when coal is burned, measured in BTU per pound or megajoules per kilogram. It determines how much useful energy can be extracted from a given quantity of coal." },
    { question: "How do moisture and ash affect coal quality?", answer: "Moisture and ash are non-combustible components that reduce the effective heating value. A coal with 10% moisture and 10% ash can only burn 80% of its mass as fuel, significantly lowering its energy output per ton." },
    { question: "What coal rank has the highest heating value?", answer: "Anthracite has the highest heating value at about 14,000 BTU/lb, followed by bituminous (12,000-13,000), sub-bituminous (8,000-10,000), and lignite (5,500-7,500 BTU/lb)." },
  ],
  formula: "Effective BTU/lb = Base BTU x (1 - Moisture - Ash); Total Energy (BTU) = Effective BTU x Tonnes x 2204.62 lbs/tonne; Energy (GJ) = Total BTU x 0.001055 / 1000; CO2 = Tonnage x Combustible Fraction x Carbon Content x 3.667",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const miningEquipmentCostPerTonCalculator: CalculatorDefinition = {
  slug: "mining-equipment-cost-per-ton-calculator",
  title: "Mining Equipment Cost Per Ton Calculator",
  description: "Estimate the per-ton operating cost of mining equipment including fuel, maintenance, operator wages, and depreciation for different equipment types.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mining cost per ton","mining equipment cost","excavator cost","haul truck cost","mining operations"],
  variants: [{
    id: "standard",
    name: "Mining Equipment Cost Per Ton",
    description: "Estimate the per-ton operating cost of mining equipment including fuel, maintenance, operator wages, and depreciation for different equipment types.",
    fields: [
      { name: "equipmentType", label: "Equipment Type", type: "select", options: [{ value: "1", label: "Excavator (200-ton class)" }, { value: "2", label: "Haul Truck (150-ton)" }, { value: "3", label: "Wheel Loader" }, { value: "4", label: "Drill Rig" }, { value: "5", label: "Dozer (D10/D11)" }], defaultValue: "1" },
      { name: "tonsPerHour", label: "Production Rate (tons/hour)", type: "number", min: 10, max: 5000, defaultValue: 500 },
      { name: "hoursPerShift", label: "Hours Per Shift", type: "number", min: 4, max: 12, defaultValue: 10 },
      { name: "fuelPrice", label: "Fuel Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "operatorWage", label: "Operator Hourly Wage ($)", type: "number", min: 15, max: 100, defaultValue: 35 },
    ],
    calculate: (inputs) => {
    const equip = parseFloat(inputs.equipmentType as unknown as string);
    const tph = inputs.tonsPerHour as number;
    const hours = inputs.hoursPerShift as number;
    const fuelPrice = inputs.fuelPrice as number;
    const wage = inputs.operatorWage as number;
    const fuelRates = { 1: 60, 2: 45, 3: 30, 4: 20, 5: 50 } as Record<number, number>;
    const maintRates = { 1: 250, 2: 180, 3: 120, 4: 150, 5: 200 } as Record<number, number>;
    const depreciationHr = { 1: 300, 2: 200, 3: 150, 4: 180, 5: 250 } as Record<number, number>;
    const fuelGph = fuelRates[equip];
    const fuelCostHr = fuelGph * fuelPrice;
    const maintCostHr = maintRates[equip];
    const depHr = depreciationHr[equip];
    const totalHourlyCost = fuelCostHr + maintCostHr + wage + depHr;
    const costPerTon = tph > 0 ? totalHourlyCost / tph : 0;
    const shiftCost = totalHourlyCost * hours;
    const shiftTons = tph * hours;
    return {
      primary: { label: "Cost Per Ton", value: "$" + formatNumber(parseFloat(costPerTon.toFixed(2))) },
      details: [
        { label: "Total Hourly Cost", value: "$" + formatNumber(Math.round(totalHourlyCost)) + "/hr" },
        { label: "Fuel Cost", value: "$" + formatNumber(Math.round(fuelCostHr)) + "/hr (" + fuelGph + " gal/hr)" },
        { label: "Maintenance Cost", value: "$" + formatNumber(maintRates[equip]) + "/hr" },
        { label: "Shift Total Cost", value: "$" + formatNumber(Math.round(shiftCost)) },
        { label: "Shift Production", value: formatNumber(shiftTons) + " tons" }
      ]
    };
  },
  }],
  relatedSlugs: ["gold-ore-grade-value-calculator","excavation-volume-calculator","aggregate-volume-calculator"],
  faq: [
    { question: "What is the biggest cost in mining operations?", answer: "Fuel and maintenance are typically the largest equipment operating costs, often accounting for 60-70% of the total. Labor, depreciation, and tires/undercarriage make up the remainder." },
    { question: "How many tons can a large excavator move per hour?", answer: "A 200-ton class hydraulic excavator can load 400 to 800 tons per hour depending on material type, swing angle, and truck positioning. Harder rock reduces productivity significantly." },
    { question: "How do you reduce mining cost per ton?", answer: "Key strategies include maximizing equipment utilization, optimizing haul routes, matching truck and loader sizes, reducing idle time, and implementing preventive maintenance programs." },
  ],
  formula: "Fuel Cost/hr = Gallons/hr x Fuel Price; Total Hourly Cost = Fuel + Maintenance + Operator Wage + Depreciation; Cost Per Ton = Total Hourly Cost / Tons Per Hour; Shift Cost = Hourly Cost x Hours Per Shift",
};

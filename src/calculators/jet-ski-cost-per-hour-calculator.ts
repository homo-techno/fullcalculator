import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jetSkiCostPerHourCalculator: CalculatorDefinition = {
  slug: "jet-ski-cost-per-hour-calculator",
  title: "Jet Ski Cost Per Hour Calculator",
  description: "Calculate the true cost per hour of jet ski ownership including purchase price, maintenance, insurance, fuel, and storage costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["jet ski cost per hour","pwc operating cost","jet ski expense","personal watercraft cost"],
  variants: [{
    id: "standard",
    name: "Jet Ski Cost Per Hour",
    description: "Calculate the true cost per hour of jet ski ownership including purchase price, maintenance, insurance, fuel, and storage costs.",
    fields: [
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 2000, max: 30000, defaultValue: 12000 },
      { name: "yearsOwned", label: "Expected Years of Ownership", type: "number", min: 1, max: 20, defaultValue: 5 },
      { name: "hoursPerYear", label: "Hours Used Per Year", type: "number", min: 10, max: 500, defaultValue: 50 },
      { name: "fuelCostPerHour", label: "Fuel Cost Per Hour ($)", type: "number", min: 5, max: 60, defaultValue: 20 },
      { name: "annualInsurance", label: "Annual Insurance ($)", type: "number", min: 100, max: 2000, defaultValue: 350 },
      { name: "annualStorage", label: "Annual Storage ($)", type: "number", min: 0, max: 5000, defaultValue: 600 },
      { name: "annualMaintenance", label: "Annual Maintenance ($)", type: "number", min: 100, max: 5000, defaultValue: 400 },
    ],
    calculate: (inputs) => {
    const price = inputs.purchasePrice as number;
    const years = inputs.yearsOwned as number;
    const hoursYear = inputs.hoursPerYear as number;
    const fuelPerHour = inputs.fuelCostPerHour as number;
    const insurance = inputs.annualInsurance as number;
    const storage = inputs.annualStorage as number;
    const maintenance = inputs.annualMaintenance as number;
    const totalHours = hoursYear * years;
    const resaleValue = price * Math.pow(0.85, years);
    const depreciation = price - resaleValue;
    const annualFixed = insurance + storage + maintenance;
    const annualFuel = fuelPerHour * hoursYear;
    const annualTotal = (depreciation / years) + annualFixed + annualFuel;
    const costPerHour = hoursYear > 0 ? annualTotal / hoursYear : 0;
    return {
      primary: { label: "Cost Per Hour", value: "$" + formatNumber(Math.round(costPerHour * 100) / 100) },
      details: [
        { label: "Annual Total Cost", value: "$" + formatNumber(Math.round(annualTotal)) },
        { label: "Annual Depreciation", value: "$" + formatNumber(Math.round(depreciation / years)) },
        { label: "Annual Fixed Costs", value: "$" + formatNumber(Math.round(annualFixed)) },
        { label: "Annual Fuel Cost", value: "$" + formatNumber(Math.round(annualFuel)) },
        { label: "Estimated Resale Value", value: "$" + formatNumber(Math.round(resaleValue)) }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-fuel-consumption-calculator","boat-insurance-cost-calculator"],
  faq: [
    { question: "How much does it cost to own a jet ski per year?", answer: "Annual jet ski ownership costs typically range from $1,500 to $4,000 including insurance, storage, maintenance, and fuel. This does not include the purchase price or depreciation." },
    { question: "How many hours does a jet ski engine last?", answer: "Most modern jet ski engines last 300 to 500 hours with proper maintenance. Some 4-stroke models can exceed 500 hours. Regular oil changes, impeller inspections, and winterization extend engine life." },
    { question: "Is it cheaper to rent or buy a jet ski?", answer: "If you ride fewer than 30 to 40 hours per year, renting at $75 to $150 per hour is usually cheaper than owning. If you ride more frequently, ownership becomes more economical over time." },
  ],
  formula: "Annual Depreciation = (Purchase Price - Resale Value) / Years; Annual Total = Depreciation + Insurance + Storage + Maintenance + Fuel; Cost Per Hour = Annual Total / Hours Per Year",
};

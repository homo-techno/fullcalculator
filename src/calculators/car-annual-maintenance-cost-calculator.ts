import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carAnnualMaintenanceCostCalculator: CalculatorDefinition = {
  slug: "car-annual-maintenance-cost-calculator",
  title: "Car Annual Maintenance Cost Calculator",
  description: "Estimate total annual vehicle maintenance cost including oil changes, tires, brakes, and scheduled services based on driving habits and vehicle age.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["annual maintenance cost","car maintenance budget","vehicle upkeep cost","car ownership cost"],
  variants: [{
    id: "standard",
    name: "Car Annual Maintenance Cost",
    description: "Estimate total annual vehicle maintenance cost including oil changes, tires, brakes, and scheduled services based on driving habits and vehicle age.",
    fields: [
      { name: "vehicleAge", label: "Vehicle Age (years)", type: "number", min: 0, max: 25, defaultValue: 5 },
      { name: "annualMiles", label: "Annual Miles Driven", type: "number", min: 1000, max: 50000, defaultValue: 15000 },
      { name: "vehicleClass", label: "Vehicle Class", type: "select", options: [{ value: "1", label: "Economy" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Luxury" }, { value: "4", label: "Truck/SUV" }], defaultValue: "2" },
      { name: "oilType", label: "Oil Type", type: "select", options: [{ value: "1", label: "Conventional" }, { value: "2", label: "Synthetic" }], defaultValue: "2" },
      { name: "diyPercent", label: "DIY Maintenance (%)", type: "number", min: 0, max: 100, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const age = inputs.vehicleAge as number;
    const annualMiles = inputs.annualMiles as number;
    const vehicleClass = parseInt(inputs.vehicleClass as string);
    const oilType = parseInt(inputs.oilType as string);
    const diyPct = inputs.diyPercent as number / 100;
    const classMultiplier = { 1: 0.7, 2: 1.0, 3: 1.8, 4: 1.2 };
    const ageMultiplier = 1 + Math.max(age - 3, 0) * 0.08;
    const oilChanges = oilType === 1 ? Math.ceil(annualMiles / 5000) : Math.ceil(annualMiles / 7500);
    const oilChangeCost = oilType === 1 ? 45 : 75;
    const annualOilCost = oilChanges * oilChangeCost;
    const tiresCostAnnual = Math.round(annualMiles / 50000 * 600);
    const brakesCostAnnual = Math.round(annualMiles / 50000 * 400);
    const scheduledService = 200 * ageMultiplier;
    const unexpectedRepairs = age > 5 ? 300 * (age - 5) * 0.3 : 0;
    const classMult = classMultiplier[vehicleClass] || 1;
    const subtotal = (annualOilCost + tiresCostAnnual + brakesCostAnnual + scheduledService + unexpectedRepairs) * classMult;
    const diyDiscount = subtotal * diyPct * 0.4;
    const totalCost = Math.round(subtotal - diyDiscount);
    const monthlyCost = Math.round(totalCost / 12);
    const costPerMile = Math.round(totalCost / annualMiles * 1000) / 1000;
    return {
      primary: { label: "Estimated Annual Maintenance", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Monthly Average", value: "$" + formatNumber(monthlyCost) },
        { label: "Cost Per Mile", value: "$" + formatNumber(costPerMile) },
        { label: "Oil Changes/Year", value: formatNumber(oilChanges) + " ($" + formatNumber(annualOilCost) + ")" },
        { label: "Tires (annualized)", value: "$" + formatNumber(Math.round(tiresCostAnnual * classMult)) },
        { label: "DIY Savings", value: "$" + formatNumber(Math.round(diyDiscount)) }
      ]
    };
  },
  }],
  relatedSlugs: ["car-depreciation-curve-calculator","oil-change-interval-calculator"],
  faq: [
    { question: "How much does car maintenance cost per year?", answer: "The average annual maintenance cost is $800 to $1,200 for vehicles under 5 years old. Costs increase with age, and luxury vehicles can cost 50 to 80 percent more than economy cars." },
    { question: "Does DIY maintenance really save money?", answer: "DIY maintenance on basic tasks like oil changes, air filters, and wiper blades can save 30 to 50 percent on labor costs. However, complex repairs often require specialized tools and expertise." },
    { question: "Do older cars cost more to maintain?", answer: "Yes. Maintenance costs typically increase 8 to 15 percent per year after the warranty period ends, as more components wear out and require replacement or repair." },
  ],
  formula: "Annual Cost = (Oil + Tires + Brakes + Service + Repairs) x Class Multiplier - DIY Savings; Age Multiplier = 1 + max(Age - 3, 0) x 0.08; DIY Savings = Subtotal x DIY% x 40% labor discount",
};

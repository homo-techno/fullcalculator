import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tractorFuelCostCalculator: CalculatorDefinition = {
  slug: "tractor-fuel-cost-calculator",
  title: "Tractor Fuel Cost Calculator",
  description: "Estimate diesel fuel consumption and cost for tractor field operations based on horsepower, load factor, and hours worked.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tractor fuel cost","diesel consumption calculator","farm equipment fuel"],
  variants: [{
    id: "standard",
    name: "Tractor Fuel Cost",
    description: "Estimate diesel fuel consumption and cost for tractor field operations based on horsepower, load factor, and hours worked.",
    fields: [
      { name: "horsePower", label: "Tractor Horsepower", type: "number", min: 20, max: 600, defaultValue: 150 },
      { name: "loadFactor", label: "Load Factor (%)", type: "number", min: 20, max: 100, defaultValue: 55 },
      { name: "hoursPerDay", label: "Hours Per Day", type: "number", min: 1, max: 24, defaultValue: 8 },
      { name: "daysPerYear", label: "Days Per Year", type: "number", min: 1, max: 365, defaultValue: 120 },
      { name: "fuelPrice", label: "Diesel Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 3.75 },
    ],
    calculate: (inputs) => {
      const hp = inputs.horsePower as number;
      const lf = inputs.loadFactor as number;
      const hpd = inputs.hoursPerDay as number;
      const dpy = inputs.daysPerYear as number;
      const fp = inputs.fuelPrice as number;
      if (!hp || !lf || !hpd || !dpy || !fp) return null;
      const galPerHour = hp * (lf / 100) * 0.044;
      const dailyFuel = Math.round(galPerHour * hpd * 100) / 100;
      const annualGallons = Math.round(galPerHour * hpd * dpy);
      const annualCost = Math.round(annualGallons * fp * 100) / 100;
      const costPerHour = Math.round(galPerHour * fp * 100) / 100;
      return {
        primary: { label: "Annual Fuel Cost", value: "$" + formatNumber(annualCost) },
        details: [
          { label: "Gallons Per Hour", value: formatNumber(Math.round(galPerHour * 100) / 100) },
          { label: "Daily Fuel Use", value: formatNumber(dailyFuel) + " gal" },
          { label: "Annual Gallons", value: formatNumber(annualGallons) + " gal" },
          { label: "Cost Per Hour", value: "$" + formatNumber(costPerHour) },
        ],
      };
  },
  }],
  relatedSlugs: ["tractor-pto-calculator","farm-profit-margin-calculator"],
  faq: [
    { question: "How much fuel does a tractor use per hour?", answer: "A general rule of thumb is that a diesel engine consumes about 0.044 gallons per horsepower-hour at full load. A 100 HP tractor at 50% load uses roughly 2.2 gallons per hour." },
    { question: "What is load factor?", answer: "Load factor is the percentage of maximum engine power being used during an operation. Heavy tillage may be 70 to 85%, while light mowing may be 30 to 40%." },
  ],
  formula: "Fuel Consumption (gal/hr) = HP x Load Factor x 0.044; Annual Cost = Gal/Hr x Hours/Day x Days/Year x Fuel Price",
};

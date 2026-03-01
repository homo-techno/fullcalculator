import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carMaintenanceScheduleCalculator: CalculatorDefinition = {
  slug: "car-maintenance-schedule-calculator",
  title: "Car Maintenance Schedule Calculator",
  description: "Estimate annual maintenance costs by vehicle mileage",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car maintenance cost","vehicle maintenance schedule","auto service cost"],
  variants: [{
    id: "standard",
    name: "Car Maintenance Schedule",
    description: "Estimate annual maintenance costs by vehicle mileage",
    fields: [
      { name: "currentMileage", label: "Current Mileage", type: "number", defaultValue: 50000, min: 0, step: 5000 },
      { name: "annualMiles", label: "Annual Miles Driven", type: "number", defaultValue: 12000, min: 0, step: 1000 },
      { name: "vehicleAge", label: "Vehicle Age (years)", type: "number", defaultValue: 5, min: 0, max: 30, step: 1 },
      { name: "oilChangeCost", label: "Oil Change Cost ($)", type: "number", defaultValue: 50, min: 0, step: 10 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const mileage = inputs.currentMileage as number || 50000;
      const annual = inputs.annualMiles as number || 12000;
      const age = inputs.vehicleAge as number || 5;
      const oilCost = inputs.oilChangeCost as number || 50;
      const oilChanges = Math.ceil(annual / 5000);
      const oilTotal = oilChanges * oilCost;
      const tireRotations = Math.ceil(annual / 7500);
      const tireRotCost = tireRotations * 30;
      const brakeService = age > 3 ? 200 : 0;
      const miscMaint = age * 50 + (mileage > 75000 ? 300 : 0);
      const totalAnnual = oilTotal + tireRotCost + brakeService + miscMaint;
      const monthlyCost = totalAnnual / 12;
      return {
        primary: { label: "Est. Annual Maintenance", value: "$" + formatNumber(Math.round(totalAnnual)) },
        details: [
          { label: "Oil Changes Per Year", value: String(oilChanges) + " ($" + formatNumber(oilTotal) + ")" },
          { label: "Tire Rotations", value: String(tireRotations) + " ($" + formatNumber(tireRotCost) + ")" },
          { label: "Brake Service", value: "$" + formatNumber(brakeService) },
          { label: "Monthly Budget", value: "$" + formatNumber(Math.round(monthlyCost)) }
        ]
      };
    },
  }],
  relatedSlugs: ["car-depreciation-calculator"],
  faq: [
    { question: "How much should I budget for car maintenance?", answer: "Budget about $100-150 per month for a vehicle over 5 years old or with more than 60000 miles." },
    { question: "What maintenance is most important?", answer: "Regular oil changes, tire rotations, and brake inspections are the most critical services." },
  ],
  formula: "Annual Cost = Oil Changes + Tire Rotations + Brake Service + Age-based Maintenance",
};

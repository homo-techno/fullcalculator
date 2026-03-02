import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transmissionFluidChangeCalculator: CalculatorDefinition = {
  slug: "transmission-fluid-change-calculator",
  title: "Transmission Fluid Change Calculator",
  description: "Determine when your transmission fluid change is due and estimate service costs based on transmission type and driving conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["transmission fluid change","transmission service","ATF change schedule","gearbox fluid"],
  variants: [{
    id: "standard",
    name: "Transmission Fluid Change",
    description: "Determine when your transmission fluid change is due and estimate service costs based on transmission type and driving conditions.",
    fields: [
      { name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 75000 },
      { name: "lastServiceMileage", label: "Last Service Mileage", type: "number", min: 0, max: 500000, defaultValue: 30000 },
      { name: "transType", label: "Transmission Type", type: "select", options: [{ value: "1", label: "Automatic" }, { value: "2", label: "Manual" }, { value: "3", label: "CVT" }, { value: "4", label: "Dual-Clutch (DCT)" }], defaultValue: "1" },
      { name: "drivingCondition", label: "Driving Conditions", type: "select", options: [{ value: "1", label: "Normal" }, { value: "2", label: "Severe (towing, city, hot climate)" }], defaultValue: "1" },
      { name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 },
    ],
    calculate: (inputs) => {
    const current = inputs.currentMileage as number;
    const lastService = inputs.lastServiceMileage as number;
    const transType = parseInt(inputs.transType as string);
    const condition = parseInt(inputs.drivingCondition as string);
    const monthly = inputs.monthlyMiles as number;
    const baseIntervals = { 1: 60000, 2: 60000, 3: 50000, 4: 40000 };
    const severeMultiplier = condition === 2 ? 0.5 : 1;
    const interval = Math.round((baseIntervals[transType] || 60000) * severeMultiplier);
    const costs = { 1: 200, 2: 120, 3: 250, 4: 300 };
    const serviceCost = costs[transType] || 200;
    const milesSinceLast = current - lastService;
    const milesUntilDue = interval - milesSinceLast;
    const monthsUntilDue = milesUntilDue > 0 ? Math.round(milesUntilDue / monthly * 10) / 10 : 0;
    return {
      primary: { label: "Next Service At", value: formatNumber(lastService + interval) + " mi" },
      details: [
        { label: "Service Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Since Last Service", value: formatNumber(milesSinceLast) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Estimated Service Cost", value: "$" + formatNumber(serviceCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : "On Schedule" }
      ]
    };
  },
  }],
  relatedSlugs: ["coolant-flush-schedule-calculator","oil-change-interval-calculator"],
  faq: [
    { question: "How often should transmission fluid be changed?", answer: "Automatic transmissions typically need fluid changes every 60,000 to 100,000 miles under normal conditions, or every 30,000 miles under severe conditions like frequent towing or city driving." },
    { question: "What are signs of bad transmission fluid?", answer: "Dark or burnt-smelling fluid, delayed gear engagement, rough shifting, and transmission slipping are all signs that the fluid needs to be changed." },
    { question: "Is a transmission flush or drain-and-fill better?", answer: "A drain-and-fill is generally safer for high-mileage vehicles. A full flush replaces more fluid but can dislodge debris in older transmissions. Consult your vehicle manufacturer recommendation." },
  ],
  formula: "Service Interval = Base Interval x Condition Multiplier
Next Service = Last Service Mileage + Service Interval
Months Until Due = Miles Until Due / Monthly Miles",
};

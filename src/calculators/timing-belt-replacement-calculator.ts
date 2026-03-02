import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timingBeltReplacementCalculator: CalculatorDefinition = {
  slug: "timing-belt-replacement-calculator",
  title: "Timing Belt Replacement Calculator",
  description: "Calculate when your timing belt or chain needs replacement and estimate the cost based on engine type and service complexity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["timing belt replacement","timing chain","timing belt cost","engine timing service"],
  variants: [{
    id: "standard",
    name: "Timing Belt Replacement",
    description: "Calculate when your timing belt or chain needs replacement and estimate the cost based on engine type and service complexity.",
    fields: [
      { name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 85000 },
      { name: "lastReplacementMileage", label: "Last Replacement Mileage", type: "number", min: 0, max: 500000, defaultValue: 0 },
      { name: "timingType", label: "Timing Component Type", type: "select", options: [{ value: "1", label: "Timing Belt" }, { value: "2", label: "Timing Chain" }], defaultValue: "1" },
      { name: "engineConfig", label: "Engine Configuration", type: "select", options: [{ value: "1", label: "4-Cylinder (simpler)" }, { value: "2", label: "V6 (moderate)" }, { value: "3", label: "V8 or Complex Layout" }], defaultValue: "1" },
      { name: "includeWaterPump", label: "Replace Water Pump Too", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (recommended)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const current = inputs.currentMileage as number;
    const lastReplacement = inputs.lastReplacementMileage as number;
    const timingType = parseInt(inputs.timingType as string);
    const engineConfig = parseInt(inputs.engineConfig as string);
    const includeWP = parseInt(inputs.includeWaterPump as string);
    const intervals = { 1: 90000, 2: 200000 };
    const interval = intervals[timingType] || 90000;
    const baseLaborCost = { 1: 400, 2: 600, 3: 900 };
    const basePartsCost = { 1: 150, 2: 80 };
    const waterPumpCost = includeWP ? 150 : 0;
    const labor = baseLaborCost[engineConfig] || 400;
    const parts = (basePartsCost[timingType] || 150) + waterPumpCost;
    const totalCost = labor + parts;
    const milesSinceLast = current - lastReplacement;
    const milesUntilDue = interval - milesSinceLast;
    return {
      primary: { label: "Next Replacement At", value: formatNumber(lastReplacement + interval) + " mi" },
      details: [
        { label: "Replacement Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Parts Cost", value: "$" + formatNumber(parts) },
        { label: "Labor Cost", value: "$" + formatNumber(labor) },
        { label: "Total Estimated Cost", value: "$" + formatNumber(totalCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue - Replace Immediately" : milesUntilDue < 10000 ? "Due Soon" : "On Schedule" }
      ]
    };
  },
  }],
  relatedSlugs: ["spark-plug-replacement-calculator","car-annual-maintenance-cost-calculator"],
  faq: [
    { question: "How often should a timing belt be replaced?", answer: "Most timing belts should be replaced every 60,000 to 100,000 miles or 7 to 10 years, whichever comes first. Check your owner manual for the exact interval." },
    { question: "What happens if a timing belt breaks?", answer: "On an interference engine, a broken timing belt causes pistons to strike valves, resulting in thousands of dollars in engine damage. On non-interference engines, the engine simply stops running." },
    { question: "Should I replace the water pump with the timing belt?", answer: "Yes. The water pump is accessed during timing belt replacement, so replacing it at the same time saves significant labor cost compared to doing it separately later." },
  ],
  formula: "Timing Belt Interval: ~90,000 miles
Timing Chain Interval: ~200,000 miles
Total Cost = Labor (by engine complexity) + Parts + Water Pump (optional)",
};

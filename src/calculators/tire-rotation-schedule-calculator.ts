import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tireRotationScheduleCalculator: CalculatorDefinition = {
  slug: "tire-rotation-schedule-calculator",
  title: "Tire Rotation Schedule Calculator",
  description: "Calculate when your next tire rotation is due.",
  category: "Everyday",
  categorySlug: "~",
  icon: "RefreshCw",
  keywords: ["tire","rotation","schedule","mileage","maintenance"],
  variants: [{
    id: "standard",
    name: "Tire Rotation Schedule",
    description: "Calculate when your next tire rotation is due.",
    fields: [
      { name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 1000000, defaultValue: 35000 },
      { name: "lastRotationMileage", label: "Last Rotation Mileage", type: "number", min: 0, max: 1000000, defaultValue: 30000 },
      { name: "rotationInterval", label: "Rotation Interval (miles)", type: "number", min: 3000, max: 15000, defaultValue: 7500 },
      { name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 },
    ],
    calculate: (inputs) => {
    const currentMileage = inputs.currentMileage as number;
    const lastRotationMileage = inputs.lastRotationMileage as number;
    const rotationInterval = inputs.rotationInterval as number;
    const monthlyMiles = inputs.monthlyMiles as number;
    const milesSinceLast = currentMileage - lastRotationMileage;
    const milesUntilNext = rotationInterval - milesSinceLast;
    const nextRotationMileage = lastRotationMileage + rotationInterval;
    const monthsUntilDue = milesUntilNext > 0 ? milesUntilNext / monthlyMiles : 0;
    return {
      primary: { label: "Next Rotation At", value: formatNumber(nextRotationMileage) + " mi" },
      details: [
        { label: "Miles Since Last Rotation", value: formatNumber(milesSinceLast) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilNext, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Status", value: milesUntilNext <= 0 ? "Overdue" : "On Schedule" }
      ]
    };
  },
  }],
  relatedSlugs: ["oil-change-interval-calculator","brake-pad-life-calculator","vehicle-depreciation-schedule-calculator"],
  faq: [
    { question: "How often should I rotate tires?", answer: "Most manufacturers recommend every 5000 to 7500 miles." },
    { question: "Why is tire rotation important?", answer: "It promotes even tread wear and extends the life of your tires." },
  ],
  formula: "Next Rotation = Last Rotation Mileage + Rotation Interval",
};

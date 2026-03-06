import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatEngineHoursMaintenanceCalculator: CalculatorDefinition = {
  slug: "boat-engine-hours-maintenance-calculator",
  title: "Boat Engine Hours Maintenance Calculator",
  description: "Track engine hours and determine when maintenance is due for oil changes, impeller replacement, lower unit service, and other scheduled boat engine care.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["boat engine maintenance","engine hours service","marine engine schedule","boat oil change interval"],
  variants: [{
    id: "standard",
    name: "Boat Engine Hours Maintenance",
    description: "Track engine hours and determine when maintenance is due for oil changes, impeller replacement, lower unit service, and other scheduled boat engine care.",
    fields: [
      { name: "currentHours", label: "Current Engine Hours", type: "number", min: 0, max: 20000, defaultValue: 250 },
      { name: "lastOilChange", label: "Hours at Last Oil Change", type: "number", min: 0, max: 20000, defaultValue: 200 },
      { name: "lastImpeller", label: "Hours at Last Impeller Change", type: "number", min: 0, max: 20000, defaultValue: 100 },
      { name: "lastLowerUnit", label: "Hours at Last Lower Unit Service", type: "number", min: 0, max: 20000, defaultValue: 0 },
      { name: "hoursPerYear", label: "Estimated Annual Usage (hours)", type: "number", min: 10, max: 1000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const current = inputs.currentHours as number;
    const lastOil = inputs.lastOilChange as number;
    const lastImpeller = inputs.lastImpeller as number;
    const lastLower = inputs.lastLowerUnit as number;
    const annual = inputs.hoursPerYear as number;
    const oilRemaining = Math.max(0, 100 - (current - lastOil));
    const impellerRemaining = Math.max(0, 300 - (current - lastImpeller));
    const lowerRemaining = Math.max(0, 500 - (current - lastLower));
    const nextService = Math.min(oilRemaining, impellerRemaining, lowerRemaining);
    const oilMonths = annual > 0 ? Math.round((oilRemaining / annual) * 12) : 0;
    return {
      primary: { label: "Next Service Due In", value: formatNumber(nextService) + " hours" },
      details: [
        { label: "Oil Change Due In", value: formatNumber(oilRemaining) + " hours (~" + oilMonths + " months)" },
        { label: "Impeller Due In", value: formatNumber(impellerRemaining) + " hours" },
        { label: "Lower Unit Service Due In", value: formatNumber(lowerRemaining) + " hours" },
        { label: "Hours Since Last Oil Change", value: formatNumber(current - lastOil) + " hours" },
        { label: "Total Engine Hours", value: formatNumber(current) }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-fuel-consumption-calculator","boat-depreciation-calculator"],
  faq: [
    { question: "How often should I change boat engine oil?", answer: "Most marine engine manufacturers recommend changing oil every 100 hours of operation or at least once per year, whichever comes first. New engines may require a break-in oil change at 20 to 25 hours." },
    { question: "When should I replace my water pump impeller?", answer: "Replace the water pump impeller every 300 hours or every two to three years. If you notice reduced water flow from the tell-tale, replace it immediately regardless of hours." },
    { question: "What is considered high hours on a boat engine?", answer: "For gasoline inboard engines, 1,500 hours is considered high. Diesel engines can run 5,000 or more hours. Outboard engines typically last 1,500 to 3,000 hours with proper maintenance." },
  ],
  formula: "Oil Change Interval = 100 hours
Impeller Replacement Interval = 300 hours
Lower Unit Service Interval = 500 hours
Hours Remaining = Interval - (Current Hours - Hours at Last Service)",
};

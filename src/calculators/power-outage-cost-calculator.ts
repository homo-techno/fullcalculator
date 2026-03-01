import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerOutageCostCalculator: CalculatorDefinition = {
  slug: "power-outage-cost-calculator",
  title: "Power Outage Cost Calculator",
  description: "Estimate the financial cost of a power outage including spoiled food, lost productivity, and damage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["power outage cost", "blackout cost calculator", "electricity outage losses"],
  variants: [{
    id: "standard",
    name: "Power Outage Cost",
    description: "Estimate the financial cost of a power outage including spoiled food, lost productivity, and damage",
    fields: [
      { name: "durationHours", label: "Outage Duration", type: "number", suffix: "hours", min: 1, max: 168, defaultValue: 8 },
      { name: "householdType", label: "Household Type", type: "select", options: [{value:"small",label:"Small (1-2 people)"},{value:"medium",label:"Medium (3-4 people)"},{value:"large",label:"Large (5+ people)"}], defaultValue: "medium" },
      { name: "season", label: "Season", type: "select", options: [{value:"mild",label:"Mild Weather"},{value:"summer",label:"Summer (Hot)"},{value:"winter",label:"Winter (Cold)"}], defaultValue: "mild" },
      { name: "workFromHome", label: "Work From Home Income per Day", type: "number", prefix: "$", min: 0, max: 2000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const hours = inputs.durationHours as number;
      const household = inputs.householdType as string;
      const season = inputs.season as string;
      const wfhIncome = inputs.workFromHome as number;
      if (!hours || hours <= 0) return null;
      const foodLoss = hours >= 4 ? (household === "small" ? 50 : household === "medium" ? 150 : 250) : 0;
      const hvacCost: Record<string, number> = { mild: 0, summer: 5, winter: 8 };
      const comfortCost = (hvacCost[season] || 0) * hours;
      const workHoursLost = Math.min(hours, 8);
      const productivityLoss = (wfhIncome / 8) * workHoursLost;
      const total = foodLoss + comfortCost + productivityLoss;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Food Spoilage", value: "$" + formatNumber(foodLoss) },
          { label: "Comfort/HVAC Impact", value: "$" + formatNumber(Math.round(comfortCost)) },
          { label: "Lost Productivity", value: "$" + formatNumber(Math.round(productivityLoss)) },
        ],
      };
    },
  }],
  relatedSlugs: ["radon-mitigation-calculator", "mold-remediation-calculator"],
  faq: [
    { question: "How much does a power outage cost a household?", answer: "A typical 8-hour outage costs a household $50 to $500 depending on food spoilage, work disruption, and weather conditions. Extended outages can cost significantly more." },
    { question: "How can I prepare for a power outage?", answer: "Keep a battery backup for essential electronics, have a cooler and ice ready, maintain flashlights and batteries, and consider a portable generator for extended outages." },
  ],
  formula: "Total Cost = Food Spoilage + (HVAC Rate x Hours) + (Income / 8 x Work Hours Lost)",
};

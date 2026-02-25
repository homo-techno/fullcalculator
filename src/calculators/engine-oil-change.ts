import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engineOilChangeCalculator: CalculatorDefinition = {
  slug: "engine-oil-change-calculator",
  title: "Oil Change Interval Calculator",
  description: "Free oil change interval calculator. Determine when your next oil change is due based on mileage, time, and driving conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["oil change interval", "oil change calculator", "when to change oil", "oil change mileage", "oil change schedule"],
  variants: [
    {
      id: "interval",
      name: "Next Oil Change",
      description: "Calculate when your next oil change is due",
      fields: [
        { name: "lastChangeMiles", label: "Odometer at Last Oil Change", type: "number", placeholder: "e.g. 42000", suffix: "miles" },
        { name: "currentMiles", label: "Current Odometer", type: "number", placeholder: "e.g. 45500", suffix: "miles" },
        { name: "intervalMiles", label: "Oil Change Interval", type: "select", options: [
          { label: "3,000 miles (Conventional, severe)", value: "3000" },
          { label: "5,000 miles (Conventional, normal)", value: "5000" },
          { label: "7,500 miles (Synthetic blend)", value: "7500" },
          { label: "10,000 miles (Full synthetic)", value: "10000" },
          { label: "15,000 miles (Extended synthetic)", value: "15000" },
        ], defaultValue: "5000" },
        { name: "dailyMiles", label: "Average Daily Miles", type: "number", placeholder: "e.g. 35" },
      ],
      calculate: (inputs) => {
        const lastChange = inputs.lastChangeMiles as number;
        const current = inputs.currentMiles as number;
        const interval = parseInt(inputs.intervalMiles as string) || 5000;
        const daily = (inputs.dailyMiles as number) || 30;
        if (!lastChange || !current) return null;

        const milesSinceChange = current - lastChange;
        const milesRemaining = interval - milesSinceChange;
        const daysRemaining = daily > 0 ? Math.max(0, Math.floor(milesRemaining / daily)) : 0;
        const nextChangeMiles = lastChange + interval;
        const percentUsed = (milesSinceChange / interval) * 100;

        return {
          primary: { label: "Miles Until Next Change", value: milesRemaining > 0 ? `${formatNumber(milesRemaining, 0)} miles` : "Overdue!" },
          details: [
            { label: "Next change at", value: `${formatNumber(nextChangeMiles, 0)} miles` },
            { label: "Miles since last change", value: `${formatNumber(milesSinceChange, 0)} miles` },
            { label: "Oil life used", value: `${formatNumber(Math.min(percentUsed, 100), 0)}%` },
            { label: "Estimated days remaining", value: milesRemaining > 0 ? `${daysRemaining} days` : "0 days" },
          ],
        };
      },
    },
    {
      id: "cost",
      name: "Annual Oil Change Cost",
      description: "Calculate annual spending on oil changes",
      fields: [
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "intervalMiles", label: "Oil Change Interval", type: "number", placeholder: "e.g. 5000", suffix: "miles" },
        { name: "costPerChange", label: "Cost per Oil Change", type: "number", placeholder: "e.g. 75", prefix: "$" },
      ],
      calculate: (inputs) => {
        const annual = inputs.annualMiles as number;
        const interval = inputs.intervalMiles as number;
        const cost = inputs.costPerChange as number;
        if (!annual || !interval || !cost) return null;

        const changesPerYear = annual / interval;
        const annualCost = changesPerYear * cost;

        return {
          primary: { label: "Annual Oil Change Cost", value: `$${formatNumber(annualCost)}` },
          details: [
            { label: "Oil changes per year", value: formatNumber(changesPerYear, 1) },
            { label: "Cost per change", value: `$${formatNumber(cost)}` },
            { label: "Monthly average", value: `$${formatNumber(annualCost / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-maintenance-cost-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How often should I change my oil?", answer: "Modern cars with synthetic oil typically need changes every 7,500-10,000 miles. Conventional oil should be changed every 3,000-5,000 miles. Always follow your owner's manual recommendations." },
    { question: "Does synthetic oil last longer?", answer: "Yes, full synthetic oil can last 10,000-15,000 miles between changes, compared to 3,000-5,000 for conventional oil. While more expensive per change, synthetic oil often costs less annually due to fewer changes needed." },
  ],
  formula: "Miles Remaining = Oil Change Interval - (Current Odometer - Last Change Odometer)",
};

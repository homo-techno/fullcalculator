import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oilChangeIntervalCalculator: CalculatorDefinition = {
  slug: "oil-change-interval-calculator",
  title: "Oil Change Interval Calculator",
  description: "Free oil change interval calculator. Determine when your next oil change is due based on mileage, driving conditions, and oil type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["oil change interval", "oil change calculator", "when to change oil", "oil change schedule", "oil change mileage"],
  variants: [
    {
      id: "next",
      name: "Next Oil Change Due",
      description: "Calculate when your next oil change is due",
      fields: [
        { name: "currentMileage", label: "Current Odometer Reading", type: "number", placeholder: "e.g. 45000" },
        { name: "lastChangeMileage", label: "Mileage at Last Oil Change", type: "number", placeholder: "e.g. 40000" },
        { name: "oilType", label: "Oil Type", type: "select", options: [
          { label: "Conventional Oil", value: "conventional" },
          { label: "Synthetic Blend", value: "blend" },
          { label: "Full Synthetic", value: "synthetic" },
          { label: "High Mileage (75K+ miles)", value: "highmileage" },
        ], defaultValue: "synthetic" },
        { name: "drivingConditions", label: "Driving Conditions", type: "select", options: [
          { label: "Normal (mostly highway)", value: "normal" },
          { label: "Moderate (mixed city/highway)", value: "moderate" },
          { label: "Severe (lots of city, towing, dusty)", value: "severe" },
        ], defaultValue: "normal" },
        { name: "dailyMiles", label: "Average Daily Miles", type: "number", placeholder: "e.g. 35" },
      ],
      calculate: (inputs) => {
        const currentMileage = inputs.currentMileage as number;
        const lastChange = inputs.lastChangeMileage as number;
        const oilType = (inputs.oilType as string) || "synthetic";
        const conditions = (inputs.drivingConditions as string) || "normal";
        const dailyMiles = (inputs.dailyMiles as number) || 35;
        if (!currentMileage || !lastChange) return null;

        // Base intervals by oil type
        const baseIntervals: Record<string, number> = {
          conventional: 5000,
          blend: 7500,
          synthetic: 10000,
          highmileage: 5000,
        };

        // Condition adjustments
        const conditionFactors: Record<string, number> = {
          normal: 1.0,
          moderate: 0.85,
          severe: 0.65,
        };

        const baseInterval = baseIntervals[oilType] || 7500;
        const adjustedInterval = Math.round(baseInterval * (conditionFactors[conditions] || 1.0));
        const milesSinceChange = currentMileage - lastChange;
        const milesUntilDue = adjustedInterval - milesSinceChange;
        const daysUntilDue = Math.max(0, Math.round(milesUntilDue / dailyMiles));
        const pctUsed = Math.min(100, (milesSinceChange / adjustedInterval) * 100);

        const nextChangeMileage = lastChange + adjustedInterval;
        const status = milesUntilDue <= 0 ? "OVERDUE" : milesUntilDue <= 500 ? "Due Soon" : "OK";

        return {
          primary: { label: "Next Oil Change At", value: `${formatNumber(nextChangeMileage, 0)} miles` },
          details: [
            { label: "Recommended interval", value: `${formatNumber(adjustedInterval, 0)} miles` },
            { label: "Miles since last change", value: formatNumber(milesSinceChange, 0) },
            { label: "Miles until due", value: milesUntilDue <= 0 ? "OVERDUE" : formatNumber(milesUntilDue, 0) },
            { label: "Approximate days until due", value: milesUntilDue <= 0 ? "Now" : `${daysUntilDue} days` },
            { label: "Oil life used", value: `${formatNumber(pctUsed, 0)}%` },
            { label: "Status", value: status },
          ],
        };
      },
    },
    {
      id: "cost",
      name: "Annual Oil Change Cost",
      description: "Estimate annual oil change costs",
      fields: [
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "oilType", label: "Oil Type", type: "select", options: [
          { label: "Conventional Oil", value: "conventional" },
          { label: "Synthetic Blend", value: "blend" },
          { label: "Full Synthetic", value: "synthetic" },
        ], defaultValue: "synthetic" },
        { name: "serviceType", label: "Service Type", type: "select", options: [
          { label: "DIY (do it yourself)", value: "diy" },
          { label: "Quick Lube Shop", value: "quick" },
          { label: "Dealership", value: "dealer" },
        ], defaultValue: "quick" },
      ],
      calculate: (inputs) => {
        const annualMiles = inputs.annualMiles as number;
        const oilType = (inputs.oilType as string) || "synthetic";
        const serviceType = (inputs.serviceType as string) || "quick";
        if (!annualMiles) return null;

        const intervals: Record<string, number> = { conventional: 5000, blend: 7500, synthetic: 10000 };
        const diyCosts: Record<string, number> = { conventional: 25, blend: 35, synthetic: 45 };
        const quickCosts: Record<string, number> = { conventional: 45, blend: 65, synthetic: 85 };
        const dealerCosts: Record<string, number> = { conventional: 65, blend: 90, synthetic: 120 };

        const interval = intervals[oilType] || 7500;
        const changesPerYear = Math.ceil(annualMiles / interval);

        const costMap: Record<string, Record<string, number>> = { diy: diyCosts, quick: quickCosts, dealer: dealerCosts };
        const costPerChange = costMap[serviceType]?.[oilType] || 65;
        const annualCost = changesPerYear * costPerChange;

        return {
          primary: { label: "Annual Oil Change Cost", value: `$${formatNumber(annualCost)}` },
          details: [
            { label: "Oil changes per year", value: `${changesPerYear}` },
            { label: "Cost per change", value: `$${formatNumber(costPerChange)}` },
            { label: "Change interval", value: `Every ${formatNumber(interval, 0)} miles` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mpg-calculator", "car-payment-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How often should I change my oil?", answer: "With modern full synthetic oil, most vehicles can go 7,500-10,000 miles between changes. Conventional oil should be changed every 3,000-5,000 miles. Always check your owner's manual for the manufacturer's recommendation, and shorten the interval for severe driving conditions." },
    { question: "What are severe driving conditions?", answer: "Severe conditions include frequent short trips (under 10 miles), stop-and-go city driving, dusty or dirty roads, towing, extreme temperatures, and driving at sustained high speeds. Most urban driving qualifies as moderate to severe." },
    { question: "Is synthetic oil worth the extra cost?", answer: "Yes, for most drivers. Synthetic oil lasts longer (7,500-10,000+ miles vs 3,000-5,000), provides better engine protection, performs better in extreme temperatures, and may actually save money over time due to fewer changes needed." },
  ],
  formula: "Next Oil Change = Last Change Mileage + (Base Interval x Condition Factor); Annual Changes = Annual Miles / Interval",
};

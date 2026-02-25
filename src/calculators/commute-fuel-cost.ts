import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commuteFuelCostCalculator: CalculatorDefinition = {
  slug: "commute-fuel-cost-calculator",
  title: "Commute Fuel Cost Calculator",
  description: "Free commute fuel cost calculator. Estimate daily, weekly, monthly, and annual fuel costs for your work commute.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["commute fuel cost", "commute gas cost", "daily commute cost", "work commute calculator", "driving to work cost"],
  variants: [
    {
      id: "commute",
      name: "Commute Fuel Cost",
      description: "Calculate fuel cost for your daily commute",
      fields: [
        { name: "distance", label: "One-Way Distance", type: "number", placeholder: "e.g. 25", suffix: "miles" },
        { name: "mpg", label: "Fuel Efficiency", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "gasPrice", label: "Gas Price", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01, suffix: "/gal" },
        { name: "daysPerWeek", label: "Work Days per Week", type: "number", placeholder: "e.g. 5" },
        { name: "weeksPerYear", label: "Weeks per Year", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const oneWay = inputs.distance as number;
        const mpg = inputs.mpg as number;
        const price = inputs.gasPrice as number;
        const days = (inputs.daysPerWeek as number) || 5;
        const weeks = (inputs.weeksPerYear as number) || 50;
        if (!oneWay || !mpg || !price) return null;

        const dailyMiles = oneWay * 2;
        const dailyCost = (dailyMiles / mpg) * price;
        const weeklyCost = dailyCost * days;
        const monthlyCost = weeklyCost * 4.33;
        const annualCost = weeklyCost * weeks;

        return {
          primary: { label: "Monthly Commute Cost", value: `$${formatNumber(monthlyCost)}` },
          details: [
            { label: "Daily cost (round trip)", value: `$${formatNumber(dailyCost)}` },
            { label: "Weekly cost", value: `$${formatNumber(weeklyCost)}` },
            { label: "Annual cost", value: `$${formatNumber(annualCost)}` },
            { label: "Daily round trip", value: `${formatNumber(dailyMiles, 0)} miles` },
            { label: "Annual commute miles", value: `${formatNumber(dailyMiles * days * weeks, 0)} miles` },
          ],
        };
      },
    },
    {
      id: "remote",
      name: "Remote Work Savings",
      description: "Calculate savings from working remotely vs commuting",
      fields: [
        { name: "distance", label: "One-Way Commute Distance", type: "number", placeholder: "e.g. 25", suffix: "miles" },
        { name: "mpg", label: "Fuel Efficiency", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "gasPrice", label: "Gas Price", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
        { name: "remoteDays", label: "Remote Days per Week", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const oneWay = inputs.distance as number;
        const mpg = inputs.mpg as number;
        const price = inputs.gasPrice as number;
        const remoteDays = (inputs.remoteDays as number) || 0;
        if (!oneWay || !mpg || !price) return null;

        const dailyCost = (oneWay * 2 / mpg) * price;
        const weeklySavings = dailyCost * remoteDays;
        const annualSavings = weeklySavings * 50;

        return {
          primary: { label: "Annual Remote Savings", value: `$${formatNumber(annualSavings)}` },
          details: [
            { label: "Weekly savings", value: `$${formatNumber(weeklySavings)}` },
            { label: "Monthly savings", value: `$${formatNumber(weeklySavings * 4.33)}` },
            { label: "Daily commute cost saved", value: `$${formatNumber(dailyCost)}` },
            { label: "Miles saved per year", value: `${formatNumber(oneWay * 2 * remoteDays * 50, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "car-total-cost-calculator"],
  faq: [
    { question: "How much does the average commute cost in gas?", answer: "With the average US commute of 16 miles one-way, a car getting 28 MPG, and gas at $3.50/gallon, the daily round-trip costs about $4.00, or roughly $87/month." },
    { question: "How can I reduce my commute fuel cost?", answer: "Consider carpooling, working remotely when possible, using public transit, improving driving habits (smooth acceleration, proper tire pressure), or switching to a more fuel-efficient vehicle." },
  ],
  formula: "Daily Cost = (One-Way Distance × 2 / MPG) × Gas Price",
};

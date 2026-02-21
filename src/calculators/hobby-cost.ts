import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hobbyCostCalculator: CalculatorDefinition = {
  slug: "hobby-cost-calculator",
  title: "Hobby Cost Calculator",
  description:
    "Free hobby cost calculator. Estimate monthly, yearly, and lifetime costs for any hobby. Compare cost per hour of enjoyment across hobbies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "hobby cost calculator",
    "how much does hobby cost",
    "hobby budget",
    "cost per hour hobby",
    "hobby expense tracker",
    "recreation cost",
  ],
  variants: [
    {
      id: "hobby-budget",
      name: "Hobby Budget Calculator",
      description: "Calculate total cost of a hobby including startup and recurring expenses",
      fields: [
        {
          name: "startupCost",
          label: "Initial/Startup Costs ($)",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "monthlyCost",
          label: "Monthly Recurring Cost ($)",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
        },
        {
          name: "perSessionCost",
          label: "Per Session/Use Cost ($)",
          type: "number",
          placeholder: "e.g. 20",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "sessionsPerMonth",
          label: "Sessions per Month",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
          defaultValue: 4,
        },
        {
          name: "hoursPerSession",
          label: "Hours per Session",
          type: "number",
          placeholder: "e.g. 2",
          min: 0.25,
          step: 0.25,
          defaultValue: 2,
        },
        {
          name: "years",
          label: "Time Horizon (years)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 50,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const startup = (inputs.startupCost as number) || 0;
        const monthly = (inputs.monthlyCost as number) || 0;
        const perSession = (inputs.perSessionCost as number) || 0;
        const sessionsMonth = (inputs.sessionsPerMonth as number) || 4;
        const hoursSession = (inputs.hoursPerSession as number) || 2;
        const years = (inputs.years as number) || 5;

        const totalMonthly = monthly + (perSession * sessionsMonth);
        const yearly = totalMonthly * 12;
        const totalCost = startup + (yearly * years);
        const totalHours = sessionsMonth * hoursSession * 12 * years;
        const costPerHour = totalHours > 0 ? totalCost / totalHours : 0;
        const costPerSession = hoursSession > 0 ? (totalMonthly / sessionsMonth) : 0;
        const dailyCost = totalMonthly / 30;

        return {
          primary: { label: "Total Cost (" + years + " years)", value: "$" + formatNumber(totalCost, 0) },
          details: [
            { label: "Startup Costs", value: "$" + formatNumber(startup, 0) },
            { label: "Monthly Cost", value: "$" + formatNumber(totalMonthly, 0) },
            { label: "Yearly Cost", value: "$" + formatNumber(yearly, 0) },
            { label: "Daily Cost (avg)", value: "$" + formatNumber(dailyCost, 2) },
            { label: "Cost per Session", value: "$" + formatNumber(costPerSession, 2) },
            { label: "Cost per Hour", value: "$" + formatNumber(costPerHour, 2) },
            { label: "Total Hours of Enjoyment", value: formatNumber(totalHours, 0) + " hours" },
            { label: "Sessions per Year", value: formatNumber(sessionsMonth * 12, 0) },
          ],
        };
      },
    },
    {
      id: "compare-hobbies",
      name: "Compare Two Hobbies",
      description: "Compare the cost-effectiveness of two hobbies by cost per hour",
      fields: [
        {
          name: "hobby1Monthly",
          label: "Hobby 1: Monthly Cost ($)",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
        },
        {
          name: "hobby1Hours",
          label: "Hobby 1: Hours per Month",
          type: "number",
          placeholder: "e.g. 20",
          min: 0.5,
          step: 0.5,
        },
        {
          name: "hobby2Monthly",
          label: "Hobby 2: Monthly Cost ($)",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          min: 0,
        },
        {
          name: "hobby2Hours",
          label: "Hobby 2: Hours per Month",
          type: "number",
          placeholder: "e.g. 40",
          min: 0.5,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const h1Cost = inputs.hobby1Monthly as number;
        const h1Hours = inputs.hobby1Hours as number;
        const h2Cost = inputs.hobby2Monthly as number;
        const h2Hours = inputs.hobby2Hours as number;
        if (!h1Cost || !h1Hours || !h2Cost || !h2Hours) return null;

        const h1CostPerHour = h1Cost / h1Hours;
        const h2CostPerHour = h2Cost / h2Hours;
        const h1Yearly = h1Cost * 12;
        const h2Yearly = h2Cost * 12;

        const betterValue = h1CostPerHour < h2CostPerHour ? "Hobby 1" : h2CostPerHour < h1CostPerHour ? "Hobby 2" : "Equal";
        const savings = Math.abs(h1Yearly - h2Yearly);

        return {
          primary: { label: "Better Value ($/hr)", value: betterValue },
          details: [
            { label: "Hobby 1 Cost/Hour", value: "$" + formatNumber(h1CostPerHour, 2) },
            { label: "Hobby 2 Cost/Hour", value: "$" + formatNumber(h2CostPerHour, 2) },
            { label: "Hobby 1 Monthly", value: "$" + formatNumber(h1Cost, 0) },
            { label: "Hobby 2 Monthly", value: "$" + formatNumber(h2Cost, 0) },
            { label: "Hobby 1 Yearly", value: "$" + formatNumber(h1Yearly, 0) },
            { label: "Hobby 2 Yearly", value: "$" + formatNumber(h2Yearly, 0) },
            { label: "Yearly Difference", value: "$" + formatNumber(savings, 0) },
            { label: "Hobby 1 Monthly Hours", value: formatNumber(h1Hours, 1) },
            { label: "Hobby 2 Monthly Hours", value: formatNumber(h2Hours, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["event-ticket-calculator", "break-even-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "How do I calculate the cost of a hobby?",
      answer:
        "Add up all expenses: initial equipment/startup costs, monthly recurring fees (memberships, subscriptions), per-session costs (ammo, supplies, greens fees), and maintenance/replacement costs. Divide total cost by hours of enjoyment for cost per hour.",
    },
    {
      question: "What is a good cost per hour for a hobby?",
      answer:
        "It varies widely. Reading: $0.50-2/hr. Gaming: $1-5/hr. Golf: $15-40/hr. Skiing: $20-50/hr. Compare to entertainment alternatives: movies are about $5-8/hr, streaming services are under $1/hr. The best value is whatever brings you the most joy.",
    },
    {
      question: "What are the cheapest hobbies?",
      answer:
        "Walking/hiking, reading (library), writing, drawing, bodyweight exercise, birdwatching, and cooking are among the lowest-cost hobbies. Many cost under $1/hour of enjoyment after minimal startup investment.",
    },
  ],
  formula:
    "Monthly Cost = Recurring + (Per Session x Sessions) | Yearly = Monthly x 12 | Total = Startup + (Yearly x Years) | Cost/Hour = Total / Total Hours",
};

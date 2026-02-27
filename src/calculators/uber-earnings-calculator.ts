import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uberEarningsCalculator: CalculatorDefinition = {
  slug: "uber-earnings-calculator",
  title: "Uber Earnings Calculator",
  description: "Free uber earnings calculator. Calculate and plan with accurate uber driver earnings estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["uber earnings calculator", "uber driver earnings", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Uber Earnings",
      description: "Free uber earnings calculator. Calculate and plan with accurate uber driver earn",
      fields: [
        {
          name: "trips",
          label: "Trips per Week",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
        },
        {
          name: "avgFare",
          label: "Average Fare",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "hours",
          label: "Hours per Week",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "hrs",
          min: 1,
        },
        {
          name: "gasCost",
          label: "Weekly Gas Cost",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
        },
        {
          name: "maintenance",
          label: "Weekly Maintenance",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
        },
        {
          name: "uberCut",
          label: "Uber Commission",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "%",
          min: 0,
          max: 50,
          defaultValue: 25,
        }
      ],
      calculate: (inputs) => {
        const trips = inputs.trips as number;
        const avgFare = inputs.avgFare as number;
        const hours = inputs.hours as number;
        const gas = inputs.gasCost as number || 0;
        const maintenance = inputs.maintenance as number || 0;
        const cut = (inputs.uberCut as number) / 100;
        if (!trips || !avgFare || !hours) return null;
        const grossWeekly = trips * avgFare;
        const driverShare = grossWeekly * (1 - cut);
        const netWeekly = driverShare - gas - maintenance;
        const hourlyRate = netWeekly / hours;
        return {
          primary: { label: "Weekly Net Earnings", value: "$" + formatNumber(netWeekly) },
          details: [
            { label: "Gross fares", value: "$" + formatNumber(grossWeekly) },
            { label: "Your share (after Uber cut)", value: "$" + formatNumber(driverShare) },
            { label: "Expenses (gas + maintenance)", value: "$" + formatNumber(gas + maintenance) },
            { label: "Effective hourly rate", value: "$" + formatNumber(hourlyRate) + "/hr" },
            { label: "Monthly estimate", value: "$" + formatNumber(netWeekly * 4.33) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the uber earnings work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Net = (Trips x Fare) x (1 - Commission) - Expenses",
};

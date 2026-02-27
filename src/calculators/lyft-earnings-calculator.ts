import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lyftEarningsCalculator: CalculatorDefinition = {
  slug: "lyft-earnings-calculator",
  title: "Lyft Earnings Calculator",
  description: "Free lyft earnings calculator. Calculate and plan with accurate lyft driver earnings estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lyft earnings calculator", "lyft driver earnings", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Lyft Earnings",
      description: "Free lyft earnings calculator. Calculate and plan with accurate lyft driver earn",
      fields: [
        {
          name: "trips",
          label: "Trips per Week",
          type: "number",
          placeholder: "e.g. 25",
          min: 1,
        },
        {
          name: "avgFare",
          label: "Average Fare",
          type: "number",
          placeholder: "e.g. 14",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "hours",
          label: "Hours per Week",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "hrs",
          min: 1,
        },
        {
          name: "gasCost",
          label: "Weekly Gas Cost",
          type: "number",
          placeholder: "e.g. 90",
          prefix: "$",
          min: 0,
        },
        {
          name: "lyftCut",
          label: "Lyft Commission",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "%",
          min: 0,
          max: 50,
          defaultValue: 20,
        }
      ],
      calculate: (inputs) => {
        const trips = inputs.trips as number;
        const avgFare = inputs.avgFare as number;
        const hours = inputs.hours as number;
        const gas = inputs.gasCost as number || 0;
        const cut = (inputs.lyftCut as number) / 100;
        if (!trips || !avgFare || !hours) return null;
        const gross = trips * avgFare;
        const driverShare = gross * (1 - cut);
        const net = driverShare - gas;
        return {
          primary: { label: "Weekly Net Earnings", value: "$" + formatNumber(net) },
          details: [
            { label: "Gross fares", value: "$" + formatNumber(gross) },
            { label: "Driver share", value: "$" + formatNumber(driverShare) },
            { label: "Gas costs", value: "$" + formatNumber(gas) },
            { label: "Hourly rate", value: "$" + formatNumber(net / hours) + "/hr" },
            { label: "Annual estimate", value: "$" + formatNumber(net * 52) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the lyft earnings work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Net = (Trips x Fare) x (1 - Commission) - Gas",
};

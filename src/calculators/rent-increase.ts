import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentIncreaseCalculator: CalculatorDefinition = {
  slug: "rent-increase-calculator",
  title: "Rent Increase Calculator",
  description:
    "Free rent increase calculator. Calculate the percentage and dollar amount of a rent increase, project future rent with annual increases, and determine if a raise is reasonable.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rent increase calculator",
    "rent raise calculator",
    "rent increase percentage",
    "how much did my rent increase",
    "annual rent increase calculator",
  ],
  variants: [
    {
      id: "increase-amount",
      name: "Rent Increase Amount",
      description: "Calculate the percentage and dollar amount of a rent increase",
      fields: [
        { name: "currentRent", label: "Current Monthly Rent", type: "number", placeholder: "e.g. 1500", prefix: "$", min: 0 },
        { name: "newRent", label: "New Monthly Rent", type: "number", placeholder: "e.g. 1650", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const current = inputs.currentRent as number;
        const newRent = inputs.newRent as number;
        if (!current || !newRent) return null;

        const increase = newRent - current;
        const percentIncrease = (increase / current) * 100;
        const annualDifference = increase * 12;

        return {
          primary: { label: "Rent Increase", value: `${formatNumber(percentIncrease, 2)}%` },
          details: [
            { label: "Monthly increase", value: `$${formatNumber(increase)}` },
            { label: "Annual increase", value: `$${formatNumber(annualDifference)}` },
            { label: "Old annual rent", value: `$${formatNumber(current * 12)}` },
            { label: "New annual rent", value: `$${formatNumber(newRent * 12)}` },
          ],
          note: percentIncrease > 10 ? "An increase above 10% is significant. Check local rent control laws for any limits on increases." : undefined,
        };
      },
    },
    {
      id: "future-rent",
      name: "Future Rent Projection",
      description: "Project future rent based on annual increase rate",
      fields: [
        { name: "currentRent", label: "Current Monthly Rent", type: "number", placeholder: "e.g. 1500", prefix: "$", min: 0 },
        { name: "annualIncrease", label: "Annual Increase Rate", type: "number", placeholder: "e.g. 3", suffix: "%", min: 0, max: 50, step: 0.1 },
        {
          name: "years",
          label: "Years to Project",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.currentRent as number;
        const rate = inputs.annualIncrease as number;
        const years = parseInt(inputs.years as string) || 5;
        if (!current || rate === undefined) return null;

        const futureRent = current * Math.pow(1 + rate / 100, years);
        const totalPaid = rate === 0
          ? current * 12 * years
          : current * 12 * ((Math.pow(1 + rate / 100, years) - 1) / (rate / 100));
        const totalIncrease = futureRent - current;

        return {
          primary: { label: `Rent in ${years} Years`, value: `$${formatNumber(futureRent)}` },
          details: [
            { label: "Current monthly rent", value: `$${formatNumber(current)}` },
            { label: "Monthly increase over period", value: `$${formatNumber(totalIncrease)}` },
            { label: "Percent increase over period", value: `${formatNumber((totalIncrease / current) * 100)}%` },
            { label: `Approx. total rent paid (${years} yrs)`, value: `$${formatNumber(totalPaid)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rent-affordability-calculator", "rent-vs-buy-calculator", "inflation-calculator"],
  faq: [
    {
      question: "How do I calculate a rent increase percentage?",
      answer:
        "Rent Increase % = ((New Rent − Old Rent) / Old Rent) × 100. For example, if rent goes from $1,500 to $1,650: ($150 / $1,500) × 100 = 10% increase.",
    },
    {
      question: "What is the average annual rent increase?",
      answer:
        "Nationally, rents increase about 3-5% per year on average, roughly tracking inflation. However, in high-demand markets rent increases of 8-15% have been common in recent years. Rent-controlled areas may cap increases at 2-5%.",
    },
    {
      question: "Are there limits on how much a landlord can raise rent?",
      answer:
        "It depends on your location. Rent-controlled or rent-stabilized cities (like NYC, San Francisco, Los Angeles) cap annual increases, often tied to CPI or a fixed percentage. In most US states without rent control, there is no legal limit on increases with proper notice.",
    },
  ],
  formula: "Rent Increase % = ((New Rent − Old Rent) / Old Rent) × 100 | Future Rent = Current Rent × (1 + Annual Rate)^Years",
};

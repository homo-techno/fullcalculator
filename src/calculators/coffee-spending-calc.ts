import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coffeeSpendingCalculator: CalculatorDefinition = {
  slug: "coffee-spending-calculator",
  title: "Coffee Spending Habit Calculator",
  description:
    "Free coffee spending calculator. Track how much you spend on coffee per week, month, and year, and compare the cost of buying vs brewing at home.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "coffee spending calculator",
    "coffee cost calculator",
    "coffee budget",
    "how much do I spend on coffee",
    "coffee habit cost",
  ],
  variants: [
    {
      id: "spending-tracker",
      name: "Coffee Spending Tracker",
      description: "Calculate your total coffee spending habit",
      fields: [
        {
          name: "cupsPerDay",
          label: "Cups per Day (bought)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0.5,
          max: 8,
          step: 0.5,
          defaultValue: 2,
        },
        {
          name: "avgPrice",
          label: "Average Price per Cup",
          type: "number",
          placeholder: "e.g. 5.50",
          prefix: "$",
          min: 1,
          max: 15,
          step: 0.25,
          defaultValue: 5.5,
        },
        {
          name: "daysPerWeek",
          label: "Days per Week Buying Coffee",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 7,
          step: 1,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const cups = parseFloat(inputs.cupsPerDay as string);
        const price = parseFloat(inputs.avgPrice as string);
        const days = parseFloat(inputs.daysPerWeek as string);
        if (!cups || !price || !days) return null;

        const dailySpend = cups * price;
        const weeklySpend = dailySpend * days;
        const monthlySpend = weeklySpend * 4.33;
        const yearlySpend = weeklySpend * 52;
        const fiveYearSpend = yearlySpend * 5;
        const tenYearSpend = yearlySpend * 10;

        // Fun comparisons
        const vacationDays = Math.floor(yearlySpend / 200); // $200/day vacation
        const niceDinners = Math.floor(yearlySpend / 75);

        return {
          primary: { label: "Yearly Coffee Spending", value: `$${formatNumber(yearlySpend)}` },
          details: [
            { label: "Daily Spending", value: `$${formatNumber(dailySpend)}` },
            { label: "Weekly Spending", value: `$${formatNumber(weeklySpend)}` },
            { label: "Monthly Spending", value: `$${formatNumber(monthlySpend)}` },
            { label: "5-Year Total", value: `$${formatNumber(fiveYearSpend)}` },
            { label: "10-Year Total", value: `$${formatNumber(tenYearSpend)}` },
            { label: "Equivalent Vacation Days", value: `${formatNumber(vacationDays, 0)} days` },
          ],
        };
      },
    },
    {
      id: "buy-vs-brew",
      name: "Buy vs Brew at Home",
      description: "Compare buying coffee vs making it at home",
      fields: [
        {
          name: "cupsPerDay",
          label: "Cups per Day",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 8,
          step: 0.5,
          defaultValue: 2,
        },
        {
          name: "shopPrice",
          label: "Coffee Shop Price per Cup",
          type: "number",
          placeholder: "e.g. 5.50",
          prefix: "$",
          min: 1,
          max: 15,
          step: 0.25,
          defaultValue: 5.5,
        },
        {
          name: "homeMethod",
          label: "Home Brewing Method",
          type: "select",
          options: [
            { label: "Drip Coffee Maker ($0.15/cup)", value: "0.15" },
            { label: "French Press ($0.20/cup)", value: "0.20" },
            { label: "Single-Serve Pod ($0.70/cup)", value: "0.70" },
            { label: "Espresso Machine ($0.40/cup)", value: "0.40" },
            { label: "Cold Brew ($0.25/cup)", value: "0.25" },
          ],
          defaultValue: "0.15",
        },
      ],
      calculate: (inputs) => {
        const cups = parseFloat(inputs.cupsPerDay as string);
        const shopPrice = parseFloat(inputs.shopPrice as string);
        const homeCost = parseFloat(inputs.homeMethod as string);
        if (!cups || !shopPrice || !homeCost) return null;

        const shopDaily = cups * shopPrice;
        const homeDaily = cups * homeCost;
        const dailySavings = shopDaily - homeDaily;
        const yearlySavings = dailySavings * 365;
        const monthlyShop = shopDaily * 30;
        const monthlyHome = homeDaily * 30;

        // If invested at 7% over 10 years
        const annualSavings = yearlySavings;
        const invested10yr = annualSavings * ((Math.pow(1.07, 10) - 1) / 0.07);

        return {
          primary: { label: "Yearly Savings (Home Brew)", value: `$${formatNumber(yearlySavings)}` },
          details: [
            { label: "Daily Savings", value: `$${formatNumber(dailySavings)}` },
            { label: "Monthly Shop Cost", value: `$${formatNumber(monthlyShop)}` },
            { label: "Monthly Home Cost", value: `$${formatNumber(monthlyHome)}` },
            { label: "Home Cost per Cup", value: `$${formatNumber(homeCost)}` },
            { label: "Savings if Invested (10yr @ 7%)", value: `$${formatNumber(invested10yr)}` },
          ],
          note: "Home brewing costs include coffee beans/grounds and filters. Does not include equipment purchase price, which typically pays for itself in 1-3 months.",
        };
      },
    },
  ],
  relatedSlugs: ["latte-factor-calculator", "subscription-audit-calculator"],
  faq: [
    {
      question: "How much does the average person spend on coffee per year?",
      answer:
        "The average American spends about $1,100 per year on coffee, with daily coffee shop buyers spending $2,000-$3,000+ per year. Making coffee at home costs roughly $50-$200 per year depending on the brewing method.",
    },
    {
      question: "What is the cheapest way to make coffee at home?",
      answer:
        "Drip coffee makers and French presses are the most economical at about $0.10-$0.20 per cup. Buying beans in bulk and grinding at home saves even more. Single-serve pods are more expensive at $0.50-$1.00 per cup.",
    },
  ],
  formula:
    "Yearly Spending = Cups/Day x Price x Days/Week x 52 | Savings = (Shop Price - Home Cost) x Cups/Day x 365",
};

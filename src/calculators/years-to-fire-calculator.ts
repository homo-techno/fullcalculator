import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yearsToFireCalculator: CalculatorDefinition = {
  slug: "years-to-fire-calculator",
  title: "Years to FIRE Calculator",
  description:
    "Calculate how many years until you reach FIRE. Based on current age, savings rate, and investment returns. See your path to financial independence.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "years to FIRE calculator",
    "time to retirement calculator",
    "FIRE timeline",
    "retirement countdown",
    "FI timeline calculator",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Years to FIRE",
      description: "How long until financial independence",
      fields: [
        {
          name: "currentAge",
          label: "Current Age",
          type: "number",
          placeholder: "e.g. 35",
        },
        {
          name: "currentNetWorth",
          label: "Current Net Worth",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
        },
        {
          name: "annualSavings",
          label: "Annual Savings",
          type: "number",
          placeholder: "e.g. 30000",
          prefix: "$",
        },
        {
          name: "fireNumber",
          label: "Your FIRE Number Goal",
          type: "number",
          placeholder: "e.g. 1000000",
          prefix: "$",
        },
        {
          name: "investmentReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
        },
      ],
      calculate: (inputs) => {
        const currentAge = parseFloat(inputs.currentAge as string) || 35;
        const netWorth = parseFloat(inputs.currentNetWorth as string) || 100000;
        const annualSavings = parseFloat(inputs.annualSavings as string) || 30000;
        const fireNumber = parseFloat(inputs.fireNumber as string) || 1000000;
        const returnRate = parseFloat(inputs.investmentReturn as string) || 7;

        // Simple calculation: compound interest with contributions
        let portfolio = netWorth;
        let years = 0;
        const rate = returnRate / 100;

        while (portfolio < fireNumber && years < 100) {
          portfolio = (portfolio * (1 + rate)) + annualSavings;
          years++;
        }

        const fireAge = currentAge + years;
        const savingsRate = (annualSavings / (netWorth + annualSavings)) * 100;

        return {
          primary: { label: "Years Until FIRE", value: `${formatNumber(years, 0)} years` },
          details: [
            { label: "Current age", value: formatNumber(currentAge) },
            { label: "FIRE age", value: formatNumber(fireAge) },
            { label: "Current net worth", value: `$${formatNumber(netWorth, 0)}` },
            { label: "Annual savings", value: `$${formatNumber(annualSavings, 0)}` },
            { label: "FIRE number goal", value: `$${formatNumber(fireNumber, 0)}` },
            { label: "Expected return", value: `${returnRate}%` },
            { label: "Portfolio at FIRE", value: `$${formatNumber(portfolio, 0)}` },
            { label: "Total contributed", value: `$${formatNumber(netWorth + (annualSavings * years), 0)}` },
            { label: "Investment growth", value: `$${formatNumber(portfolio - (netWorth + (annualSavings * years)), 0)}` },
          ],
          note: "Assumes consistent returns and savings. Adjust for life changes, raises, and market volatility.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "compound-interest"],
  faq: [
    {
      question: "What's the most important factor in reaching FIRE?",
      answer:
        "Savings rate matters most in early years. Later, investment returns dominate. Typical: 70% savings, 30% returns early. Flips to 30% savings, 70% returns late.",
    },
    {
      question: "Can I retire earlier by increasing savings?",
      answer:
        "Yes! Every $10k extra savings/year cuts FIRE timeline by ~1-2 years (depending on current wealth). Increasing return rate 1% also saves ~1-2 years.",
    },
  ],
  formula: "Years to FIRE = time for (Net Worth + Annual Savings) × (1 + Return Rate) to reach FIRE Number",
};

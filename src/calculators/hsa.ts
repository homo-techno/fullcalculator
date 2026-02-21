import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hsaCalculator: CalculatorDefinition = {
  slug: "hsa-calculator",
  title: "HSA Calculator",
  description:
    "Free HSA calculator. Calculate your Health Savings Account tax savings, investment growth, and total value. Understand the triple tax advantage of HSAs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "hsa calculator",
    "health savings account calculator",
    "hsa tax savings calculator",
    "hsa investment calculator",
    "hsa growth calculator",
  ],
  variants: [
    {
      id: "hsa-growth",
      name: "HSA Growth Calculator",
      description: "Calculate HSA tax savings and investment growth over time",
      fields: [
        {
          name: "annualContribution",
          label: "Annual Contribution",
          type: "number",
          placeholder: "e.g. 4150",
          prefix: "$",
          min: 0,
        },
        {
          name: "years",
          label: "Investment Period",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "25 years", value: "25" },
            { label: "30 years", value: "30" },
          ],
          defaultValue: "20",
        },
        {
          name: "expectedReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.1,
          defaultValue: 7,
        },
        {
          name: "taxBracket",
          label: "Combined Tax Bracket (Fed + State)",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "%",
          min: 0,
          max: 55,
          step: 1,
          defaultValue: 30,
        },
      ],
      calculate: (inputs) => {
        const annual = inputs.annualContribution as number;
        const years = parseInt(inputs.years as string) || 20;
        const returnRate = (inputs.expectedReturn as number) || 7;
        const taxBracket = (inputs.taxBracket as number) || 30;
        if (!annual) return null;

        const monthlyContribution = annual / 12;
        const monthlyReturn = Math.pow(1 + returnRate / 100, 1 / 12) - 1;
        const totalMonths = years * 12;

        // Calculate future value with monthly contributions
        let balance = 0;
        for (let m = 0; m < totalMonths; m++) {
          balance = balance * (1 + monthlyReturn) + monthlyContribution;
        }

        const totalContributions = annual * years;
        const investmentGrowth = balance - totalContributions;

        // Triple tax advantage calculations
        // 1. Tax savings on contributions (pre-tax)
        const contributionTaxSavings = totalContributions * (taxBracket / 100);

        // 2. Tax savings on growth (tax-free growth)
        const growthTaxSavings = investmentGrowth * (taxBracket / 100);

        // 3. Tax-free withdrawals for qualified medical expenses
        const withdrawalTaxSavings = balance * (taxBracket / 100);

        // Total tax advantage
        const totalTaxBenefit = contributionTaxSavings + growthTaxSavings;

        // FICA savings (7.65% on contributions)
        const ficaSavings = totalContributions * 0.0765;

        return {
          primary: {
            label: "Projected HSA Value",
            value: `$${formatNumber(balance)}`,
          },
          details: [
            { label: "Total contributions", value: `$${formatNumber(totalContributions)}` },
            { label: "Investment growth", value: `$${formatNumber(investmentGrowth)}` },
            { label: "Tax savings on contributions", value: `$${formatNumber(contributionTaxSavings)}` },
            { label: "Tax savings on growth", value: `$${formatNumber(growthTaxSavings)}` },
            { label: "FICA savings (7.65%)", value: `$${formatNumber(ficaSavings)}` },
            { label: "Total tax benefit", value: `$${formatNumber(totalTaxBenefit + ficaSavings)}` },
            { label: "Tax-free withdrawal value", value: `$${formatNumber(balance)}` },
            { label: "Annual contribution", value: `$${formatNumber(annual)}` },
          ],
          note: "HSA triple tax advantage: (1) Tax-deductible contributions, (2) Tax-free investment growth, (3) Tax-free withdrawals for qualified medical expenses. After age 65, non-medical withdrawals are taxed as income (like a traditional IRA) but with no penalty.",
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "roth-ira-calculator", "tax-calculator"],
  faq: [
    {
      question: "What is the HSA triple tax advantage?",
      answer:
        "The HSA triple tax advantage means: (1) Contributions are tax-deductible and reduce your taxable income, (2) Investments grow tax-free inside the HSA, (3) Withdrawals for qualified medical expenses are tax-free. HSA contributions also avoid FICA taxes, making it a quadruple benefit.",
    },
    {
      question: "What are the 2024 HSA contribution limits?",
      answer:
        "For 2024, the HSA contribution limit is $4,150 for self-only coverage and $8,300 for family coverage. Those age 55+ can contribute an additional $1,000 catch-up contribution. Employer contributions count toward these limits.",
    },
    {
      question: "Can I invest my HSA funds?",
      answer:
        "Yes, most HSA providers allow you to invest your balance in mutual funds, ETFs, and other securities once you reach a minimum cash balance (often $1,000-$2,000). Investing your HSA for long-term growth is one of the best tax-advantaged strategies available.",
    },
  ],
  formula:
    "HSA Value = Sum of (Monthly Contribution × (1 + r)^remaining months). Tax Savings = Contributions × Tax Rate + Growth × Tax Rate. FICA Savings = Contributions × 7.65%.",
};

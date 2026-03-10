import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baristaFireCalculator: CalculatorDefinition = {
  slug: "barista-fire-calculator",
  title: "BaristaFIRE Calculator",
  description:
    "Calculate how much to save for BaristaFIRE: combine part-time work income with portfolio withdrawals to retire early while working part-time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "BaristaFIRE calculator",
    "partial retirement",
    "part-time work retirement",
    "semi-retirement",
    "early semi-retirement",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate BaristaFIRE Portfolio",
      description: "Portfolio needed with part-time income",
      fields: [
        {
          name: "annualExpenses",
          label: "Annual Living Expenses",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
        {
          name: "partTimeIncome",
          label: "Part-Time Annual Income",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const expenses = parseFloat(inputs.annualExpenses as string) || 50000;
        const partTimeIncome = parseFloat(inputs.partTimeIncome as string) || 20000;

        const portfolioGap = expenses - partTimeIncome;
        const baristaPortfolio = portfolioGap * 25; // 4% rule
        const fullFireNumber = expenses * 25;
        const savings = fullFireNumber - baristaPortfolio;
        const percentSavings = (savings / fullFireNumber) * 100;

        return {
          primary: { label: "BaristaFIRE Portfolio Needed", value: `$${formatNumber(baristaPortfolio, 0)}` },
          details: [
            { label: "Annual expenses", value: `$${formatNumber(expenses, 0)}` },
            { label: "Part-time income", value: `$${formatNumber(partTimeIncome, 0)}` },
            { label: "Portfolio gap to cover", value: `$${formatNumber(portfolioGap, 0)}` },
            { label: "Portfolio needed (4% rule)", value: `$${formatNumber(baristaPortfolio, 0)}` },
            { label: "Full FIRE number", value: `$${formatNumber(fullFireNumber, 0)}` },
            { label: "You can save", value: `$${formatNumber(savings, 0)} (${formatNumber(percentSavings, 1)}%)` },
          ],
          note: "Part-time work covers gap and provides purpose/social engagement in retirement.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "coastfire-calculator"],
  faq: [
    {
      question: "Is BaristaFIRE true early retirement?",
      answer:
        "Not quite. You still work 10-20 hours/week (hence 'barista'). But you choose flexible, low-stress work. Provides income cushion and social connection.",
    },
    {
      question: "How much does part-time income help?",
      answer:
        "$20k part-time income = $500k less portfolio needed ($20k × 25). For someone targeting $1M FIRE, this reduces portfolio to $500k.",
    },
  ],
  formula: "BaristaFIRE Portfolio = (Annual Expenses - Part-Time Income) × 25",
};

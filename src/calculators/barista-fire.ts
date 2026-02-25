import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baristaFireCalculator: CalculatorDefinition = {
  slug: "barista-fire-calculator",
  title: "Barista FIRE Calculator",
  description:
    "Calculate your Barista FIRE number - retire from your career and work part-time to cover some expenses and get benefits while your portfolio grows.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Barista FIRE", "semi-retirement", "part-time retirement", "financial independence", "partial retirement"],
  variants: [
    {
      id: "baristaFireNumber",
      name: "Barista FIRE Number",
      fields: [
        { name: "annualExpenses", label: "Total Annual Expenses ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "partTimeIncome", label: "Expected Part-Time Annual Income ($)", type: "number", placeholder: "e.g. 20000" },
        { name: "healthBenefitValue", label: "Health Benefits Value from Part-Time Job ($)", type: "number", placeholder: "e.g. 6000" },
        { name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", placeholder: "e.g. 4" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 300000" },
      ],
      calculate: (inputs) => {
        const annualExpenses = inputs.annualExpenses as number;
        const partTimeIncome = inputs.partTimeIncome as number || 0;
        const healthBenefitValue = inputs.healthBenefitValue as number || 0;
        const withdrawalRate = (inputs.withdrawalRate as number) || 4;
        const currentSavings = inputs.currentSavings as number || 0;

        if (!annualExpenses) return null;

        const expensesCoveredByWork = partTimeIncome + healthBenefitValue;
        const expensesFromPortfolio = Math.max(annualExpenses - expensesCoveredByWork, 0);
        const baristaFireNumber = expensesFromPortfolio / (withdrawalRate / 100);
        const fullFireNumber = annualExpenses / (withdrawalRate / 100);
        const savings = fullFireNumber - baristaFireNumber;
        const progress = (currentSavings / baristaFireNumber) * 100;
        const isReady = currentSavings >= baristaFireNumber;

        return {
          primary: { label: "Barista FIRE Number", value: `$${formatNumber(baristaFireNumber, 0)}` },
          details: [
            { label: "Full FIRE Number (comparison)", value: `$${formatNumber(fullFireNumber, 0)}` },
            { label: "Savings vs Full FIRE", value: `$${formatNumber(savings, 0)}` },
            { label: "Expenses Covered by Part-Time Work", value: `$${formatNumber(expensesCoveredByWork, 0)}` },
            { label: "Current Progress", value: `${formatNumber(Math.min(progress, 100), 1)}%` },
            { label: "Status", value: isReady ? "Ready for Barista FIRE!" : `Need $${formatNumber(baristaFireNumber - currentSavings, 0)} more` },
          ],
        };
      },
    },
    {
      id: "timeline",
      name: "Barista FIRE Timeline",
      fields: [
        { name: "annualExpenses", label: "Total Annual Expenses ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "partTimeIncome", label: "Part-Time Annual Income ($)", type: "number", placeholder: "e.g. 20000" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 200000" },
        { name: "annualSavings", label: "Current Annual Savings ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 35" },
      ],
      calculate: (inputs) => {
        const annualExpenses = inputs.annualExpenses as number;
        const partTimeIncome = inputs.partTimeIncome as number || 0;
        const currentSavings = inputs.currentSavings as number || 0;
        const annualSavings = inputs.annualSavings as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const currentAge = inputs.currentAge as number;

        if (!annualExpenses || !annualSavings || !returnRate || !currentAge) return null;

        const portfolioNeed = Math.max(annualExpenses - partTimeIncome, 0) / 0.04;
        const fullFireTarget = annualExpenses / 0.04;

        let balance = currentSavings;
        let baristaYears = 0;
        while (balance < portfolioNeed && baristaYears < 100) {
          balance = (balance + annualSavings) * (1 + returnRate);
          baristaYears++;
        }

        balance = currentSavings;
        let fullFireYears = 0;
        while (balance < fullFireTarget && fullFireYears < 100) {
          balance = (balance + annualSavings) * (1 + returnRate);
          fullFireYears++;
        }

        const yearsSaved = fullFireYears - baristaYears;

        return {
          primary: { label: "Years to Barista FIRE", value: baristaYears < 100 ? `${baristaYears}` : "100+" },
          details: [
            { label: "Barista FIRE Age", value: baristaYears < 100 ? `${currentAge + baristaYears}` : "N/A" },
            { label: "Full FIRE Would Take", value: fullFireYears < 100 ? `${fullFireYears} years` : "100+" },
            { label: "Years Saved vs Full FIRE", value: `${yearsSaved}` },
            { label: "Barista FIRE Target", value: `$${formatNumber(portfolioNeed, 0)}` },
            { label: "Full FIRE Target", value: `$${formatNumber(fullFireTarget, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "coast-fire-calculator", "lean-fire-calculator", "retirement-income-calculator"],
  faq: [
    { question: "What is Barista FIRE?", answer: "Barista FIRE means having enough savings to partially retire, supplementing portfolio withdrawals with part-time work income. The name comes from the idea of working at a coffee shop for extra income and health benefits." },
    { question: "What are the benefits of Barista FIRE?", answer: "Barista FIRE allows you to leave a demanding career sooner, provides health insurance through an employer, gives social interaction, and reduces the portfolio size needed for full retirement." },
  ],
  formula: "Barista FIRE Number = (Annual Expenses − Part-Time Income) / Withdrawal Rate",
};

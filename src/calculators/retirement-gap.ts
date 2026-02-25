import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementGapCalculator: CalculatorDefinition = {
  slug: "retirement-gap-calculator",
  title: "Retirement Gap Calculator",
  description:
    "Identify the gap between your projected retirement income and expenses. Calculate how much more you need to save to close the retirement gap.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement gap", "income gap", "savings shortfall", "retirement planning", "income vs expenses"],
  variants: [
    {
      id: "gapAnalysis",
      name: "Gap Analysis",
      fields: [
        { name: "monthlyExpenses", label: "Expected Monthly Expenses in Retirement ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "socialSecurity", label: "Expected Monthly Social Security ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "pensionIncome", label: "Expected Monthly Pension ($)", type: "number", placeholder: "e.g. 0" },
        { name: "otherIncome", label: "Other Monthly Income ($)", type: "number", placeholder: "e.g. 500" },
        { name: "currentSavings", label: "Current Retirement Savings ($)", type: "number", placeholder: "e.g. 300000" },
        { name: "yearsToRetirement", label: "Years to Retirement", type: "number", placeholder: "e.g. 15" },
        { name: "yearsInRetirement", label: "Expected Years in Retirement", type: "number", placeholder: "e.g. 25" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const monthlyExpenses = inputs.monthlyExpenses as number;
        const socialSecurity = inputs.socialSecurity as number || 0;
        const pensionIncome = inputs.pensionIncome as number || 0;
        const otherIncome = inputs.otherIncome as number || 0;
        const currentSavings = inputs.currentSavings as number || 0;
        const yearsToRetirement = inputs.yearsToRetirement as number;
        const yearsInRetirement = inputs.yearsInRetirement as number;
        const returnRate = (inputs.returnRate as number) / 100;

        if (!monthlyExpenses || !yearsToRetirement || !yearsInRetirement) return null;

        const monthlyGuaranteedIncome = socialSecurity + pensionIncome + otherIncome;
        const monthlyGap = Math.max(monthlyExpenses - monthlyGuaranteedIncome, 0);
        const annualGap = monthlyGap * 12;

        const savingsNeeded = annualGap / 0.04;
        const futureValueOfCurrent = currentSavings * Math.pow(1 + returnRate, yearsToRetirement);
        const savingsShortfall = Math.max(savingsNeeded - futureValueOfCurrent, 0);

        // Calculate required additional monthly savings to close gap
        const monthlyRate = returnRate / 12;
        const totalMonths = yearsToRetirement * 12;
        let additionalMonthlySavings = 0;
        if (savingsShortfall > 0 && monthlyRate > 0) {
          additionalMonthlySavings = savingsShortfall * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }

        const gapPercent = monthlyExpenses > 0 ? (monthlyGap / monthlyExpenses) * 100 : 0;
        const coveragePercent = 100 - gapPercent;

        return {
          primary: { label: "Monthly Retirement Income Gap", value: `$${formatNumber(monthlyGap, 2)}` },
          details: [
            { label: "Income Coverage", value: `${formatNumber(coveragePercent, 1)}% of expenses covered` },
            { label: "Total Savings Needed", value: `$${formatNumber(savingsNeeded, 0)}` },
            { label: "Projected Savings at Retirement", value: `$${formatNumber(futureValueOfCurrent, 0)}` },
            { label: "Savings Shortfall", value: `$${formatNumber(savingsShortfall, 0)}` },
            { label: "Additional Monthly Savings Needed", value: `$${formatNumber(additionalMonthlySavings, 2)}` },
            { label: "Guaranteed Monthly Income", value: `$${formatNumber(monthlyGuaranteedIncome, 2)}` },
          ],
        };
      },
    },
    {
      id: "closingStrategies",
      name: "Gap Closing Strategies",
      fields: [
        { name: "annualGap", label: "Annual Retirement Income Gap ($)", type: "number", placeholder: "e.g. 24000" },
        { name: "yearsToRetirement", label: "Years to Retirement", type: "number", placeholder: "e.g. 15" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 6" },
        { name: "delayYears", label: "Possible Delay Retirement (years)", type: "number", placeholder: "e.g. 3" },
        { name: "expenseReduction", label: "Possible Expense Reduction (%)", type: "number", placeholder: "e.g. 15" },
        { name: "partTimeIncome", label: "Possible Part-Time Annual Income ($)", type: "number", placeholder: "e.g. 15000" },
      ],
      calculate: (inputs) => {
        const annualGap = inputs.annualGap as number;
        const yearsToRetirement = inputs.yearsToRetirement as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const delayYears = inputs.delayYears as number || 0;
        const expenseReduction = (inputs.expenseReduction as number) / 100 || 0;
        const partTimeIncome = inputs.partTimeIncome as number || 0;

        if (!annualGap || !yearsToRetirement || !returnRate) return null;

        const baseSavingsNeeded = annualGap / 0.04;

        // Strategy 1: Save more
        const monthlyRate = returnRate / 12;
        const totalMonths = yearsToRetirement * 12;
        const monthlySavingsNeeded = baseSavingsNeeded * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);

        // Strategy 2: Delay retirement
        const delayedMonths = (yearsToRetirement + delayYears) * 12;
        const monthlySavingsDelayed = baseSavingsNeeded * monthlyRate / (Math.pow(1 + monthlyRate, delayedMonths) - 1);

        // Strategy 3: Reduce expenses
        const reducedGap = annualGap * (1 - expenseReduction);
        const reducedSavingsNeeded = reducedGap / 0.04;
        const monthlySavingsReduced = reducedSavingsNeeded * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);

        // Strategy 4: Part-time work
        const gapAfterPartTime = Math.max(annualGap - partTimeIncome, 0);
        const savingsWithPartTime = gapAfterPartTime / 0.04;
        const monthlySavingsPartTime = savingsWithPartTime * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);

        return {
          primary: { label: "Base Monthly Savings Needed", value: `$${formatNumber(monthlySavingsNeeded, 2)}` },
          details: [
            { label: "Strategy: Save More", value: `$${formatNumber(monthlySavingsNeeded, 2)}/mo needed` },
            { label: `Strategy: Delay ${delayYears} Years`, value: `$${formatNumber(monthlySavingsDelayed, 2)}/mo needed` },
            { label: `Strategy: Cut Expenses ${formatNumber(expenseReduction * 100, 0)}%`, value: `$${formatNumber(monthlySavingsReduced, 2)}/mo needed` },
            { label: "Strategy: Part-Time Work", value: `$${formatNumber(monthlySavingsPartTime, 2)}/mo needed` },
            { label: "Total Savings Target", value: `$${formatNumber(baseSavingsNeeded, 0)}` },
            { label: "Reduced Target (cut expenses + part-time)", value: `$${formatNumber(Math.max((annualGap * (1 - expenseReduction) - partTimeIncome), 0) / 0.04, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["retirement-income-calculator", "retirement-savings-needed-calculator", "required-savings-rate-calculator", "fire-number-calculator"],
  faq: [
    { question: "What is a retirement gap?", answer: "A retirement gap is the difference between your expected retirement expenses and your projected retirement income from all sources (Social Security, pensions, investments). A gap means you'll need additional savings or income." },
    { question: "How can I close my retirement gap?", answer: "Common strategies include: saving more now, delaying retirement, reducing planned expenses, working part-time in retirement, downsizing your home, or adjusting your investment strategy for potentially higher returns." },
  ],
  formula: "Gap = Monthly Expenses − (Social Security + Pension + Other Income); Savings Needed = Annual Gap / Withdrawal Rate",
};

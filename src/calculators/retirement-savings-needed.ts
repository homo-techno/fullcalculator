import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementSavingsNeededCalculator: CalculatorDefinition = {
  slug: "retirement-savings-needed-calculator",
  title: "Retirement Savings Needed Calculator",
  description:
    "Calculate how much you need to save for retirement based on your desired lifestyle, expected expenses, and retirement age. Factor in inflation and Social Security.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement savings", "savings needed", "retirement target", "retirement planning", "nest egg"],
  variants: [
    {
      id: "savingsTarget",
      name: "Savings Target",
      fields: [
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 35" },
        { name: "retirementAge", label: "Retirement Age", type: "number", placeholder: "e.g. 65" },
        { name: "lifeExpectancy", label: "Life Expectancy", type: "number", placeholder: "e.g. 90" },
        { name: "desiredMonthlyIncome", label: "Desired Monthly Income in Retirement ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "expectedSS", label: "Expected Monthly Social Security ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "otherIncome", label: "Other Monthly Retirement Income ($)", type: "number", placeholder: "e.g. 500" },
        { name: "inflationRate", label: "Inflation Rate (%)", type: "number", placeholder: "e.g. 3" },
        { name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const retirementAge = inputs.retirementAge as number;
        const lifeExpectancy = inputs.lifeExpectancy as number;
        const desiredMonthlyIncome = inputs.desiredMonthlyIncome as number;
        const expectedSS = inputs.expectedSS as number || 0;
        const otherIncome = inputs.otherIncome as number || 0;
        const inflationRate = (inputs.inflationRate as number) / 100;
        const withdrawalRate = (inputs.withdrawalRate as number) || 4;

        if (!currentAge || !retirementAge || !lifeExpectancy || !desiredMonthlyIncome) return null;

        const yearsToRetirement = retirementAge - currentAge;
        const inflationMultiplier = Math.pow(1 + inflationRate, yearsToRetirement);
        const futureMonthlyNeed = desiredMonthlyIncome * inflationMultiplier;
        const futureMonthlyGap = futureMonthlyNeed - (expectedSS + otherIncome) * inflationMultiplier;
        const annualGap = Math.max(futureMonthlyGap * 12, 0);
        const savingsNeeded = annualGap / (withdrawalRate / 100);
        const retirementYears = lifeExpectancy - retirementAge;
        const totalNeededInRetirement = annualGap * retirementYears;

        return {
          primary: { label: "Retirement Savings Needed", value: `$${formatNumber(savingsNeeded, 0)}` },
          details: [
            { label: "Future Monthly Income Need (inflation-adjusted)", value: `$${formatNumber(futureMonthlyNeed, 2)}` },
            { label: "Monthly Gap from Portfolio", value: `$${formatNumber(Math.max(futureMonthlyGap, 0), 2)}` },
            { label: "Years Until Retirement", value: `${yearsToRetirement}` },
            { label: "Retirement Duration", value: `${retirementYears} years` },
            { label: "Total Spending in Retirement (est.)", value: `$${formatNumber(totalNeededInRetirement, 0)}` },
          ],
        };
      },
    },
    {
      id: "monthlySavings",
      name: "Required Monthly Savings",
      fields: [
        { name: "savingsTarget", label: "Savings Target ($)", type: "number", placeholder: "e.g. 1500000" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "yearsToRetirement", label: "Years to Retirement", type: "number", placeholder: "e.g. 30" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const savingsTarget = inputs.savingsTarget as number;
        const currentSavings = inputs.currentSavings as number || 0;
        const yearsToRetirement = inputs.yearsToRetirement as number;
        const returnRate = (inputs.returnRate as number) / 100;

        if (!savingsTarget || !yearsToRetirement || !returnRate) return null;

        const futureValueOfCurrent = currentSavings * Math.pow(1 + returnRate, yearsToRetirement);
        const remainingGap = Math.max(savingsTarget - futureValueOfCurrent, 0);
        const monthlyRate = returnRate / 12;
        const totalMonths = yearsToRetirement * 12;
        const monthlySavings = remainingGap > 0
          ? (remainingGap * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
          : 0;
        const annualSavings = monthlySavings * 12;
        const totalContributions = monthlySavings * totalMonths;

        return {
          primary: { label: "Required Monthly Savings", value: `$${formatNumber(monthlySavings, 2)}` },
          details: [
            { label: "Required Annual Savings", value: `$${formatNumber(annualSavings, 2)}` },
            { label: "Future Value of Current Savings", value: `$${formatNumber(futureValueOfCurrent, 0)}` },
            { label: "Remaining Gap to Fill", value: `$${formatNumber(remainingGap, 0)}` },
            { label: "Total New Contributions Needed", value: `$${formatNumber(totalContributions, 0)}` },
            { label: "Investment Growth on New Savings", value: `$${formatNumber(remainingGap - totalContributions, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "retirement-income-calculator", "fire-number-calculator", "required-savings-rate-calculator"],
  faq: [
    { question: "How much should I save for retirement?", answer: "A common guideline is to save 10-15% of your pre-tax income for retirement. However, the exact amount depends on your desired lifestyle, expected Social Security benefits, and other income sources." },
    { question: "What is the retirement savings multiplier?", answer: "Fidelity suggests saving 1x your salary by 30, 3x by 40, 6x by 50, 8x by 60, and 10x by 67. These are general guidelines and your needs may differ." },
  ],
  formula: "Savings Needed = (Annual Income Gap in Retirement) / Withdrawal Rate",
};

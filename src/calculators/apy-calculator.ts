import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const apyCalculator: CalculatorDefinition = {
  slug: "apy-calculator",
  title: "APY Calculator",
  description: "Free online APY (Annual Percentage Yield) calculator. Calculate true annual returns on savings and investments accounting for compounding frequency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["APY", "annual percentage yield", "APY calculator", "savings rate", "interest rate", "compound interest", "yield calculator"],
  variants: [
    {
      id: "calculate-apy",
      name: "Calculate APY from Interest Rate",
      fields: [
        {
          name: "interestRate",
          label: "Stated Interest Rate (%)",
          type: "number",
          placeholder: "e.g. 5.0",
          min: 0,
        },
        {
          name: "compounding",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Daily (365x/year)", value: "365" },
            { label: "Monthly (12x/year)", value: "12" },
            { label: "Quarterly (4x/year)", value: "4" },
            { label: "Semi-Annually (2x/year)", value: "2" },
            { label: "Annually (1x/year)", value: "1" },
          ],
        },
        {
          name: "depositAmount",
          label: "Deposit Amount ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const rate = parseFloat(inputs.interestRate as string) || 0;
        const n = parseFloat(inputs.compounding as string) || 365;
        const deposit = parseFloat(inputs.depositAmount as string) || 0;

        const r = rate / 100;
        const apy = (Math.pow(1 + r / n, n) - 1) * 100;

        const simpleInterest = deposit * r;
        const compoundInterest = deposit * (apy / 100);
        const extraFromCompounding = compoundInterest - simpleInterest;

        const monthlyEarnings = compoundInterest / 12;
        const dailyEarnings = compoundInterest / 365;

        return {
          primary: { label: "Annual Percentage Yield (APY)", value: formatNumber(apy, 4) + "%" },
          details: [
            { label: "Stated Interest Rate", value: formatNumber(rate, 2) + "%" },
            { label: "APY Advantage over Simple", value: formatNumber(apy - rate, 4) + "%" },
            { label: "Annual Earnings (Simple)", value: "$" + formatNumber(simpleInterest) },
            { label: "Annual Earnings (Compound)", value: "$" + formatNumber(compoundInterest) },
            { label: "Extra from Compounding", value: "$" + formatNumber(extraFromCompounding) },
            { label: "Monthly Earnings", value: "$" + formatNumber(monthlyEarnings) },
            { label: "Daily Earnings", value: "$" + formatNumber(dailyEarnings) },
          ],
        };
      },
    },
    {
      id: "compare-apy",
      name: "Compare Two APYs",
      fields: [
        {
          name: "apy1",
          label: "Account 1 APY (%)",
          type: "number",
          placeholder: "e.g. 4.5",
          min: 0,
        },
        {
          name: "apy2",
          label: "Account 2 APY (%)",
          type: "number",
          placeholder: "e.g. 5.0",
          min: 0,
        },
        {
          name: "deposit",
          label: "Deposit Amount ($)",
          type: "number",
          placeholder: "e.g. 50000",
          min: 0,
        },
        {
          name: "years",
          label: "Comparison Period (years)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 30,
        },
      ],
      calculate: (inputs) => {
        const apy1 = parseFloat(inputs.apy1 as string) || 0;
        const apy2 = parseFloat(inputs.apy2 as string) || 0;
        const deposit = parseFloat(inputs.deposit as string) || 0;
        const years = parseFloat(inputs.years as string) || 5;

        const balance1 = deposit * Math.pow(1 + apy1 / 100, years);
        const balance2 = deposit * Math.pow(1 + apy2 / 100, years);
        const interest1 = balance1 - deposit;
        const interest2 = balance2 - deposit;
        const difference = Math.abs(balance2 - balance1);
        const betterAccount = apy2 > apy1 ? "Account 2" : apy1 > apy2 ? "Account 1" : "Equal";

        return {
          primary: { label: "Difference Over " + years + " Years", value: "$" + formatNumber(difference) },
          details: [
            { label: "Account 1 (" + formatNumber(apy1, 2) + "% APY)", value: "$" + formatNumber(balance1) },
            { label: "Account 1 Interest", value: "$" + formatNumber(interest1) },
            { label: "Account 2 (" + formatNumber(apy2, 2) + "% APY)", value: "$" + formatNumber(balance2) },
            { label: "Account 2 Interest", value: "$" + formatNumber(interest2) },
            { label: "Better Option", value: betterAccount },
            { label: "Annual Difference", value: "$" + formatNumber(difference / years) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["effective-interest-rate", "cd-calculator", "money-market-calc"],
  faq: [
    {
      question: "What is APY?",
      answer: "APY (Annual Percentage Yield) is the effective annual rate of return on a deposit or investment, taking into account compound interest. It represents the actual amount of interest you earn or pay over a year, including the effect of compounding.",
    },
    {
      question: "Why does compounding frequency matter?",
      answer: "More frequent compounding means interest is calculated and added to the balance more often, resulting in interest being earned on interest sooner. Daily compounding yields more than monthly, which yields more than quarterly, etc.",
    },
    {
      question: "What is a good APY for a savings account?",
      answer: "APY rates vary with market conditions. High-yield savings accounts and money market accounts typically offer competitive rates. As of recent years, rates above 4% are considered strong. Always compare rates across multiple institutions.",
    },
  ],
  formula: "APY = (1 + r/n)^n - 1\nwhere r = stated annual rate, n = compounding periods per year",
};

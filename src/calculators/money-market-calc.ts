import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const moneyMarketCalc: CalculatorDefinition = {
  slug: "money-market-calc",
  title: "Money Market Account Calculator",
  description: "Free online money market account calculator. Compare money market accounts with savings accounts and calculate projected earnings with monthly deposits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["money market", "money market account", "MMA calculator", "high yield savings", "money market rate", "savings comparison", "money market fund"],
  variants: [
    {
      id: "mma-earnings",
      name: "Money Market Earnings",
      fields: [
        {
          name: "initialDeposit",
          label: "Initial Deposit ($)",
          type: "number",
          placeholder: "e.g. 25000",
          min: 0,
        },
        {
          name: "monthlyDeposit",
          label: "Monthly Deposit ($)",
          type: "number",
          placeholder: "e.g. 500",
          min: 0,
        },
        {
          name: "apy",
          label: "Money Market APY (%)",
          type: "number",
          placeholder: "e.g. 4.5",
          min: 0,
        },
        {
          name: "months",
          label: "Investment Period (months)",
          type: "number",
          placeholder: "e.g. 24",
          min: 1,
          max: 360,
        },
        {
          name: "minimumBalance",
          label: "Minimum Balance Required ($)",
          type: "number",
          placeholder: "e.g. 2500",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const initial = parseFloat(inputs.initialDeposit as string) || 0;
        const monthly = parseFloat(inputs.monthlyDeposit as string) || 0;
        const apy = parseFloat(inputs.apy as string) || 0;
        const months = parseFloat(inputs.months as string) || 24;
        const minBalance = parseFloat(inputs.minimumBalance as string) || 0;

        const monthlyRate = Math.pow(1 + apy / 100, 1 / 12) - 1;
        let balance = initial;
        let totalDeposited = initial;
        let totalInterest = 0;

        for (let m = 0; m < months; m++) {
          const interest = balance * monthlyRate;
          totalInterest += interest;
          balance += interest + monthly;
          totalDeposited += monthly;
        }

        const meetsMinimum = balance >= minBalance;
        const monthlyIncome = totalInterest / months;
        const effectiveReturn = totalDeposited > 0 ? (totalInterest / totalDeposited) * 100 : 0;

        return {
          primary: { label: "Final Balance", value: "$" + formatNumber(balance) },
          details: [
            { label: "Total Deposited", value: "$" + formatNumber(totalDeposited) },
            { label: "Total Interest Earned", value: "$" + formatNumber(totalInterest) },
            { label: "Average Monthly Interest", value: "$" + formatNumber(monthlyIncome) },
            { label: "APY", value: formatNumber(apy, 2) + "%" },
            { label: "Effective Return on Deposits", value: formatNumber(effectiveReturn, 2) + "%" },
            { label: "Meets Minimum Balance", value: meetsMinimum ? "Yes" : "No - May incur fees" },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare MMA vs Savings",
      fields: [
        {
          name: "amount",
          label: "Amount to Deposit ($)",
          type: "number",
          placeholder: "e.g. 20000",
          min: 0,
        },
        {
          name: "mmaAPY",
          label: "Money Market APY (%)",
          type: "number",
          placeholder: "e.g. 4.5",
          min: 0,
        },
        {
          name: "savingsAPY",
          label: "Savings Account APY (%)",
          type: "number",
          placeholder: "e.g. 0.5",
          min: 0,
        },
        {
          name: "years",
          label: "Comparison Period (years)",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 30,
        },
      ],
      calculate: (inputs) => {
        const amount = parseFloat(inputs.amount as string) || 0;
        const mmaAPY = parseFloat(inputs.mmaAPY as string) || 0;
        const savingsAPY = parseFloat(inputs.savingsAPY as string) || 0;
        const years = parseFloat(inputs.years as string) || 3;

        const mmaFuture = amount * Math.pow(1 + mmaAPY / 100, years);
        const savingsFuture = amount * Math.pow(1 + savingsAPY / 100, years);
        const mmaInterest = mmaFuture - amount;
        const savingsInterest = savingsFuture - amount;
        const difference = mmaInterest - savingsInterest;
        const monthlyDifference = difference / (years * 12);

        return {
          primary: { label: "Extra Earnings with Money Market", value: "$" + formatNumber(difference) },
          details: [
            { label: "Money Market Balance", value: "$" + formatNumber(mmaFuture) },
            { label: "Money Market Interest", value: "$" + formatNumber(mmaInterest) },
            { label: "Savings Account Balance", value: "$" + formatNumber(savingsFuture) },
            { label: "Savings Account Interest", value: "$" + formatNumber(savingsInterest) },
            { label: "Extra Monthly Earnings", value: "$" + formatNumber(monthlyDifference) },
            { label: "Rate Advantage", value: formatNumber(mmaAPY - savingsAPY, 2) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["apy-calculator", "cd-calculator", "effective-interest-rate"],
  faq: [
    {
      question: "What is a money market account?",
      answer: "A money market account (MMA) is a type of deposit account that typically offers higher interest rates than regular savings accounts. They usually require a higher minimum balance and may offer limited check-writing and debit card access. MMAs are FDIC insured up to $250,000.",
    },
    {
      question: "How does a money market account differ from a money market fund?",
      answer: "A money market account is a bank deposit product (FDIC insured). A money market fund is a mutual fund that invests in short-term debt securities (not FDIC insured but regulated by the SEC). Money market funds may offer slightly higher yields but carry slightly more risk.",
    },
    {
      question: "What is the minimum balance for a money market account?",
      answer: "Minimum balances vary by institution, typically ranging from $1,000 to $25,000. Some banks waive minimums or fees for higher balances. Falling below the minimum may result in monthly maintenance fees or a lower interest rate.",
    },
  ],
  formula: "Balance = Initial x (1 + monthly rate)^months + Monthly Deposit x [((1 + monthly rate)^months - 1) / monthly rate]",
};

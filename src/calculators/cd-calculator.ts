import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cdCalculator: CalculatorDefinition = {
  slug: "cd-calculator",
  title: "Certificate of Deposit (CD) Calculator",
  description: "Free online CD calculator. Calculate earnings on certificates of deposit with various terms, rates, and compounding frequencies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["CD calculator", "certificate of deposit", "CD rate", "CD interest", "CD earnings", "savings calculator", "fixed deposit"],
  variants: [
    {
      id: "cd-earnings",
      name: "Calculate CD Earnings",
      fields: [
        {
          name: "deposit",
          label: "Initial Deposit ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "apy",
          label: "APY (%)",
          type: "number",
          placeholder: "e.g. 5.0",
          min: 0,
        },
        {
          name: "termMonths",
          label: "CD Term",
          type: "select",
          options: [
            { label: "3 Months", value: "3" },
            { label: "6 Months", value: "6" },
            { label: "9 Months", value: "9" },
            { label: "12 Months (1 Year)", value: "12" },
            { label: "18 Months", value: "18" },
            { label: "24 Months (2 Years)", value: "24" },
            { label: "36 Months (3 Years)", value: "36" },
            { label: "48 Months (4 Years)", value: "48" },
            { label: "60 Months (5 Years)", value: "60" },
          ],
        },
        {
          name: "compounding",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Daily", value: "365" },
            { label: "Monthly", value: "12" },
            { label: "Quarterly", value: "4" },
            { label: "Semi-Annually", value: "2" },
            { label: "Annually", value: "1" },
          ],
        },
        {
          name: "taxRate",
          label: "Marginal Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 24",
          min: 0,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const deposit = parseFloat(inputs.deposit as string) || 0;
        const apy = parseFloat(inputs.apy as string) || 0;
        const termMonths = parseFloat(inputs.termMonths as string) || 12;
        const compounding = parseFloat(inputs.compounding as string) || 365;
        const taxRate = parseFloat(inputs.taxRate as string) || 0;

        const years = termMonths / 12;

        // Convert APY to APR for compounding calculation
        const apr = compounding * (Math.pow(1 + apy / 100, 1 / compounding) - 1);
        const periodsTotal = compounding * years;
        const maturityValue = deposit * Math.pow(1 + apr / compounding, periodsTotal);
        const interestEarned = maturityValue - deposit;

        const taxOnInterest = interestEarned * (taxRate / 100);
        const afterTaxEarnings = interestEarned - taxOnInterest;
        const afterTaxTotal = deposit + afterTaxEarnings;

        // Early withdrawal penalty (typically 3-6 months interest)
        const penaltyMonths = termMonths <= 12 ? 3 : termMonths <= 36 ? 6 : 12;
        const monthlyInterest = interestEarned / termMonths;
        const earlyWithdrawalPenalty = monthlyInterest * penaltyMonths;

        return {
          primary: { label: "Value at Maturity", value: "$" + formatNumber(maturityValue) },
          details: [
            { label: "Initial Deposit", value: "$" + formatNumber(deposit) },
            { label: "Interest Earned", value: "$" + formatNumber(interestEarned) },
            { label: "APY", value: formatNumber(apy, 2) + "%" },
            { label: "CD Term", value: formatNumber(termMonths, 0) + " months" },
            { label: "Tax on Interest (" + taxRate + "%)", value: "$" + formatNumber(taxOnInterest) },
            { label: "After-Tax Earnings", value: "$" + formatNumber(afterTaxEarnings) },
            { label: "After-Tax Total", value: "$" + formatNumber(afterTaxTotal) },
            { label: "Early Withdrawal Penalty (est.)", value: "$" + formatNumber(earlyWithdrawalPenalty) },
          ],
        };
      },
    },
    {
      id: "cd-ladder",
      name: "CD Ladder Strategy",
      fields: [
        {
          name: "totalAmount",
          label: "Total Amount to Invest ($)",
          type: "number",
          placeholder: "e.g. 50000",
          min: 0,
        },
        {
          name: "numberOfCDs",
          label: "Number of CDs in Ladder",
          type: "select",
          options: [
            { label: "3 CDs", value: "3" },
            { label: "4 CDs", value: "4" },
            { label: "5 CDs", value: "5" },
          ],
        },
        {
          name: "shortTermAPY",
          label: "Short-Term CD APY (%)",
          type: "number",
          placeholder: "e.g. 4.5",
          min: 0,
        },
        {
          name: "longTermAPY",
          label: "Long-Term CD APY (%)",
          type: "number",
          placeholder: "e.g. 5.0",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const total = parseFloat(inputs.totalAmount as string) || 0;
        const numCDs = parseFloat(inputs.numberOfCDs as string) || 5;
        const shortAPY = parseFloat(inputs.shortTermAPY as string) || 0;
        const longAPY = parseFloat(inputs.longTermAPY as string) || 0;

        const perCD = total / numCDs;
        let totalValue = 0;
        let totalInterest = 0;

        // Each CD has a different term: 1yr, 2yr, 3yr, etc.
        for (let i = 1; i <= numCDs; i++) {
          const rate = shortAPY + ((longAPY - shortAPY) * (i - 1)) / (numCDs - 1 || 1);
          const value = perCD * Math.pow(1 + rate / 100, i);
          totalValue += value;
          totalInterest += value - perCD;
        }

        const blendedAPY = total > 0 ? (totalInterest / total) / (numCDs / 2) * 100 : 0;
        const avgMaturity = (numCDs + 1) / 2;

        return {
          primary: { label: "Total Ladder Value", value: "$" + formatNumber(totalValue) },
          details: [
            { label: "Amount Per CD", value: "$" + formatNumber(perCD) },
            { label: "Number of CDs", value: formatNumber(numCDs, 0) },
            { label: "Total Interest Earned", value: "$" + formatNumber(totalInterest) },
            { label: "Blended APY (est.)", value: formatNumber(blendedAPY, 2) + "%" },
            { label: "Average Maturity", value: formatNumber(avgMaturity, 1) + " years" },
          ],
          note: "A CD ladder provides regular access to funds as CDs mature at staggered intervals, while still earning higher long-term rates.",
        };
      },
    },
  ],
  relatedSlugs: ["apy-calculator", "money-market-calc", "effective-interest-rate"],
  faq: [
    {
      question: "What is a Certificate of Deposit (CD)?",
      answer: "A CD is a savings product offered by banks where you deposit money for a fixed term (3 months to 5+ years) at a guaranteed interest rate. CDs typically offer higher rates than savings accounts in exchange for locking up your money for the term.",
    },
    {
      question: "What is a CD ladder?",
      answer: "A CD ladder involves splitting your investment across multiple CDs with staggered maturity dates. For example, investing equal amounts in 1, 2, 3, 4, and 5-year CDs. This provides regular access to funds while earning higher long-term rates.",
    },
    {
      question: "What happens if I withdraw a CD early?",
      answer: "Early withdrawal from a CD typically incurs a penalty of 3-12 months of interest, depending on the CD term and bank. Some banks offer no-penalty CDs with slightly lower rates. The penalty can eat into your principal if you withdraw very early.",
    },
  ],
  formula: "Maturity Value = Deposit x (1 + APR/n)^(n x t)\nwhere n = compounding frequency, t = years",
};

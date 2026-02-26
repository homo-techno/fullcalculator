import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lotteryTaxCalculator: CalculatorDefinition = {
  slug: "lottery-tax-calculator",
  title: "Lottery Tax Calculator",
  description:
    "Free online lottery tax calculator. Estimate federal and state taxes on lottery winnings, compare lump sum vs annuity, and see your take-home prize amount.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "lottery tax calculator",
    "lottery winnings calculator",
    "lottery payout calculator",
    "lump sum vs annuity",
    "lottery after tax calculator",
  ],
  variants: [
    {
      id: "lump-sum",
      name: "Lump Sum Payout",
      description: "Calculate taxes on a lottery lump sum payout",
      fields: [
        { name: "jackpot", label: "Advertised Jackpot", type: "number", placeholder: "e.g. 500000000", prefix: "$" },
        { name: "lumpSumPercent", label: "Lump Sum % of Jackpot", type: "number", placeholder: "e.g. 60", suffix: "%", defaultValue: 60 },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
          defaultValue: "single",
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate",
          type: "select",
          options: [
            { label: "0% (TX, FL, WA, etc.)", value: "0" },
            { label: "3%", value: "3" },
            { label: "5%", value: "5" },
            { label: "6%", value: "6" },
            { label: "7%", value: "7" },
            { label: "8%", value: "8" },
            { label: "9%", value: "9" },
            { label: "10%+", value: "10" },
            { label: "13.3% (California)", value: "13.3" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const jackpot = parseFloat(inputs.jackpot as string) || 0;
        const lumpPct = parseFloat(inputs.lumpSumPercent as string) || 60;
        const stateTax = parseFloat(inputs.stateTaxRate as string) || 0;
        if (!jackpot) return null;

        const lumpSum = jackpot * (lumpPct / 100);

        // Federal tax: 37% top bracket for high earners
        const federalRate = 37;
        const federalTax = lumpSum * (federalRate / 100);
        const stateTaxAmt = lumpSum * (stateTax / 100);
        const totalTax = federalTax + stateTaxAmt;
        const takeHome = lumpSum - totalTax;
        const effectiveRate = (totalTax / lumpSum) * 100;

        return {
          primary: { label: "Take-Home (Lump Sum)", value: `$${formatNumber(takeHome)}` },
          details: [
            { label: "Advertised jackpot", value: `$${formatNumber(jackpot)}` },
            { label: "Lump sum payout", value: `$${formatNumber(lumpSum)}` },
            { label: "Federal tax (37%)", value: `$${formatNumber(federalTax)}` },
            { label: "State tax", value: `$${formatNumber(stateTaxAmt)} (${formatNumber(stateTax)}%)` },
            { label: "Total taxes", value: `$${formatNumber(totalTax)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate)}%` },
          ],
          note: "Federal tax calculated at the top marginal rate of 37%. Actual taxes may differ based on deductions and other income.",
        };
      },
    },
    {
      id: "annuity",
      name: "Annuity vs Lump Sum",
      description: "Compare annuity payments to lump sum after taxes",
      fields: [
        { name: "jackpot", label: "Advertised Jackpot", type: "number", placeholder: "e.g. 500000000", prefix: "$" },
        { name: "lumpSumPercent", label: "Lump Sum % of Jackpot", type: "number", placeholder: "e.g. 60", suffix: "%", defaultValue: 60 },
        { name: "annuityYears", label: "Annuity Period (years)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "stateTaxRate", label: "State Tax Rate %", type: "number", placeholder: "e.g. 5", suffix: "%" },
      ],
      calculate: (inputs) => {
        const jackpot = parseFloat(inputs.jackpot as string) || 0;
        const lumpPct = parseFloat(inputs.lumpSumPercent as string) || 60;
        const annuityYrs = parseFloat(inputs.annuityYears as string) || 30;
        const stateTax = parseFloat(inputs.stateTaxRate as string) || 0;
        if (!jackpot) return null;

        const federalRate = 37;
        const totalRate = federalRate + stateTax;

        // Lump sum
        const lumpSum = jackpot * (lumpPct / 100);
        const lumpTax = lumpSum * (totalRate / 100);
        const lumpTakeHome = lumpSum - lumpTax;

        // Annuity
        const annualPayment = jackpot / annuityYrs;
        const annualTax = annualPayment * (totalRate / 100);
        const annualTakeHome = annualPayment - annualTax;
        const totalAnnuityTakeHome = annualTakeHome * annuityYrs;

        return {
          primary: { label: "Annuity Annual Take-Home", value: `$${formatNumber(annualTakeHome)}` },
          details: [
            { label: "Annuity gross/year", value: `$${formatNumber(annualPayment)}` },
            { label: "Annuity total take-home", value: `$${formatNumber(totalAnnuityTakeHome)}` },
            { label: "Lump sum take-home", value: `$${formatNumber(lumpTakeHome)}` },
            { label: "Annuity advantage", value: `$${formatNumber(totalAnnuityTakeHome - lumpTakeHome)}` },
            { label: "Annuity period", value: `${formatNumber(annuityYrs)} years` },
          ],
          note: "The annuity provides more total money but over many years. The lump sum gives immediate access. Consider investment returns on the lump sum when deciding.",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "paycheck-calculator", "investment-calculator"],
  faq: [
    {
      question: "How much tax do you pay on lottery winnings?",
      answer:
        "Federal tax on lottery winnings is 24% withheld at the time of payment, but the actual rate is 37% for large jackpots (top tax bracket). State taxes range from 0% (in states like Texas and Florida) to over 13% (California). You may owe additional tax when filing your return.",
    },
    {
      question: "Should I take the lump sum or annuity?",
      answer:
        "The annuity pays more total money over time but locks it up for 20-30 years. The lump sum gives you less but immediately, allowing you to invest. Most financial advisors suggest the lump sum if you can invest wisely, but the annuity provides protection against overspending.",
    },
  ],
  formula: "Take-Home = Payout - (Payout x Federal Rate) - (Payout x State Rate)",
};

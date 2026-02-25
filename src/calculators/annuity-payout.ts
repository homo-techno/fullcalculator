import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annuityPayoutCalculator: CalculatorDefinition = {
  slug: "annuity-payout-calculator",
  title: "Annuity Payout Calculator",
  description:
    "Calculate your annuity payout amounts based on investment, interest rate, and payout period. Compare immediate vs deferred annuity options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["annuity payout", "annuity income", "immediate annuity", "deferred annuity", "annuitization"],
  variants: [
    {
      id: "payoutCalculation",
      name: "Payout Calculation",
      fields: [
        { name: "principal", label: "Annuity Principal ($)", type: "number", placeholder: "e.g. 300000" },
        { name: "interestRate", label: "Annual Interest Rate (%)", type: "number", placeholder: "e.g. 5" },
        { name: "payoutYears", label: "Payout Period (years)", type: "number", placeholder: "e.g. 20" },
        { name: "payoutFrequency", label: "Payout Frequency (1=Monthly, 4=Quarterly, 12=Annual)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const principal = inputs.principal as number;
        const interestRate = (inputs.interestRate as number) / 100;
        const payoutYears = inputs.payoutYears as number;
        const payoutFrequency = inputs.payoutFrequency as number || 1;

        if (!principal || !interestRate || !payoutYears) return null;

        const periodsPerYear = payoutFrequency === 1 ? 12 : payoutFrequency === 4 ? 4 : 1;
        const totalPeriods = payoutYears * periodsPerYear;
        const periodRate = interestRate / periodsPerYear;

        const payoutAmount = principal * (periodRate * Math.pow(1 + periodRate, totalPeriods)) /
          (Math.pow(1 + periodRate, totalPeriods) - 1);

        const totalPayouts = payoutAmount * totalPeriods;
        const totalInterest = totalPayouts - principal;
        const monthlyEquivalent = payoutFrequency === 1 ? payoutAmount : payoutAmount / (12 / periodsPerYear);

        return {
          primary: { label: `${payoutFrequency === 1 ? "Monthly" : payoutFrequency === 4 ? "Quarterly" : "Annual"} Payout`, value: `$${formatNumber(payoutAmount, 2)}` },
          details: [
            { label: "Monthly Equivalent", value: `$${formatNumber(monthlyEquivalent, 2)}` },
            { label: "Annual Income", value: `$${formatNumber(payoutAmount * periodsPerYear, 2)}` },
            { label: "Total Payouts", value: `$${formatNumber(totalPayouts, 0)}` },
            { label: "Total Interest Earned", value: `$${formatNumber(totalInterest, 0)}` },
            { label: "Principal Invested", value: `$${formatNumber(principal, 0)}` },
          ],
        };
      },
    },
    {
      id: "deferredAnnuity",
      name: "Deferred Annuity",
      fields: [
        { name: "principal", label: "Initial Investment ($)", type: "number", placeholder: "e.g. 200000" },
        { name: "deferralYears", label: "Deferral Period (years)", type: "number", placeholder: "e.g. 10" },
        { name: "growthRate", label: "Growth Rate During Deferral (%)", type: "number", placeholder: "e.g. 5" },
        { name: "payoutRate", label: "Payout Rate (%)", type: "number", placeholder: "e.g. 5" },
        { name: "payoutYears", label: "Payout Period (years)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const principal = inputs.principal as number;
        const deferralYears = inputs.deferralYears as number;
        const growthRate = (inputs.growthRate as number) / 100;
        const payoutRate = (inputs.payoutRate as number) / 100;
        const payoutYears = inputs.payoutYears as number;

        if (!principal || !deferralYears || !growthRate || !payoutRate || !payoutYears) return null;

        const accumulatedValue = principal * Math.pow(1 + growthRate, deferralYears);
        const monthlyRate = payoutRate / 12;
        const totalMonths = payoutYears * 12;
        const monthlyPayout = accumulatedValue * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const totalPayouts = monthlyPayout * totalMonths;
        const growthDuringDeferral = accumulatedValue - principal;

        return {
          primary: { label: "Monthly Payout After Deferral", value: `$${formatNumber(monthlyPayout, 2)}` },
          details: [
            { label: "Accumulated Value at Payout Start", value: `$${formatNumber(accumulatedValue, 0)}` },
            { label: "Growth During Deferral", value: `$${formatNumber(growthDuringDeferral, 0)}` },
            { label: "Annual Payout", value: `$${formatNumber(monthlyPayout * 12, 2)}` },
            { label: "Total Lifetime Payouts", value: `$${formatNumber(totalPayouts, 0)}` },
            { label: "Total Return on Investment", value: `$${formatNumber(totalPayouts - principal, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["annuity-calculator", "pension-vs-lump-sum-calculator", "retirement-income-calculator", "rmd-calculator"],
  faq: [
    { question: "How are annuity payouts calculated?", answer: "Annuity payouts are calculated using the present value of an annuity formula, considering the principal amount, interest rate, and payout period. Higher rates and shorter periods produce larger payments." },
    { question: "What is a deferred annuity?", answer: "A deferred annuity accumulates value over a set period before payouts begin. The deferral period allows your investment to grow tax-deferred, resulting in larger payouts compared to an immediate annuity with the same initial investment." },
  ],
  formula: "Payout = Principal × [r(1+r)^n / ((1+r)^n − 1)], where r = periodic rate, n = total periods",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const armCalculator: CalculatorDefinition = {
  slug: "arm-calculator",
  title: "ARM (Adjustable Rate Mortgage) Calculator",
  description:
    "Free ARM calculator. Compare adjustable-rate mortgage payments during the fixed period and after adjustment. See worst-case scenarios and compare ARM vs. fixed-rate mortgages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ARM calculator",
    "adjustable rate mortgage calculator",
    "ARM vs fixed mortgage",
    "5/1 ARM calculator",
    "adjustable mortgage calculator",
  ],
  variants: [
    {
      id: "arm-analysis",
      name: "ARM Payment Analysis",
      description: "Calculate ARM payments during fixed and adjustable periods",
      fields: [
        { name: "loanAmount", label: "Loan Amount", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "initialRate", label: "Initial (Teaser) Rate", type: "number", placeholder: "e.g. 5.5", suffix: "%", min: 0, max: 20, step: 0.01 },
        {
          name: "armType",
          label: "ARM Type",
          type: "select",
          options: [
            { label: "3/1 ARM (3-year fixed)", value: "3" },
            { label: "5/1 ARM (5-year fixed)", value: "5" },
            { label: "7/1 ARM (7-year fixed)", value: "7" },
            { label: "10/1 ARM (10-year fixed)", value: "10" },
          ],
          defaultValue: "5",
        },
        { name: "expectedRate", label: "Expected Rate After Adjustment", type: "number", placeholder: "e.g. 7.5", suffix: "%", min: 0, max: 20, step: 0.01 },
        { name: "rateCap", label: "Lifetime Rate Cap", type: "number", placeholder: "e.g. 5", suffix: "%", min: 0, max: 10, step: 0.1, defaultValue: 5 },
        {
          name: "term",
          label: "Total Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const initialRate = inputs.initialRate as number;
        const fixedYears = parseInt(inputs.armType as string) || 5;
        const expectedRate = inputs.expectedRate as number;
        const lifetimeCap = (inputs.rateCap as number) || 5;
        const totalYears = parseInt(inputs.term as string) || 30;
        if (!loan || !initialRate || !expectedRate) return null;

        const totalMonths = totalYears * 12;
        const fixedMonths = fixedYears * 12;
        const remainingMonths = totalMonths - fixedMonths;

        // Initial payment (full term amortization at initial rate)
        const r1 = initialRate / 100 / 12;
        const initialPayment = (loan * (r1 * Math.pow(1 + r1, totalMonths))) / (Math.pow(1 + r1, totalMonths) - 1);

        // Balance remaining after fixed period
        let balance = loan;
        for (let i = 0; i < fixedMonths; i++) {
          const interest = balance * r1;
          const principal = initialPayment - interest;
          balance -= principal;
        }

        // Adjusted payment on remaining balance
        const r2 = expectedRate / 100 / 12;
        const adjustedPayment = (balance * (r2 * Math.pow(1 + r2, remainingMonths))) / (Math.pow(1 + r2, remainingMonths) - 1);

        // Worst case (max rate)
        const worstRate = initialRate + lifetimeCap;
        const r3 = worstRate / 100 / 12;
        const worstPayment = (balance * (r3 * Math.pow(1 + r3, remainingMonths))) / (Math.pow(1 + r3, remainingMonths) - 1);

        // Total interest
        const totalInterestInitial = initialPayment * fixedMonths - (loan - balance);
        const totalInterestAdj = adjustedPayment * remainingMonths - balance;
        const totalInterest = totalInterestInitial + totalInterestAdj;

        const paymentIncrease = adjustedPayment - initialPayment;

        return {
          primary: { label: "Initial Monthly Payment", value: `$${formatNumber(initialPayment)}` },
          details: [
            { label: `Payment after year ${fixedYears}`, value: `$${formatNumber(adjustedPayment)}` },
            { label: "Payment increase", value: `$${formatNumber(paymentIncrease)} (${formatNumber((paymentIncrease / initialPayment) * 100, 1)}%)` },
            { label: "Worst-case payment (rate cap)", value: `$${formatNumber(worstPayment)}` },
            { label: `Balance at year ${fixedYears}`, value: `$${formatNumber(balance)}` },
            { label: "Worst-case rate", value: `${formatNumber(worstRate, 2)}%` },
            { label: "Total interest (expected)", value: `$${formatNumber(totalInterest)}` },
            { label: `Initial rate (years 1-${fixedYears})`, value: `${formatNumber(initialRate, 2)}%` },
            { label: "Expected adjusted rate", value: `${formatNumber(expectedRate, 2)}%` },
          ],
          note: paymentIncrease > initialPayment * 0.2
            ? "Warning: Expected payment increase is over 20%. Make sure you can afford the adjusted payment."
            : undefined,
        };
      },
    },
    {
      id: "arm-vs-fixed",
      name: "ARM vs. Fixed Rate",
      description: "Compare ARM savings against a fixed-rate mortgage",
      fields: [
        { name: "loanAmount", label: "Loan Amount", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "armRate", label: "ARM Initial Rate", type: "number", placeholder: "e.g. 5.5", suffix: "%", min: 0, max: 20, step: 0.01 },
        { name: "fixedRate", label: "30-Year Fixed Rate", type: "number", placeholder: "e.g. 6.75", suffix: "%", min: 0, max: 20, step: 0.01 },
        {
          name: "fixedPeriod",
          label: "ARM Fixed Period",
          type: "select",
          options: [
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const armRate = inputs.armRate as number;
        const fixedRate = inputs.fixedRate as number;
        const fixedPeriod = parseInt(inputs.fixedPeriod as string) || 5;
        if (!loan || !armRate || !fixedRate) return null;

        const months = 30 * 12;
        const fixedMonths = fixedPeriod * 12;

        const rArm = armRate / 100 / 12;
        const rFixed = fixedRate / 100 / 12;
        const armPayment = (loan * (rArm * Math.pow(1 + rArm, months))) / (Math.pow(1 + rArm, months) - 1);
        const fixedPayment = (loan * (rFixed * Math.pow(1 + rFixed, months))) / (Math.pow(1 + rFixed, months) - 1);

        const monthlySavings = fixedPayment - armPayment;
        const totalSavingsDuringFixed = monthlySavings * fixedMonths;

        return {
          primary: { label: "Monthly Savings (ARM vs Fixed)", value: `$${formatNumber(monthlySavings)}` },
          details: [
            { label: "ARM payment (initial)", value: `$${formatNumber(armPayment)}` },
            { label: "Fixed payment", value: `$${formatNumber(fixedPayment)}` },
            { label: `Savings during ${fixedPeriod}-year fixed period`, value: `$${formatNumber(totalSavingsDuringFixed)}` },
            { label: "Rate difference", value: `${formatNumber(fixedRate - armRate, 2)}%` },
          ],
          note: `You save $${formatNumber(totalSavingsDuringFixed)} during the fixed period. After year ${fixedPeriod}, the ARM rate adjusts and could be higher than the fixed rate.`,
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "mortgage-refinance-calculator", "mortgage-points-calculator"],
  faq: [
    {
      question: "What is an ARM (Adjustable Rate Mortgage)?",
      answer:
        "An ARM has an initial fixed-rate period (3, 5, 7, or 10 years) followed by rate adjustments, usually annually. A 5/1 ARM means 5 years fixed, then adjusts every 1 year. Initial rates are lower than fixed-rate mortgages, but payments can increase after the fixed period.",
    },
    {
      question: "When does an ARM make sense?",
      answer:
        "An ARM can make sense if you plan to sell or refinance before the fixed period ends, want a lower initial payment, or expect rates to decrease. If you plan to stay long-term and want payment stability, a fixed-rate mortgage is usually safer.",
    },
    {
      question: "What are ARM rate caps?",
      answer:
        "ARM caps limit how much the rate can change. A typical 2/2/5 cap means: first adjustment max +2%, each subsequent adjustment max +2%, and lifetime cap +5% above the initial rate. So a 5% initial rate with a 5% lifetime cap can never exceed 10%.",
    },
  ],
  formula:
    "Monthly Payment = P[r(1+r)^n] / [(1+r)^n − 1] | ARM compares initial-period payment at teaser rate vs. adjusted payment at expected/cap rate on remaining balance",
};

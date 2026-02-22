import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fdCalculator: CalculatorDefinition = {
  slug: "fd-calculator",
  title: "FD Calculator",
  description:
    "Free fixed deposit calculator. Calculate FD maturity amount and interest earned with simple and compound interest options. Compare FD returns across tenures.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FD calculator",
    "fixed deposit calculator",
    "FD interest calculator",
    "FD maturity calculator",
    "bank FD calculator",
    "fixed deposit returns",
  ],
  variants: [
    {
      id: "cumulative",
      name: "Cumulative FD",
      description: "Interest compounded and paid at maturity",
      fields: [
        {
          name: "principal",
          label: "Deposit Amount",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate (p.a.)",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.1,
        },
        {
          name: "tenure",
          label: "Tenure (months)",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "months",
          min: 1,
          max: 120,
        },
        {
          name: "compounding",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Monthly", value: "12" },
            { label: "Quarterly", value: "4" },
            { label: "Half-Yearly", value: "2" },
            { label: "Yearly", value: "1" },
          ],
          defaultValue: "4",
        },
      ],
      calculate: (inputs) => {
        const P = inputs.principal as number;
        const rate = inputs.rate as number;
        const months = inputs.tenure as number;
        const n = parseInt(inputs.compounding as string);
        if (!P || !rate || !months) return null;

        const r = rate / 100;
        const t = months / 12;
        const maturityAmount = P * Math.pow(1 + r / n, n * t);
        const totalInterest = maturityAmount - P;

        return {
          primary: { label: "Maturity Amount", value: `₹${formatNumber(maturityAmount)}` },
          details: [
            { label: "Principal amount", value: `₹${formatNumber(P)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            { label: "Effective annual yield", value: `${formatNumber((Math.pow(1 + r / n, n) - 1) * 100, 2)}%` },
            { label: "Tenure", value: `${months} months (${formatNumber(t, 1)} years)` },
          ],
        };
      },
    },
    {
      id: "non-cumulative",
      name: "Non-Cumulative FD",
      description: "Interest paid out periodically (monthly/quarterly)",
      fields: [
        {
          name: "principal",
          label: "Deposit Amount",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate (p.a.)",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.1,
        },
        {
          name: "tenure",
          label: "Tenure (months)",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "months",
          min: 1,
          max: 120,
        },
        {
          name: "payout",
          label: "Interest Payout",
          type: "select",
          options: [
            { label: "Monthly", value: "12" },
            { label: "Quarterly", value: "4" },
            { label: "Half-Yearly", value: "2" },
            { label: "Yearly", value: "1" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const P = inputs.principal as number;
        const rate = inputs.rate as number;
        const months = inputs.tenure as number;
        const payoutFreq = parseInt(inputs.payout as string);
        if (!P || !rate || !months) return null;

        const periodicInterest = P * (rate / 100) / payoutFreq;
        const totalInterest = P * (rate / 100) * (months / 12);
        const payoutLabel = payoutFreq === 12 ? "Monthly" : payoutFreq === 4 ? "Quarterly" : payoutFreq === 2 ? "Half-yearly" : "Yearly";

        return {
          primary: { label: `${payoutLabel} Interest Payout`, value: `₹${formatNumber(periodicInterest)}` },
          details: [
            { label: "Principal amount", value: `₹${formatNumber(P)}` },
            { label: "Total interest over tenure", value: `₹${formatNumber(totalInterest)}` },
            { label: "Maturity value (principal returned)", value: `₹${formatNumber(P)}` },
            { label: "Tenure", value: `${months} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ppf-calculator", "rd-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "What is a Fixed Deposit (FD)?",
      answer:
        "A Fixed Deposit is a financial instrument provided by banks where you deposit a lump sum for a fixed period at a predetermined interest rate. FDs offer guaranteed returns and are considered one of the safest investment options.",
    },
    {
      question: "What is the difference between cumulative and non-cumulative FD?",
      answer:
        "In a cumulative FD, interest is compounded and paid at maturity along with the principal. In a non-cumulative FD, interest is paid out periodically (monthly, quarterly, half-yearly, or yearly) and only the principal is returned at maturity.",
    },
    {
      question: "Is FD interest taxable?",
      answer:
        "Yes, FD interest is taxable under 'Income from Other Sources' in India. If total FD interest exceeds ₹40,000 per year (₹50,000 for senior citizens), TDS at 10% is deducted by the bank. You can claim deduction under Section 80TTB (senior citizens) up to ₹50,000.",
    },
  ],
  formula: "Maturity = P × (1 + r/n)^(n×t)",
};

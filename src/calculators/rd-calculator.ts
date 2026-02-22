import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rdCalculator: CalculatorDefinition = {
  slug: "rd-calculator",
  title: "RD Calculator",
  description:
    "Free recurring deposit calculator. Calculate RD maturity amount and interest earned. Plan your monthly savings with accurate RD calculations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "RD calculator",
    "recurring deposit calculator",
    "RD maturity calculator",
    "RD interest calculator",
    "monthly deposit calculator",
    "recurring deposit returns",
  ],
  variants: [
    {
      id: "basic",
      name: "RD Maturity Calculator",
      description: "Calculate maturity amount for a recurring deposit",
      fields: [
        {
          name: "monthlyDeposit",
          label: "Monthly Deposit",
          type: "number",
          placeholder: "e.g. 10000",
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
          min: 6,
          max: 120,
        },
      ],
      calculate: (inputs) => {
        const P = inputs.monthlyDeposit as number;
        const rate = inputs.rate as number;
        const months = inputs.tenure as number;
        if (!P || !rate || !months) return null;

        const r = rate / 100;
        const n = 4; // Quarterly compounding for RD
        let maturity = 0;

        for (let i = 1; i <= months; i++) {
          const remainingMonths = months - i + 1;
          maturity += P * Math.pow(1 + r / n, n * (remainingMonths / 12));
        }

        const totalDeposited = P * months;
        const totalInterest = maturity - totalDeposited;

        return {
          primary: { label: "Maturity Amount", value: `₹${formatNumber(maturity)}` },
          details: [
            { label: "Monthly deposit", value: `₹${formatNumber(P)}` },
            { label: "Total amount deposited", value: `₹${formatNumber(totalDeposited)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            { label: "Tenure", value: `${months} months` },
          ],
        };
      },
    },
    {
      id: "target",
      name: "Target Amount",
      description: "Calculate the monthly deposit needed for a target maturity amount",
      fields: [
        {
          name: "target",
          label: "Target Maturity Amount",
          type: "number",
          placeholder: "e.g. 1000000",
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
          min: 6,
          max: 120,
        },
      ],
      calculate: (inputs) => {
        const target = inputs.target as number;
        const rate = inputs.rate as number;
        const months = inputs.tenure as number;
        if (!target || !rate || !months) return null;

        const r = rate / 100;
        const n = 4;
        let multiplier = 0;

        for (let i = 1; i <= months; i++) {
          const remainingMonths = months - i + 1;
          multiplier += Math.pow(1 + r / n, n * (remainingMonths / 12));
        }

        const monthlyDeposit = target / multiplier;
        const totalDeposited = monthlyDeposit * months;
        const totalInterest = target - totalDeposited;

        return {
          primary: { label: "Required Monthly Deposit", value: `₹${formatNumber(monthlyDeposit)}` },
          details: [
            { label: "Target maturity amount", value: `₹${formatNumber(target)}` },
            { label: "Total amount you will deposit", value: `₹${formatNumber(totalDeposited)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            { label: "Tenure", value: `${months} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fd-calculator", "ppf-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "What is a Recurring Deposit (RD)?",
      answer:
        "A Recurring Deposit is a savings scheme where you deposit a fixed amount every month for a predetermined period. Interest is compounded quarterly and paid at maturity along with the total deposits.",
    },
    {
      question: "How is RD interest calculated?",
      answer:
        "RD interest is compounded quarterly. Each monthly installment earns interest for the remaining tenure. The maturity value is the sum of each deposit compounded at the quarterly rate for its remaining period.",
    },
    {
      question: "What is the minimum and maximum tenure for RD?",
      answer:
        "The minimum tenure for an RD is typically 6 months, and the maximum is 10 years (120 months). Different banks may offer slightly different tenure options. Post office RDs have a standard 5-year tenure.",
    },
  ],
  formula: "Maturity = Σ P × (1 + r/4)^(4 × remaining_months/12)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cdInterestCalculator: CalculatorDefinition = {
  slug: "cd-interest-calculator",
  title: "CD Interest Calculator",
  description:
    "Free CD calculator. Calculate certificate of deposit interest earned and maturity value. Compare different CD terms and APY rates to maximize your savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cd calculator",
    "cd interest calculator",
    "certificate of deposit calculator",
    "cd rate calculator",
    "cd maturity calculator",
  ],
  variants: [
    {
      id: "cd-calc",
      name: "CD Interest Calculator",
      description: "Calculate interest earned on a certificate of deposit",
      fields: [
        {
          name: "deposit",
          label: "Initial Deposit",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "apy",
          label: "Annual Percentage Yield (APY)",
          type: "number",
          placeholder: "e.g. 5.0",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.01,
        },
        {
          name: "termMonths",
          label: "CD Term",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "6 months", value: "6" },
            { label: "9 months", value: "9" },
            { label: "12 months (1 year)", value: "12" },
            { label: "18 months", value: "18" },
            { label: "24 months (2 years)", value: "24" },
            { label: "36 months (3 years)", value: "36" },
            { label: "48 months (4 years)", value: "48" },
            { label: "60 months (5 years)", value: "60" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const deposit = inputs.deposit as number;
        const apy = inputs.apy as number;
        const months = parseInt(inputs.termMonths as string) || 12;
        if (!deposit || !apy) return null;

        // APY already accounts for compounding, so maturity = deposit × (1 + APY)^(months/12)
        const years = months / 12;
        const maturityValue = deposit * Math.pow(1 + apy / 100, years);
        const interestEarned = maturityValue - deposit;
        const monthlyInterest = interestEarned / months;

        // Compare different terms
        const terms = [3, 6, 12, 24, 60];
        const comparisons = terms.map((t) => {
          const y = t / 12;
          const val = deposit * Math.pow(1 + apy / 100, y);
          return { term: t, value: val, interest: val - deposit };
        });

        const details = [
          { label: "Initial deposit", value: `$${formatNumber(deposit)}` },
          { label: "APY", value: `${formatNumber(apy, 2)}%` },
          { label: "Term", value: `${months} months` },
          { label: "Interest earned", value: `$${formatNumber(interestEarned)}` },
          { label: "Average monthly interest", value: `$${formatNumber(monthlyInterest)}` },
        ];

        // Add term comparisons
        for (const c of comparisons) {
          if (c.term !== months) {
            const label = c.term >= 12 ? `${c.term / 12}-year CD interest` : `${c.term}-month CD interest`;
            details.push({ label, value: `$${formatNumber(c.interest)}` });
          }
        }

        return {
          primary: {
            label: "Maturity Value",
            value: `$${formatNumber(maturityValue)}`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "savings-account-calculator", "investment-calculator"],
  faq: [
    {
      question: "How is CD interest calculated?",
      answer:
        "CD interest is calculated using the APY (Annual Percentage Yield), which already accounts for compounding frequency. Maturity Value = Deposit × (1 + APY)^years. For a $10,000 CD at 5% APY for 1 year, you earn $500 in interest.",
    },
    {
      question: "What is the difference between APY and APR for CDs?",
      answer:
        "APR is the simple annual interest rate without compounding. APY includes the effect of compounding and represents the actual annual return. For CDs, APY is the more useful figure because it shows your true earnings. A 4.9% APR compounded daily equals about 5.02% APY.",
    },
    {
      question: "What happens if I withdraw a CD early?",
      answer:
        "Early withdrawal from a CD typically incurs a penalty, often 3-6 months of interest for shorter-term CDs and 6-12 months for longer terms. Some banks offer no-penalty CDs, but these usually have lower rates. Always check penalty terms before opening a CD.",
    },
  ],
  formula: "Maturity Value = Deposit × (1 + APY/100)^(months/12). Interest Earned = Maturity Value - Deposit.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compoundInterestCalculator: CalculatorDefinition = {
  slug: "compound-interest-calculator",
  title: "Compound Interest Calculator",
  description:
    "Free compound interest calculator. See how your savings or investments grow over time with compound interest. Compare different rates and time periods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "compound interest calculator",
    "interest calculator",
    "savings calculator",
    "investment calculator",
    "compound interest formula",
  ],
  variants: [
    {
      id: "basic",
      name: "Compound Interest",
      description: "Calculate future value with compound interest",
      fields: [
        {
          name: "principal",
          label: "Initial Investment",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
        {
          name: "years",
          label: "Time Period",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 1,
          max: 100,
        },
        {
          name: "compound",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Annually (1x/year)", value: "1" },
            { label: "Semi-annually (2x/year)", value: "2" },
            { label: "Quarterly (4x/year)", value: "4" },
            { label: "Monthly (12x/year)", value: "12" },
            { label: "Daily (365x/year)", value: "365" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const P = inputs.principal as number;
        const r = (inputs.rate as number) / 100;
        const t = inputs.years as number;
        const n = parseInt(inputs.compound as string) || 12;
        if (!P || !r || !t) return null;

        const A = P * Math.pow(1 + r / n, n * t);
        const interest = A - P;

        return {
          primary: { label: "Future Value", value: `$${formatNumber(A)}` },
          details: [
            { label: "Total interest earned", value: `$${formatNumber(interest)}` },
            { label: "Initial investment", value: `$${formatNumber(P)}` },
            {
              label: "Interest as % of total",
              value: `${formatNumber((interest / A) * 100)}%`,
            },
          ],
        };
      },
    },
    {
      id: "with-contributions",
      name: "With Monthly Contributions",
      description: "Compound interest plus regular monthly deposits",
      fields: [
        {
          name: "principal",
          label: "Initial Investment",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthly",
          label: "Monthly Contribution",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
        {
          name: "years",
          label: "Time Period",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "years",
          min: 1,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const P = inputs.principal as number;
        const PMT = inputs.monthly as number;
        const r = (inputs.rate as number) / 100;
        const t = inputs.years as number;
        if ((!P && P !== 0) || !r || !t) return null;

        const monthlyRate = r / 12;
        const months = t * 12;

        const compoundedPrincipal = P * Math.pow(1 + monthlyRate, months);
        const futureContributions =
          (PMT || 0) * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        const totalValue = compoundedPrincipal + futureContributions;
        const totalContributed = P + (PMT || 0) * months;
        const totalInterest = totalValue - totalContributed;

        return {
          primary: {
            label: "Future Value",
            value: `$${formatNumber(totalValue)}`,
          },
          details: [
            { label: "Total contributions", value: `$${formatNumber(totalContributed)}` },
            { label: "Total interest earned", value: `$${formatNumber(totalInterest)}` },
            {
              label: "Interest as % of total",
              value: `${formatNumber((totalInterest / totalValue) * 100)}%`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    {
      question: "What is compound interest?",
      answer:
        'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It makes your money grow faster than simple interest because you earn "interest on interest."',
    },
    {
      question: "What is the compound interest formula?",
      answer:
        "A = P(1 + r/n)^(nt), where A = future value, P = principal, r = annual rate (decimal), n = compounding frequency per year, t = time in years.",
    },
    {
      question: "How often should interest be compounded?",
      answer:
        "More frequent compounding results in slightly higher returns. Daily compounding yields slightly more than monthly, which yields more than annually. However, the difference between monthly and daily compounding is minimal.",
    },
  ],
  formula: "A = P(1 + r/n)^(nt)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backdoorRothCalculator: CalculatorDefinition = {
  slug: "backdoor-roth-calculator",
  title: "Backdoor Roth IRA Calculator",
  description:
    "Free backdoor Roth IRA calculator. Estimate taxes on a backdoor Roth conversion including the pro-rata rule impact for existing traditional IRA balances.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "backdoor Roth calculator",
    "backdoor Roth IRA",
    "pro rata rule",
    "Roth IRA high income",
    "non-deductible IRA conversion",
  ],
  variants: [
    {
      id: "backdoor-roth",
      name: "Backdoor Roth IRA Analysis",
      description:
        "Calculate taxes on a backdoor Roth IRA conversion considering the pro-rata rule",
      fields: [
        {
          name: "contributionAmount",
          label: "Non-Deductible IRA Contribution",
          type: "number",
          placeholder: "e.g. 7000",
          prefix: "$",
          defaultValue: 7000,
        },
        {
          name: "existingTraditionalBalance",
          label: "Existing Traditional IRA Balance",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "existingNonDeductibleBasis",
          label: "Non-Deductible Basis in Traditional IRA",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "marginalRate",
          label: "Marginal Tax Rate",
          type: "select",
          options: [
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "32",
        },
        {
          name: "yearsToGrow",
          label: "Years Until Retirement",
          type: "number",
          placeholder: "e.g. 25",
          defaultValue: 25,
          min: 1,
          max: 50,
        },
        {
          name: "expectedReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          defaultValue: 7,
        },
      ],
      calculate: (inputs) => {
        const contribution = (inputs.contributionAmount as number) || 7000;
        const existingBalance =
          (inputs.existingTraditionalBalance as number) || 0;
        const nonDeductibleBasis =
          (inputs.existingNonDeductibleBasis as number) || 0;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 32) / 100;
        const years = (inputs.yearsToGrow as number) || 25;
        const returnRate = ((inputs.expectedReturn as number) || 7) / 100;

        if (!contribution || contribution <= 0) return null;

        // Pro-rata rule calculation
        const totalIRABalance = existingBalance + contribution;
        const totalNonDeductible = nonDeductibleBasis + contribution;
        const nonTaxablePortion = totalNonDeductible / totalIRABalance;
        const taxablePortion = 1 - nonTaxablePortion;

        const conversionAmount = contribution;
        const taxableAmount = conversionAmount * taxablePortion;
        const taxOnConversion = taxableAmount * marginalRate;

        // Future value in Roth
        const futureValue = contribution * Math.pow(1 + returnRate, years);
        const taxFreeGrowth = futureValue - contribution;

        // Compare to taxable account
        const taxableAccountGrowth =
          contribution * Math.pow(1 + returnRate * (1 - 0.15), years);
        const rothAdvantage = futureValue - taxableAccountGrowth - taxOnConversion;

        const hasProRataIssue = existingBalance > 0;

        return {
          primary: {
            label: "Tax on Backdoor Roth",
            value: `$${formatNumber(taxOnConversion)}`,
          },
          details: [
            {
              label: "Contribution (non-deductible)",
              value: `$${formatNumber(contribution)}`,
            },
            {
              label: "Pro-rata taxable portion",
              value: `${formatNumber(taxablePortion * 100)}%`,
            },
            {
              label: "Taxable amount on conversion",
              value: `$${formatNumber(taxableAmount)}`,
            },
            {
              label: `Roth value in ${years} years (tax-free)`,
              value: `$${formatNumber(futureValue)}`,
            },
            {
              label: "Tax-free growth",
              value: `$${formatNumber(taxFreeGrowth)}`,
            },
            {
              label: "Advantage over taxable account",
              value: `$${formatNumber(rothAdvantage)}`,
            },
          ],
          note: hasProRataIssue
            ? "Warning: You have an existing traditional IRA balance. The pro-rata rule means a portion of your conversion will be taxable. Consider rolling your traditional IRA into a 401(k) before doing a backdoor Roth to avoid this issue."
            : "With no existing traditional IRA balance, your backdoor Roth conversion should be tax-free (only the growth between contribution and conversion, if any, is taxable).",
        };
      },
    },
  ],
  relatedSlugs: [
    "roth-conversion-calculator",
    "retirement-calculator",
    "tax-calculator",
  ],
  faq: [
    {
      question: "What is a backdoor Roth IRA?",
      answer:
        "A backdoor Roth IRA is a strategy for high-income earners who exceed Roth IRA income limits. You contribute to a non-deductible traditional IRA, then convert it to a Roth IRA. When done with no existing traditional IRA balance, the conversion is essentially tax-free.",
    },
    {
      question: "What is the pro-rata rule?",
      answer:
        "The pro-rata rule requires you to treat all traditional IRA balances (including SEP and SIMPLE IRAs) as one pool when converting. If you have pre-tax money in any traditional IRA, a proportional share of the conversion will be taxable, even if you only convert the non-deductible contribution.",
    },
  ],
  formula:
    "Taxable Amount = Conversion x (Pre-Tax IRA Balance / Total IRA Balance); Tax = Taxable Amount x Marginal Rate",
};

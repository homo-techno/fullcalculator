import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const selfEmploymentTaxCalculator: CalculatorDefinition = {
  slug: "self-employment-tax-calculator",
  title: "Self-Employment Tax Calculator",
  description:
    "Free self-employment tax calculator. Calculate SE tax (15.3%) on net self-employment income. See the deductible half, Social Security, and Medicare breakdowns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "self employment tax calculator",
    "se tax calculator",
    "1099 tax calculator",
    "freelance tax calculator",
    "self employed tax rate",
  ],
  variants: [
    {
      id: "se-tax",
      name: "Calculate SE Tax",
      description: "Calculate self-employment tax on net earnings",
      fields: [
        {
          name: "netIncome",
          label: "Net Self-Employment Income",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const netIncome = inputs.netIncome as number;
        if (!netIncome) return null;

        // SE tax is calculated on 92.35% of net SE income
        const taxableBase = netIncome * 0.9235;

        // Social Security: 12.4% up to $168,600 (2024)
        const ssWageLimit = 168600;
        const socialSecurity = Math.min(taxableBase, ssWageLimit) * 0.124;

        // Medicare: 2.9% on all earnings
        const medicare = taxableBase * 0.029;

        // Additional Medicare: 0.9% on earnings above $200,000
        const additionalMedicare = taxableBase > 200000 ? (taxableBase - 200000) * 0.009 : 0;

        const totalSETax = socialSecurity + medicare + additionalMedicare;

        // Deductible half of SE tax
        const deductibleHalf = totalSETax / 2;

        const effectiveRate = (totalSETax / netIncome) * 100;

        return {
          primary: {
            label: "Total Self-Employment Tax",
            value: `$${formatNumber(totalSETax)}`,
          },
          details: [
            { label: "Net SE income", value: `$${formatNumber(netIncome)}` },
            { label: "Taxable base (92.35%)", value: `$${formatNumber(taxableBase)}` },
            { label: "Social Security (12.4%)", value: `$${formatNumber(socialSecurity)}` },
            { label: "Medicare (2.9%)", value: `$${formatNumber(medicare)}` },
            { label: "Additional Medicare (0.9%)", value: `$${formatNumber(additionalMedicare)}` },
            { label: "Deductible half of SE tax", value: `$${formatNumber(deductibleHalf)}` },
            { label: "Effective SE tax rate", value: `${formatNumber(effectiveRate, 2)}%` },
          ],
          note: "You can deduct half of your SE tax from gross income when calculating income tax. This is an above-the-line deduction (Schedule 1).",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "freelance-rate-calculator", "take-home-pay-calculator"],
  faq: [
    {
      question: "What is the self-employment tax rate?",
      answer:
        "The SE tax rate is 15.3%, consisting of 12.4% for Social Security and 2.9% for Medicare. This is calculated on 92.35% of net self-employment income. You effectively pay both the employee and employer portions of FICA taxes.",
    },
    {
      question: "Why is SE tax calculated on 92.35% of income?",
      answer:
        "The 92.35% factor (100% - 7.65%) accounts for the employer-equivalent portion of FICA. As an employee, your employer pays half of FICA. As self-employed, you get an equivalent adjustment by only paying SE tax on 92.35% of net earnings.",
    },
    {
      question: "Can I deduct self-employment tax?",
      answer:
        "You can deduct half of your self-employment tax (the employer-equivalent portion) from your gross income on Schedule 1 of Form 1040. This reduces your adjusted gross income (AGI) and your income tax, but not the SE tax itself.",
    },
  ],
  formula:
    "SE Tax = (Net Income × 92.35%) × 15.3%. Social Security = min(Taxable Base, $168,600) × 12.4%. Medicare = Taxable Base × 2.9%.",
};

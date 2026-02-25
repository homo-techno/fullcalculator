import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plan529TaxBenefitCalculator: CalculatorDefinition = {
  slug: "529-tax-benefit-calculator",
  title: "529 Plan Tax Benefit Calculator",
  description:
    "Free 529 plan tax benefit calculator. Estimate state tax deductions and tax-free growth from a 529 college savings plan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "529 plan calculator",
    "529 tax benefit",
    "college savings tax",
    "529 tax deduction",
    "education savings plan",
  ],
  variants: [
    {
      id: "529-benefit",
      name: "529 Plan Tax Benefit Analysis",
      description:
        "Calculate state tax deduction and tax-free growth benefit of a 529 plan",
      fields: [
        {
          name: "annualContribution",
          label: "Annual 529 Contribution",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
        },
        {
          name: "yearsToGrow",
          label: "Years Until Funds Needed",
          type: "number",
          placeholder: "e.g. 18",
          min: 1,
          max: 30,
        },
        {
          name: "expectedReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "%",
          defaultValue: 6,
        },
        {
          name: "stateDeductionMax",
          label: "State Tax Deduction Limit (per contributor)",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          defaultValue: 10000,
        },
        {
          name: "stateTaxRate",
          label: "State Marginal Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
        {
          name: "federalCapGainsRate",
          label: "Federal Capital Gains Rate (for comparison)",
          type: "select",
          options: [
            { label: "0%", value: "0" },
            { label: "15%", value: "15" },
            { label: "20%", value: "20" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const annualContrib = inputs.annualContribution as number;
        const years = inputs.yearsToGrow as number;
        const returnRate = ((inputs.expectedReturn as number) || 6) / 100;
        const stateDeductionMax =
          (inputs.stateDeductionMax as number) || 10000;
        const stateRate = ((inputs.stateTaxRate as number) || 0) / 100;
        const fedCapGainsRate =
          (parseInt(inputs.federalCapGainsRate as string) || 15) / 100;

        if (!annualContrib || annualContrib <= 0 || !years) return null;

        // 529 future value (tax-free growth)
        const futureValue529 =
          annualContrib *
          ((Math.pow(1 + returnRate, years) - 1) / returnRate) *
          (1 + returnRate);
        const totalContributions = annualContrib * years;
        const totalGrowth = futureValue529 - totalContributions;

        // State tax deduction savings
        const deductiblePerYear = Math.min(annualContrib, stateDeductionMax);
        const annualStateSavings = deductiblePerYear * stateRate;
        const totalStateSavings = annualStateSavings * years;

        // Tax-free growth savings vs taxable account
        const taxOnGrowthAvoided =
          totalGrowth * (fedCapGainsRate + stateRate);

        // Taxable account comparison
        const afterTaxReturn = returnRate * (1 - fedCapGainsRate);
        const taxableAccountValue =
          annualContrib *
          ((Math.pow(1 + afterTaxReturn, years) - 1) / afterTaxReturn) *
          (1 + afterTaxReturn);

        const totalBenefit = totalStateSavings + taxOnGrowthAvoided;
        const advantageOver529 = futureValue529 - taxableAccountValue;

        return {
          primary: {
            label: "Total 529 Tax Benefit",
            value: `$${formatNumber(totalBenefit)}`,
          },
          details: [
            {
              label: `529 account value in ${years} years`,
              value: `$${formatNumber(futureValue529)}`,
            },
            {
              label: "Total contributions",
              value: `$${formatNumber(totalContributions)}`,
            },
            {
              label: "Tax-free growth",
              value: `$${formatNumber(totalGrowth)}`,
            },
            {
              label: "Annual state tax deduction savings",
              value: `$${formatNumber(annualStateSavings)}`,
            },
            {
              label: `Total state deduction savings (${years} years)`,
              value: `$${formatNumber(totalStateSavings)}`,
            },
            {
              label: "Tax on growth avoided",
              value: `$${formatNumber(taxOnGrowthAvoided)}`,
            },
            {
              label: "529 advantage over taxable account",
              value: `$${formatNumber(advantageOver529)}`,
            },
          ],
          note: "529 plans provide tax-free growth and tax-free withdrawals for qualified education expenses. Many states offer a state income tax deduction for contributions. There is no federal tax deduction for 529 contributions. Unused funds can be rolled to a Roth IRA (up to $35,000 lifetime, SECURE 2.0).",
        };
      },
    },
  ],
  relatedSlugs: [
    "education-tax-credit-calculator",
    "compound-interest-calculator",
    "tax-calculator",
  ],
  faq: [
    {
      question: "What are the tax benefits of a 529 plan?",
      answer:
        "529 plans offer tax-free investment growth and tax-free withdrawals for qualified education expenses (tuition, room, board, books, etc.). Many states also provide a state income tax deduction or credit for contributions. There is no federal income tax deduction.",
    },
    {
      question: "Can I use 529 funds for non-education expenses?",
      answer:
        "Non-qualified withdrawals are subject to income tax and a 10% penalty on the earnings portion. Under SECURE 2.0, up to $35,000 of unused 529 funds can be rolled into a Roth IRA for the beneficiary (subject to annual Roth contribution limits and a 15-year account age requirement).",
    },
  ],
  formula:
    "Total Benefit = State Tax Savings (contribution x state rate x years) + Tax on Growth Avoided (growth x cap gains rate)",
};

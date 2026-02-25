import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const equipmentLoanCalculator: CalculatorDefinition = {
  slug: "equipment-loan-calculator",
  title: "Equipment Financing Calculator",
  description:
    "Free equipment financing calculator. Compare buying vs. leasing equipment, estimate monthly payments, and calculate total cost of ownership for business equipment loans.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "equipment loan calculator",
    "equipment financing",
    "equipment lease calculator",
    "business equipment loan",
    "machinery financing",
    "equipment payment calculator",
  ],
  variants: [
    {
      id: "equipment-loan-payment",
      name: "Equipment Loan Payment",
      description: "Calculate monthly payments for equipment financing",
      fields: [
        {
          name: "equipmentCost",
          label: "Equipment Cost",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 8.0",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "5",
        },
        {
          name: "residualValue",
          label: "Estimated Residual Value",
          type: "select",
          options: [
            { label: "0% (fully depreciated)", value: "0" },
            { label: "10%", value: "10" },
            { label: "20%", value: "20" },
            { label: "30%", value: "30" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const cost = inputs.equipmentCost as number;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 5;
        const residualPct = parseFloat(inputs.residualValue as string) || 0;
        if (!cost || !rate) return null;

        const loanAmount = cost - down;
        if (loanAmount <= 0) return null;

        const mr = rate / 100 / 12;
        const n = years * 12;
        const monthly =
          (loanAmount * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const totalPaid = monthly * n;
        const totalInterest = totalPaid - loanAmount;
        const residualValue = cost * (residualPct / 100);
        const netCostOfOwnership = totalPaid + down - residualValue;
        const annualCost = netCostOfOwnership / years;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Amount financed", value: `$${formatNumber(loanAmount)}` },
            { label: "Down payment", value: `$${formatNumber(down)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total loan repayment", value: `$${formatNumber(totalPaid)}` },
            { label: "Estimated residual value", value: `$${formatNumber(residualValue)}` },
            { label: "Net cost of ownership", value: `$${formatNumber(netCostOfOwnership)}` },
            { label: "Annualized cost", value: `$${formatNumber(annualCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sba-loan-calculator", "personal-loan-calculator"],
  faq: [
    {
      question: "Should I buy or lease equipment?",
      answer:
        "Buying makes sense for equipment with a long useful life that you'll use for years. Leasing is better for equipment that becomes obsolete quickly, or when you need to preserve cash flow and want lower upfront costs.",
    },
    {
      question: "What is equipment depreciation?",
      answer:
        "Equipment loses value over time through depreciation. The IRS allows businesses to deduct depreciation as a business expense. Section 179 allows you to deduct the full cost in the year of purchase, up to limits.",
    },
    {
      question: "What are typical equipment loan rates?",
      answer:
        "Equipment loan rates typically range from 5% to 15% depending on credit quality, equipment type, and loan term. New equipment and strong credit get the best rates. SBA loans may offer even lower rates.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Net Cost = Total Paid + Down - Residual Value.",
};

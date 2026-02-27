import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const titleSearchCostCalculator: CalculatorDefinition = {
  slug: "title-search-cost",
  title: "Title Search and Insurance Cost Estimator",
  description:
    "Estimate title search, title insurance, and related closing costs for a real estate transaction. Covers both lender and owner policies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "title search",
    "title insurance",
    "closing costs",
    "real estate",
    "lender policy",
    "owner policy",
    "settlement",
    "escrow",
    "property transfer",
  ],
  variants: [
    {
      slug: "title-costs",
      title: "Title Search & Insurance Costs",
      fields: [
        {
          name: "purchasePrice",
          label: "Purchase Price ($)",
          type: "number",
        },
        {
          name: "loanAmount",
          label: "Loan Amount ($)",
          type: "number",
        },
        {
          name: "state",
          label: "Cost Region",
          type: "select",
          options: [
            { label: "Low Cost Region", value: "low" },
            { label: "Average Cost Region", value: "avg" },
            { label: "High Cost Region (NY, NJ, FL)", value: "high" },
          ],
        },
      ],
      calculate(inputs) {
        const price = parseFloat(inputs.purchasePrice as string);
        const loan = parseFloat(inputs.loanAmount as string);
        const region = inputs.state as string;
        if (isNaN(price) || isNaN(loan))
          return { error: "Please enter valid purchase price and loan amount." };

        const regionMultiplier: Record<string, number> = { low: 0.8, avg: 1.0, high: 1.4 };
        const mult = regionMultiplier[region];

        const titleSearchFee = 300 * mult;
        const ownerPolicyRate = price <= 500000 ? 0.005 : price <= 1000000 ? 0.004 : 0.0035;
        const ownerPolicy = price * ownerPolicyRate * mult;
        const lenderPolicy = loan * 0.0035 * mult;
        const simultIssueDiscount = Math.min(lenderPolicy * 0.3, 200);
        const adjustedLenderPolicy = lenderPolicy - simultIssueDiscount;
        const recordingFees = 150 * mult;
        const closingFee = 500 * mult;
        const totalTitleCosts = titleSearchFee + ownerPolicy + adjustedLenderPolicy + recordingFees + closingFee;
        const percentOfPrice = (totalTitleCosts / price) * 100;

        return {
          results: [
            { label: "Title Search Fee", value: `$${formatNumber(titleSearchFee)}` },
            { label: "Owner's Title Insurance", value: `$${formatNumber(ownerPolicy)}` },
            { label: "Lender's Title Insurance", value: `$${formatNumber(adjustedLenderPolicy)}` },
            { label: "Simultaneous Issue Discount", value: `-$${formatNumber(simultIssueDiscount)}` },
            { label: "Recording Fees", value: `$${formatNumber(recordingFees)}` },
            { label: "Settlement/Closing Fee", value: `$${formatNumber(closingFee)}` },
            { label: "Total Title Costs", value: `$${formatNumber(totalTitleCosts)}` },
            { label: "% of Purchase Price", value: `${formatNumber(percentOfPrice)}%` },
          ],
        };
      },
    },
    {
      slug: "refinance-title",
      title: "Refinance Title Costs",
      fields: [
        {
          name: "loanAmount",
          label: "New Loan Amount ($)",
          type: "number",
        },
        {
          name: "hasExistingPolicy",
          label: "Have Existing Owner's Policy?",
          type: "select",
          options: [
            { label: "Yes (reissue discount available)", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
      ],
      calculate(inputs) {
        const loan = parseFloat(inputs.loanAmount as string);
        const hasPolicy = inputs.hasExistingPolicy as string;
        if (isNaN(loan)) return { error: "Please enter a valid loan amount." };

        const titleSearchFee = 250;
        const lenderPolicy = loan * 0.0035;
        const reissueDiscount = hasPolicy === "yes" ? lenderPolicy * 0.3 : 0;
        const adjustedPolicy = lenderPolicy - reissueDiscount;
        const closingFee = 400;
        const recordingFees = 100;
        const totalCost = titleSearchFee + adjustedPolicy + closingFee + recordingFees;

        return {
          results: [
            { label: "Title Search Fee", value: `$${formatNumber(titleSearchFee)}` },
            { label: "Lender's Title Insurance", value: `$${formatNumber(lenderPolicy)}` },
            { label: "Reissue Discount", value: `-$${formatNumber(reissueDiscount)}` },
            { label: "Adjusted Policy Cost", value: `$${formatNumber(adjustedPolicy)}` },
            { label: "Settlement Fee", value: `$${formatNumber(closingFee)}` },
            { label: "Recording Fees", value: `$${formatNumber(recordingFees)}` },
            { label: "Total Refinance Title Costs", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-appraisal-value", "hoa-fee-comparison", "rent-to-income"],
  faq: [
    {
      question: "What is title insurance and why do I need it?",
      answer:
        "Title insurance protects against losses from defects in the title, such as unknown liens, forgery, recording errors, or undisclosed heirs. Lender's title insurance is required by mortgage lenders, while owner's title insurance is optional but recommended to protect your equity.",
    },
    {
      question: "How much does title insurance cost?",
      answer:
        "Title insurance typically costs 0.5% to 1% of the purchase price for the owner's policy and about 0.35% of the loan amount for the lender's policy. A simultaneous issue discount (20-40%) applies when both policies are issued together. Costs vary significantly by state.",
    },
    {
      question: "Who pays for title insurance?",
      answer:
        "This varies by location and is negotiable. In many states, the seller pays for the owner's policy and the buyer pays for the lender's policy. However, customs differ: in some states the buyer pays both, and in others the seller pays both. It is always subject to negotiation.",
    },
  ],
  formula:
    "Owner's Policy = Purchase Price x Rate (0.35-0.5%) | Lender's Policy = Loan Amount x 0.35% | Simultaneous Issue Discount = ~30% off lender policy | Total = Search + Policies + Recording + Closing Fee",
};

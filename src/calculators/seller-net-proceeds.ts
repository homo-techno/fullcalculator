import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sellerNetProceedsCalculator: CalculatorDefinition = {
  slug: "seller-net-proceeds",
  title: "Seller Net Proceeds Calculator",
  description: "Free online real estate seller net proceeds calculator. Estimate how much you will take home after selling your property, including commissions, closing costs, and mortgage payoff.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["seller net proceeds", "home sale calculator", "selling costs", "real estate closing", "home equity", "seller closing costs", "net proceeds"],
  variants: [
    {
      id: "net-proceeds",
      name: "Calculate Net Proceeds",
      fields: [
        {
          name: "salePrice",
          label: "Expected Sale Price ($)",
          type: "number",
          placeholder: "e.g. 450000",
          min: 0,
        },
        {
          name: "mortgageBalance",
          label: "Remaining Mortgage Balance ($)",
          type: "number",
          placeholder: "e.g. 280000",
          min: 0,
        },
        {
          name: "agentCommission",
          label: "Total Agent Commission",
          type: "select",
          options: [
            { label: "4% (discount agent)", value: "4" },
            { label: "5% (negotiated)", value: "5" },
            { label: "6% (traditional)", value: "6" },
            { label: "3% (seller agent only)", value: "3" },
            { label: "0% (FSBO, no agents)", value: "0" },
          ],
        },
        {
          name: "closingCostPercent",
          label: "Estimated Closing Costs",
          type: "select",
          options: [
            { label: "1% of sale price", value: "1" },
            { label: "1.5% of sale price", value: "1.5" },
            { label: "2% of sale price", value: "2" },
            { label: "3% of sale price", value: "3" },
          ],
        },
        {
          name: "repairCredits",
          label: "Repair Credits / Concessions ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
        {
          name: "homeImprovements",
          label: "Pre-Sale Home Improvements ($)",
          type: "number",
          placeholder: "e.g. 3000",
          min: 0,
        },
        {
          name: "originalPurchasePrice",
          label: "Original Purchase Price ($)",
          type: "number",
          placeholder: "e.g. 300000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const salePrice = parseFloat(inputs.salePrice as string) || 0;
        const mortgageBalance = parseFloat(inputs.mortgageBalance as string) || 0;
        const commissionPercent = parseFloat(inputs.agentCommission as string) || 6;
        const closingCostPercent = parseFloat(inputs.closingCostPercent as string) || 2;
        const repairCredits = parseFloat(inputs.repairCredits as string) || 0;
        const improvements = parseFloat(inputs.homeImprovements as string) || 0;
        const originalPrice = parseFloat(inputs.originalPurchasePrice as string) || 0;

        const agentCommission = salePrice * (commissionPercent / 100);
        const closingCosts = salePrice * (closingCostPercent / 100);

        // Transfer tax (varies by state, ~0.1-2%, using 0.5% average)
        const transferTax = salePrice * 0.005;

        // Title insurance (seller's portion, ~0.5%)
        const titleInsurance = salePrice * 0.005;

        const totalCosts = agentCommission + closingCosts + transferTax + titleInsurance + repairCredits + improvements;
        const netProceeds = salePrice - mortgageBalance - totalCosts;

        // Capital gains estimate
        const capitalGain = salePrice - originalPrice - improvements;
        const exemption = 250000; // single filer exemption
        const taxableGain = Math.max(0, capitalGain - exemption);
        const estimatedCapGainsTax = taxableGain * 0.15;

        const afterTaxProceeds = netProceeds - estimatedCapGainsTax;
        const equityPercent = salePrice > 0 ? ((salePrice - mortgageBalance) / salePrice) * 100 : 0;

        return {
          primary: { label: "Estimated Net Proceeds", value: "$" + formatNumber(netProceeds) },
          details: [
            { label: "Sale Price", value: "$" + formatNumber(salePrice) },
            { label: "Mortgage Payoff", value: "-$" + formatNumber(mortgageBalance) },
            { label: "Agent Commission (" + commissionPercent + "%)", value: "-$" + formatNumber(agentCommission) },
            { label: "Closing Costs (" + closingCostPercent + "%)", value: "-$" + formatNumber(closingCosts) },
            { label: "Transfer Tax (est. 0.5%)", value: "-$" + formatNumber(transferTax) },
            { label: "Title Insurance (est. 0.5%)", value: "-$" + formatNumber(titleInsurance) },
            { label: "Repair Credits / Concessions", value: "-$" + formatNumber(repairCredits) },
            { label: "Pre-Sale Improvements", value: "-$" + formatNumber(improvements) },
            { label: "Total Selling Costs", value: "-$" + formatNumber(totalCosts) },
            { label: "Home Equity", value: formatNumber(equityPercent, 1) + "%" },
            { label: "Capital Gain", value: "$" + formatNumber(capitalGain) },
            { label: "Est. Capital Gains Tax", value: "-$" + formatNumber(estimatedCapGainsTax) },
            { label: "After-Tax Proceeds", value: "$" + formatNumber(afterTaxProceeds) },
          ],
          note: "Home sale profits up to $250,000 (single) or $500,000 (married) are excluded from capital gains tax if you lived in the home for 2+ of the last 5 years.",
        };
      },
    },
  ],
  relatedSlugs: ["1031-exchange", "15-vs-30-mortgage", "legal-fee-calc"],
  faq: [
    {
      question: "What costs do sellers pay when selling a home?",
      answer: "Major seller costs include: real estate agent commissions (3-6%), closing costs (1-3%), transfer taxes, title insurance, any agreed-upon repair credits, and mortgage payoff. Total selling costs typically range from 7-10% of the sale price.",
    },
    {
      question: "Do I have to pay capital gains tax on my home sale?",
      answer: "If you lived in the home as your primary residence for at least 2 of the past 5 years, you can exclude up to $250,000 in profit (single) or $500,000 (married filing jointly) from capital gains tax. Profits above these thresholds are taxed at long-term capital gains rates (15-20%).",
    },
    {
      question: "What are seller concessions?",
      answer: "Seller concessions are costs the seller agrees to cover for the buyer, such as paying for repairs, contributing to the buyer's closing costs, or offering credits. These reduce your net proceeds but can help close the deal and sometimes achieve a higher sale price.",
    },
  ],
  formula: "Net Proceeds = Sale Price - Mortgage Payoff - Agent Commission - Closing Costs - Transfer Tax - Title Insurance - Repairs - Improvements",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flipProfitCalculator: CalculatorDefinition = {
  slug: "flip-profit-calculator",
  title: "House Flip Profit Calculator",
  description:
    "Free house flip profit calculator. Estimate profit, ROI, and costs for flipping a house including purchase, rehab, holding costs, and selling expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "house flip calculator",
    "flip profit calculator",
    "house flipping calculator",
    "fix and flip calculator",
    "flip ROI calculator",
  ],
  variants: [
    {
      id: "profit",
      name: "Flip Profit Analysis",
      description: "Calculate profit and ROI from flipping a property",
      fields: [
        { name: "purchasePrice", label: "Purchase Price", type: "number", placeholder: "e.g. 200000", prefix: "$", min: 0 },
        { name: "rehabCost", label: "Rehab / Renovation Cost", type: "number", placeholder: "e.g. 50000", prefix: "$", min: 0 },
        { name: "arv", label: "After Repair Value (ARV)", type: "number", placeholder: "e.g. 320000", prefix: "$", min: 0 },
        { name: "holdingMonths", label: "Holding Period", type: "number", placeholder: "e.g. 4", suffix: "months", min: 1, max: 36, step: 1 },
        { name: "monthlyHolding", label: "Monthly Holding Costs", type: "number", placeholder: "e.g. 2000", prefix: "$", min: 0 },
        { name: "closingBuy", label: "Buying Closing Costs", type: "number", placeholder: "e.g. 5000", prefix: "$", min: 0 },
        { name: "agentPercent", label: "Selling Agent Commission", type: "number", placeholder: "e.g. 5", suffix: "%", min: 0, max: 10, step: 0.1, defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const purchase = inputs.purchasePrice as number;
        const rehab = (inputs.rehabCost as number) || 0;
        const arv = inputs.arv as number;
        const months = (inputs.holdingMonths as number) || 4;
        const monthlyHold = (inputs.monthlyHolding as number) || 0;
        const closingBuy = (inputs.closingBuy as number) || 0;
        const agentPct = (inputs.agentPercent as number) || 5;
        if (!purchase || !arv) return null;

        const holdingTotal = monthlyHold * months;
        const agentFee = arv * (agentPct / 100);
        const closingSell = arv * 0.01; // estimated seller closing costs
        const totalCost = purchase + rehab + holdingTotal + closingBuy + agentFee + closingSell;
        const profit = arv - totalCost;
        const roi = ((profit) / (purchase + rehab + holdingTotal + closingBuy)) * 100;
        const annualizedROI = roi * (12 / months);

        // 70% rule check
        const maxOffer70 = arv * 0.70 - rehab;

        return {
          primary: { label: "Net Profit", value: `$${formatNumber(profit)}` },
          details: [
            { label: "After Repair Value (ARV)", value: `$${formatNumber(arv)}` },
            { label: "Total investment", value: `$${formatNumber(totalCost)}` },
            { label: "ROI", value: `${formatNumber(roi, 1)}%` },
            { label: "Annualized ROI", value: `${formatNumber(annualizedROI, 1)}%` },
            { label: "Purchase + rehab", value: `$${formatNumber(purchase + rehab)}` },
            { label: "Holding costs", value: `$${formatNumber(holdingTotal)}` },
            { label: "Agent + closing (sell)", value: `$${formatNumber(agentFee + closingSell)}` },
            { label: "70% rule max offer", value: `$${formatNumber(maxOffer70)}` },
          ],
          note: profit < 0
            ? "This flip shows a loss. Consider negotiating a lower purchase price or reducing rehab scope."
            : purchase > maxOffer70
              ? `Purchase exceeds the 70% rule max offer of $${formatNumber(maxOffer70)}. Proceed with caution.`
              : undefined,
        };
      },
    },
    {
      id: "arv",
      name: "Max Offer (70% Rule)",
      description: "Calculate maximum purchase price using the 70% rule",
      fields: [
        { name: "arv", label: "After Repair Value (ARV)", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "rehabCost", label: "Estimated Rehab Cost", type: "number", placeholder: "e.g. 40000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const arv = inputs.arv as number;
        const rehab = (inputs.rehabCost as number) || 0;
        if (!arv) return null;

        const maxOffer = arv * 0.70 - rehab;
        const maxOfferPercent = (maxOffer / arv) * 100;

        return {
          primary: { label: "Maximum Offer Price", value: `$${formatNumber(maxOffer)}` },
          details: [
            { label: "After Repair Value", value: `$${formatNumber(arv)}` },
            { label: "70% of ARV", value: `$${formatNumber(arv * 0.70)}` },
            { label: "Rehab cost", value: `$${formatNumber(rehab)}` },
            { label: "Max offer as % of ARV", value: `${formatNumber(maxOfferPercent)}%` },
          ],
          note: "The 70% rule: Never pay more than 70% of ARV minus repair costs. This leaves room for holding costs, selling costs, and profit.",
        };
      },
    },
  ],
  relatedSlugs: ["renovation-cost-calculator", "home-value-calculator", "roi-calculator"],
  faq: [
    {
      question: "What is the 70% rule in house flipping?",
      answer:
        "The 70% rule states: Maximum Offer = ARV × 70% − Repair Costs. For a home with $300K ARV and $40K in repairs, max offer = $300K × 0.70 − $40K = $170K. This ensures a margin for holding costs, selling costs, and profit.",
    },
    {
      question: "What are holding costs in a flip?",
      answer:
        "Holding costs are ongoing expenses during the flip: mortgage/hard money interest, property taxes, insurance, utilities, HOA fees, and loan fees. They typically run $1,500-$4,000+/month. Shorter hold times = higher profits.",
    },
    {
      question: "What is a good profit for a house flip?",
      answer:
        "Most successful flippers target $25,000-$50,000+ profit per flip, or a 15-25% ROI. Net profit margins of 10% or less are risky after accounting for unexpected costs. Time is critical: a 20% ROI in 3 months is very different from 20% in 12 months.",
    },
  ],
  formula:
    "Profit = ARV − Purchase − Rehab − Holding Costs − Buying Closing − Agent Fee − Selling Closing | 70% Rule: Max Offer = ARV × 0.70 − Rehab",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const closingCostEstimatorCalculator: CalculatorDefinition = {
  slug: "closing-cost-estimator-calculator",
  title: "Closing Cost Estimator Calculator",
  description: "Estimate total buyer and seller closing costs for a property transaction",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["closing costs","buyer closing costs","seller closing costs"],
  variants: [{
    id: "standard",
    name: "Closing Cost Estimator",
    description: "Estimate total buyer and seller closing costs for a property transaction",
    fields: [
      { name: "homePrice", label: "Home Price ($)", type: "number", defaultValue: 350000, min: 0, step: 10000 },
      { name: "loanAmount", label: "Loan Amount ($)", type: "number", defaultValue: 280000, min: 0, step: 10000 },
      { name: "isBuyer", label: "Buyer(1) or Seller(0)", type: "number", defaultValue: 1, min: 0, max: 1, step: 1 },
      { name: "state", label: "State Transfer Tax Rate (%)", type: "number", defaultValue: 0.5, min: 0, max: 3, step: 0.1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const price = inputs.homePrice as number || 350000;
      const loan = inputs.loanAmount as number || 280000;
      const isBuyer = inputs.isBuyer === 1;
      const transferRate = (inputs.state as number || 0.5) / 100;
      let costs: Record<string, number> = {};
      if (isBuyer) {
        costs = {
          origination: loan * 0.01,
          appraisal: 500,
          inspection: 400,
          titleInsurance: price * 0.005,
          escrow: 1500,
          recording: 200,
          prepaidTax: (price * 0.012 / 12) * 3,
          prepaidInsurance: 1200,
        };
      } else {
        costs = {
          transferTax: price * transferRate,
          titleInsurance: price * 0.003,
          escrow: 1500,
          recording: 150,
          homeWarranty: 500,
        };
      }
      const total = Object.values(costs).reduce((a, b) => a + b, 0);
      const pctOfPrice = (total / price) * 100;
      return {
        primary: { label: (isBuyer ? "Buyer" : "Seller") + " Closing Costs", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "As % of Home Price", value: formatNumber(Math.round(pctOfPrice * 10) / 10) + "%" },
          { label: isBuyer ? "Loan Origination" : "Transfer Tax", value: "$" + formatNumber(Math.round(isBuyer ? costs.origination : costs.transferTax)) },
          { label: "Title Insurance", value: "$" + formatNumber(Math.round(costs.titleInsurance)) },
          { label: "Escrow Fees", value: "$" + formatNumber(Math.round(costs.escrow)) }
        ]
      };
    },
  }],
  relatedSlugs: ["real-estate-commission-calculator"],
  faq: [
    { question: "How much are typical closing costs?", answer: "Buyers typically pay 2-5% of the home price. Sellers usually pay 1-3% plus agent commission." },
    { question: "Can closing costs be negotiated?", answer: "Yes, many fees are negotiable. Sellers can also offer closing cost credits to buyers." },
  ],
  formula: "Total = Sum of applicable fees (origination, title, escrow, taxes, insurance, recording)",
};

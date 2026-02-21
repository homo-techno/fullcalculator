import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costBasisCalculator: CalculatorDefinition = {
  slug: "cost-basis-calculator",
  title: "Cost Basis Calculator",
  description:
    "Free cost basis calculator. Determine your investment cost basis using average cost method, including commissions and multiple purchases.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cost basis", "average cost", "investment", "shares", "commission"],
  variants: [
    {
      id: "single",
      name: "Single Purchase",
      fields: [
        { name: "purchasePrice", label: "Purchase Price Per Share ($)", type: "number", placeholder: "e.g. 150" },
        { name: "quantity", label: "Number of Shares", type: "number", placeholder: "e.g. 100" },
        { name: "commission", label: "Commission / Fees ($)", type: "number", placeholder: "e.g. 9.99" },
      ],
      calculate: (inputs) => {
        const purchasePrice = inputs.purchasePrice as number;
        const quantity = inputs.quantity as number;
        const commission = inputs.commission as number || 0;

        if (!purchasePrice || !quantity) return null;

        const totalCost = purchasePrice * quantity;
        const totalCostBasis = totalCost + commission;
        const costBasisPerShare = totalCostBasis / quantity;

        return {
          primary: { label: "Cost Basis Per Share", value: `$${formatNumber(costBasisPerShare, 4)}` },
          details: [
            { label: "Total Cost Basis", value: `$${formatNumber(totalCostBasis, 2)}` },
            { label: "Purchase Subtotal", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Commission / Fees", value: `$${formatNumber(commission, 2)}` },
            { label: "Number of Shares", value: formatNumber(quantity, 4) },
          ],
        };
      },
    },
    {
      id: "multiple",
      name: "Multiple Purchases (Average Cost)",
      fields: [
        { name: "purchases", label: "Purchases: price,qty per line (comma-separated pairs)", type: "text" as "number", placeholder: "e.g. 150,100, 160,50, 140,75" },
        { name: "totalCommissions", label: "Total Commissions ($)", type: "number", placeholder: "e.g. 29.97" },
      ],
      calculate: (inputs) => {
        const purchasesStr = inputs.purchases as string || "";
        const totalCommissions = inputs.totalCommissions as number || 0;

        const values = purchasesStr.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));

        if (values.length < 2 || values.length % 2 !== 0) return null;

        let totalShares = 0;
        let totalCost = 0;
        const lots: { price: number; qty: number }[] = [];

        for (let i = 0; i < values.length; i += 2) {
          const price = values[i];
          const qty = values[i + 1];
          lots.push({ price, qty });
          totalShares += qty;
          totalCost += price * qty;
        }

        const totalCostBasis = totalCost + totalCommissions;
        const avgCostPerShare = totalCostBasis / totalShares;

        const details = lots.map((lot, idx) => ({
          label: `Lot ${idx + 1}: ${formatNumber(lot.qty, 0)} shares @ $${formatNumber(lot.price, 2)}`,
          value: `$${formatNumber(lot.price * lot.qty, 2)}`,
        }));

        return {
          primary: { label: "Average Cost Per Share", value: `$${formatNumber(avgCostPerShare, 4)}` },
          details: [
            ...details,
            { label: "Total Shares", value: formatNumber(totalShares, 4) },
            { label: "Total Cost (before fees)", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Total Cost Basis (with fees)", value: `$${formatNumber(totalCostBasis, 2)}` },
            { label: "Total Commissions", value: `$${formatNumber(totalCommissions, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["capital-gains-calculator", "crypto-profit-calculator", "tax-bracket-calculator"],
  faq: [
    { question: "What is cost basis?", answer: "Cost basis is the original value of an asset for tax purposes, typically the purchase price plus any commissions or fees. It is used to calculate capital gains or losses when you sell." },
    { question: "What is the average cost method?", answer: "The average cost method calculates cost basis by dividing the total cost of all shares purchased by the total number of shares. This is commonly used for mutual funds and is simpler than tracking individual lots." },
  ],
  formula: "Cost Basis = (Purchase Price × Quantity) + Commissions; Average Cost = Total Cost Basis / Total Shares",
};

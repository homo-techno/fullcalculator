import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoProfitCalculator: CalculatorDefinition = {
  slug: "crypto-profit-calculator",
  title: "Crypto Profit Calculator",
  description:
    "Free crypto profit calculator. Calculate your cryptocurrency profit, loss, ROI, and net gains after trading fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["crypto", "cryptocurrency", "bitcoin", "profit", "ROI"],
  variants: [
    {
      id: "profitLoss",
      name: "Profit / Loss",
      fields: [
        { name: "buyPrice", label: "Buy Price (per coin) ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "sellPrice", label: "Sell Price (per coin) ($)", type: "number", placeholder: "e.g. 45000" },
        { name: "quantity", label: "Quantity", type: "number", placeholder: "e.g. 0.5" },
        { name: "feesPct", label: "Trading Fees (%)", type: "number", placeholder: "e.g. 0.5" },
      ],
      calculate: (inputs) => {
        const buyPrice = inputs.buyPrice as number;
        const sellPrice = inputs.sellPrice as number;
        const quantity = inputs.quantity as number;
        const feesPct = inputs.feesPct as number || 0;

        if (!buyPrice || !sellPrice || !quantity) return null;

        const totalCost = buyPrice * quantity;
        const totalRevenue = sellPrice * quantity;
        const buyFee = totalCost * (feesPct / 100);
        const sellFee = totalRevenue * (feesPct / 100);
        const totalFees = buyFee + sellFee;
        const grossProfit = totalRevenue - totalCost;
        const netProfit = grossProfit - totalFees;
        const roi = (netProfit / (totalCost + buyFee)) * 100;
        const priceChange = ((sellPrice - buyPrice) / buyPrice) * 100;

        return {
          primary: { label: "Net Profit / Loss", value: `$${formatNumber(netProfit, 2)}` },
          details: [
            { label: "Total Investment", value: `$${formatNumber(totalCost + buyFee, 2)}` },
            { label: "Total Revenue", value: `$${formatNumber(totalRevenue - sellFee, 2)}` },
            { label: "Gross Profit", value: `$${formatNumber(grossProfit, 2)}` },
            { label: "Total Fees Paid", value: `$${formatNumber(totalFees, 2)}` },
            { label: "ROI", value: `${formatNumber(roi, 2)}%` },
            { label: "Price Change", value: `${formatNumber(priceChange, 2)}%` },
          ],
        };
      },
    },
    {
      id: "breakEven",
      name: "Break-Even Price",
      fields: [
        { name: "buyPrice", label: "Buy Price (per coin) ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "quantity", label: "Quantity", type: "number", placeholder: "e.g. 0.5" },
        { name: "feesPct", label: "Trading Fees (%)", type: "number", placeholder: "e.g. 0.5" },
      ],
      calculate: (inputs) => {
        const buyPrice = inputs.buyPrice as number;
        const quantity = inputs.quantity as number;
        const feesPct = inputs.feesPct as number || 0;

        if (!buyPrice || !quantity) return null;

        const totalCost = buyPrice * quantity;
        const buyFee = totalCost * (feesPct / 100);
        const totalInvestment = totalCost + buyFee;

        // breakEvenPrice * quantity - (breakEvenPrice * quantity * feesPct/100) = totalInvestment
        // breakEvenPrice * quantity * (1 - feesPct/100) = totalInvestment
        const breakEvenPrice = totalInvestment / (quantity * (1 - feesPct / 100));
        const breakEvenIncrease = ((breakEvenPrice - buyPrice) / buyPrice) * 100;

        return {
          primary: { label: "Break-Even Sell Price", value: `$${formatNumber(breakEvenPrice, 2)}` },
          details: [
            { label: "Buy Price", value: `$${formatNumber(buyPrice, 2)}` },
            { label: "Total Investment (with fees)", value: `$${formatNumber(totalInvestment, 2)}` },
            { label: "Price Increase Needed", value: `${formatNumber(breakEvenIncrease, 2)}%` },
            { label: "Total Fees Impact", value: `$${formatNumber(buyFee + breakEvenPrice * quantity * (feesPct / 100), 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["capital-gains-calculator", "cost-basis-calculator", "exchange-rate-calculator"],
  faq: [
    { question: "How is crypto ROI calculated?", answer: "ROI = (Net Profit / Total Investment) × 100. Net profit is the selling revenue minus the buying cost and all trading fees." },
    { question: "What fees should I include?", answer: "Include exchange trading fees (typically 0.1% to 1.5%), withdrawal fees, and any network/gas fees. Most exchanges charge fees on both buy and sell transactions." },
  ],
  formula: "Net Profit = (Sell Price × Qty) - (Buy Price × Qty) - Total Fees; ROI = Net Profit / Total Investment × 100",
};

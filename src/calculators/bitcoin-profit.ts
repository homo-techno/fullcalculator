import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bitcoinProfitCalculator: CalculatorDefinition = {
  slug: "bitcoin-profit-calculator",
  title: "Bitcoin Profit Calculator",
  description:
    "Free Bitcoin profit calculator. Calculate your BTC investment profit or loss based on buy price, sell price, and amount invested.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bitcoin", "BTC", "profit", "loss", "investment", "cryptocurrency", "ROI"],
  variants: [
    {
      id: "profitLoss",
      name: "Bitcoin Profit / Loss",
      fields: [
        { name: "investmentAmount", label: "Investment Amount ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "buyPrice", label: "Buy Price ($/BTC)", type: "number", placeholder: "e.g. 40000" },
        { name: "sellPrice", label: "Sell Price ($/BTC)", type: "number", placeholder: "e.g. 65000" },
        { name: "buyFee", label: "Buy Fee (%)", type: "number", placeholder: "e.g. 0.5", defaultValue: 0 },
        { name: "sellFee", label: "Sell Fee (%)", type: "number", placeholder: "e.g. 0.5", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const investment = inputs.investmentAmount as number;
        const buyPrice = inputs.buyPrice as number;
        const sellPrice = inputs.sellPrice as number;
        const buyFee = (inputs.buyFee as number) || 0;
        const sellFee = (inputs.sellFee as number) || 0;

        if (!investment || !buyPrice || !sellPrice) return null;

        const buyFeeAmount = investment * (buyFee / 100);
        const netInvestment = investment - buyFeeAmount;
        const btcAmount = netInvestment / buyPrice;
        const grossRevenue = btcAmount * sellPrice;
        const sellFeeAmount = grossRevenue * (sellFee / 100);
        const netRevenue = grossRevenue - sellFeeAmount;
        const profit = netRevenue - investment;
        const roi = (profit / investment) * 100;

        return {
          primary: { label: "Net Profit / Loss", value: `$${formatNumber(profit, 2)}` },
          details: [
            { label: "BTC Purchased", value: `${formatNumber(btcAmount, 8)} BTC` },
            { label: "Investment", value: `$${formatNumber(investment, 2)}` },
            { label: "Net Revenue", value: `$${formatNumber(netRevenue, 2)}` },
            { label: "Total Fees Paid", value: `$${formatNumber(buyFeeAmount + sellFeeAmount, 2)}` },
            { label: "ROI", value: `${formatNumber(roi, 2)}%` },
            { label: "Price Change", value: `${formatNumber(((sellPrice - buyPrice) / buyPrice) * 100, 2)}%` },
          ],
        };
      },
    },
    {
      id: "dcaProfit",
      name: "DCA Bitcoin Profit",
      fields: [
        { name: "monthlyInvestment", label: "Monthly Investment ($)", type: "number", placeholder: "e.g. 500" },
        { name: "months", label: "Number of Months", type: "number", placeholder: "e.g. 12" },
        { name: "avgBuyPrice", label: "Average Buy Price ($/BTC)", type: "number", placeholder: "e.g. 45000" },
        { name: "currentPrice", label: "Current BTC Price ($)", type: "number", placeholder: "e.g. 65000" },
      ],
      calculate: (inputs) => {
        const monthly = inputs.monthlyInvestment as number;
        const months = inputs.months as number;
        const avgBuy = inputs.avgBuyPrice as number;
        const current = inputs.currentPrice as number;

        if (!monthly || !months || !avgBuy || !current) return null;

        const totalInvested = monthly * months;
        const totalBTC = totalInvested / avgBuy;
        const currentValue = totalBTC * current;
        const profit = currentValue - totalInvested;
        const roi = (profit / totalInvested) * 100;

        return {
          primary: { label: "Total Profit / Loss", value: `$${formatNumber(profit, 2)}` },
          details: [
            { label: "Total Invested", value: `$${formatNumber(totalInvested, 2)}` },
            { label: "Current Value", value: `$${formatNumber(currentValue, 2)}` },
            { label: "Total BTC Accumulated", value: `${formatNumber(totalBTC, 8)} BTC` },
            { label: "Average Buy Price", value: `$${formatNumber(avgBuy, 2)}` },
            { label: "ROI", value: `${formatNumber(roi, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["crypto-profit-calculator", "dollar-cost-averaging-calculator", "capital-gains-calculator"],
  faq: [
    { question: "How do I calculate Bitcoin profit?", answer: "Bitcoin profit = (BTC amount x Sell price) - Total investment - Fees. Your BTC amount depends on how much you invested and at what price you bought." },
    { question: "What is DCA for Bitcoin?", answer: "Dollar-Cost Averaging (DCA) means investing a fixed amount at regular intervals regardless of price. This strategy reduces the impact of volatility on your average purchase price." },
    { question: "Are Bitcoin profits taxable?", answer: "Yes, in most countries Bitcoin profits are subject to capital gains tax. The tax rate may depend on how long you held the BTC before selling." },
  ],
  formula: "Profit = (BTC Amount x Sell Price) - Investment - Fees; ROI = Profit / Investment x 100",
};

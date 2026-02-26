import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stockAverageCalc: CalculatorDefinition = {
  slug: "stock-average-calc",
  title: "Stock Average Price Calculator",
  description: "Free online stock average price calculator. Calculate your average cost basis with dollar cost averaging across multiple purchases.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["stock average", "average price", "cost basis", "dollar cost averaging", "DCA", "stock purchase", "average down"],
  variants: [
    {
      id: "two-purchases",
      name: "Two Purchase Average",
      fields: [
        {
          name: "shares1",
          label: "First Purchase - Shares",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "price1",
          label: "First Purchase - Price Per Share ($)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "shares2",
          label: "Second Purchase - Shares",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "price2",
          label: "Second Purchase - Price Per Share ($)",
          type: "number",
          placeholder: "e.g. 40",
          min: 0,
        },
        {
          name: "currentPrice",
          label: "Current Price Per Share ($)",
          type: "number",
          placeholder: "e.g. 55",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const shares1 = parseFloat(inputs.shares1 as string) || 0;
        const price1 = parseFloat(inputs.price1 as string) || 0;
        const shares2 = parseFloat(inputs.shares2 as string) || 0;
        const price2 = parseFloat(inputs.price2 as string) || 0;
        const currentPrice = parseFloat(inputs.currentPrice as string) || 0;

        const totalCost1 = shares1 * price1;
        const totalCost2 = shares2 * price2;
        const totalCost = totalCost1 + totalCost2;
        const totalShares = shares1 + shares2;
        const averagePrice = totalShares > 0 ? totalCost / totalShares : 0;

        const currentValue = totalShares * currentPrice;
        const gainLoss = currentValue - totalCost;
        const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
        const breakEvenPrice = averagePrice;

        return {
          primary: { label: "Average Cost Per Share", value: "$" + formatNumber(averagePrice) },
          details: [
            { label: "Total Shares", value: formatNumber(totalShares, 0) },
            { label: "Total Investment", value: "$" + formatNumber(totalCost) },
            { label: "Current Portfolio Value", value: "$" + formatNumber(currentValue) },
            { label: "Unrealized Gain/Loss", value: "$" + formatNumber(gainLoss) },
            { label: "Return Percentage", value: formatNumber(gainLossPercent, 2) + "%" },
            { label: "Break-Even Price", value: "$" + formatNumber(breakEvenPrice) },
          ],
        };
      },
    },
    {
      id: "dca-plan",
      name: "Dollar Cost Averaging Plan",
      fields: [
        {
          name: "monthlyInvestment",
          label: "Monthly Investment Amount ($)",
          type: "number",
          placeholder: "e.g. 500",
          min: 0,
        },
        {
          name: "currentPrice",
          label: "Current Stock Price ($)",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "expectedReturn",
          label: "Expected Annual Return (%)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "months",
          label: "Investment Period (months)",
          type: "number",
          placeholder: "e.g. 24",
          min: 1,
          max: 360,
        },
      ],
      calculate: (inputs) => {
        const monthly = parseFloat(inputs.monthlyInvestment as string) || 0;
        const price = parseFloat(inputs.currentPrice as string) || 0;
        const annualReturn = parseFloat(inputs.expectedReturn as string) || 0;
        const months = parseFloat(inputs.months as string) || 12;

        const monthlyReturn = annualReturn / 100 / 12;
        let totalInvested = 0;
        let portfolioValue = 0;
        let totalShares = 0;

        for (let i = 0; i < months; i++) {
          const currentMonthPrice = price * Math.pow(1 + monthlyReturn, i);
          const sharesBought = currentMonthPrice > 0 ? monthly / currentMonthPrice : 0;
          totalShares += sharesBought;
          totalInvested += monthly;
          portfolioValue = totalShares * price * Math.pow(1 + monthlyReturn, months);
        }

        const averageCost = totalShares > 0 ? totalInvested / totalShares : 0;
        const totalReturn = portfolioValue - totalInvested;
        const returnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

        return {
          primary: { label: "Projected Portfolio Value", value: "$" + formatNumber(portfolioValue) },
          details: [
            { label: "Total Invested", value: "$" + formatNumber(totalInvested) },
            { label: "Total Shares Accumulated", value: formatNumber(totalShares, 2) },
            { label: "Average Cost Per Share", value: "$" + formatNumber(averageCost) },
            { label: "Projected Total Return", value: "$" + formatNumber(totalReturn) },
            { label: "Return Percentage", value: formatNumber(returnPercent, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dividend-yield-calc", "rsu-tax-calc", "npv-calculator"],
  faq: [
    {
      question: "What is dollar cost averaging (DCA)?",
      answer: "Dollar cost averaging is an investment strategy where you invest a fixed amount at regular intervals, regardless of the stock price. This results in buying more shares when prices are low and fewer when prices are high, reducing the impact of volatility.",
    },
    {
      question: "How do I calculate my average cost basis?",
      answer: "Divide your total amount invested by the total number of shares purchased. For example, if you invested $5,000 for 100 shares and then $4,000 for 100 shares, your average cost is $9,000 / 200 = $45 per share.",
    },
    {
      question: "Is averaging down a good strategy?",
      answer: "Averaging down (buying more shares as the price drops) can lower your cost basis, but it also increases your exposure to a losing position. It works best with fundamentally sound investments experiencing temporary price declines.",
    },
  ],
  formula: "Average Cost = Total Amount Invested / Total Shares Purchased",
};

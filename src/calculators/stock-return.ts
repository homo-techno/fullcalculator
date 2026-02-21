import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stockReturnCalculator: CalculatorDefinition = {
  slug: "stock-return-calculator",
  title: "Stock Return Calculator",
  description: "Free stock return calculator. Calculate profit, loss, and ROI on stock investments including dividends and fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["stock return calculator", "stock profit calculator", "stock gain calculator", "stock investment return", "share profit loss"],
  variants: [
    {
      id: "return",
      name: "Stock Profit/Loss",
      fields: [
        { name: "buyPrice", label: "Buy Price (per share)", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "shares", label: "Number of Shares", type: "number", placeholder: "e.g. 10" },
        { name: "sellPrice", label: "Sell Price (per share)", type: "number", placeholder: "e.g. 185", prefix: "$" },
        { name: "buyFee", label: "Buy Commission", type: "number", placeholder: "e.g. 0", prefix: "$" },
        { name: "sellFee", label: "Sell Commission", type: "number", placeholder: "e.g. 0", prefix: "$" },
      ],
      calculate: (inputs) => {
        const buy = inputs.buyPrice as number;
        const shares = inputs.shares as number;
        const sell = inputs.sellPrice as number;
        const buyFee = (inputs.buyFee as number) || 0;
        const sellFee = (inputs.sellFee as number) || 0;
        if (!buy || !shares || !sell) return null;
        const totalCost = buy * shares + buyFee;
        const totalRevenue = sell * shares - sellFee;
        const profit = totalRevenue - totalCost;
        const roi = (profit / totalCost) * 100;
        return {
          primary: { label: profit >= 0 ? "Profit" : "Loss", value: `$${formatNumber(profit)}` },
          details: [
            { label: "ROI", value: `${formatNumber(roi, 2)}%` },
            { label: "Total cost", value: `$${formatNumber(totalCost)}` },
            { label: "Total revenue", value: `$${formatNumber(totalRevenue)}` },
            { label: "Per share gain", value: `$${formatNumber(sell - buy)}` },
            { label: "Total fees", value: `$${formatNumber(buyFee + sellFee)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "investment-calculator", "percentage-calculator"],
  faq: [
    { question: "How do I calculate stock return?", answer: "Stock return = (Sell Price - Buy Price) × Shares - Fees. ROI = Profit / Total Cost × 100%. For $150 buy, $185 sell, 10 shares: Profit = ($185-$150) × 10 = $350, ROI = 23.3%." },
  ],
  formula: "Profit = (Sell × Shares - Sell Fee) - (Buy × Shares + Buy Fee) | ROI = Profit / Cost × 100%",
};

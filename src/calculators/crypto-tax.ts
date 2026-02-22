import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoTaxCalculator: CalculatorDefinition = {
  slug: "crypto-tax-calculator",
  title: "Crypto Tax Calculator",
  description:
    "Free crypto tax calculator. Estimate your capital gains tax on cryptocurrency trades based on purchase price, sale price, holding period, and tax bracket.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["crypto tax", "capital gains", "cryptocurrency", "tax", "short term", "long term", "IRS"],
  variants: [
    {
      id: "capitalGains",
      name: "Capital Gains Tax",
      fields: [
        { name: "purchasePrice", label: "Total Purchase Price ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "salePrice", label: "Total Sale Price ($)", type: "number", placeholder: "e.g. 8000" },
        {
          name: "holdingPeriod",
          label: "Holding Period",
          type: "select",
          options: [
            { label: "Short-Term (< 1 year)", value: "short" },
            { label: "Long-Term (>= 1 year)", value: "long" },
          ],
          defaultValue: "short",
        },
        {
          name: "taxBracket",
          label: "Income Tax Bracket (%)",
          type: "select",
          options: [
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "22",
        },
      ],
      calculate: (inputs) => {
        const purchasePrice = inputs.purchasePrice as number;
        const salePrice = inputs.salePrice as number;
        const holdingPeriod = inputs.holdingPeriod as string;
        const incomeTaxRate = Number(inputs.taxBracket);

        if (!purchasePrice || !salePrice) return null;

        const gain = salePrice - purchasePrice;
        let taxRate: number;
        if (holdingPeriod === "long") {
          if (incomeTaxRate <= 15) taxRate = 0;
          else if (incomeTaxRate <= 35) taxRate = 15;
          else taxRate = 20;
        } else {
          taxRate = incomeTaxRate;
        }

        const taxOwed = gain > 0 ? gain * (taxRate / 100) : 0;
        const netProfit = gain - taxOwed;

        return {
          primary: { label: "Estimated Tax Owed", value: `$${formatNumber(taxOwed, 2)}` },
          details: [
            { label: "Capital Gain / Loss", value: `$${formatNumber(gain, 2)}` },
            { label: "Tax Rate Applied", value: `${formatNumber(taxRate, 0)}%` },
            { label: "Net Profit After Tax", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Holding Period", value: holdingPeriod === "long" ? "Long-Term" : "Short-Term" },
            { label: "Effective Tax on Gain", value: gain > 0 ? `${formatNumber((taxOwed / gain) * 100, 2)}%` : "N/A" },
          ],
        };
      },
    },
    {
      id: "multiTrade",
      name: "Multiple Trades Summary",
      fields: [
        { name: "totalProceeds", label: "Total Sale Proceeds ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "totalCostBasis", label: "Total Cost Basis ($)", type: "number", placeholder: "e.g. 35000" },
        { name: "shortTermGains", label: "Short-Term Gains ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "longTermGains", label: "Long-Term Gains ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "incomeTaxRate", label: "Income Tax Rate (%)", type: "number", placeholder: "e.g. 24" },
        { name: "ltcgRate", label: "Long-Term Capital Gains Rate (%)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const proceeds = inputs.totalProceeds as number;
        const costBasis = inputs.totalCostBasis as number;
        const stGains = inputs.shortTermGains as number;
        const ltGains = inputs.longTermGains as number;
        const stRate = inputs.incomeTaxRate as number;
        const ltRate = inputs.ltcgRate as number;

        if (!proceeds || !costBasis) return null;

        const totalGain = proceeds - costBasis;
        const stTax = (stGains || 0) * ((stRate || 0) / 100);
        const ltTax = (ltGains || 0) * ((ltRate || 0) / 100);
        const totalTax = stTax + ltTax;

        return {
          primary: { label: "Total Estimated Tax", value: `$${formatNumber(totalTax, 2)}` },
          details: [
            { label: "Total Gain / Loss", value: `$${formatNumber(totalGain, 2)}` },
            { label: "Short-Term Tax", value: `$${formatNumber(stTax, 2)}` },
            { label: "Long-Term Tax", value: `$${formatNumber(ltTax, 2)}` },
            { label: "Net After Tax", value: `$${formatNumber(totalGain - totalTax, 2)}` },
            { label: "Effective Tax Rate", value: totalGain > 0 ? `${formatNumber((totalTax / totalGain) * 100, 2)}%` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["crypto-profit-calculator", "capital-gains-calculator", "tax-bracket-calculator"],
  faq: [
    { question: "How is crypto taxed?", answer: "In the US, cryptocurrency is treated as property. Selling, trading, or spending crypto triggers a taxable event. Gains are taxed as either short-term (ordinary income rates) or long-term capital gains depending on holding period." },
    { question: "What is the difference between short-term and long-term crypto tax?", answer: "Short-term gains (held less than 1 year) are taxed at your ordinary income tax rate. Long-term gains (held 1 year or more) benefit from lower capital gains rates of 0%, 15%, or 20%." },
    { question: "Do I owe tax on crypto losses?", answer: "No, you do not owe tax on losses. In fact, crypto losses can be used to offset gains and up to $3,000 of ordinary income per year in the US." },
  ],
  formula: "Tax = Capital Gain x Tax Rate; Capital Gain = Sale Price - Purchase Price (Cost Basis)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exchangeRateCalculator: CalculatorDefinition = {
  slug: "exchange-rate-calculator",
  title: "Exchange Rate Calculator",
  description:
    "Free exchange rate calculator. Convert between currencies using a given exchange rate and view the inverse conversion.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["exchange rate", "currency converter", "forex", "currency exchange", "conversion"],
  variants: [
    {
      id: "convert",
      name: "Currency Conversion",
      fields: [
        { name: "amount", label: "Amount to Convert", type: "number", placeholder: "e.g. 1000" },
        { name: "exchangeRate", label: "Exchange Rate (1 unit = X target)", type: "number", placeholder: "e.g. 1.08" },
        { name: "fee", label: "Conversion Fee (%)", type: "number", placeholder: "e.g. 1.5" },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const exchangeRate = inputs.exchangeRate as number;
        const fee = inputs.fee as number || 0;

        if (!amount || !exchangeRate) return null;

        const convertedAmount = amount * exchangeRate;
        const feeAmount = convertedAmount * (fee / 100);
        const netConverted = convertedAmount - feeAmount;
        const inverseRate = 1 / exchangeRate;
        const effectiveRate = netConverted / amount;

        return {
          primary: { label: "Converted Amount", value: formatNumber(netConverted, 2) },
          details: [
            { label: "Gross Conversion", value: formatNumber(convertedAmount, 2) },
            { label: "Fee Deducted", value: formatNumber(feeAmount, 2) },
            { label: "Exchange Rate", value: formatNumber(exchangeRate, 6) },
            { label: "Inverse Rate", value: formatNumber(inverseRate, 6) },
            { label: "Effective Rate (after fees)", value: formatNumber(effectiveRate, 6) },
          ],
        };
      },
    },
    {
      id: "crossRate",
      name: "Cross Rate",
      fields: [
        { name: "amount", label: "Amount", type: "number", placeholder: "e.g. 1000" },
        { name: "rateAtoBase", label: "Currency A to Base Rate", type: "number", placeholder: "e.g. 1.08" },
        { name: "rateBtoBase", label: "Currency B to Base Rate", type: "number", placeholder: "e.g. 160.5" },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const rateAtoBase = inputs.rateAtoBase as number;
        const rateBtoBase = inputs.rateBtoBase as number;

        if (!amount || !rateAtoBase || !rateBtoBase) return null;

        const crossRate = rateBtoBase / rateAtoBase;
        const convertedAmount = amount * crossRate;
        const inverseCrossRate = rateAtoBase / rateBtoBase;

        return {
          primary: { label: "Converted Amount", value: formatNumber(convertedAmount, 2) },
          details: [
            { label: "Cross Rate (A to B)", value: formatNumber(crossRate, 6) },
            { label: "Inverse Cross Rate (B to A)", value: formatNumber(inverseCrossRate, 6) },
            { label: "Currency A / Base", value: formatNumber(rateAtoBase, 6) },
            { label: "Currency B / Base", value: formatNumber(rateBtoBase, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["crypto-profit-calculator", "budget-calculator", "real-return-calculator"],
  faq: [
    { question: "What is an exchange rate?", answer: "An exchange rate is the price of one currency in terms of another. For example, a EUR/USD rate of 1.08 means 1 Euro equals 1.08 US Dollars." },
    { question: "What is a cross rate?", answer: "A cross rate is the exchange rate between two currencies derived from their respective rates against a common third currency (base currency), such as the US Dollar." },
  ],
  formula: "Converted = Amount × Exchange Rate; Inverse Rate = 1 / Exchange Rate; Cross Rate = Rate_B / Rate_A",
};

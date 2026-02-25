import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transferTaxCalculator: CalculatorDefinition = {
  slug: "transfer-tax-calculator",
  title: "Real Estate Transfer Tax Calculator",
  description:
    "Free real estate transfer tax calculator. Calculate state and local transfer taxes, documentary stamp taxes, and recording fees for property sales.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "transfer tax calculator",
    "real estate transfer tax",
    "documentary stamp tax",
    "property transfer tax",
    "deed transfer tax",
  ],
  variants: [
    {
      id: "transfer-tax",
      name: "Transfer Tax Estimate",
      description: "Calculate real estate transfer taxes on a property sale",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "stateRate",
          label: "State Transfer Tax Rate",
          type: "number",
          placeholder: "e.g. 0.5",
          suffix: "%",
          min: 0,
          max: 5,
          step: 0.01,
          defaultValue: 0.5,
        },
        {
          name: "countyRate",
          label: "County/Local Transfer Tax Rate",
          type: "number",
          placeholder: "e.g. 0.25",
          suffix: "%",
          min: 0,
          max: 5,
          step: 0.01,
          defaultValue: 0.25,
        },
        {
          name: "sellerPortion",
          label: "Seller's Portion",
          type: "select",
          options: [
            { label: "100% (seller pays all)", value: "100" },
            { label: "50% (split equally)", value: "50" },
            { label: "0% (buyer pays all)", value: "0" },
          ],
          defaultValue: "50",
        },
        {
          name: "recordingFee",
          label: "Recording Fee",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
          defaultValue: 150,
        },
      ],
      calculate: (inputs) => {
        const salePrice = inputs.salePrice as number;
        const stateRate = (inputs.stateRate as number) || 0;
        const countyRate = (inputs.countyRate as number) || 0;
        const sellerPortion = parseInt(inputs.sellerPortion as string) || 50;
        const recordingFee = (inputs.recordingFee as number) || 0;
        if (!salePrice) return null;

        const stateTax = salePrice * (stateRate / 100);
        const countyTax = salePrice * (countyRate / 100);
        const totalTransferTax = stateTax + countyTax;
        const sellerCost = totalTransferTax * (sellerPortion / 100) + recordingFee;
        const buyerCost = totalTransferTax * ((100 - sellerPortion) / 100);
        const totalClosingTax = totalTransferTax + recordingFee;

        return {
          primary: {
            label: "Total Transfer Tax",
            value: `$${formatNumber(totalTransferTax)}`,
          },
          details: [
            { label: "State transfer tax", value: `$${formatNumber(stateTax)}` },
            { label: "County/local transfer tax", value: `$${formatNumber(countyTax)}` },
            { label: "Recording fee", value: `$${formatNumber(recordingFee)}` },
            { label: "Seller's portion", value: `$${formatNumber(sellerCost)}` },
            { label: "Buyer's portion", value: `$${formatNumber(buyerCost)}` },
            { label: "Tax as % of sale price", value: `${formatNumber((totalTransferTax / salePrice) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["real-estate-commission-calculator", "title-insurance-calculator", "escrow-calculator"],
  faq: [
    {
      question: "What is a real estate transfer tax?",
      answer:
        "A real estate transfer tax is a fee imposed by state, county, or city governments when property ownership is transferred. It is typically calculated as a percentage of the sale price and paid at closing. Rates vary significantly by jurisdiction.",
    },
    {
      question: "Who pays the transfer tax?",
      answer:
        "Transfer tax responsibility varies by state and local custom. In some areas the seller pays, in others the buyer pays, and in many areas the cost is split. The allocation is often negotiable as part of the purchase agreement.",
    },
    {
      question: "How much are transfer taxes?",
      answer:
        "Transfer tax rates vary widely. Some states have no transfer tax (e.g., Texas, Wyoming), while others charge 0.1-2% or more. Cities may add additional taxes. Total transfer taxes typically range from $500 to several thousand dollars.",
    },
  ],
  formula: "Transfer Tax = Sale Price x (State Rate + Local Rate)",
};

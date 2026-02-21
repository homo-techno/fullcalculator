import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salesTaxReverseCalculator: CalculatorDefinition = {
  slug: "sales-tax-reverse-calculator",
  title: "Reverse Sales Tax Calculator",
  description: "Free reverse sales tax calculator. Find the pre-tax price from a total amount including sales tax. Calculate the original price and tax amount from any receipt total.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["reverse sales tax calculator", "pre-tax price calculator", "remove sales tax", "back out sales tax", "calculate price before tax"],
  variants: [
    {
      id: "reverse-sales-tax",
      name: "Find Pre-Tax Price",
      description: "Calculate the original price before sales tax was added",
      fields: [
        { name: "totalPrice", label: "Total Price (including tax)", type: "number", placeholder: "e.g. 107.50", prefix: "$" },
        { name: "taxRate", label: "Sales Tax Rate", type: "number", placeholder: "e.g. 8.25", suffix: "%" },
      ],
      calculate: (inputs) => {
        const totalPrice = inputs.totalPrice as number;
        const taxRate = inputs.taxRate as number;

        if (!totalPrice || taxRate === undefined) return null;

        const preTaxPrice = totalPrice / (1 + taxRate / 100);
        const taxAmount = totalPrice - preTaxPrice;
        const taxPercentOfTotal = (taxAmount / totalPrice) * 100;

        return {
          primary: { label: "Pre-Tax Price", value: `$${formatNumber(preTaxPrice)}` },
          details: [
            { label: "Total price (with tax)", value: `$${formatNumber(totalPrice)}` },
            { label: "Sales tax amount", value: `$${formatNumber(taxAmount)}` },
            { label: "Sales tax rate", value: `${taxRate}%` },
            { label: "Tax as % of total", value: `${formatNumber(taxPercentOfTotal)}%` },
          ],
        };
      },
    },
    {
      id: "batch-reverse",
      name: "Multiple Items Reverse Tax",
      description: "Reverse calculate tax on a batch of purchases",
      fields: [
        { name: "totalSpent", label: "Total Amount Spent (with tax)", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "taxRate", label: "Sales Tax Rate", type: "number", placeholder: "e.g. 8.25", suffix: "%" },
        { name: "numItems", label: "Number of Items", type: "number", placeholder: "e.g. 5", min: 1, defaultValue: 1 },
        { name: "exemptAmount", label: "Tax-Exempt Amount (if any)", type: "number", placeholder: "e.g. 0", prefix: "$", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const totalSpent = inputs.totalSpent as number;
        const taxRate = inputs.taxRate as number;
        const numItems = (inputs.numItems as number) || 1;
        const exemptAmount = (inputs.exemptAmount as number) || 0;

        if (!totalSpent || taxRate === undefined) return null;

        const taxableTotal = totalSpent - exemptAmount;
        const taxablePreTax = taxableTotal / (1 + taxRate / 100);
        const totalTaxPaid = taxableTotal - taxablePreTax;
        const totalPreTax = taxablePreTax + exemptAmount;
        const avgPricePerItem = totalPreTax / numItems;
        const avgTaxPerItem = totalTaxPaid / numItems;

        return {
          primary: { label: "Total Pre-Tax Amount", value: `$${formatNumber(totalPreTax)}` },
          details: [
            { label: "Total spent", value: `$${formatNumber(totalSpent)}` },
            { label: "Total sales tax paid", value: `$${formatNumber(totalTaxPaid)}` },
            { label: "Taxable amount (pre-tax)", value: `$${formatNumber(taxablePreTax)}` },
            { label: "Tax-exempt amount", value: exemptAmount > 0 ? `$${formatNumber(exemptAmount)}` : "None" },
            { label: "Average pre-tax per item", value: `$${formatNumber(avgPricePerItem)}` },
            { label: "Average tax per item", value: `$${formatNumber(avgTaxPerItem)}` },
            { label: "Tax rate", value: `${taxRate}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "discount-calculator", "percentage-calculator"],
  faq: [
    { question: "How do I calculate the price before tax?", answer: "Divide the total price by (1 + tax rate as a decimal). For example, if the total is $107.50 and the tax rate is 7.5%, the pre-tax price is $107.50 / 1.075 = $100. The tax amount is $107.50 - $100 = $7.50." },
    { question: "Why can't I just subtract the tax percentage from the total?", answer: "Because the tax was calculated on the pre-tax price, not the total. If you simply subtract 8% from $108, you get $99.36 - which is wrong. The correct answer is $108 / 1.08 = $100. The difference matters more with higher amounts and tax rates." },
    { question: "What is the average US sales tax rate?", answer: "The average combined state and local sales tax rate in the US is about 6.6%. Five states have no sales tax: Alaska (though some local taxes apply), Delaware, Montana, New Hampshire, and Oregon. The highest combined rates are in Louisiana (~9.55%), Tennessee (~9.55%), and Arkansas (~9.47%)." },
  ],
  formula: "Pre-Tax Price = Total Price / (1 + Tax Rate / 100). Tax Amount = Total Price - Pre-Tax Price.",
};

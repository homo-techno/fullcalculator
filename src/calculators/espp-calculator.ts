import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const esppCalculator: CalculatorDefinition = {
  slug: "espp-calculator",
  title: "ESPP Calculator",
  description: "Calculate the value and return of participating in an employee stock purchase plan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ESPP calculator", "employee stock purchase plan", "ESPP return"],
  variants: [{
    id: "standard",
    name: "ESPP",
    description: "Calculate the value and return of participating in an employee stock purchase plan",
    fields: [
      { name: "salary", label: "Annual Salary", type: "number", suffix: "$", min: 20000, max: 1000000, defaultValue: 100000 },
      { name: "contributionPct", label: "Contribution Percent", type: "number", suffix: "%", min: 1, max: 15, defaultValue: 10 },
      { name: "discount", label: "ESPP Discount", type: "number", suffix: "%", min: 5, max: 15, defaultValue: 15 },
      { name: "currentPrice", label: "Current Stock Price", type: "number", suffix: "$", min: 1, max: 5000, defaultValue: 150 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      const contrib = inputs.contributionPct as number;
      const discount = inputs.discount as number;
      const price = inputs.currentPrice as number;
      if (!salary || !contrib || !price) return null;
      const annualContrib = salary * (contrib / 100);
      const maxContrib = Math.min(annualContrib, 25000);
      const purchasePrice = price * (1 - discount / 100);
      const sharesBought = Math.floor(maxContrib / purchasePrice);
      const marketValue = sharesBought * price;
      const instantGain = marketValue - (sharesBought * purchasePrice);
      const returnPct = purchasePrice > 0 ? (instantGain / (sharesBought * purchasePrice)) * 100 : 0;
      return {
        primary: { label: "Instant Gain", value: "$" + formatNumber(instantGain) },
        details: [
          { label: "Annual Contribution", value: "$" + formatNumber(maxContrib) },
          { label: "Purchase Price per Share", value: "$" + formatNumber(purchasePrice) },
          { label: "Shares Purchased", value: formatNumber(sharesBought) },
          { label: "Market Value", value: "$" + formatNumber(marketValue) },
          { label: "Effective Return", value: formatNumber(returnPct) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["stock-option-calculator", "rsu-tax-calculator"],
  faq: [
    { question: "How does an ESPP work?", answer: "An ESPP allows employees to purchase company stock at a discount, typically 15 percent below market price. Contributions are deducted from your paycheck over a purchase period, usually 6 months." },
    { question: "What is the ESPP contribution limit?", answer: "The IRS limits ESPP purchases to $25,000 worth of stock per calendar year, based on the fair market value at the start of the offering period." },
  ],
  formula: "Instant Gain = (Market Price - Purchase Price) x Shares; Return = Gain / Cost x 100",
};

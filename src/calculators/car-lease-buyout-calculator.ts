import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carLeaseBuyoutCalculator: CalculatorDefinition = {
  slug: "car-lease-buyout-calculator",
  title: "Car Lease Buyout Calculator",
  description: "Determine whether buying out your car lease is a good financial decision based on residual value and market price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lease buyout", "car lease purchase", "lease end options"],
  variants: [{
    id: "standard",
    name: "Car Lease Buyout",
    description: "Determine whether buying out your car lease is a good financial decision based on residual value and market price",
    fields: [
      { name: "residualValue", label: "Lease Residual Value", type: "number", prefix: "$", min: 1000, max: 200000, defaultValue: 18000 },
      { name: "marketValue", label: "Current Market Value", type: "number", prefix: "$", min: 1000, max: 200000, defaultValue: 22000 },
      { name: "purchaseFee", label: "Purchase Fee", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 300 },
      { name: "salesTax", label: "Sales Tax Rate", type: "number", suffix: "%", min: 0, max: 15, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const residual = inputs.residualValue as number;
      const market = inputs.marketValue as number;
      const fee = inputs.purchaseFee as number;
      const taxRate = inputs.salesTax as number;
      if (!residual || !market) return null;
      const tax = residual * (taxRate / 100);
      const totalBuyout = residual + fee + tax;
      const equity = market - totalBuyout;
      const verdict = equity > 0 ? "Good deal - you gain equity" : "Not recommended - you overpay";
      return {
        primary: { label: "Equity (or Loss)", value: "$" + formatNumber(Math.round(equity)) },
        details: [
          { label: "Total Buyout Cost", value: "$" + formatNumber(Math.round(totalBuyout)) },
          { label: "Market Value", value: "$" + formatNumber(Math.round(market)) },
          { label: "Sales Tax", value: "$" + formatNumber(Math.round(tax)) },
          { label: "Verdict", value: verdict },
        ],
      };
    },
  }],
  relatedSlugs: ["car-depreciation-schedule-calculator", "car-shipping-cost-calculator"],
  faq: [
    { question: "Is it worth buying out a car lease?", answer: "If the market value exceeds your buyout cost (residual plus fees and tax), buying out can be a good deal." },
    { question: "What is residual value on a lease?", answer: "Residual value is the predetermined amount the car is expected to be worth at lease end, set when you signed the lease." },
  ],
  formula: "Equity = Market Value - (Residual Value + Purchase Fee + Sales Tax)",
};

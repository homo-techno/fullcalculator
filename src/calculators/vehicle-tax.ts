import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vehicleTaxCalculator: CalculatorDefinition = {
  slug: "vehicle-tax-calculator",
  title: "Vehicle Sales Tax Calculator",
  description: "Free vehicle sales tax calculator. Estimate the sales tax on a car purchase based on vehicle price and your state or local tax rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vehicle sales tax", "car tax calculator", "auto sales tax", "car purchase tax", "vehicle tax estimator"],
  variants: [
    {
      id: "salestax",
      name: "Calculate Vehicle Sales Tax",
      description: "Estimate sales tax and total cost on a vehicle purchase",
      fields: [
        { name: "price", label: "Vehicle Price", type: "number", placeholder: "e.g. 35000", prefix: "$" },
        { name: "tradeIn", label: "Trade-In Value (if applicable)", type: "number", placeholder: "e.g. 8000", prefix: "$" },
        { name: "rebate", label: "Manufacturer Rebate", type: "number", placeholder: "e.g. 2000", prefix: "$" },
        { name: "stateTax", label: "State Sales Tax Rate (%)", type: "number", placeholder: "e.g. 6.25", suffix: "%" },
        { name: "localTax", label: "Local/County Tax Rate (%)", type: "number", placeholder: "e.g. 1.5", suffix: "%" },
        { name: "taxOnTradeIn", label: "Tax Credit for Trade-In?", type: "select", options: [
          { label: "Yes (tax on difference)", value: "yes" },
          { label: "No (tax on full price)", value: "no" },
        ], defaultValue: "yes" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const tradeIn = (inputs.tradeIn as number) || 0;
        const rebate = (inputs.rebate as number) || 0;
        const stateTax = (inputs.stateTax as number) || 0;
        const localTax = (inputs.localTax as number) || 0;
        const taxOnTradeIn = (inputs.taxOnTradeIn as string) || "yes";
        if (!price) return null;

        const totalTaxRate = stateTax + localTax;
        let taxableAmount: number;

        if (taxOnTradeIn === "yes") {
          taxableAmount = Math.max(0, price - tradeIn - rebate);
        } else {
          taxableAmount = Math.max(0, price - rebate);
        }

        const totalTax = taxableAmount * (totalTaxRate / 100);
        const stateTaxAmount = taxableAmount * (stateTax / 100);
        const localTaxAmount = taxableAmount * (localTax / 100);
        const outOfPocket = price - tradeIn + totalTax;

        return {
          primary: { label: "Total Sales Tax", value: `$${formatNumber(totalTax)}` },
          details: [
            { label: "Taxable amount", value: `$${formatNumber(taxableAmount)}` },
            { label: "State tax", value: `$${formatNumber(stateTaxAmount)} (${stateTax}%)` },
            { label: "Local tax", value: `$${formatNumber(localTaxAmount)} (${localTax}%)` },
            { label: "Combined tax rate", value: `${formatNumber(totalTaxRate, 2)}%` },
            { label: "Total out-of-pocket", value: `$${formatNumber(outOfPocket)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-payment-calculator", "car-trade-in-calculator", "car-loan-calculator"],
  faq: [
    { question: "Do all states charge sales tax on cars?", answer: "No. Alaska, Delaware, Montana, New Hampshire, and Oregon do not have a state sales tax. However, some localities in Alaska do charge local sales tax. In most other states, you pay sales tax on the vehicle purchase price." },
    { question: "Is sales tax calculated on the full price or after trade-in?", answer: "This varies by state. Most states allow a trade-in tax credit, meaning you only pay tax on the difference between the new car price and trade-in value. Some states (California, Hawaii, etc.) tax the full purchase price regardless of trade-in." },
    { question: "Are there other fees besides sales tax?", answer: "Yes. You will also typically pay title fees, registration fees, documentation fees, and potentially inspection fees. These vary by state and dealer, usually adding $200-$800 to your total cost." },
  ],
  formula: "Sales Tax = (Vehicle Price - Trade-In Credit - Rebates) x (State Rate + Local Rate)",
};

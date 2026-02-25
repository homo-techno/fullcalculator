import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyRoiCalculator: CalculatorDefinition = {
  slug: "property-roi-calculator",
  title: "Property ROI Calculator",
  description:
    "Free property ROI calculator. Calculate total return on investment for real estate including appreciation, rental income, tax benefits, and equity buildup.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "property roi calculator",
    "real estate roi",
    "property return on investment",
    "real estate returns",
    "property investment return",
  ],
  variants: [
    {
      id: "total-roi",
      name: "Total Property ROI",
      description: "Calculate comprehensive property ROI including all income sources",
      fields: [
        {
          name: "purchasePrice",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "currentValue",
          label: "Current / Sale Value",
          type: "number",
          placeholder: "e.g. 380000",
          prefix: "$",
          min: 0,
        },
        {
          name: "totalCashInvested",
          label: "Total Cash Invested (down + closing + repairs)",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
        {
          name: "totalRentalIncome",
          label: "Total Net Rental Income Earned",
          type: "number",
          placeholder: "e.g. 30000",
          prefix: "$",
          min: 0,
        },
        {
          name: "mortgagePaydown",
          label: "Total Mortgage Principal Paid Down",
          type: "number",
          placeholder: "e.g. 15000",
          prefix: "$",
          min: 0,
        },
        {
          name: "yearsHeld",
          label: "Years Held",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "years",
          min: 0.1,
          step: 0.1,
        },
        {
          name: "sellingCosts",
          label: "Selling Costs (commissions, etc.)",
          type: "number",
          placeholder: "e.g. 22000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const purchasePrice = inputs.purchasePrice as number;
        const currentValue = inputs.currentValue as number;
        const cashInvested = inputs.totalCashInvested as number;
        const rentalIncome = (inputs.totalRentalIncome as number) || 0;
        const principalPaydown = (inputs.mortgagePaydown as number) || 0;
        const years = inputs.yearsHeld as number;
        const sellingCosts = (inputs.sellingCosts as number) || 0;
        if (!purchasePrice || !currentValue || !cashInvested || !years) return null;

        const appreciation = currentValue - purchasePrice;
        const totalReturn = appreciation + rentalIncome + principalPaydown - sellingCosts;
        const totalROI = (totalReturn / cashInvested) * 100;
        const annualizedROI = (Math.pow(1 + totalReturn / cashInvested, 1 / years) - 1) * 100;

        return {
          primary: {
            label: "Total ROI",
            value: `${formatNumber(totalROI)}%`,
          },
          details: [
            { label: "Annualized ROI", value: `${formatNumber(annualizedROI)}%` },
            { label: "Total dollar return", value: `$${formatNumber(totalReturn)}` },
            { label: "Appreciation gain", value: `$${formatNumber(appreciation)}` },
            { label: "Net rental income", value: `$${formatNumber(rentalIncome)}` },
            { label: "Equity from mortgage paydown", value: `$${formatNumber(principalPaydown)}` },
            { label: "Selling costs", value: `$${formatNumber(sellingCosts)}` },
          ],
        };
      },
    },
    {
      id: "annual-return",
      name: "Annual Return Breakdown",
      description: "Break down annual returns from a rental property",
      fields: [
        {
          name: "propertyValue",
          label: "Current Property Value",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "annualAppreciation",
          label: "Annual Appreciation Rate",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
          min: -10,
          max: 20,
          step: 0.1,
        },
        {
          name: "annualCashFlow",
          label: "Annual Net Cash Flow",
          type: "number",
          placeholder: "e.g. 6000",
          prefix: "$",
        },
        {
          name: "annualPrincipalPaydown",
          label: "Annual Mortgage Principal Paydown",
          type: "number",
          placeholder: "e.g. 4000",
          prefix: "$",
          min: 0,
        },
        {
          name: "totalEquity",
          label: "Total Equity in Property",
          type: "number",
          placeholder: "e.g. 120000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const value = inputs.propertyValue as number;
        const appreciationRate = inputs.annualAppreciation as number;
        const cashFlow = inputs.annualCashFlow as number;
        const principalPaydown = (inputs.annualPrincipalPaydown as number) || 0;
        const equity = inputs.totalEquity as number;
        if (!value || appreciationRate === undefined || cashFlow === undefined || !equity) return null;

        const appreciationGain = value * (appreciationRate / 100);
        const totalAnnualReturn = cashFlow + appreciationGain + principalPaydown;
        const returnOnEquity = (totalAnnualReturn / equity) * 100;

        return {
          primary: {
            label: "Return on Equity",
            value: `${formatNumber(returnOnEquity)}%`,
          },
          details: [
            { label: "Total annual return", value: `$${formatNumber(totalAnnualReturn)}` },
            { label: "From appreciation", value: `$${formatNumber(appreciationGain)}` },
            { label: "From cash flow", value: `$${formatNumber(cashFlow)}` },
            { label: "From loan paydown", value: `$${formatNumber(principalPaydown)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "investment-property-calculator", "rental-cash-flow-calculator"],
  faq: [
    {
      question: "How do you calculate ROI on real estate?",
      answer:
        "Total property ROI considers four components: appreciation (property value increase), cash flow (net rental income), principal paydown (equity gained from mortgage payments), and tax benefits. ROI = Total Return / Cash Invested x 100.",
    },
    {
      question: "What is a good ROI on real estate?",
      answer:
        "A good total ROI on real estate is typically 10-20% annually when including all return components. Cash-on-cash returns of 8-12% are considered good for rental properties. Location, leverage, and management quality heavily influence returns.",
    },
    {
      question: "What is return on equity in real estate?",
      answer:
        "Return on equity measures your annual total return against the equity you have in the property. As your equity grows through appreciation and paydown, you may want to refinance or sell if your return on equity drops below alternative investment returns.",
    },
  ],
  formula: "Total ROI = (Appreciation + Rental Income + Principal Paydown - Selling Costs) / Cash Invested x 100",
};

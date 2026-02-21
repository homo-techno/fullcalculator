import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentToOwnCalculator: CalculatorDefinition = {
  slug: "rent-to-own-calculator",
  title: "Rent to Own Calculator",
  description:
    "Free rent-to-own calculator. Analyze the costs and equity built in a lease-option or rent-to-own agreement compared to traditional renting or buying.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rent to own calculator",
    "lease option calculator",
    "rent to own vs buy",
    "lease to own calculator",
    "rent to own home calculator",
  ],
  variants: [
    {
      id: "analyze",
      name: "Rent-to-Own Analysis",
      description: "Analyze the cost and equity of a rent-to-own agreement",
      fields: [
        { name: "purchasePrice", label: "Agreed Purchase Price", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "optionFee", label: "Option Fee (upfront)", type: "number", placeholder: "e.g. 5000", prefix: "$", min: 0 },
        { name: "monthlyPayment", label: "Monthly Rent Payment", type: "number", placeholder: "e.g. 1800", prefix: "$", min: 0 },
        { name: "rentCredit", label: "Monthly Rent Credit (toward purchase)", type: "number", placeholder: "e.g. 300", prefix: "$", min: 0 },
        { name: "marketRent", label: "Fair Market Rent", type: "number", placeholder: "e.g. 1500", prefix: "$", min: 0 },
        {
          name: "leaseTerm",
          label: "Lease-Option Term",
          type: "select",
          options: [
            { label: "1 year", value: "12" },
            { label: "2 years", value: "24" },
            { label: "3 years", value: "36" },
            { label: "5 years", value: "60" },
          ],
          defaultValue: "36",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const optionFee = (inputs.optionFee as number) || 0;
        const monthlyPayment = inputs.monthlyPayment as number;
        const rentCredit = (inputs.rentCredit as number) || 0;
        const marketRent = (inputs.marketRent as number) || 0;
        const months = parseInt(inputs.leaseTerm as string) || 36;
        if (!price || !monthlyPayment) return null;

        const totalPaid = monthlyPayment * months + optionFee;
        const totalRentCredits = rentCredit * months + optionFee;
        const remainingPrice = price - totalRentCredits;
        const premiumOverMarket = monthlyPayment - marketRent;
        const totalPremium = premiumOverMarket * months;
        const totalCostIfNotBuying = totalPaid; // lost if you don't exercise

        return {
          primary: { label: "Remaining Purchase Price", value: `$${formatNumber(remainingPrice)}` },
          details: [
            { label: "Original purchase price", value: `$${formatNumber(price)}` },
            { label: "Total rent credits earned", value: `$${formatNumber(totalRentCredits)}` },
            { label: "Option fee", value: `$${formatNumber(optionFee)}` },
            { label: "Total paid during lease", value: `$${formatNumber(totalPaid)}` },
            { label: "Premium over market rent", value: `$${formatNumber(premiumOverMarket)}/mo` },
            { label: "Total premium paid", value: `$${formatNumber(totalPremium)}` },
            { label: "Lease term", value: `${months} months (${formatNumber(months / 12, 1)} years)` },
          ],
          note: premiumOverMarket > 0
            ? `You pay $${formatNumber(premiumOverMarket)}/mo above market rent. If you don't exercise the option, you lose the option fee and rent credits.`
            : undefined,
        };
      },
    },
    {
      id: "compare",
      name: "Rent-to-Own vs. Traditional Rent",
      description: "Compare rent-to-own costs to regular renting",
      fields: [
        { name: "rtoPayment", label: "Rent-to-Own Monthly Payment", type: "number", placeholder: "e.g. 1800", prefix: "$", min: 0 },
        { name: "regularRent", label: "Regular Rent (comparable)", type: "number", placeholder: "e.g. 1400", prefix: "$", min: 0 },
        { name: "optionFee", label: "Option Fee (upfront)", type: "number", placeholder: "e.g. 5000", prefix: "$", min: 0 },
        { name: "rentCredit", label: "Monthly Rent Credit", type: "number", placeholder: "e.g. 300", prefix: "$", min: 0 },
        {
          name: "months",
          label: "Comparison Period",
          type: "select",
          options: [
            { label: "1 year", value: "12" },
            { label: "2 years", value: "24" },
            { label: "3 years", value: "36" },
          ],
          defaultValue: "24",
        },
      ],
      calculate: (inputs) => {
        const rto = inputs.rtoPayment as number;
        const regular = inputs.regularRent as number;
        const optionFee = (inputs.optionFee as number) || 0;
        const credit = (inputs.rentCredit as number) || 0;
        const months = parseInt(inputs.months as string) || 24;
        if (!rto || !regular) return null;

        const totalRTO = rto * months + optionFee;
        const totalRegular = regular * months;
        const equityBuilt = credit * months + optionFee;
        const extraCost = totalRTO - totalRegular;
        const netCost = extraCost - equityBuilt;

        return {
          primary: { label: "Equity Built (if purchased)", value: `$${formatNumber(equityBuilt)}` },
          details: [
            { label: "Total rent-to-own cost", value: `$${formatNumber(totalRTO)}` },
            { label: "Total regular rent cost", value: `$${formatNumber(totalRegular)}` },
            { label: "Extra cost over regular rent", value: `$${formatNumber(extraCost)}` },
            { label: "Net extra cost (after credits)", value: `$${formatNumber(netCost)}` },
            { label: "Monthly savings if regular renting", value: `$${formatNumber(rto - regular)}` },
          ],
          note: netCost > 0
            ? `You pay $${formatNumber(netCost)} more than regular renting, beyond what goes to equity. Worth it if you plan to buy.`
            : "The rent credits fully offset or exceed the premium over market rent.",
        };
      },
    },
  ],
  relatedSlugs: ["rent-vs-buy-calculator", "mortgage-calculator", "rent-affordability-calculator"],
  faq: [
    {
      question: "How does rent-to-own work?",
      answer:
        "In a rent-to-own (lease-option) agreement, you rent a home with an option to purchase it at a predetermined price within a set period (1-5 years). You pay an upfront option fee and typically higher-than-market rent, with a portion credited toward the purchase price.",
    },
    {
      question: "What happens if I don't buy the home?",
      answer:
        "If you don't exercise the purchase option, you typically lose the option fee and any rent credits accumulated. The extra premium you paid above market rent is also lost. Some contracts may allow extension of the option period for an additional fee.",
    },
    {
      question: "Is rent-to-own a good idea?",
      answer:
        "Rent-to-own can help buyers who need time to build credit, save a down payment, or test a neighborhood. However, the premium costs, risk of losing the option fee, and locked purchase price (which might end up above market) are downsides. Always have a real estate attorney review the contract.",
    },
  ],
  formula:
    "Remaining Price = Purchase Price − (Rent Credits × Months + Option Fee) | Total RTO Cost = Monthly Payment × Months + Option Fee",
};

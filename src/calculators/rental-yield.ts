import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentalYieldCalculator: CalculatorDefinition = {
  slug: "rental-yield-calculator",
  title: "Rental Yield Calculator",
  description: "Free rental yield calculator. Calculate gross and net rental yield, cap rate, and cash-on-cash return for investment properties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rental yield calculator", "cap rate calculator", "rental property calculator", "real estate roi", "rental income calculator"],
  variants: [
    {
      id: "yield",
      name: "Rental Yield & Cap Rate",
      fields: [
        { name: "price", label: "Property Price", type: "number", prefix: "$", placeholder: "e.g. 300000" },
        { name: "rent", label: "Monthly Rent", type: "number", prefix: "$", placeholder: "e.g. 2000" },
        { name: "expenses", label: "Annual Expenses (taxes, insurance, maintenance)", type: "number", prefix: "$", placeholder: "e.g. 6000", defaultValue: 0 },
        { name: "vacancy", label: "Vacancy Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 5", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number, rent = inputs.rent as number;
        const expenses = (inputs.expenses as number) || 0;
        const vacancy = (inputs.vacancy as number) || 5;
        if (!price || !rent) return null;
        const annualGross = rent * 12;
        const effectiveRent = annualGross * (1 - vacancy / 100);
        const noi = effectiveRent - expenses;
        const grossYield = (annualGross / price) * 100;
        const netYield = (noi / price) * 100;
        const grm = price / annualGross;
        return {
          primary: { label: "Net Yield (Cap Rate)", value: `${formatNumber(netYield, 2)}%` },
          details: [
            { label: "Gross yield", value: `${formatNumber(grossYield, 2)}%` },
            { label: "Annual gross rent", value: `$${formatNumber(annualGross, 2)}` },
            { label: "Net operating income", value: `$${formatNumber(noi, 2)}` },
            { label: "Gross Rent Multiplier", value: formatNumber(grm, 1) },
            { label: "Monthly NOI", value: `$${formatNumber(noi / 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "mortgage-calculator", "property-tax-calculator"],
  faq: [{ question: "What is cap rate?", answer: "Cap rate (capitalization rate) = Net Operating Income / Property Value × 100. It measures the return on a real estate investment independent of financing. A good cap rate is typically 5-10%, varying by market and property type." }],
  formula: "Cap Rate = NOI / Price × 100 | NOI = Rent - Expenses - Vacancy",
};

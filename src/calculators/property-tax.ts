import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyTaxCalculator: CalculatorDefinition = {
  slug: "property-tax-calculator",
  title: "Property Tax Calculator",
  description: "Free property tax calculator. Estimate annual and monthly property taxes based on home value and tax rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["property tax calculator", "real estate tax", "home tax calculator", "property tax estimator"],
  variants: [
    {
      id: "fromRate",
      name: "From Tax Rate",
      fields: [
        { name: "value", label: "Property Value", type: "number", prefix: "$", placeholder: "e.g. 350000" },
        { name: "rate", label: "Tax Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 1.25" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number, rate = inputs.rate as number;
        if (!value || !rate) return null;
        const annual = value * (rate / 100);
        return {
          primary: { label: "Annual Property Tax", value: `$${formatNumber(annual, 2)}` },
          details: [
            { label: "Monthly", value: `$${formatNumber(annual / 12, 2)}` },
            { label: "Effective rate", value: `${formatNumber(rate, 3)}%` },
            { label: "Tax per $1,000", value: `$${formatNumber((rate / 100) * 1000, 2)}` },
          ],
        };
      },
    },
    {
      id: "fromMills",
      name: "From Mill Rate",
      fields: [
        { name: "assessed", label: "Assessed Value", type: "number", prefix: "$", placeholder: "e.g. 280000" },
        { name: "mills", label: "Mill Rate (per $1000)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const assessed = inputs.assessed as number, mills = inputs.mills as number;
        if (!assessed || !mills) return null;
        const annual = assessed * (mills / 1000);
        return {
          primary: { label: "Annual Property Tax", value: `$${formatNumber(annual, 2)}` },
          details: [
            { label: "Monthly", value: `$${formatNumber(annual / 12, 2)}` },
            { label: "Equivalent rate", value: `${formatNumber(mills / 10, 3)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "down-payment-calculator", "tax-calculator"],
  faq: [{ question: "How is property tax calculated?", answer: "Property tax = Assessed Value × Tax Rate. Tax rates are usually expressed as a percentage or mill rate (per $1,000). For a $350,000 home at 1.25%: $350,000 × 0.0125 = $4,375/year." }],
  formula: "Tax = Assessed Value × Rate",
};

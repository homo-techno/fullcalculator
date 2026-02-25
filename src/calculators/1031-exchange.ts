import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exchange1031Calculator: CalculatorDefinition = {
  slug: "1031-exchange-calculator",
  title: "1031 Exchange Calculator",
  description:
    "Free 1031 exchange calculator. Estimate tax deferral savings, boot amounts, and replacement property requirements for like-kind exchanges.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "1031 exchange calculator",
    "like-kind exchange",
    "tax deferred exchange",
    "real estate exchange calculator",
    "property exchange tax",
  ],
  variants: [
    {
      id: "tax-deferral",
      name: "Tax Deferral Estimate",
      description: "Calculate potential tax savings from a 1031 exchange",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price of Relinquished Property",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "originalBasis",
          label: "Original Purchase Price (Adjusted Basis)",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "improvements",
          label: "Capital Improvements Made",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "depreciation",
          label: "Total Depreciation Taken",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
          min: 0,
        },
        {
          name: "capitalGainsTaxRate",
          label: "Capital Gains Tax Rate",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
          defaultValue: 15,
        },
        {
          name: "depreciationRecaptureRate",
          label: "Depreciation Recapture Rate",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
          defaultValue: 25,
        },
      ],
      calculate: (inputs) => {
        const salePrice = inputs.salePrice as number;
        const basis = inputs.originalBasis as number;
        const improvements = (inputs.improvements as number) || 0;
        const depreciation = (inputs.depreciation as number) || 0;
        const cgRate = (inputs.capitalGainsTaxRate as number) || 15;
        const drRate = (inputs.depreciationRecaptureRate as number) || 25;
        if (!salePrice || !basis) return null;

        const adjustedBasis = basis + improvements - depreciation;
        const totalGain = salePrice - adjustedBasis;
        const capitalGainsTax = Math.max(0, totalGain - depreciation) * (cgRate / 100);
        const depreciationRecaptureTax = depreciation * (drRate / 100);
        const totalTaxDeferred = capitalGainsTax + depreciationRecaptureTax;

        return {
          primary: {
            label: "Total Tax Deferred",
            value: `$${formatNumber(totalTaxDeferred)}`,
          },
          details: [
            { label: "Total gain", value: `$${formatNumber(totalGain)}` },
            { label: "Adjusted basis", value: `$${formatNumber(adjustedBasis)}` },
            { label: "Capital gains tax deferred", value: `$${formatNumber(capitalGainsTax)}` },
            { label: "Depreciation recapture deferred", value: `$${formatNumber(depreciationRecaptureTax)}` },
            { label: "Min. replacement property value", value: `$${formatNumber(salePrice)}` },
          ],
        };
      },
    },
    {
      id: "boot",
      name: "Boot Calculator",
      description: "Calculate taxable boot in a 1031 exchange",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price of Relinquished Property",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "replacementPrice",
          label: "Replacement Property Price",
          type: "number",
          placeholder: "e.g. 450000",
          prefix: "$",
          min: 0,
        },
        {
          name: "mortgageRelieved",
          label: "Mortgage Paid Off (Relinquished)",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
          min: 0,
        },
        {
          name: "newMortgage",
          label: "New Mortgage (Replacement)",
          type: "number",
          placeholder: "e.g. 180000",
          prefix: "$",
          min: 0,
        },
        {
          name: "taxRate",
          label: "Capital Gains Tax Rate",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
          defaultValue: 15,
        },
      ],
      calculate: (inputs) => {
        const salePrice = inputs.salePrice as number;
        const replacementPrice = inputs.replacementPrice as number;
        const mortgageRelieved = (inputs.mortgageRelieved as number) || 0;
        const newMortgage = (inputs.newMortgage as number) || 0;
        const taxRate = (inputs.taxRate as number) || 15;
        if (!salePrice || !replacementPrice) return null;

        const cashBoot = Math.max(0, salePrice - replacementPrice);
        const mortgageBoot = Math.max(0, mortgageRelieved - newMortgage);
        const totalBoot = cashBoot + mortgageBoot;
        const taxOnBoot = totalBoot * (taxRate / 100);

        return {
          primary: {
            label: "Total Boot (Taxable)",
            value: `$${formatNumber(totalBoot)}`,
          },
          details: [
            { label: "Cash boot", value: `$${formatNumber(cashBoot)}` },
            { label: "Mortgage boot", value: `$${formatNumber(mortgageBoot)}` },
            { label: "Estimated tax on boot", value: `$${formatNumber(taxOnBoot)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "mortgage-calculator", "property-roi-calculator"],
  faq: [
    {
      question: "What is a 1031 exchange?",
      answer:
        "A 1031 exchange (named after IRS Section 1031) allows real estate investors to defer capital gains taxes by selling an investment property and reinvesting the proceeds into a like-kind replacement property within specific time frames (45 days to identify, 180 days to close).",
    },
    {
      question: "What is boot in a 1031 exchange?",
      answer:
        "Boot is any value received in a 1031 exchange that is not like-kind property. This includes cash received, reduction in mortgage liability, or personal property. Boot is taxable in the year of the exchange.",
    },
    {
      question: "What properties qualify for a 1031 exchange?",
      answer:
        "Properties must be held for investment or productive use in a trade or business. This includes rental properties, commercial buildings, and vacant land. Personal residences and properties held primarily for sale (flips) do not qualify.",
    },
  ],
  formula: "Tax Deferred = (Capital Gain x CG Rate) + (Depreciation Recapture x Recapture Rate)",
};

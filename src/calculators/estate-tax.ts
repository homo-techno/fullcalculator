import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const estateTaxCalculator: CalculatorDefinition = {
  slug: "estate-tax-calculator",
  title: "Estate Tax Calculator",
  description:
    "Free federal estate tax calculator. Estimate estate taxes with the $13.61M exemption and 40% top rate on taxable estates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["estate tax", "inheritance", "death tax", "exemption", "estate planning"],
  variants: [
    {
      id: "individual",
      name: "Individual Estate",
      fields: [
        { name: "estateValue", label: "Total Estate Value ($)", type: "number", placeholder: "e.g. 20000000" },
        { name: "deductions", label: "Deductions (charity, debts) ($)", type: "number", placeholder: "e.g. 500000" },
      ],
      calculate: (inputs) => {
        const estateValue = inputs.estateValue as number;
        const deductions = inputs.deductions as number || 0;

        if (!estateValue) return null;

        const exemption = 13610000; // 2024 individual exemption
        const adjustedEstate = estateValue - deductions;
        const taxableEstate = Math.max(adjustedEstate - exemption, 0);

        // Federal estate tax brackets (2024)
        const brackets = [
          { min: 0, max: 10000, rate: 0.18 },
          { min: 10000, max: 20000, rate: 0.20 },
          { min: 20000, max: 40000, rate: 0.22 },
          { min: 40000, max: 60000, rate: 0.24 },
          { min: 60000, max: 80000, rate: 0.26 },
          { min: 80000, max: 100000, rate: 0.28 },
          { min: 100000, max: 150000, rate: 0.30 },
          { min: 150000, max: 250000, rate: 0.32 },
          { min: 250000, max: 500000, rate: 0.34 },
          { min: 500000, max: 750000, rate: 0.37 },
          { min: 750000, max: 1000000, rate: 0.39 },
          { min: 1000000, max: Infinity, rate: 0.40 },
        ];

        let totalTax = 0;
        for (const bracket of brackets) {
          if (taxableEstate > bracket.min) {
            const taxableInBracket = Math.min(taxableEstate, bracket.max) - bracket.min;
            totalTax += taxableInBracket * bracket.rate;
          }
        }

        const effectiveRate = taxableEstate > 0 ? (totalTax / adjustedEstate) * 100 : 0;
        const netEstate = adjustedEstate - totalTax;

        return {
          primary: { label: "Estimated Estate Tax", value: `$${formatNumber(totalTax, 2)}` },
          details: [
            { label: "Total Estate Value", value: `$${formatNumber(estateValue, 2)}` },
            { label: "Deductions", value: `$${formatNumber(deductions, 2)}` },
            { label: "Adjusted Estate", value: `$${formatNumber(adjustedEstate, 2)}` },
            { label: "Exemption (2024)", value: `$${formatNumber(exemption, 2)}` },
            { label: "Taxable Estate", value: `$${formatNumber(taxableEstate, 2)}` },
            { label: "Effective Tax Rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "Net Estate to Heirs", value: `$${formatNumber(netEstate, 2)}` },
          ],
        };
      },
    },
    {
      id: "married",
      name: "Married Couple (Portability)",
      fields: [
        { name: "estateValue", label: "Combined Estate Value ($)", type: "number", placeholder: "e.g. 30000000" },
        { name: "deductions", label: "Total Deductions ($)", type: "number", placeholder: "e.g. 500000" },
      ],
      calculate: (inputs) => {
        const estateValue = inputs.estateValue as number;
        const deductions = inputs.deductions as number || 0;

        if (!estateValue) return null;

        const singleExemption = 13610000;
        const doubleExemption = singleExemption * 2; // Portability
        const adjustedEstate = estateValue - deductions;
        const taxableEstate = Math.max(adjustedEstate - doubleExemption, 0);

        // Simplified: 40% flat rate on amount above exemption
        const estimatedTax = taxableEstate * 0.40;
        const effectiveRate = adjustedEstate > 0 ? (estimatedTax / adjustedEstate) * 100 : 0;
        const netEstate = adjustedEstate - estimatedTax;

        return {
          primary: { label: "Estimated Estate Tax", value: `$${formatNumber(estimatedTax, 2)}` },
          details: [
            { label: "Combined Estate", value: `$${formatNumber(estateValue, 2)}` },
            { label: "Combined Exemption (Portability)", value: `$${formatNumber(doubleExemption, 2)}` },
            { label: "Taxable Estate", value: `$${formatNumber(taxableEstate, 2)}` },
            { label: "Top Rate", value: "40%" },
            { label: "Effective Rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "Net Estate to Heirs", value: `$${formatNumber(netEstate, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tax-bracket-calculator", "present-value-calculator", "budget-calculator"],
  faq: [
    { question: "What is the estate tax exemption?", answer: "For 2024, the federal estate tax exemption is $13.61 million per individual. Estates below this threshold owe no federal estate tax. Married couples can effectively double this using portability." },
    { question: "What is portability?", answer: "Portability allows a surviving spouse to use the deceased spouse's unused estate tax exemption, effectively doubling the exemption to ~$27.22 million for a married couple." },
  ],
  formula: "Taxable Estate = Estate Value - Deductions - Exemption ($13.61M); Tax rates range from 18% to 40% on the taxable amount",
};

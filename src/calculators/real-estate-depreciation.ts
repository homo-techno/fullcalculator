import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const realEstateDepreciationCalculator: CalculatorDefinition = {
  slug: "real-estate-depreciation-calculator",
  title: "Real Estate Depreciation Calculator",
  description:
    "Free real estate depreciation calculator. Calculate annual depreciation deductions for residential (27.5 years) and commercial (39 years) rental properties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "real estate depreciation calculator",
    "rental property depreciation",
    "27.5 year depreciation",
    "commercial depreciation",
    "cost segregation",
    "depreciation deduction",
  ],
  variants: [
    {
      id: "standard",
      name: "Straight-Line Depreciation",
      description:
        "Calculate annual depreciation for residential or commercial property",
      fields: [
        {
          name: "purchasePrice",
          label: "Total Property Purchase Price",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
        },
        {
          name: "landValue",
          label: "Land Value (non-depreciable)",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
        },
        {
          name: "improvements",
          label: "Capital Improvements",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "propertyType",
          label: "Property Type",
          type: "select",
          options: [
            { label: "Residential Rental (27.5 years)", value: "residential" },
            { label: "Commercial (39 years)", value: "commercial" },
          ],
          defaultValue: "residential",
        },
        {
          name: "taxBracket",
          label: "Marginal Tax Bracket",
          type: "select",
          options: [
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "24",
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.purchasePrice as string);
        const land = parseFloat(inputs.landValue as string);
        const improvements = parseFloat(inputs.improvements as string) || 0;
        const type = inputs.propertyType as string;
        const bracket = parseFloat(inputs.taxBracket as string) / 100;

        if (!price || price <= 0 || !land || land < 0) return null;

        const depreciableBase = price - land + improvements;
        const usefulLife = type === "residential" ? 27.5 : 39;
        const annualDepreciation = depreciableBase / usefulLife;
        const monthlyDepreciation = annualDepreciation / 12;
        const annualTaxSavings = annualDepreciation * bracket;

        const totalDepreciation = depreciableBase;
        const totalTaxSavings = totalDepreciation * bracket;

        return {
          primary: {
            label: "Annual Depreciation Deduction",
            value: `$${formatNumber(annualDepreciation)}`,
          },
          details: [
            { label: "Depreciable basis", value: `$${formatNumber(depreciableBase)}` },
            { label: "Useful life", value: `${formatNumber(usefulLife)} years` },
            { label: "Monthly depreciation", value: `$${formatNumber(monthlyDepreciation)}` },
            { label: "Annual tax savings", value: `$${formatNumber(annualTaxSavings)}` },
            { label: "Total depreciation over life", value: `$${formatNumber(totalDepreciation)}` },
            { label: "Total tax savings over life", value: `$${formatNumber(totalTaxSavings)}` },
            { label: "Land value (not depreciable)", value: `$${formatNumber(land)}` },
          ],
          note: "Depreciation is a non-cash deduction that reduces taxable rental income. When you sell, depreciation is recaptured and taxed at up to 25%. The land portion is never depreciable.",
        };
      },
    },
    {
      id: "partial-year",
      name: "Partial Year (Mid-Month Convention)",
      description:
        "Calculate first-year depreciation using the mid-month convention",
      fields: [
        {
          name: "depreciableBasis",
          label: "Depreciable Basis (Price - Land)",
          type: "number",
          placeholder: "e.g. 240000",
          prefix: "$",
        },
        {
          name: "propertyType",
          label: "Property Type",
          type: "select",
          options: [
            { label: "Residential Rental (27.5 years)", value: "residential" },
            { label: "Commercial (39 years)", value: "commercial" },
          ],
          defaultValue: "residential",
        },
        {
          name: "monthPlaced",
          label: "Month Placed in Service",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const basis = parseFloat(inputs.depreciableBasis as string);
        const type = inputs.propertyType as string;
        const month = parseInt(inputs.monthPlaced as string, 10);

        if (!basis || basis <= 0) return null;

        const usefulLife = type === "residential" ? 27.5 : 39;
        const annualDepreciation = basis / usefulLife;
        const monthlyDepreciation = annualDepreciation / 12;

        // Mid-month convention: count from middle of placed-in-service month
        const monthsInFirstYear = 12 - month + 0.5;
        const firstYearDepreciation = monthlyDepreciation * monthsInFirstYear;
        const fullYearDepreciation = annualDepreciation;

        return {
          primary: {
            label: "First Year Depreciation",
            value: `$${formatNumber(firstYearDepreciation)}`,
          },
          details: [
            { label: "Depreciable basis", value: `$${formatNumber(basis)}` },
            { label: "Full-year depreciation", value: `$${formatNumber(fullYearDepreciation)}` },
            { label: "Months in first year (mid-month)", value: formatNumber(monthsInFirstYear) },
            { label: "Monthly depreciation", value: `$${formatNumber(monthlyDepreciation)}` },
            { label: "Recovery period", value: `${formatNumber(usefulLife)} years` },
          ],
          note: "The mid-month convention treats property as placed in service at the midpoint of the month. This applies to all real property under MACRS depreciation.",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "roi-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "How does real estate depreciation work?",
      answer:
        "The IRS allows you to deduct the cost of a rental property (minus land value) over its useful life: 27.5 years for residential and 39 years for commercial property. This is a paper deduction that reduces taxable rental income even though you haven't spent cash.",
    },
    {
      question: "What is depreciation recapture?",
      answer:
        "When you sell a depreciated property, the IRS requires you to pay depreciation recapture tax on the total depreciation taken, at a maximum rate of 25%. This claws back some of the tax benefits you received during ownership.",
    },
    {
      question: "What is cost segregation?",
      answer:
        "Cost segregation is an engineering study that reclassifies parts of a building (carpets, fixtures, landscaping) into shorter depreciation periods (5, 7, or 15 years instead of 27.5/39). This accelerates deductions and increases early tax savings.",
    },
  ],
  formula:
    "Annual Depreciation = (Purchase Price - Land Value + Improvements) / Useful Life. Residential = 27.5 years, Commercial = 39 years.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mileageTaxDeductionCalculator: CalculatorDefinition = {
  slug: "mileage-tax-deduction-calculator",
  title: "Mileage Tax Deduction Calculator",
  description:
    "Calculate your IRS mileage tax deduction for business, medical, moving, or charity driving. Find your 2024 mileage deduction value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "mileage tax deduction calculator",
    "IRS mileage rate 2024",
    "business mileage deduction",
    "self-employed mileage deduction",
    "gig worker mileage deduction",
  ],
  variants: [
    {
      id: "business",
      name: "Business Mileage Deduction",
      description: "Calculate IRS deduction for self-employed business driving",
      fields: [
        {
          name: "annualMiles",
          label: "Annual Business Miles",
          type: "number",
          placeholder: "e.g. 15000",
          suffix: "miles",
        },
        {
          name: "taxYear",
          label: "Tax Year",
          type: "select",
          options: [
            { label: "2024 (67.0¢/mile)", value: "2024" },
            { label: "2023 (65.5¢/mile)", value: "2023" },
            { label: "2022 (62.5¢/mile H2, 58.5¢ H1)", value: "2022" },
          ],
          defaultValue: "2024",
        },
        {
          name: "taxBracket",
          label: "Your Tax Bracket",
          type: "select",
          options: [
            { label: "10% bracket", value: "10" },
            { label: "12% bracket", value: "12" },
            { label: "22% bracket", value: "22" },
            { label: "24% bracket", value: "24" },
            { label: "32% bracket", value: "32" },
          ],
          defaultValue: "22",
        },
        {
          name: "includeCharityMedical",
          label: "Additional Miles",
          type: "select",
          options: [
            { label: "Business miles only", value: "none" },
            { label: "Include medical/moving (21¢/mile)", value: "medical" },
            { label: "Include charity (14¢/mile)", value: "charity" },
          ],
          defaultValue: "none",
        },
        {
          name: "additionalMiles",
          label: "Medical/Charity Miles (if applicable)",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "miles",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const miles = parseFloat(inputs.annualMiles as string) || 0;
        const year = inputs.taxYear as string;
        const bracket = parseFloat(inputs.taxBracket as string) / 100 || 0.22;
        const additionalType = inputs.includeCharityMedical as string;
        const additionalMiles = parseFloat(inputs.additionalMiles as string) || 0;

        const rates: Record<string, number> = { "2024": 0.67, "2023": 0.655, "2022": 0.585 };
        const businessRate = rates[year] || 0.67;
        const additionalRate = additionalType === "charity" ? 0.14 : 0.21;

        const businessDeduction = miles * businessRate;
        const additionalDeduction = additionalType !== "none" ? additionalMiles * additionalRate : 0;
        const totalDeduction = businessDeduction + additionalDeduction;

        // SE tax savings (15.3% × 50% since SE deduction lowers net income)
        const seTaxSavings = businessDeduction * 0.9235 * 0.153;
        const incomeTaxSavings = totalDeduction * bracket;
        const totalTaxSavings = seTaxSavings + incomeTaxSavings;

        const perMileSavings = miles > 0 ? totalTaxSavings / miles : 0;

        // Annual tracking value
        const dailyMiles = miles / 250; // business days
        const monthlyMiles = miles / 12;

        return {
          primary: { label: "Total Tax Deduction", value: `$${formatNumber(totalDeduction, 2)}` },
          details: [
            { label: "Business miles", value: `${formatNumber(miles, 0)} miles` },
            { label: "IRS rate (${year})", value: `${(businessRate * 100).toFixed(1)}¢/mile` },
            { label: "Business mileage deduction", value: `$${formatNumber(businessDeduction, 2)}` },
            { label: "Additional deduction", value: additionalType !== "none" ? `$${formatNumber(additionalDeduction, 2)}` : "N/A" },
            { label: "Total deduction", value: `$${formatNumber(totalDeduction, 2)}` },
            { label: "Income tax savings", value: `$${formatNumber(incomeTaxSavings, 2)}` },
            { label: "SE tax savings", value: `$${formatNumber(seTaxSavings, 2)}` },
            { label: "Total tax savings", value: `$${formatNumber(totalTaxSavings, 2)}` },
            { label: "Savings per mile", value: `${formatNumber(perMileSavings * 100, 1)}¢/mile` },
            { label: "Monthly miles to track", value: `${formatNumber(monthlyMiles, 0)} miles` },
          ],
          note: "Track every business mile with a mileage app (MileIQ, Stride, Everlance). The IRS requires a contemporaneous log — saving receipts after the fact is not sufficient for mileage deductions.",
        };
      },
    },
  ],
  relatedSlugs: ["gig-worker-quarterly-tax-calculator", "rideshare-vehicle-expense-calculator", "gig-vs-w2-calculator"],
  faq: [
    {
      question: "What is the 2024 IRS mileage rate?",
      answer:
        "The 2024 IRS standard mileage rate is 67.0 cents per mile for business driving (up from 65.5¢ in 2023). Medical/moving rate is 21¢/mile. Charitable driving is 14¢/mile. These rates are set by the IRS and updated annually.",
    },
    {
      question: "Can gig workers deduct mileage?",
      answer:
        "Yes. Rideshare drivers and delivery workers can deduct business mileage using the IRS standard rate (67¢/mile in 2024). This includes miles driven while carrying passengers/deliveries AND deadhead miles driving to pickup zones. Personal commuting miles are NOT deductible.",
    },
    {
      question: "How do I track mileage for taxes?",
      answer:
        "Use a mileage tracking app (MileIQ, Stride, TripLog) that automatically logs trips via GPS. You need: date, destination, purpose, and miles for each trip. Manual logs (notebook/spreadsheet) are acceptable but risky — apps create an automatic contemporaneous record.",
    },
  ],
  formula: "Deduction = Business Miles × $0.67 (2024 IRS rate) | Tax Savings = Deduction × (Tax Bracket + 7.65% SE)",
};

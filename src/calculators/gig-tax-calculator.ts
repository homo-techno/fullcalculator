import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gigTaxCalculator: CalculatorDefinition = {
  slug: "gig-tax-calculator",
  title: "Gig Worker Tax Calculator",
  description:
    "Estimate your quarterly estimated tax payments as a gig worker including self-employment tax, federal income tax, and state tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gig worker",
    "quarterly taxes",
    "self-employment tax",
    "estimated tax",
    "1099",
    "freelancer tax",
  ],
  variants: [
    {
      slug: "gig-tax-calculator",
      title: "Quarterly Estimated Tax",
      description:
        "Calculate your quarterly estimated tax payments for gig income.",
      fields: [
        {
          name: "annualGrossIncome",
          label: "Annual Gross Gig Income ($)",
          type: "number",
          defaultValue: "50000",
        },
        {
          name: "annualExpenses",
          label: "Annual Business Expenses ($)",
          type: "number",
          defaultValue: "12000",
        },
        {
          name: "otherIncome",
          label: "Other Annual Income ($)",
          type: "number",
          defaultValue: "0",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          defaultValue: "single",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate (%)",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "milesDriven",
          label: "Annual Business Miles",
          type: "number",
          defaultValue: "15000",
        },
      ],
      calculate(inputs) {
        const grossIncome = parseFloat(inputs.annualGrossIncome as string);
        const expenses = parseFloat(inputs.annualExpenses as string);
        const otherIncome = parseFloat(inputs.otherIncome as string);
        const filingStatus = inputs.filingStatus as string;
        const stateTaxRate = parseFloat(inputs.stateTaxRate as string) / 100;
        const miles = parseFloat(inputs.milesDriven as string);

        const mileageDeduction = miles * 0.67;
        const totalDeductions = expenses + mileageDeduction;
        const netSelfEmployment = grossIncome - totalDeductions;
        const seTax = netSelfEmployment * 0.9235 * 0.153;
        const seDeduction = seTax / 2;

        const standardDeduction =
          filingStatus === "married" ? 29200 : filingStatus === "hoh" ? 21900 : 14600;
        const taxableIncome =
          netSelfEmployment + otherIncome - seDeduction - standardDeduction;
        const adjustedTaxable = Math.max(0, taxableIncome);

        let federalTax = 0;
        if (filingStatus === "married") {
          if (adjustedTaxable <= 23200) federalTax = adjustedTaxable * 0.1;
          else if (adjustedTaxable <= 94300)
            federalTax = 2320 + (adjustedTaxable - 23200) * 0.12;
          else if (adjustedTaxable <= 201050)
            federalTax = 10852 + (adjustedTaxable - 94300) * 0.22;
          else federalTax = 34337 + (adjustedTaxable - 201050) * 0.24;
        } else {
          if (adjustedTaxable <= 11600) federalTax = adjustedTaxable * 0.1;
          else if (adjustedTaxable <= 47150)
            federalTax = 1160 + (adjustedTaxable - 11600) * 0.12;
          else if (adjustedTaxable <= 100525)
            federalTax = 5426 + (adjustedTaxable - 47150) * 0.22;
          else federalTax = 17168.5 + (adjustedTaxable - 100525) * 0.24;
        }

        const stateTax = adjustedTaxable * stateTaxRate;
        const totalAnnualTax = seTax + federalTax + stateTax;
        const quarterlyPayment = totalAnnualTax / 4;
        const effectiveTaxRate =
          netSelfEmployment > 0 ? (totalAnnualTax / netSelfEmployment) * 100 : 0;

        return {
          "Net Self-Employment Income": `$${formatNumber(netSelfEmployment)}`,
          "Mileage Deduction": `$${formatNumber(mileageDeduction)}`,
          "Self-Employment Tax": `$${formatNumber(seTax)}`,
          "Federal Income Tax": `$${formatNumber(federalTax)}`,
          "State Income Tax": `$${formatNumber(stateTax)}`,
          "Total Annual Tax": `$${formatNumber(totalAnnualTax)}`,
          "Quarterly Payment Due": `$${formatNumber(quarterlyPayment)}`,
          "Effective Tax Rate": `${formatNumber(effectiveTaxRate)}%`,
        };
      },
    },
    {
      slug: "gig-tax-calculator-monthly",
      title: "Monthly Tax Set-Aside",
      description: "Calculate how much to set aside monthly for gig taxes.",
      fields: [
        {
          name: "monthlyIncome",
          label: "Monthly Gig Income ($)",
          type: "number",
          defaultValue: "4000",
        },
        {
          name: "monthlyExpenses",
          label: "Monthly Business Expenses ($)",
          type: "number",
          defaultValue: "800",
        },
        {
          name: "taxBracket",
          label: "Estimated Tax Bracket",
          type: "select",
          defaultValue: "22",
          options: [
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
          ],
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate (%)",
          type: "number",
          defaultValue: "5",
        },
      ],
      calculate(inputs) {
        const income = parseFloat(inputs.monthlyIncome as string);
        const expenses = parseFloat(inputs.monthlyExpenses as string);
        const bracket = parseFloat(inputs.taxBracket as string) / 100;
        const stateRate = parseFloat(inputs.stateTaxRate as string) / 100;

        const netIncome = income - expenses;
        const seTax = netIncome * 0.9235 * 0.153;
        const federalTax = netIncome * bracket;
        const stateTax = netIncome * stateRate;
        const totalMonthlyTax = seTax + federalTax + stateTax;
        const setAsidePercent = (totalMonthlyTax / income) * 100;
        const afterTax = netIncome - totalMonthlyTax;

        return {
          "Net Monthly Income": `$${formatNumber(netIncome)}`,
          "Monthly SE Tax": `$${formatNumber(seTax)}`,
          "Monthly Federal Tax": `$${formatNumber(federalTax)}`,
          "Monthly State Tax": `$${formatNumber(stateTax)}`,
          "Total Monthly Tax": `$${formatNumber(totalMonthlyTax)}`,
          "Set-Aside % of Gross": `${formatNumber(setAsidePercent)}%`,
          "After-Tax Take Home": `$${formatNumber(afterTax)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "1099-deduction",
    "uber-driver-earnings",
    "contractor-vs-employee",
  ],
  faq: [
    {
      question: "When are quarterly estimated tax payments due?",
      answer:
        "Quarterly estimated tax payments are due April 15, June 15, September 15, and January 15 of the following year. You may owe a penalty if you miss a payment or underpay.",
    },
    {
      question: "How much should gig workers set aside for taxes?",
      answer:
        "A common rule of thumb is to set aside 25-30% of your net gig income for taxes. This covers self-employment tax (15.3%), federal income tax, and state income tax. The exact amount depends on your total income and deductions.",
    },
    {
      question: "Can gig workers deduct mileage?",
      answer:
        "Yes. Gig workers can deduct business miles at the IRS standard mileage rate (67 cents per mile for 2024) or actual vehicle expenses. You must keep a mileage log and cannot deduct commuting miles.",
    },
  ],
  formula:
    "SE Tax = Net Income x 92.35% x 15.3%. Federal Tax = (Net Income - SE Deduction - Standard Deduction) x Bracket Rate. Quarterly Payment = Total Annual Tax / 4.",
};

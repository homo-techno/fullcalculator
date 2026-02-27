import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tenNinetyNineDeductionCalculator: CalculatorDefinition = {
  slug: "1099-deduction",
  title: "1099 Contractor Tax Deductions Calculator",
  description:
    "Calculate common tax deductions available to 1099 independent contractors including home office, mileage, equipment, and more.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "1099",
    "contractor",
    "deductions",
    "tax write-offs",
    "self-employed",
    "business expenses",
    "Schedule C",
  ],
  variants: [
    {
      slug: "1099-deduction",
      title: "1099 Common Deductions",
      description:
        "Estimate your total 1099 deductions and tax savings from common business expenses.",
      fields: [
        {
          name: "grossIncome",
          label: "Annual 1099 Gross Income ($)",
          type: "number",
          defaultValue: "60000",
        },
        {
          name: "businessMiles",
          label: "Annual Business Miles",
          type: "number",
          defaultValue: "12000",
        },
        {
          name: "homeOfficeSquareFt",
          label: "Home Office Square Feet",
          type: "number",
          defaultValue: "200",
        },
        {
          name: "equipmentCost",
          label: "Equipment & Supplies ($)",
          type: "number",
          defaultValue: "2000",
        },
        {
          name: "softwareSubscriptions",
          label: "Software & Subscriptions ($)",
          type: "number",
          defaultValue: "1200",
        },
        {
          name: "phoneInternet",
          label: "Phone & Internet (Business %) ($)",
          type: "number",
          defaultValue: "1800",
        },
        {
          name: "healthInsurance",
          label: "Health Insurance Premiums ($)",
          type: "number",
          defaultValue: "6000",
        },
        {
          name: "retirementContributions",
          label: "SEP-IRA/Solo 401k Contributions ($)",
          type: "number",
          defaultValue: "5000",
        },
        {
          name: "professionalDev",
          label: "Professional Development ($)",
          type: "number",
          defaultValue: "500",
        },
        {
          name: "taxBracket",
          label: "Marginal Tax Bracket",
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
      ],
      calculate(inputs) {
        const gross = parseFloat(inputs.grossIncome as string);
        const miles = parseFloat(inputs.businessMiles as string);
        const homeOffice = parseFloat(inputs.homeOfficeSquareFt as string);
        const equipment = parseFloat(inputs.equipmentCost as string);
        const software = parseFloat(inputs.softwareSubscriptions as string);
        const phone = parseFloat(inputs.phoneInternet as string);
        const health = parseFloat(inputs.healthInsurance as string);
        const retirement = parseFloat(inputs.retirementContributions as string);
        const profDev = parseFloat(inputs.professionalDev as string);
        const bracket = parseFloat(inputs.taxBracket as string) / 100;

        const mileageDeduction = miles * 0.67;
        const homeOfficeDeduction = Math.min(homeOffice * 5, 1500);
        const totalScheduleC =
          mileageDeduction + homeOfficeDeduction + equipment + software + phone + profDev;
        const totalDeductions = totalScheduleC + health + retirement;
        const netIncome = gross - totalDeductions;
        const seTaxSavings = totalScheduleC * 0.153;
        const incomeTaxSavings = totalDeductions * bracket;
        const totalTaxSavings = seTaxSavings + incomeTaxSavings;
        const effectiveDeductionRate = (totalDeductions / gross) * 100;

        return {
          "Mileage Deduction": `$${formatNumber(mileageDeduction)}`,
          "Home Office Deduction": `$${formatNumber(homeOfficeDeduction)}`,
          "Equipment & Supplies": `$${formatNumber(equipment)}`,
          "Software & Subscriptions": `$${formatNumber(software)}`,
          "Phone & Internet": `$${formatNumber(phone)}`,
          "Health Insurance Deduction": `$${formatNumber(health)}`,
          "Retirement Contributions": `$${formatNumber(retirement)}`,
          "Total Deductions": `$${formatNumber(totalDeductions)}`,
          "Net Taxable Income": `$${formatNumber(netIncome)}`,
          "Estimated SE Tax Savings": `$${formatNumber(seTaxSavings)}`,
          "Estimated Income Tax Savings": `$${formatNumber(incomeTaxSavings)}`,
          "Total Estimated Tax Savings": `$${formatNumber(totalTaxSavings)}`,
          "Deduction Rate": `${formatNumber(effectiveDeductionRate)}%`,
        };
      },
    },
  ],
  relatedSlugs: [
    "gig-tax-calculator",
    "contractor-vs-employee",
    "small-business-tax",
  ],
  faq: [
    {
      question: "What are the most commonly missed 1099 deductions?",
      answer:
        "Commonly missed deductions include the home office deduction, self-employment tax deduction (50% of SE tax), health insurance premiums, retirement contributions, professional development, and the qualified business income (QBI) deduction of up to 20%.",
    },
    {
      question: "Should I use standard mileage rate or actual expenses?",
      answer:
        "The standard mileage rate (67 cents/mile for 2024) is simpler and often more beneficial for newer, fuel-efficient vehicles. Actual expenses may be better if you have an older vehicle with high maintenance or if you use an expensive vehicle primarily for business.",
    },
    {
      question: "How does the simplified home office deduction work?",
      answer:
        "The simplified method allows $5 per square foot of home office space, up to 300 square feet ($1,500 max). The regular method uses the percentage of your home used for business applied to actual expenses like rent, utilities, and insurance.",
    },
  ],
  formula:
    "Total Deductions = Mileage (Miles x $0.67) + Home Office ($5/sqft, max $1,500) + Equipment + Software + Phone + Health Insurance + Retirement. Tax Savings = (Schedule C Deductions x 15.3%) + (All Deductions x Tax Bracket).",
};

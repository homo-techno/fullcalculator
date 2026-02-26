import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sideHustleTaxCalculator: CalculatorDefinition = {
  slug: "side-hustle-tax",
  title: "Side Hustle Tax Calculator",
  description: "Free online side hustle and gig economy tax calculator. Estimate self-employment taxes, quarterly payments, and take-home income from freelance work.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["side hustle tax", "gig tax", "freelance tax", "self-employment tax", "1099 tax", "quarterly taxes", "gig economy"],
  variants: [
    {
      id: "gig-tax",
      name: "Calculate Side Hustle Taxes",
      fields: [
        {
          name: "annualGigIncome",
          label: "Annual Side Hustle Income ($)",
          type: "number",
          placeholder: "e.g. 30000",
          min: 0,
        },
        {
          name: "businessExpenses",
          label: "Business Expenses / Deductions ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
        {
          name: "w2Income",
          label: "W-2 Employment Income ($)",
          type: "number",
          placeholder: "e.g. 60000",
          min: 0,
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "joint" },
            { label: "Married Filing Separately", value: "separate" },
            { label: "Head of Household", value: "hoh" },
          ],
        },
        {
          name: "state",
          label: "State Tax Rate Estimate",
          type: "select",
          options: [
            { label: "No State Tax (TX, FL, WA, etc.)", value: "0" },
            { label: "Low (1-3%)", value: "2" },
            { label: "Medium (4-6%)", value: "5" },
            { label: "High (7-10%)", value: "8" },
            { label: "Very High (10%+)", value: "11" },
          ],
        },
      ],
      calculate: (inputs) => {
        const gigIncome = parseFloat(inputs.annualGigIncome as string) || 0;
        const expenses = parseFloat(inputs.businessExpenses as string) || 0;
        const w2Income = parseFloat(inputs.w2Income as string) || 0;
        const filingStatus = inputs.filingStatus as string;
        const stateRate = parseFloat(inputs.state as string) || 0;

        const netGigIncome = Math.max(0, gigIncome - expenses);

        // Self-employment tax (15.3% on 92.35% of net income)
        const seTaxableIncome = netGigIncome * 0.9235;
        const socialSecurityTax = Math.min(seTaxableIncome, 168600) * 0.124;
        const medicareTax = seTaxableIncome * 0.029;
        const selfEmploymentTax = socialSecurityTax + medicareTax;

        // SE tax deduction (half of SE tax)
        const seDeduction = selfEmploymentTax / 2;

        // Federal income tax on gig income (simplified marginal rate)
        const totalIncome = w2Income + netGigIncome - seDeduction;
        const standardDeduction = filingStatus === "joint" ? 29200 : filingStatus === "hoh" ? 21900 : 14600;
        const taxableIncome = Math.max(0, totalIncome - standardDeduction);

        let marginalRate = 0;
        if (filingStatus === "joint") {
          if (taxableIncome > 693750) marginalRate = 0.37;
          else if (taxableIncome > 364200) marginalRate = 0.35;
          else if (taxableIncome > 190750) marginalRate = 0.32;
          else if (taxableIncome > 89075) marginalRate = 0.24;
          else if (taxableIncome > 22000) marginalRate = 0.22;
          else if (taxableIncome > 0) marginalRate = 0.12;
        } else {
          if (taxableIncome > 578125) marginalRate = 0.37;
          else if (taxableIncome > 231250) marginalRate = 0.35;
          else if (taxableIncome > 182100) marginalRate = 0.32;
          else if (taxableIncome > 95375) marginalRate = 0.24;
          else if (taxableIncome > 44725) marginalRate = 0.22;
          else if (taxableIncome > 11000) marginalRate = 0.12;
          else if (taxableIncome > 0) marginalRate = 0.10;
        }

        const federalTaxOnGig = netGigIncome * marginalRate;
        const stateTax = netGigIncome * (stateRate / 100);
        const totalTax = selfEmploymentTax + federalTaxOnGig + stateTax;
        const effectiveTaxRate = gigIncome > 0 ? (totalTax / gigIncome) * 100 : 0;
        const takeHome = gigIncome - totalTax;
        const quarterlyPayment = totalTax / 4;

        return {
          primary: { label: "Total Estimated Tax", value: "$" + formatNumber(totalTax) },
          details: [
            { label: "Gross Side Hustle Income", value: "$" + formatNumber(gigIncome) },
            { label: "Business Expenses", value: "-$" + formatNumber(expenses) },
            { label: "Net Self-Employment Income", value: "$" + formatNumber(netGigIncome) },
            { label: "Self-Employment Tax (15.3%)", value: "$" + formatNumber(selfEmploymentTax) },
            { label: "Federal Income Tax (marginal)", value: "$" + formatNumber(federalTaxOnGig) },
            { label: "State Tax", value: "$" + formatNumber(stateTax) },
            { label: "Effective Tax Rate on Gig Income", value: formatNumber(effectiveTaxRate, 1) + "%" },
            { label: "Take-Home from Side Hustle", value: "$" + formatNumber(takeHome) },
            { label: "Quarterly Tax Payment", value: "$" + formatNumber(quarterlyPayment) },
          ],
          note: "This is an estimate. Actual taxes depend on your complete tax situation. Consider consulting a tax professional and making quarterly estimated payments to avoid penalties.",
        };
      },
    },
  ],
  relatedSlugs: ["consulting-rate-calc", "1099-tax", "overtime-pay-calc"],
  faq: [
    {
      question: "Do I have to pay taxes on side hustle income?",
      answer: "Yes. All income over $400 from self-employment is subject to both income tax and self-employment tax (Social Security and Medicare). You should receive a 1099 form if you earn $600+ from a single payer.",
    },
    {
      question: "What is self-employment tax?",
      answer: "Self-employment tax is the Social Security (12.4%) and Medicare (2.9%) tax that self-employed individuals pay. As an employee, your employer pays half; as self-employed, you pay both halves (15.3%). You can deduct half of this tax on your return.",
    },
    {
      question: "Do I need to make quarterly tax payments?",
      answer: "If you expect to owe $1,000+ in taxes for the year, the IRS requires quarterly estimated payments (due April 15, June 15, September 15, and January 15). Failure to pay quarterly can result in underpayment penalties.",
    },
  ],
  formula: "Total Tax = Self-Employment Tax (15.3% of 92.35% of net income) + Federal Income Tax + State Tax",
};

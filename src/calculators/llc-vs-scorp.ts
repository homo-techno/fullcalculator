import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const llcVsScorpCalculator: CalculatorDefinition = {
  slug: "llc-vs-scorp",
  title: "LLC vs S-Corp Tax Comparison Calculator",
  description:
    "Compare the tax implications of operating as an LLC vs S-Corporation to find the optimal structure for your business income level.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "LLC",
    "S-Corp",
    "tax comparison",
    "business entity",
    "self-employment tax",
    "payroll tax",
    "business structure",
  ],
  variants: [
    {
      slug: "llc-vs-scorp",
      title: "LLC vs S-Corp Tax Savings",
      description:
        "See how much you could save by electing S-Corp status for your LLC.",
      fields: [
        {
          name: "netBusinessIncome",
          label: "Net Business Income ($)",
          type: "number",
          defaultValue: "120000",
        },
        {
          name: "reasonableSalary",
          label: "Reasonable S-Corp Salary ($)",
          type: "number",
          defaultValue: "60000",
        },
        {
          name: "additionalPayrollCost",
          label: "Annual Payroll Service Cost ($)",
          type: "number",
          defaultValue: "1200",
        },
        {
          name: "additionalFilingCost",
          label: "Additional S-Corp Filing Costs ($)",
          type: "number",
          defaultValue: "1500",
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate (%)",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          defaultValue: "single",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
        },
      ],
      calculate(inputs) {
        const netIncome = parseFloat(inputs.netBusinessIncome as string);
        const salary = parseFloat(inputs.reasonableSalary as string);
        const payrollCost = parseFloat(inputs.additionalPayrollCost as string);
        const filingCost = parseFloat(inputs.additionalFilingCost as string);
        const stateRate = parseFloat(inputs.stateTaxRate as string) / 100;
        const filingStatus = inputs.filingStatus as string;

        // LLC (as sole prop)
        const llcSeTax = netIncome * 0.9235 * 0.153;
        const llcSeDeduction = llcSeTax / 2;
        const llcQbi = netIncome * 0.2;
        const standardDeduction = filingStatus === "married" ? 29200 : 14600;
        const llcTaxable = Math.max(
          0,
          netIncome - llcSeDeduction - standardDeduction - llcQbi
        );

        let llcFederal = 0;
        if (llcTaxable <= 11600) llcFederal = llcTaxable * 0.1;
        else if (llcTaxable <= 47150)
          llcFederal = 1160 + (llcTaxable - 11600) * 0.12;
        else if (llcTaxable <= 100525)
          llcFederal = 5426 + (llcTaxable - 47150) * 0.22;
        else llcFederal = 17168.5 + (llcTaxable - 100525) * 0.24;

        const llcState = llcTaxable * stateRate;
        const llcTotal = llcSeTax + llcFederal + llcState;

        // S-Corp
        const employerFica = salary * 0.0765;
        const employeeFica = salary * 0.0765;
        const scorpSeTax = employerFica + employeeFica;
        const distribution = netIncome - salary - employerFica - payrollCost - filingCost;
        const scorpQbi = Math.max(0, distribution) * 0.2;
        const scorpTaxable = Math.max(
          0,
          salary + Math.max(0, distribution) - standardDeduction - scorpQbi
        );

        let scorpFederal = 0;
        if (scorpTaxable <= 11600) scorpFederal = scorpTaxable * 0.1;
        else if (scorpTaxable <= 47150)
          scorpFederal = 1160 + (scorpTaxable - 11600) * 0.12;
        else if (scorpTaxable <= 100525)
          scorpFederal = 5426 + (scorpTaxable - 47150) * 0.22;
        else scorpFederal = 17168.5 + (scorpTaxable - 100525) * 0.24;

        const scorpState = scorpTaxable * stateRate;
        const scorpTotal = scorpSeTax + scorpFederal + scorpState + payrollCost + filingCost;

        const savings = llcTotal - scorpTotal;
        const breakEvenIncome = 50000;

        return {
          "LLC Self-Employment Tax": `$${formatNumber(llcSeTax)}`,
          "LLC Federal Income Tax": `$${formatNumber(llcFederal)}`,
          "LLC State Tax": `$${formatNumber(llcState)}`,
          "LLC Total Tax": `$${formatNumber(llcTotal)}`,
          "S-Corp Payroll Tax (FICA)": `$${formatNumber(scorpSeTax)}`,
          "S-Corp Federal Income Tax": `$${formatNumber(scorpFederal)}`,
          "S-Corp State Tax": `$${formatNumber(scorpState)}`,
          "S-Corp Admin Costs": `$${formatNumber(payrollCost + filingCost)}`,
          "S-Corp Total Cost": `$${formatNumber(scorpTotal)}`,
          "Annual Tax Savings (S-Corp)": `$${formatNumber(savings)}`,
          "S-Corp Distribution": `$${formatNumber(Math.max(0, distribution))}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "small-business-tax",
    "1099-deduction",
    "contractor-vs-employee",
  ],
  faq: [
    {
      question: "When does it make sense to elect S-Corp status?",
      answer:
        "Generally, S-Corp election becomes beneficial when net business income exceeds $50,000-$60,000 per year. Below that, the additional costs of payroll, tax filings, and administration may offset the self-employment tax savings.",
    },
    {
      question: "What is a reasonable salary for an S-Corp?",
      answer:
        "The IRS requires S-Corp owners who perform services to pay themselves a 'reasonable salary' before taking distributions. This is typically 40-60% of net business income, and should be comparable to what you would pay someone else to do your job.",
    },
    {
      question: "What are the downsides of S-Corp election?",
      answer:
        "S-Corp adds complexity: mandatory payroll processing ($1,000-2,000/year), additional tax filings (Form 1120-S), stricter recordkeeping requirements, and potential IRS scrutiny if your salary is set too low.",
    },
  ],
  formula:
    "LLC Tax = (Income x 92.35% x 15.3%) + Federal Income Tax + State Tax. S-Corp Tax = (Salary x 15.3%) + Federal Tax on (Salary + Distribution) + State Tax + Admin Costs. Savings = LLC Tax - S-Corp Tax.",
};

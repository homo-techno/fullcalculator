import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gigWorkerQuarterlyTaxCalculator: CalculatorDefinition = {
  slug: "gig-worker-quarterly-tax-calculator",
  title: "Gig Worker Quarterly Tax Calculator",
  description:
    "Calculate your quarterly estimated tax payments as a gig worker, freelancer, or self-employed contractor. Avoid IRS underpayment penalties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "quarterly estimated taxes gig worker",
    "self-employed quarterly tax calculator",
    "freelancer estimated tax payment",
    "IRS 1040-ES calculator",
    "gig economy tax payment schedule",
  ],
  variants: [
    {
      id: "quarterly",
      name: "Quarterly Payment Calculator",
      description: "Estimate your quarterly IRS payments",
      fields: [
        {
          name: "annualGrossIncome",
          label: "Expected Annual Gig Income",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
        },
        {
          name: "annualExpenses",
          label: "Expected Annual Business Expenses",
          type: "number",
          placeholder: "e.g. 8000",
          prefix: "$",
          defaultValue: 5000,
        },
        {
          name: "otherIncome",
          label: "Other W-2 / Salary Income",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const grossGig = parseFloat(inputs.annualGrossIncome as string) || 0;
        const expenses = parseFloat(inputs.annualExpenses as string) || 0;
        const otherIncome = parseFloat(inputs.otherIncome as string) || 0;
        const status = inputs.filingStatus as string;

        const netGig = grossGig - expenses;
        const seTax = netGig > 0 ? netGig * 0.9235 * 0.153 : 0; // SE tax (15.3% on 92.35% of net)
        const seDeduction = seTax / 2; // half of SE tax is deductible
        const standardDeduction: Record<string, number> = { single: 14600, married: 29200, hoh: 21900 };
        const stdDed = standardDeduction[status] || 14600;

        const taxableIncome = Math.max(0, netGig + otherIncome - seDeduction - stdDed);

        // 2024 tax brackets (single)
        let incomeTax = 0;
        if (status === "single") {
          if (taxableIncome > 609350) incomeTax = 183647 + (taxableIncome - 609350) * 0.37;
          else if (taxableIncome > 243725) incomeTax = 55374 + (taxableIncome - 243725) * 0.35;
          else if (taxableIncome > 100525) incomeTax = 17168 + (taxableIncome - 100525) * 0.24;
          else if (taxableIncome > 47150) incomeTax = 5147 + (taxableIncome - 47150) * 0.22;
          else if (taxableIncome > 23200) incomeTax = 1160 + (taxableIncome - 23200) * 0.12;
          else if (taxableIncome > 11600) incomeTax = (taxableIncome - 11600) * 0.10;
        } else {
          // Simplified for married/hoh — use proportional estimate
          const divisor = status === "married" ? 2 : 1.5;
          const halfTaxable = taxableIncome / divisor;
          let halfTax = 0;
          if (halfTaxable > 100525) halfTax = 17168 + (halfTaxable - 100525) * 0.24;
          else if (halfTaxable > 47150) halfTax = 5147 + (halfTaxable - 47150) * 0.22;
          else if (halfTaxable > 23200) halfTax = 1160 + (halfTaxable - 23200) * 0.12;
          else if (halfTaxable > 11600) halfTax = (halfTaxable - 11600) * 0.10;
          incomeTax = halfTax * divisor;
        }

        const totalTax = seTax + incomeTax;
        const quarterlyPayment = totalTax / 4;
        const effectiveRate = grossGig > 0 ? (totalTax / grossGig) * 100 : 0;

        return {
          primary: { label: "Quarterly Payment", value: `$${formatNumber(quarterlyPayment, 0)}` },
          details: [
            { label: "Annual gig income", value: `$${formatNumber(grossGig, 0)}` },
            { label: "Business expenses", value: `-$${formatNumber(expenses, 0)}` },
            { label: "Net self-employment income", value: `$${formatNumber(netGig, 0)}` },
            { label: "Self-employment tax (15.3%)", value: `$${formatNumber(seTax, 0)}` },
            { label: "Estimated income tax", value: `$${formatNumber(incomeTax, 0)}` },
            { label: "Total annual tax", value: `$${formatNumber(totalTax, 0)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate, 1)}%` },
            { label: "Q1 due Apr 15", value: `$${formatNumber(quarterlyPayment, 0)}` },
            { label: "Q2 due Jun 15", value: `$${formatNumber(quarterlyPayment, 0)}` },
            { label: "Q3 due Sep 15", value: `$${formatNumber(quarterlyPayment, 0)}` },
            { label: "Q4 due Jan 15", value: `$${formatNumber(quarterlyPayment, 0)}` },
          ],
          note: "Pay quarterly if you expect to owe $1,000+ in taxes. Underpayment penalty is ~8% annually on shortfall. Safe harbor: pay 100% of last year's tax liability.",
        };
      },
    },
  ],
  relatedSlugs: ["gig-vs-w2-calculator", "mileage-tax-deduction-calculator", "gig-worker-hourly-rate-calculator"],
  faq: [
    {
      question: "When are quarterly tax payments due?",
      answer:
        "2024 quarterly estimated tax due dates: Q1 April 15, Q2 June 17, Q3 September 16, Q4 January 15, 2025. Missing a payment doesn't mean immediate penalties — the IRS assesses interest on underpaid amounts at year-end filing.",
    },
    {
      question: "What is self-employment tax?",
      answer:
        "Self-employment tax is 15.3%: 12.4% for Social Security (on first $168,600 of net earnings in 2024) and 2.9% for Medicare (on all net earnings). It's calculated on 92.35% of net self-employment income. You can deduct half of SE tax from your adjusted gross income.",
    },
    {
      question: "How much should gig workers set aside for taxes?",
      answer:
        "A safe rule: set aside 25–30% of every payment received. This covers SE tax (~15%) + income tax (~10–15% for most gig workers). Open a separate savings account and transfer 25–30% immediately when paid. This prevents spending money you owe the IRS.",
    },
  ],
  formula: "Quarterly Payment = (SE Tax + Income Tax) ÷ 4",
};

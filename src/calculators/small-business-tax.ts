import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smallBusinessTaxCalculator: CalculatorDefinition = {
  slug: "small-business-tax",
  title: "Small Business Tax Estimator",
  description:
    "Estimate your small business tax liability by entity type including sole proprietorship, LLC, S-Corp, and C-Corp.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "small business",
    "tax",
    "LLC",
    "S-Corp",
    "C-Corp",
    "sole proprietorship",
    "business tax",
    "entity type",
  ],
  variants: [
    {
      slug: "small-business-tax",
      title: "Business Tax by Entity Type",
      description:
        "Estimate tax liability for your small business based on entity type and income.",
      fields: [
        {
          name: "grossRevenue",
          label: "Annual Gross Revenue ($)",
          type: "number",
          defaultValue: "200000",
        },
        {
          name: "businessExpenses",
          label: "Annual Business Expenses ($)",
          type: "number",
          defaultValue: "80000",
        },
        {
          name: "entityType",
          label: "Business Entity Type",
          type: "select",
          defaultValue: "sole",
          options: [
            { label: "Sole Proprietorship", value: "sole" },
            { label: "Single-Member LLC", value: "llc" },
            { label: "S-Corporation", value: "scorp" },
            { label: "C-Corporation", value: "ccorp" },
          ],
        },
        {
          name: "ownerSalary",
          label: "Owner Salary (S-Corp only) ($)",
          type: "number",
          defaultValue: "60000",
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
        {
          name: "stateTaxRate",
          label: "State Tax Rate (%)",
          type: "number",
          defaultValue: "5",
        },
      ],
      calculate(inputs) {
        const revenue = parseFloat(inputs.grossRevenue as string);
        const expenses = parseFloat(inputs.businessExpenses as string);
        const entity = inputs.entityType as string;
        const ownerSalary = parseFloat(inputs.ownerSalary as string);
        const filingStatus = inputs.filingStatus as string;
        const stateRate = parseFloat(inputs.stateTaxRate as string) / 100;

        const netProfit = revenue - expenses;
        const standardDeduction = filingStatus === "married" ? 29200 : 14600;

        let seTax = 0;
        let federalTax = 0;
        let corpTax = 0;
        let qbiDeduction = 0;
        let taxableIncome = 0;

        if (entity === "sole" || entity === "llc") {
          seTax = netProfit * 0.9235 * 0.153;
          qbiDeduction = netProfit * 0.2;
          taxableIncome = netProfit - seTax / 2 - standardDeduction - qbiDeduction;
        } else if (entity === "scorp") {
          const employerFica = ownerSalary * 0.0765;
          const distribution = netProfit - ownerSalary - employerFica;
          seTax = ownerSalary * 0.153;
          qbiDeduction = Math.max(0, distribution) * 0.2;
          taxableIncome =
            ownerSalary + Math.max(0, distribution) - standardDeduction - qbiDeduction;
        } else {
          corpTax = netProfit * 0.21;
          const afterCorpTax = netProfit - corpTax;
          taxableIncome = afterCorpTax * 0.8 - standardDeduction;
        }

        taxableIncome = Math.max(0, taxableIncome);

        if (filingStatus === "married") {
          if (taxableIncome <= 23200) federalTax = taxableIncome * 0.1;
          else if (taxableIncome <= 94300)
            federalTax = 2320 + (taxableIncome - 23200) * 0.12;
          else if (taxableIncome <= 201050)
            federalTax = 10852 + (taxableIncome - 94300) * 0.22;
          else federalTax = 34337 + (taxableIncome - 201050) * 0.24;
        } else {
          if (taxableIncome <= 11600) federalTax = taxableIncome * 0.1;
          else if (taxableIncome <= 47150)
            federalTax = 1160 + (taxableIncome - 11600) * 0.12;
          else if (taxableIncome <= 100525)
            federalTax = 5426 + (taxableIncome - 47150) * 0.22;
          else federalTax = 17168.5 + (taxableIncome - 100525) * 0.24;
        }

        const stateTax = taxableIncome * stateRate;
        const totalTax = seTax + federalTax + stateTax + corpTax;
        const effectiveRate = (totalTax / netProfit) * 100;
        const afterTaxIncome = netProfit - totalTax;

        return {
          "Net Business Profit": `$${formatNumber(netProfit)}`,
          "QBI Deduction (20%)": `$${formatNumber(qbiDeduction)}`,
          "Self-Employment Tax": `$${formatNumber(seTax)}`,
          "Corporate Tax (C-Corp)": `$${formatNumber(corpTax)}`,
          "Federal Income Tax": `$${formatNumber(federalTax)}`,
          "State Tax": `$${formatNumber(stateTax)}`,
          "Total Tax Liability": `$${formatNumber(totalTax)}`,
          "Effective Tax Rate": `${formatNumber(effectiveRate)}%`,
          "After-Tax Income": `$${formatNumber(afterTaxIncome)}`,
        };
      },
    },
  ],
  relatedSlugs: ["llc-vs-scorp", "1099-deduction", "gig-tax-calculator"],
  faq: [
    {
      question:
        "Which business entity type pays the least tax?",
      answer:
        "It depends on income level. At lower incomes, sole proprietorship with QBI deduction can be efficient. At higher incomes ($50k+ profit), S-Corps can save on self-employment tax. C-Corps have a flat 21% rate but face double taxation on distributions.",
    },
    {
      question: "What is the QBI deduction?",
      answer:
        "The Qualified Business Income (QBI) deduction allows eligible self-employed individuals and small business owners to deduct up to 20% of their qualified business income. It applies to pass-through entities like sole proprietorships, LLCs, and S-Corps.",
    },
  ],
  formula:
    "Sole/LLC: SE Tax = Profit x 92.35% x 15.3%. S-Corp: SE Tax on salary only; distributions avoid SE tax. C-Corp: 21% corporate tax + dividend tax. All: Federal tax at bracket rates, QBI deduction up to 20%.",
};

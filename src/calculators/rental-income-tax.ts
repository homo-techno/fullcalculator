import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentalIncomeTaxCalculator: CalculatorDefinition = {
  slug: "rental-income-tax-calculator",
  title: "Rental Income Tax Calculator",
  description:
    "Free rental income tax calculator. Estimate taxes on rental property income including depreciation, expenses, and passive loss rules.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rental income tax",
    "rental property tax",
    "landlord tax calculator",
    "rental depreciation",
    "passive income tax",
  ],
  variants: [
    {
      id: "rental-income",
      name: "Rental Income Tax Estimator",
      description:
        "Calculate taxable rental income after expenses and depreciation",
      fields: [
        {
          name: "grossRent",
          label: "Annual Gross Rental Income",
          type: "number",
          placeholder: "e.g. 24000",
          prefix: "$",
        },
        {
          name: "propertyValue",
          label: "Property Value (building only, not land)",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "mortgageInterest",
          label: "Annual Mortgage Interest",
          type: "number",
          placeholder: "e.g. 8000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "propertyTaxes",
          label: "Annual Property Taxes",
          type: "number",
          placeholder: "e.g. 3000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "insurance",
          label: "Annual Insurance",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "maintenance",
          label: "Annual Repairs & Maintenance",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "otherExpenses",
          label: "Other Expenses (management, etc.)",
          type: "number",
          placeholder: "e.g. 1000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "marginalRate",
          label: "Marginal Tax Rate",
          type: "select",
          options: [
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "22",
        },
      ],
      calculate: (inputs) => {
        const grossRent = inputs.grossRent as number;
        const propertyValue = (inputs.propertyValue as number) || 0;
        const mortgageInt = (inputs.mortgageInterest as number) || 0;
        const propTax = (inputs.propertyTaxes as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const maintenance = (inputs.maintenance as number) || 0;
        const other = (inputs.otherExpenses as number) || 0;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;

        if (!grossRent || grossRent <= 0) return null;

        const depreciation =
          propertyValue > 0 ? propertyValue / 27.5 : 0;
        const totalExpenses =
          mortgageInt + propTax + insurance + maintenance + other + depreciation;
        const netRentalIncome = grossRent - totalExpenses;
        const isLoss = netRentalIncome < 0;

        const passiveLossDeductible = isLoss
          ? Math.min(Math.abs(netRentalIncome), 25000)
          : 0;

        const taxOnIncome = isLoss
          ? 0
          : netRentalIncome * marginalRate;
        const taxSavingsFromLoss = passiveLossDeductible * marginalRate;

        const cashFlow = grossRent - (totalExpenses - depreciation);

        return {
          primary: {
            label: isLoss ? "Rental Loss" : "Tax on Rental Income",
            value: isLoss
              ? `-$${formatNumber(Math.abs(netRentalIncome))}`
              : `$${formatNumber(taxOnIncome)}`,
          },
          details: [
            {
              label: "Gross rental income",
              value: `$${formatNumber(grossRent)}`,
            },
            {
              label: "Total expenses (with depreciation)",
              value: `$${formatNumber(totalExpenses)}`,
            },
            {
              label: "Depreciation (27.5 years)",
              value: `$${formatNumber(depreciation)}`,
            },
            {
              label: "Net rental income/loss",
              value: `${netRentalIncome < 0 ? "-" : ""}$${formatNumber(Math.abs(netRentalIncome))}`,
            },
            {
              label: "Cash flow (excluding depreciation)",
              value: `$${formatNumber(cashFlow)}`,
            },
            {
              label: isLoss
                ? "Deductible loss (max $25k)"
                : "Tax owed",
              value: isLoss
                ? `$${formatNumber(passiveLossDeductible)} (saves $${formatNumber(taxSavingsFromLoss)})`
                : `$${formatNumber(taxOnIncome)}`,
            },
          ],
          note: isLoss
            ? "Rental losses are passive losses. If you actively participate and your AGI is under $100,000, you can deduct up to $25,000 against ordinary income. The deduction phases out between $100k-$150k AGI."
            : "Net rental income is taxed at your marginal ordinary income tax rate. Depreciation reduces taxable income but not cash flow, making real estate tax-advantaged.",
        };
      },
    },
  ],
  relatedSlugs: [
    "tax-calculator",
    "mortgage-calculator",
    "roi-calculator",
  ],
  faq: [
    {
      question: "How is rental income taxed?",
      answer:
        "Net rental income (gross rent minus expenses and depreciation) is taxed as ordinary income at your marginal rate. Depreciation allows you to deduct the building cost over 27.5 years, often creating a paper loss even when cash flow is positive.",
    },
    {
      question: "What is the $25,000 rental loss allowance?",
      answer:
        "If you actively participate in managing your rental property and your AGI is under $100,000, you can deduct up to $25,000 of rental losses against ordinary income. This phases out completely at $150,000 AGI.",
    },
  ],
  formula:
    "Net Rental Income = Gross Rent - Expenses - Depreciation (building value / 27.5 years)",
};

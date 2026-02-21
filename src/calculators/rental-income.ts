import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentalIncomeCalculator: CalculatorDefinition = {
  slug: "rental-income-calculator",
  title: "Rental Income Calculator",
  description:
    "Free rental income calculator. Estimate monthly and annual rental income, net operating income, and cash flow from your investment property.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rental income calculator",
    "rental property income",
    "rental cash flow calculator",
    "investment property income",
    "landlord income calculator",
  ],
  variants: [
    {
      id: "monthly-income",
      name: "Net Rental Income",
      description: "Calculate net monthly and annual rental income after expenses",
      fields: [
        { name: "monthlyRent", label: "Monthly Rent", type: "number", placeholder: "e.g. 2000", prefix: "$", min: 0 },
        { name: "vacancyRate", label: "Vacancy Rate", type: "number", placeholder: "e.g. 5", suffix: "%", min: 0, max: 100, step: 0.1, defaultValue: 5 },
        { name: "mortgage", label: "Monthly Mortgage (P+I)", type: "number", placeholder: "e.g. 1200", prefix: "$", min: 0 },
        { name: "propertyTax", label: "Monthly Property Tax", type: "number", placeholder: "e.g. 250", prefix: "$", min: 0 },
        { name: "insurance", label: "Monthly Insurance", type: "number", placeholder: "e.g. 100", prefix: "$", min: 0 },
        { name: "maintenance", label: "Monthly Maintenance / Repairs", type: "number", placeholder: "e.g. 150", prefix: "$", min: 0 },
        { name: "management", label: "Property Management Fee", type: "number", placeholder: "e.g. 200", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const vacancy = (inputs.vacancyRate as number) || 0;
        const mortgage = (inputs.mortgage as number) || 0;
        const tax = (inputs.propertyTax as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const maintenance = (inputs.maintenance as number) || 0;
        const management = (inputs.management as number) || 0;
        if (!rent) return null;

        const effectiveRent = rent * (1 - vacancy / 100);
        const totalExpenses = mortgage + tax + insurance + maintenance + management;
        const netMonthly = effectiveRent - totalExpenses;
        const netAnnual = netMonthly * 12;
        const grossAnnual = rent * 12;
        const operatingExpenses = tax + insurance + maintenance + management;
        const noi = (effectiveRent - operatingExpenses) * 12;

        return {
          primary: { label: "Net Monthly Cash Flow", value: `$${formatNumber(netMonthly)}` },
          details: [
            { label: "Effective monthly rent", value: `$${formatNumber(effectiveRent)}` },
            { label: "Total monthly expenses", value: `$${formatNumber(totalExpenses)}` },
            { label: "Net annual cash flow", value: `$${formatNumber(netAnnual)}` },
            { label: "Gross annual rent", value: `$${formatNumber(grossAnnual)}` },
            { label: "NOI (annual)", value: `$${formatNumber(noi)}` },
          ],
          note: netMonthly < 0 ? "Negative cash flow means your expenses exceed rental income. Consider adjusting rent or reducing costs." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["cap-rate-calculator", "rental-yield-calculator", "cash-on-cash-calculator"],
  faq: [
    {
      question: "How do I calculate net rental income?",
      answer:
        "Net rental income = Gross rent × (1 − vacancy rate) − all expenses (mortgage, taxes, insurance, maintenance, management). This gives you your monthly cash flow. Multiply by 12 for annual cash flow.",
    },
    {
      question: "What is a good vacancy rate to assume?",
      answer:
        "Most investors assume a 5-10% vacancy rate for residential properties. In strong rental markets the actual vacancy may be lower (2-4%), while weaker markets or seasonal rentals can be higher (10-20%).",
    },
    {
      question: "What is NOI?",
      answer:
        "Net Operating Income (NOI) is gross rental income minus operating expenses, but EXCLUDING mortgage payments. NOI = Effective Rent − Property Tax − Insurance − Maintenance − Management. It's used to calculate cap rate and evaluate property performance independent of financing.",
    },
  ],
  formula:
    "Net Cash Flow = (Monthly Rent × (1 − Vacancy%)) − Mortgage − Tax − Insurance − Maintenance − Management | NOI = Effective Rent − Operating Expenses (no mortgage)",
};

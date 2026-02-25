import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentalCashFlowCalculator: CalculatorDefinition = {
  slug: "rental-cash-flow-calculator",
  title: "Rental Cash Flow Calculator",
  description:
    "Free rental cash flow calculator. Estimate monthly and annual cash flow from rental properties including income, expenses, and mortgage payments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rental cash flow calculator",
    "rental income calculator",
    "rental property cash flow",
    "landlord calculator",
    "rental profit calculator",
  ],
  variants: [
    {
      id: "monthly-cash-flow",
      name: "Monthly Cash Flow",
      description: "Calculate monthly rental cash flow after all expenses",
      fields: [
        {
          name: "monthlyRent",
          label: "Monthly Rent Income",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
        },
        {
          name: "mortgagePayment",
          label: "Monthly Mortgage Payment",
          type: "number",
          placeholder: "e.g. 1200",
          prefix: "$",
          min: 0,
        },
        {
          name: "propertyTax",
          label: "Monthly Property Tax",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          min: 0,
        },
        {
          name: "insurance",
          label: "Monthly Insurance",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
        },
        {
          name: "maintenance",
          label: "Monthly Maintenance & Repairs",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
        },
        {
          name: "vacancy",
          label: "Vacancy Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const mortgage = (inputs.mortgagePayment as number) || 0;
        const tax = (inputs.propertyTax as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const maintenance = (inputs.maintenance as number) || 0;
        const vacancyRate = (inputs.vacancy as number) || 0;
        if (!rent) return null;

        const effectiveRent = rent * (1 - vacancyRate / 100);
        const totalExpenses = mortgage + tax + insurance + maintenance;
        const monthlyCashFlow = effectiveRent - totalExpenses;
        const annualCashFlow = monthlyCashFlow * 12;

        return {
          primary: {
            label: "Monthly Cash Flow",
            value: `$${formatNumber(monthlyCashFlow)}`,
          },
          details: [
            { label: "Effective monthly rent", value: `$${formatNumber(effectiveRent)}` },
            { label: "Total monthly expenses", value: `$${formatNumber(totalExpenses)}` },
            { label: "Annual cash flow", value: `$${formatNumber(annualCashFlow)}` },
            { label: "Vacancy loss", value: `$${formatNumber(rent - effectiveRent)}/mo` },
          ],
        };
      },
    },
    {
      id: "cash-on-cash",
      name: "Cash-on-Cash Return",
      description: "Calculate cash-on-cash return on your rental investment",
      fields: [
        {
          name: "annualCashFlow",
          label: "Annual Net Cash Flow",
          type: "number",
          placeholder: "e.g. 6000",
          prefix: "$",
        },
        {
          name: "totalCashInvested",
          label: "Total Cash Invested",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const cashFlow = inputs.annualCashFlow as number;
        const invested = inputs.totalCashInvested as number;
        if (cashFlow === undefined || !invested) return null;

        const cashOnCash = (cashFlow / invested) * 100;

        return {
          primary: {
            label: "Cash-on-Cash Return",
            value: `${formatNumber(cashOnCash)}%`,
          },
          details: [
            { label: "Annual cash flow", value: `$${formatNumber(cashFlow)}` },
            { label: "Total cash invested", value: `$${formatNumber(invested)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "roi-calculator", "investment-property-calculator"],
  faq: [
    {
      question: "What is rental cash flow?",
      answer:
        "Rental cash flow is the net income from a rental property after subtracting all expenses (mortgage, taxes, insurance, maintenance, vacancy) from the rental income. Positive cash flow means the property generates profit each month.",
    },
    {
      question: "What is a good cash-on-cash return for rental property?",
      answer:
        "A cash-on-cash return of 8-12% is generally considered good for rental properties. However, this varies by market, property type, and investment strategy. Some investors aim for higher returns in exchange for more management effort.",
    },
    {
      question: "How do I account for vacancy in cash flow?",
      answer:
        "Multiply your monthly rent by the vacancy rate (typically 5-10%) and subtract that amount. For example, $2,000 rent with a 5% vacancy rate gives an effective rent of $1,900/month, accounting for the time the property may sit empty.",
    },
  ],
  formula: "Cash Flow = Effective Rent - (Mortgage + Taxes + Insurance + Maintenance)",
};

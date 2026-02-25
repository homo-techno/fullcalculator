import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const investmentPropertyCalculator: CalculatorDefinition = {
  slug: "investment-property-calculator",
  title: "Investment Property Calculator",
  description:
    "Free investment property calculator. Analyze rental property deals with cap rate, NOI, cash flow, and return on investment calculations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "investment property calculator",
    "rental property analysis",
    "cap rate calculator",
    "NOI calculator",
    "real estate investment analysis",
  ],
  variants: [
    {
      id: "cap-rate",
      name: "Cap Rate & NOI",
      description: "Calculate capitalization rate and net operating income",
      fields: [
        {
          name: "propertyPrice",
          label: "Property Purchase Price",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "grossRent",
          label: "Monthly Gross Rent",
          type: "number",
          placeholder: "e.g. 2500",
          prefix: "$",
          min: 0,
        },
        {
          name: "vacancyRate",
          label: "Vacancy Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
          defaultValue: 5,
        },
        {
          name: "annualExpenses",
          label: "Annual Operating Expenses",
          type: "number",
          placeholder: "e.g. 8000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const price = inputs.propertyPrice as number;
        const monthlyRent = inputs.grossRent as number;
        const vacancyRate = (inputs.vacancyRate as number) || 0;
        const expenses = (inputs.annualExpenses as number) || 0;
        if (!price || !monthlyRent) return null;

        const annualGrossRent = monthlyRent * 12;
        const effectiveGross = annualGrossRent * (1 - vacancyRate / 100);
        const noi = effectiveGross - expenses;
        const capRate = (noi / price) * 100;
        const grm = price / annualGrossRent;

        return {
          primary: {
            label: "Cap Rate",
            value: `${formatNumber(capRate)}%`,
          },
          details: [
            { label: "Net Operating Income (NOI)", value: `$${formatNumber(noi)}/yr` },
            { label: "Effective gross income", value: `$${formatNumber(effectiveGross)}/yr` },
            { label: "Gross Rent Multiplier", value: formatNumber(grm, 2) },
            { label: "Operating expense ratio", value: `${formatNumber((expenses / effectiveGross) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "full-analysis",
      name: "Full Deal Analysis",
      description: "Complete investment property analysis with financing",
      fields: [
        {
          name: "propertyPrice",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPaymentPct",
          label: "Down Payment",
          type: "select",
          options: [
            { label: "20%", value: "20" },
            { label: "25%", value: "25" },
            { label: "30%", value: "30" },
            { label: "100% (Cash)", value: "100" },
          ],
          defaultValue: "25",
        },
        {
          name: "interestRate",
          label: "Mortgage Interest Rate",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.01,
        },
        {
          name: "monthlyRent",
          label: "Monthly Rent",
          type: "number",
          placeholder: "e.g. 2500",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthlyExpenses",
          label: "Monthly Expenses (tax, ins, maint)",
          type: "number",
          placeholder: "e.g. 600",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const price = inputs.propertyPrice as number;
        const downPct = parseInt(inputs.downPaymentPct as string) || 25;
        const rate = inputs.interestRate as number;
        const rent = inputs.monthlyRent as number;
        const expenses = (inputs.monthlyExpenses as number) || 0;
        if (!price || !rent) return null;

        const downPayment = price * (downPct / 100);
        const loanAmount = price - downPayment;
        let monthlyMortgage = 0;
        if (loanAmount > 0 && rate) {
          const mr = rate / 100 / 12;
          const n = 30 * 12;
          monthlyMortgage = (loanAmount * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        }
        const monthlyCashFlow = rent - monthlyMortgage - expenses;
        const annualCashFlow = monthlyCashFlow * 12;
        const cashOnCash = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;

        return {
          primary: {
            label: "Monthly Cash Flow",
            value: `$${formatNumber(monthlyCashFlow)}`,
          },
          details: [
            { label: "Down payment", value: `$${formatNumber(downPayment)}` },
            { label: "Monthly mortgage", value: `$${formatNumber(monthlyMortgage)}` },
            { label: "Annual cash flow", value: `$${formatNumber(annualCashFlow)}` },
            { label: "Cash-on-cash return", value: `${formatNumber(cashOnCash)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rental-cash-flow-calculator", "mortgage-calculator", "property-roi-calculator"],
  faq: [
    {
      question: "What is a good cap rate?",
      answer:
        "Cap rates between 5-10% are generally considered good, but this varies by market and property type. Higher cap rates indicate higher potential returns but may also signal higher risk. Urban properties often have lower cap rates (3-5%) than rural ones (8-12%).",
    },
    {
      question: "What is Net Operating Income (NOI)?",
      answer:
        "NOI is the annual income from a property after deducting all operating expenses (taxes, insurance, maintenance, management) but before mortgage payments. NOI = Effective Gross Income - Operating Expenses.",
    },
    {
      question: "What is the 1% rule in real estate?",
      answer:
        "The 1% rule states that monthly rent should be at least 1% of the property purchase price. For a $300,000 property, rent should be at least $3,000/month. It is a quick screening tool, not a definitive analysis.",
    },
  ],
  formula: "Cap Rate = (NOI / Property Price) x 100",
};

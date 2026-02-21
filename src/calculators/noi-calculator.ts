import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const noiCalculator: CalculatorDefinition = {
  slug: "noi-calculator",
  title: "Net Operating Income (NOI) Calculator",
  description:
    "Free NOI calculator. Calculate net operating income for investment properties by subtracting operating expenses from gross rental income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "NOI calculator",
    "net operating income",
    "NOI real estate",
    "net operating income calculator",
    "property NOI",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed NOI",
      description: "Calculate NOI with itemized income and expenses",
      fields: [
        { name: "monthlyRent", label: "Monthly Gross Rent", type: "number", placeholder: "e.g. 3000", prefix: "$", min: 0 },
        { name: "otherIncome", label: "Other Monthly Income (parking, laundry, etc.)", type: "number", placeholder: "e.g. 200", prefix: "$", min: 0 },
        { name: "vacancyRate", label: "Vacancy Rate", type: "number", placeholder: "e.g. 5", suffix: "%", min: 0, max: 50, step: 0.5, defaultValue: 5 },
        { name: "propertyTax", label: "Annual Property Tax", type: "number", placeholder: "e.g. 4800", prefix: "$", min: 0 },
        { name: "insurance", label: "Annual Insurance", type: "number", placeholder: "e.g. 1800", prefix: "$", min: 0 },
        { name: "maintenance", label: "Annual Maintenance / Repairs", type: "number", placeholder: "e.g. 3000", prefix: "$", min: 0 },
        { name: "management", label: "Annual Property Management", type: "number", placeholder: "e.g. 2400", prefix: "$", min: 0 },
        { name: "utilities", label: "Annual Utilities (if landlord-paid)", type: "number", placeholder: "e.g. 1200", prefix: "$", min: 0 },
        { name: "otherExpenses", label: "Other Annual Expenses", type: "number", placeholder: "e.g. 600", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const other = (inputs.otherIncome as number) || 0;
        const vacancy = (inputs.vacancyRate as number) || 0;
        const tax = (inputs.propertyTax as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const maintenance = (inputs.maintenance as number) || 0;
        const management = (inputs.management as number) || 0;
        const utilities = (inputs.utilities as number) || 0;
        const otherExp = (inputs.otherExpenses as number) || 0;
        if (!rent) return null;

        const grossAnnualIncome = (rent + other) * 12;
        const vacancyLoss = grossAnnualIncome * (vacancy / 100);
        const effectiveGrossIncome = grossAnnualIncome - vacancyLoss;
        const totalExpenses = tax + insurance + maintenance + management + utilities + otherExp;
        const noi = effectiveGrossIncome - totalExpenses;
        const expenseRatio = totalExpenses / effectiveGrossIncome * 100;

        return {
          primary: { label: "Annual NOI", value: `$${formatNumber(noi)}` },
          details: [
            { label: "Gross annual income", value: `$${formatNumber(grossAnnualIncome)}` },
            { label: "Vacancy loss", value: `−$${formatNumber(vacancyLoss)}` },
            { label: "Effective gross income", value: `$${formatNumber(effectiveGrossIncome)}` },
            { label: "Total operating expenses", value: `−$${formatNumber(totalExpenses)}` },
            { label: "Expense ratio", value: `${formatNumber(expenseRatio, 1)}%` },
            { label: "Monthly NOI", value: `$${formatNumber(noi / 12)}` },
          ],
          note: noi < 0 ? "Negative NOI means operating expenses exceed income before debt service. This property is not self-sustaining." : undefined,
        };
      },
    },
    {
      id: "quick",
      name: "Quick NOI",
      description: "Quick NOI calculation using expense ratio",
      fields: [
        { name: "annualRent", label: "Annual Gross Rent", type: "number", placeholder: "e.g. 36000", prefix: "$", min: 0 },
        { name: "vacancyRate", label: "Vacancy Rate", type: "number", placeholder: "e.g. 5", suffix: "%", min: 0, max: 50, step: 0.5, defaultValue: 5 },
        {
          name: "expenseRatio",
          label: "Operating Expense Ratio",
          type: "select",
          options: [
            { label: "30% (well-maintained, tenant-paid utilities)", value: "30" },
            { label: "40% (average)", value: "40" },
            { label: "50% (older property / landlord-paid utilities)", value: "50" },
            { label: "60% (high expenses)", value: "60" },
          ],
          defaultValue: "40",
        },
      ],
      calculate: (inputs) => {
        const annual = inputs.annualRent as number;
        const vacancy = (inputs.vacancyRate as number) || 0;
        const expRatio = parseInt(inputs.expenseRatio as string) || 40;
        if (!annual) return null;

        const egi = annual * (1 - vacancy / 100);
        const expenses = egi * (expRatio / 100);
        const noi = egi - expenses;

        return {
          primary: { label: "Estimated Annual NOI", value: `$${formatNumber(noi)}` },
          details: [
            { label: "Gross annual rent", value: `$${formatNumber(annual)}` },
            { label: "Effective gross income", value: `$${formatNumber(egi)}` },
            { label: "Est. operating expenses", value: `$${formatNumber(expenses)}` },
            { label: "Expense ratio used", value: `${expRatio}%` },
            { label: "Monthly NOI", value: `$${formatNumber(noi / 12)}` },
          ],
          note: "The 50% rule is a common quick estimate: operating expenses are roughly 50% of effective gross income for average properties.",
        };
      },
    },
  ],
  relatedSlugs: ["cap-rate-calculator", "dscr-calculator", "rental-income-calculator"],
  faq: [
    {
      question: "What is NOI?",
      answer:
        "Net Operating Income (NOI) is the annual income a property generates after deducting operating expenses but BEFORE debt service (mortgage payments). NOI = Effective Gross Income − Operating Expenses. It's the key metric for evaluating commercial and investment property performance.",
    },
    {
      question: "What expenses are included in NOI?",
      answer:
        "NOI includes: property taxes, insurance, repairs/maintenance, property management fees, utilities (if landlord-paid), landscaping, snow removal, legal/accounting, and reserves. NOI does NOT include mortgage payments, depreciation, income taxes, or capital expenditures.",
    },
    {
      question: "What is the 50% rule?",
      answer:
        "The 50% rule is a quick estimate stating that operating expenses (excluding mortgage) will be about 50% of gross rental income. So if a property generates $40,000/year in rent, estimate NOI at $20,000. This is a rough guideline; actual expenses vary.",
    },
  ],
  formula:
    "NOI = Effective Gross Income − Operating Expenses | Effective Gross Income = Gross Rent − Vacancy Loss | Quick NOI = Gross Rent × (1 − Vacancy%) × (1 − Expense Ratio)",
};

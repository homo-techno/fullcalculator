import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dscrCalculator: CalculatorDefinition = {
  slug: "dscr-calculator",
  title: "DSCR Calculator",
  description:
    "Free DSCR (Debt Service Coverage Ratio) calculator. Determine if your rental property generates enough income to cover its debt payments for loan qualification.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "DSCR calculator",
    "debt service coverage ratio",
    "DSCR loan calculator",
    "DSCR real estate",
    "debt coverage ratio calculator",
  ],
  variants: [
    {
      id: "basic",
      name: "DSCR from NOI",
      description: "Calculate DSCR from net operating income and annual debt service",
      fields: [
        { name: "noi", label: "Annual Net Operating Income (NOI)", type: "number", placeholder: "e.g. 48000", prefix: "$", min: 0 },
        { name: "annualDebt", label: "Annual Debt Service (mortgage payments)", type: "number", placeholder: "e.g. 36000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const noi = inputs.noi as number;
        const debt = inputs.annualDebt as number;
        if (!noi || !debt) return null;

        const dscr = noi / debt;
        const surplus = noi - debt;

        return {
          primary: { label: "DSCR", value: formatNumber(dscr, 2) },
          details: [
            { label: "Annual NOI", value: `$${formatNumber(noi)}` },
            { label: "Annual debt service", value: `$${formatNumber(debt)}` },
            { label: "Annual surplus / deficit", value: `$${formatNumber(surplus)}` },
            { label: "Monthly surplus / deficit", value: `$${formatNumber(surplus / 12)}` },
          ],
          note: dscr < 1 ? "DSCR below 1.0 means the property does not generate enough income to cover debt. Most lenders require 1.20 or higher." : dscr >= 1.25 ? "DSCR of 1.25+ is generally considered strong and meets most lender requirements." : "DSCR between 1.0-1.25 may meet minimum requirements but is considered tight. Most lenders prefer 1.25+.",
        };
      },
    },
    {
      id: "detailed",
      name: "DSCR from Property Details",
      description: "Calculate DSCR from rent, expenses, and mortgage details",
      fields: [
        { name: "monthlyRent", label: "Monthly Gross Rent", type: "number", placeholder: "e.g. 3000", prefix: "$", min: 0 },
        { name: "vacancyRate", label: "Vacancy Rate", type: "number", placeholder: "e.g. 5", suffix: "%", min: 0, max: 50, step: 0.5, defaultValue: 5 },
        { name: "monthlyExpenses", label: "Monthly Operating Expenses (no mortgage)", type: "number", placeholder: "e.g. 800", prefix: "$", min: 0 },
        { name: "monthlyMortgage", label: "Monthly Mortgage Payment (P+I)", type: "number", placeholder: "e.g. 1800", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const vacancy = (inputs.vacancyRate as number) || 0;
        const expenses = (inputs.monthlyExpenses as number) || 0;
        const mortgage = inputs.monthlyMortgage as number;
        if (!rent || !mortgage) return null;

        const effectiveRent = rent * (1 - vacancy / 100);
        const monthlyNOI = effectiveRent - expenses;
        const annualNOI = monthlyNOI * 12;
        const annualDebt = mortgage * 12;
        const dscr = annualNOI / annualDebt;

        return {
          primary: { label: "DSCR", value: formatNumber(dscr, 2) },
          details: [
            { label: "Effective monthly rent", value: `$${formatNumber(effectiveRent)}` },
            { label: "Monthly NOI", value: `$${formatNumber(monthlyNOI)}` },
            { label: "Annual NOI", value: `$${formatNumber(annualNOI)}` },
            { label: "Annual debt service", value: `$${formatNumber(annualDebt)}` },
            { label: "Monthly cash flow", value: `$${formatNumber(monthlyNOI - mortgage)}` },
          ],
          note: dscr < 1.0 ? "DSCR below 1.0: property income does not cover the debt." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["noi-calculator", "cap-rate-calculator", "rental-income-calculator"],
  faq: [
    {
      question: "What is DSCR?",
      answer:
        "Debt Service Coverage Ratio (DSCR) measures a property's ability to cover its debt payments from operating income. DSCR = Net Operating Income / Annual Debt Service. A DSCR of 1.25 means the property earns 25% more than needed to cover the mortgage.",
    },
    {
      question: "What DSCR do lenders require?",
      answer:
        "Most lenders require a minimum DSCR of 1.20-1.25 for investment property loans. Some DSCR loan programs accept 1.0 (break-even). Higher DSCR (1.5+) may qualify you for better rates and terms.",
    },
    {
      question: "What is a DSCR loan?",
      answer:
        "A DSCR loan is an investment property mortgage that qualifies you based on the property's rental income (DSCR) rather than your personal income. This is popular with investors who have complex tax returns or multiple properties.",
    },
  ],
  formula: "DSCR = Annual Net Operating Income / Annual Debt Service",
};

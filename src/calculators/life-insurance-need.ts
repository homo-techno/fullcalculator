import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lifeInsuranceNeedCalculator: CalculatorDefinition = {
  slug: "life-insurance-need-calculator",
  title: "Life Insurance Needs Calculator",
  description: "Free life insurance needs calculator. Determine how much life insurance coverage you need based on income, debts, dependents, and financial goals.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["life insurance calculator", "life insurance needs calculator", "how much life insurance", "life insurance coverage calculator", "insurance needs analysis"],
  variants: [
    {
      id: "dime-method",
      name: "DIME Method",
      description: "Calculate life insurance needs using the DIME method (Debt, Income, Mortgage, Education)",
      fields: [
        { name: "annualIncome", label: "Annual Income to Replace", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        { name: "yearsToReplace", label: "Years of Income to Replace", type: "number", placeholder: "e.g. 20", min: 1, defaultValue: 10 },
        { name: "mortgage", label: "Remaining Mortgage Balance", type: "number", placeholder: "e.g. 250000", prefix: "$", defaultValue: 0 },
        { name: "otherDebts", label: "Other Debts (car, student, credit)", type: "number", placeholder: "e.g. 30000", prefix: "$", defaultValue: 0 },
        { name: "childrenCollege", label: "Number of Children Needing College", type: "select", options: [
          { label: "0", value: "0" },
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4+", value: "4" },
        ], defaultValue: "0" },
        { name: "collegeCostPer", label: "College Cost Per Child (4 years)", type: "number", placeholder: "e.g. 100000", prefix: "$", defaultValue: 100000 },
        { name: "finalExpenses", label: "Final Expenses (funeral, etc.)", type: "number", placeholder: "e.g. 15000", prefix: "$", defaultValue: 15000 },
        { name: "existingCoverage", label: "Existing Life Insurance / Savings", type: "number", placeholder: "e.g. 50000", prefix: "$", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const annualIncome = inputs.annualIncome as number;
        const yearsToReplace = (inputs.yearsToReplace as number) || 10;
        const mortgage = (inputs.mortgage as number) || 0;
        const otherDebts = (inputs.otherDebts as number) || 0;
        const childrenCollege = parseInt(inputs.childrenCollege as string) || 0;
        const collegeCostPer = (inputs.collegeCostPer as number) || 100000;
        const finalExpenses = (inputs.finalExpenses as number) || 15000;
        const existingCoverage = (inputs.existingCoverage as number) || 0;

        if (!annualIncome) return null;

        const incomeReplacement = annualIncome * yearsToReplace;
        const debtPayoff = mortgage + otherDebts;
        const educationFund = childrenCollege * collegeCostPer;
        const totalNeed = incomeReplacement + debtPayoff + educationFund + finalExpenses;
        const coverageNeeded = Math.max(0, totalNeed - existingCoverage);

        // Round up to nearest $50,000
        const roundedCoverage = Math.ceil(coverageNeeded / 50000) * 50000;

        return {
          primary: { label: "Recommended Coverage", value: `$${formatNumber(roundedCoverage)}` },
          details: [
            { label: "Income replacement", value: `$${formatNumber(incomeReplacement)} (${yearsToReplace} years)` },
            { label: "Debt payoff (mortgage + other)", value: `$${formatNumber(debtPayoff)}` },
            { label: "Education fund", value: `$${formatNumber(educationFund)} (${childrenCollege} children)` },
            { label: "Final expenses", value: `$${formatNumber(finalExpenses)}` },
            { label: "Total need", value: `$${formatNumber(totalNeed)}` },
            { label: "Existing coverage/savings", value: `-$${formatNumber(existingCoverage)}` },
            { label: "Coverage gap", value: `$${formatNumber(coverageNeeded)}` },
          ],
          note: "The DIME method (Debt, Income, Mortgage, Education) provides a thorough needs analysis. Consider reviewing your coverage whenever you experience major life changes. A financial advisor can provide personalized guidance.",
        };
      },
    },
  ],
  relatedSlugs: ["term-life-cost-calculator", "auto-insurance-estimate-calculator", "retirement-calculator"],
  faq: [
    { question: "How much life insurance do I need?", answer: "A common rule of thumb is 10-12x your annual income, but the DIME method is more accurate. It considers your Debts, Income replacement needs, Mortgage, and Education costs for children. The right amount depends on your family's specific financial situation." },
    { question: "What is the DIME method?", answer: "DIME stands for Debt, Income, Mortgage, and Education. Add up all debts, the income your family needs replaced for a set number of years, your remaining mortgage, and education costs for children. Subtract existing coverage and savings to find your gap." },
    { question: "Do single people need life insurance?", answer: "Not always, but it depends. If you have debts that others would inherit (co-signed loans), dependents (aging parents), or want to leave money for funeral costs or charity, some coverage may be worthwhile. It's also cheaper to buy when you're young and healthy." },
  ],
  formula: "Coverage = (Annual Income × Years) + Mortgage + Other Debts + (Children × College Cost) + Final Expenses - Existing Coverage. Rounded up to nearest $50,000.",
};

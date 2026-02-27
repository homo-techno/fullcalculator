import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentToIncomeCalculator: CalculatorDefinition = {
  slug: "rent-to-income",
  title: "Rent Affordability by Income Calculator",
  description:
    "Calculate how much rent you can afford based on your income. Applies the 30% rule, 50/30/20 budget model, and custom thresholds to determine affordable rent ranges.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rent",
    "affordability",
    "income",
    "budget",
    "housing cost",
    "rent-to-income ratio",
    "apartment",
    "30 percent rule",
    "cost of living",
  ],
  variants: [
    {
      slug: "income-to-rent",
      title: "Income to Affordable Rent",
      fields: [
        {
          name: "annualIncome",
          label: "Annual Gross Income ($)",
          type: "number",
        },
        {
          name: "incomeType",
          label: "Income Type",
          type: "select",
          options: [
            { label: "Gross (before taxes)", value: "gross" },
            { label: "Net (after taxes)", value: "net" },
          ],
        },
      ],
      calculate(inputs) {
        const income = parseFloat(inputs.annualIncome as string);
        const type = inputs.incomeType as string;
        if (isNaN(income)) return { error: "Please enter a valid income." };

        const grossIncome = type === "net" ? income / 0.75 : income;
        const monthlyGross = grossIncome / 12;
        const monthlyNet = type === "net" ? income / 12 : grossIncome * 0.75 / 12;

        const rent30 = monthlyGross * 0.3;
        const rent25 = monthlyGross * 0.25;
        const rent50_30_20 = monthlyNet * 0.3;
        const annualRent30 = rent30 * 12;

        return {
          results: [
            { label: "Max Rent (30% Rule)", value: `$${formatNumber(rent30)}/mo` },
            { label: "Conservative (25% Rule)", value: `$${formatNumber(rent25)}/mo` },
            { label: "50/30/20 Budget Rent", value: `$${formatNumber(rent50_30_20)}/mo` },
            { label: "Annual Rent at 30%", value: `$${formatNumber(annualRent30)}` },
            { label: "Monthly Gross Income", value: `$${formatNumber(monthlyGross)}` },
            { label: "Est. Monthly Net Income", value: `$${formatNumber(monthlyNet)}` },
          ],
        };
      },
    },
    {
      slug: "rent-ratio-check",
      title: "Check Rent-to-Income Ratio",
      fields: [
        {
          name: "monthlyRent",
          label: "Monthly Rent ($)",
          type: "number",
        },
        {
          name: "monthlyIncome",
          label: "Monthly Gross Income ($)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const rent = parseFloat(inputs.monthlyRent as string);
        const income = parseFloat(inputs.monthlyIncome as string);
        if (isNaN(rent) || isNaN(income) || income === 0)
          return { error: "Please enter valid rent and income." };

        const ratio = (rent / income) * 100;
        const annualRent = rent * 12;
        const annualIncome = income * 12;
        const remaining = income - rent;

        const assessment =
          ratio <= 25
            ? "Excellent - very affordable"
            : ratio <= 30
            ? "Good - within recommended range"
            : ratio <= 40
            ? "Stretched - above recommended 30%"
            : ratio <= 50
            ? "Burdened - HUD considers this cost-burdened"
            : "Severely Burdened - significant financial strain";

        const requiredIncome40x = rent * 40;
        const meetsThreshold = annualIncome >= requiredIncome40x ? "Yes" : "No";

        return {
          results: [
            { label: "Rent-to-Income Ratio", value: `${formatNumber(ratio)}%` },
            { label: "Assessment", value: assessment },
            { label: "Monthly Remaining", value: `$${formatNumber(remaining)}` },
            { label: "Annual Rent", value: `$${formatNumber(annualRent)}` },
            { label: "Meets 40x Rule?", value: `${meetsThreshold} (need $${formatNumber(requiredIncome40x)}/yr)` },
          ],
        };
      },
    },
    {
      slug: "roommate-split",
      title: "Roommate Rent Split",
      fields: [
        {
          name: "totalRent",
          label: "Total Monthly Rent ($)",
          type: "number",
        },
        {
          name: "numRoommates",
          label: "Number of Roommates (including you)",
          type: "select",
          options: [
            { label: "2 people", value: "2" },
            { label: "3 people", value: "3" },
            { label: "4 people", value: "4" },
            { label: "5 people", value: "5" },
          ],
        },
        {
          name: "yourIncome",
          label: "Your Monthly Gross Income ($)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const totalRent = parseFloat(inputs.totalRent as string);
        const roommates = parseFloat(inputs.numRoommates as string);
        const income = parseFloat(inputs.yourIncome as string);
        if (isNaN(totalRent) || isNaN(roommates) || isNaN(income))
          return { error: "Please enter all values." };

        const yourShare = totalRent / roommates;
        const ratio = (yourShare / income) * 100;
        const annualCost = yourShare * 12;
        const savingsVsSolo = totalRent - yourShare;

        return {
          results: [
            { label: "Your Monthly Share", value: `$${formatNumber(yourShare)}` },
            { label: "Your Rent-to-Income Ratio", value: `${formatNumber(ratio)}%` },
            { label: "Annual Rent Cost", value: `$${formatNumber(annualCost)}` },
            { label: "Monthly Savings vs. Solo", value: `$${formatNumber(savingsVsSolo)}` },
            { label: "Annual Savings vs. Solo", value: `$${formatNumber(savingsVsSolo * 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-appraisal-value", "hoa-fee-comparison", "adu-cost"],
  faq: [
    {
      question: "What is the 30% rule for rent?",
      answer:
        "The 30% rule suggests spending no more than 30% of your gross monthly income on rent. For example, if you earn $5,000/month gross, you should aim for rent at or below $1,500. This guideline originated from the 1981 amendment to the Housing Act.",
    },
    {
      question: "What is the 40x rent rule?",
      answer:
        "Many landlords require annual gross income to be at least 40 times the monthly rent. For a $2,000/month apartment, you would need $80,000/year income. This is equivalent to spending 30% of gross income on rent.",
    },
    {
      question: "Is the 30% rule still realistic?",
      answer:
        "In many high-cost cities, the 30% rule is difficult to achieve. The key is to evaluate total housing costs (rent, utilities, insurance) relative to your full financial picture including debt, savings goals, and lifestyle. Some financial advisors suggest 25% for gross or 30% for net income.",
    },
  ],
  formula:
    "Max Rent (30% rule) = Gross Monthly Income x 0.30 | Ratio = (Rent / Gross Income) x 100 | 40x Rule: Annual Income >= Monthly Rent x 40",
};

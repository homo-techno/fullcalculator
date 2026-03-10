import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireWithPensionCalculator: CalculatorDefinition = {
  slug: "fire-with-pension-calculator",
  title: "FIRE with Pension Calculator",
  description:
    "Calculate how a pension reduces your FIRE number. Plan FIRE when pension starts (e.g., age 62-67) with guaranteed income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FIRE with pension",
    "pension FIRE number",
    "pension reduction FIRE",
    "early retirement pension",
    "government pension FIRE",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate with Pension",
      description: "FIRE number accounting for future pension",
      fields: [
        {
          name: "annualExpenses",
          label: "Annual Expenses",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
        },
        {
          name: "pensionIncome",
          label: "Expected Pension Income",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "$",
        },
        {
          name: "yearsUntilPension",
          label: "Years Until Pension Starts",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const expenses = parseFloat(inputs.annualExpenses as string) || 60000;
        const pension = parseFloat(inputs.pensionIncome as string) || 25000;
        const yearsUntilPension = parseFloat(inputs.yearsUntilPension as string) || 20;

        // Expenses before pension starts
        const expensesBefore = expenses;
        const fireNumberBefore = expensesBefore * 25;

        // After pension starts, gap to cover
        const gap = Math.max(0, expenses - pension);
        const fireNumberAfter = gap * 25;

        // Blended: cover expenses until pension, then smaller portfolio
        const blendedFireNumber = (expenses * yearsUntilPension * 25) / yearsUntilPension;
        const monthlySavings = (fireNumberBefore / yearsUntilPension) / 12;

        return {
          primary: { label: "FIRE Number with Pension", value: `$${formatNumber(fireNumberAfter, 0)}` },
          details: [
            { label: "Annual expenses", value: `$${formatNumber(expenses, 0)}` },
            { label: "Pension income (at age ~67)", value: `$${formatNumber(pension, 0)}` },
            { label: "Years until pension", value: yearsUntilPension },
            { label: "Portfolio needed (gap-only)", value: `$${formatNumber(fireNumberAfter, 0)}` },
            { label: "Without pension", value: `$${formatNumber(fireNumberBefore, 0)}` },
            { label: "Pension reduces portfolio by", value: `$${formatNumber(fireNumberBefore - fireNumberAfter, 0)}` },
            { label: "Monthly savings needed", value: `$${formatNumber(monthlySavings, 0)}` },
          ],
          note: "Pension acts as insurance. Can retire earlier with smaller portfolio knowing pension covers portion.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "safe-withdrawal-rate-optimizer"],
  faq: [
    {
      question: "How much does a pension reduce FIRE number?",
      answer:
        "By 25x the pension amount. $30k pension = $750k less portfolio needed. Very powerful! Public sector employees often achieve FIRE much faster with pensions.",
    },
    {
      question: "Can I retire before pension starts?",
      answer:
        "Yes, but your portfolio must cover full expenses until pension starts. After pension, portfolio doesn't need to generate that much income.",
    },
  ],
  formula: "FIRE Number with Pension = (Annual Expenses - Pension Income) × 25",
};

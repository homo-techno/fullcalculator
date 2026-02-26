import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paycheckWithholdingCalculator: CalculatorDefinition = {
  slug: "paycheck-withholding-calculator",
  title: "Paycheck Withholding Calculator",
  description:
    "Free paycheck withholding calculator. Optimize your W-4 settings to avoid owing taxes or getting too large a refund. Estimate proper federal withholding.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "withholding calculator",
    "w4 calculator",
    "federal withholding",
    "paycheck tax withholding",
    "w-4 adjustments",
  ],
  variants: [
    {
      id: "standard",
      name: "Withholding Optimizer",
      description:
        "Calculate if your current withholding is on track for the year",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Salary",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        {
          name: "payFrequency",
          label: "Pay Frequency",
          type: "select",
          options: [
            { label: "Weekly (52)", value: "52" },
            { label: "Bi-Weekly (26)", value: "26" },
            { label: "Semi-Monthly (24)", value: "24" },
            { label: "Monthly (12)", value: "12" },
          ],
          defaultValue: "26",
        },
        {
          name: "currentWithholding",
          label: "Federal Tax Withheld Per Paycheck",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
        },
        {
          name: "deductionType",
          label: "Deduction Type",
          type: "select",
          options: [
            { label: "Standard Deduction", value: "standard" },
            { label: "Itemized (enter amount)", value: "itemized" },
          ],
          defaultValue: "standard",
        },
        {
          name: "itemizedAmount",
          label: "Itemized Deductions (if applicable)",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "credits",
          label: "Expected Annual Tax Credits",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const salary = parseFloat(inputs.annualSalary as string);
        const status = inputs.filingStatus as string;
        const frequency = parseInt(inputs.payFrequency as string, 10);
        const withheld = parseFloat(inputs.currentWithholding as string);
        const dedType = inputs.deductionType as string;
        const itemized = parseFloat(inputs.itemizedAmount as string) || 0;
        const credits = parseFloat(inputs.credits as string) || 0;

        if (!salary || salary <= 0 || !withheld) return null;

        const standardDeductions: Record<string, number> = {
          single: 14600,
          married: 29200,
          hoh: 21900,
        };

        const deduction = dedType === "standard" ? standardDeductions[status] || 14600 : itemized;
        const taxableIncome = Math.max(0, salary - deduction);

        const brackets: Record<string, { limit: number; rate: number }[]> = {
          single: [
            { limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 },
            { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          married: [
            { limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 }, { limit: 383900, rate: 0.24 },
            { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          hoh: [
            { limit: 16550, rate: 0.10 }, { limit: 63100, rate: 0.12 },
            { limit: 100500, rate: 0.22 }, { limit: 191950, rate: 0.24 },
            { limit: 243700, rate: 0.32 }, { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
        };

        const b = brackets[status] || brackets.single;
        let estimatedTax = 0;
        let remaining = taxableIncome;
        let prevLimit = 0;
        for (const bracket of b) {
          const taxable = Math.min(remaining, bracket.limit - prevLimit);
          if (taxable <= 0) break;
          estimatedTax += taxable * bracket.rate;
          remaining -= taxable;
          prevLimit = bracket.limit;
        }

        estimatedTax = Math.max(0, estimatedTax - credits);

        const annualWithholding = withheld * frequency;
        const difference = annualWithholding - estimatedTax;
        const idealWithholding = estimatedTax / frequency;

        let status_msg: string;
        if (Math.abs(difference) < 200) {
          status_msg = "On track (within $200)";
        } else if (difference > 0) {
          status_msg = `Over-withholding by $${formatNumber(difference)} (refund expected)`;
        } else {
          status_msg = `Under-withholding by $${formatNumber(Math.abs(difference))} (may owe taxes)`;
        }

        return {
          primary: { label: "Projected Refund / Amount Owed", value: difference >= 0 ? `+$${formatNumber(difference)}` : `-$${formatNumber(Math.abs(difference))}` },
          details: [
            { label: "Status", value: status_msg },
            { label: "Estimated annual tax liability", value: `$${formatNumber(estimatedTax)}` },
            { label: "Annual withholding at current rate", value: `$${formatNumber(annualWithholding)}` },
            { label: "Ideal withholding per paycheck", value: `$${formatNumber(idealWithholding)}` },
            { label: "Current withholding per paycheck", value: `$${formatNumber(withheld)}` },
            { label: "Adjustment needed per paycheck", value: `$${formatNumber(idealWithholding - withheld)}` },
            { label: "Taxable income", value: `$${formatNumber(taxableIncome)}` },
          ],
          note: difference > 1000
            ? "You're significantly over-withholding. Consider adjusting your W-4 to increase take-home pay. A large refund means you gave the government an interest-free loan."
            : difference < -500
              ? "You may owe taxes at filing time and could face an underpayment penalty. Consider increasing withholding or making estimated payments."
              : "Your withholding is well-calibrated. Small adjustments are optional.",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "paycheck-calculator", "fica-tax-calculator"],
  faq: [
    {
      question: "How do I adjust my federal withholding?",
      answer:
        "Submit a new Form W-4 to your employer. To increase withholding (reduce refund), enter extra withholding on Line 4(c). To decrease withholding (increase take-home pay), claim dependents on Step 3 or deductions on Line 4(b).",
    },
    {
      question: "Is getting a large tax refund good?",
      answer:
        "Not necessarily. A large refund means you overpaid throughout the year, giving the government an interest-free loan. Ideally, you should aim to break even or get a small refund. The money is better in your paycheck where you can invest it.",
    },
    {
      question: "When should I update my W-4?",
      answer:
        "Update your W-4 after major life changes: marriage, divorce, having a child, buying a home, starting a side job, or receiving a significant raise. Also review annually to ensure withholding matches your expected tax liability.",
    },
  ],
  formula:
    "Projected Refund = Annual Withholding - Estimated Tax Liability. Estimated Tax = f(taxable income, brackets) - credits",
};

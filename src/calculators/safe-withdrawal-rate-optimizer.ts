import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const safeWithdrawalRateOptimizer: CalculatorDefinition = {
  slug: "safe-withdrawal-rate-optimizer",
  title: "Safe Withdrawal Rate Optimizer",
  description:
    "Optimize your withdrawal rate. Compare 3%, 3.5%, 4%, 4.5% SWR based on portfolio size, time horizon, and market conditions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "safe withdrawal rate calculator",
    "SWR optimizer",
    "withdrawal rate analysis",
    "retirement withdrawal strategy",
    "4% rule alternative",
  ],
  variants: [
    {
      id: "calculate",
      name: "Optimize Your SWR",
      description: "Find optimal withdrawal rate for your situation",
      fields: [
        {
          name: "portfolio",
          label: "Total Portfolio",
          type: "number",
          placeholder: "e.g. 1000000",
          prefix: "$",
        },
        {
          name: "retirementYears",
          label: "Expected Retirement Years",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "riskTolerance",
          label: "Risk Tolerance",
          type: "select",
          options: [
            { label: "Conservative (3% SWR)", value: "conservative" },
            { label: "Moderate (3.5% SWR)", value: "moderate" },
            { label: "Balanced (4% SWR)", value: "balanced" },
            { label: "Aggressive (4.5% SWR)", value: "aggressive" },
          ],
          defaultValue: "balanced",
        },
      ],
      calculate: (inputs) => {
        const portfolio = parseFloat(inputs.portfolio as string) || 1000000;
        const years = parseFloat(inputs.retirementYears as string) || 30;
        const risk = inputs.riskTolerance as string;

        const rates: Record<string, { swr: number; success: number }> = {
          conservative: { swr: 0.03, success: 99 },
          moderate: { swr: 0.035, success: 97 },
          balanced: { swr: 0.04, success: 95 },
          aggressive: { swr: 0.045, success: 86 },
        };

        const selected = rates[risk] || rates.balanced;
        const yearlyWithdrawal = portfolio * selected.swr;
        const monthlyWithdrawal = yearlyWithdrawal / 12;

        return {
          primary: { label: "Recommended Withdrawal", value: `$${formatNumber(yearlyWithdrawal, 0)}/year` },
          details: [
            { label: "Portfolio size", value: `$${formatNumber(portfolio, 0)}` },
            { label: "Withdrawal rate", value: `${selected.swr * 100}%` },
            { label: "Annual withdrawal", value: `$${formatNumber(yearlyWithdrawal, 0)}` },
            { label: "Monthly withdrawal", value: `$${formatNumber(monthlyWithdrawal, 0)}` },
            { label: "Expected retirement years", value: formatNumber(years) },
            { label: "Historical success rate", value: `${selected.success}% of historical periods` },
            { label: "Inflation-adjusted?", value: "Yes, adjust withdrawals with inflation" },
          ],
          note: `${selected.swr * 100}% SWR historically succeeds ${selected.success}% of the time over ${years}-year retirements. Higher rates have higher failure risk.`,
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "sequence-of-returns-risk"],
  faq: [
    {
      question: "Is 4% still safe?",
      answer:
        "For 30-year retirements: ~95% historical success. For 50+ years: 3% is safer. For 20 years: 4.5% is reasonable. It depends on your time horizon.",
    },
    {
      question: "Can I use variable withdrawal rates?",
      answer:
        "Yes! Reduce withdrawals in down markets, increase in up markets. Guardrail strategy (reduce 10% if portfolio drops below guardrails) can support higher rates.",
    },
  ],
  formula: "Annual Withdrawal = Portfolio × Safe Withdrawal Rate %",
};

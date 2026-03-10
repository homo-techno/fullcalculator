import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sequenceOfReturnsRisk: CalculatorDefinition = {
  slug: "sequence-of-returns-risk",
  title: "Sequence of Returns Risk Calculator",
  description:
    "Analyze sequence of returns risk: how market downturns early in retirement affect portfolio longevity. Test different withdrawal scenarios.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "sequence of returns risk",
    "retirement sequence risk",
    "market timing retirement",
    "sequence risk calculator",
    "retirement safety analysis",
  ],
  variants: [
    {
      id: "simple",
      name: "Test Sequence Scenarios",
      description: "Compare different return sequences",
      fields: [
        {
          name: "portfolio",
          label: "Starting Portfolio",
          type: "number",
          placeholder: "e.g. 1000000",
          prefix: "$",
        },
        {
          name: "annualWithdrawal",
          label: "Annual Withdrawal",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
        },
        {
          name: "years",
          label: "Retirement Years",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const portfolio = parseFloat(inputs.portfolio as string) || 1000000;
        const withdrawal = parseFloat(inputs.annualWithdrawal as string) || 40000;
        const years = parseFloat(inputs.years as string) || 30;

        // Best case: strong returns early
        let bestPortfolio = portfolio;
        let worstPortfolio = portfolio;

        for (let i = 0; i < years; i++) {
          // Best case: 8% first, 6% later
          const bestReturn = i < years / 2 ? 0.08 : 0.06;
          bestPortfolio = (bestPortfolio - withdrawal) * (1 + bestReturn);

          // Worst case: 2% first, 8% later (sequence risk!)
          const worstReturn = i < years / 2 ? 0.02 : 0.08;
          worstPortfolio = (worstPortfolio - withdrawal) * (1 + worstReturn);
        }

        const difference = bestPortfolio - worstPortfolio;
        const withdrawalRate = (withdrawal / portfolio) * 100;

        return {
          primary: { label: "Sequence Risk Impact", value: `$${formatNumber(difference, 0)}` },
          details: [
            { label: "Starting portfolio", value: `$${formatNumber(portfolio, 0)}` },
            { label: "Annual withdrawal", value: `$${formatNumber(withdrawal, 0)}` },
            { label: "Withdrawal rate", value: `${formatNumber(withdrawalRate, 2)}%` },
            { label: "Retirement years", value: formatNumber(years) },
            { label: "Best case ending (strong early)", value: `$${formatNumber(bestPortfolio, 0)}` },
            { label: "Worst case ending (weak early)", value: `$${formatNumber(worstPortfolio, 0)}` },
            { label: "Risk impact", value: `$${formatNumber(Math.abs(difference), 0)}` },
            { label: "Worst case outcome", value: worstPortfolio > 0 ? "Portfolio survives ✓" : "Portfolio depletes ✗" },
          ],
          note: "Strong returns early are better than late returns due to withdrawal drag. Market downturn at retirement start is biggest risk.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "safe-withdrawal-rate-optimizer"],
  faq: [
    {
      question: "Why does sequence of returns matter?",
      answer:
        "When you withdraw from a falling portfolio, you sell low. Those shares never recover. $100 withdrawn when market is down costs more in foregone gains than $100 withdrawn when market is up.",
    },
    {
      question: "Can I avoid sequence risk?",
      answer:
        "Partially: keep 2-3 years expenses in cash, use bond/stock allocation that adjusts with age, or reduce withdrawals during downturns. Some risk is unavoidable.",
    },
  ],
  formula: "Impact = Portfolio(Good Sequence) - Portfolio(Bad Sequence)",
};

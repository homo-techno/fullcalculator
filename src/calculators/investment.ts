import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const investmentCalculator: CalculatorDefinition = {
  slug: "investment-calculator",
  title: "Investment Calculator",
  description: "Free investment calculator. Calculate investment returns with regular contributions, compound interest, and see your money grow over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["investment calculator", "investment return calculator", "investment growth calculator", "stock investment calculator", "money growth calculator"],
  variants: [
    {
      id: "growth",
      name: "Investment Growth",
      description: "Project investment growth with recurring contributions",
      fields: [
        { name: "initial", label: "Initial Investment", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "monthly", label: "Monthly Contribution", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "years", label: "Investment Period (years)", type: "number", placeholder: "e.g. 20" },
        { name: "rate", label: "Expected Annual Return", type: "number", placeholder: "e.g. 8", suffix: "%" },
      ],
      calculate: (inputs) => {
        const initial = (inputs.initial as number) || 0;
        const monthly = (inputs.monthly as number) || 0;
        const years = inputs.years as number;
        const rate = ((inputs.rate as number) || 8) / 100;
        if (!years) return null;
        const r = rate / 12;
        const n = years * 12;
        const fvInitial = initial * Math.pow(1 + r, n);
        const fvContributions = monthly * ((Math.pow(1 + r, n) - 1) / r);
        const total = fvInitial + fvContributions;
        const totalContributed = initial + monthly * n;
        const earnings = total - totalContributed;
        return {
          primary: { label: "Future Value", value: `$${formatNumber(total)}` },
          details: [
            { label: "Total contributed", value: `$${formatNumber(totalContributed)}` },
            { label: "Investment earnings", value: `$${formatNumber(earnings)}` },
            { label: "Return on investment", value: `${formatNumber((earnings / totalContributed) * 100)}%` },
            { label: "Earnings as % of total", value: `${formatNumber((earnings / total) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "return",
      name: "Calculate Return Rate",
      description: "Find the annual return rate from starting and ending values",
      fields: [
        { name: "initial", label: "Initial Investment", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "final", label: "Final Value", type: "number", placeholder: "e.g. 25000", prefix: "$" },
        { name: "years", label: "Years Held", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const initial = inputs.initial as number;
        const final_ = inputs.final as number;
        const years = inputs.years as number;
        if (!initial || !final_ || !years) return null;
        const totalReturn = ((final_ - initial) / initial) * 100;
        const annualReturn = (Math.pow(final_ / initial, 1 / years) - 1) * 100;
        return {
          primary: { label: "Annualized Return", value: `${formatNumber(annualReturn, 2)}%` },
          details: [
            { label: "Total return", value: `${formatNumber(totalReturn, 2)}%` },
            { label: "Profit/Loss", value: `$${formatNumber(final_ - initial)}` },
            { label: "Period", value: `${years} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "retirement-calculator", "roi-calculator"],
  faq: [
    { question: "What is a good annual return?", answer: "The S&P 500 has historically returned ~10% annually (7% after inflation). A diversified portfolio of stocks and bonds typically returns 6-8%. Returns vary year to year — these are long-term averages." },
  ],
  formula: "FV = PV(1+r)^n + PMT×((1+r)^n-1)/r | CAGR = (End/Start)^(1/years) - 1",
};

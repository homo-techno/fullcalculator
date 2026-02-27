import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const optionsGreeksCalculator: CalculatorDefinition = {
  slug: "options-greeks-calculator",
  title: "Options Greeks Calculator",
  description: "Free options greeks calculator. Calculate and plan with accurate options greeks delta gamma estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["options greeks calculator", "options greeks delta gamma", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Options Greeks",
      description: "Free options greeks calculator. Calculate and plan with accurate options greeks ",
      fields: [
        {
          name: "stockPrice",
          label: "Stock Price",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "strikePrice",
          label: "Strike Price",
          type: "number",
          placeholder: "e.g. 105",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "days",
          label: "Days to Expiration",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "days",
          min: 1,
          max: 365,
        },
        {
          name: "volatility",
          label: "Implied Volatility",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "%",
          min: 1,
          max: 200,
          step: 0.1,
        },
        {
          name: "riskFree",
          label: "Risk-Free Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.1,
          defaultValue: 5,
        }
      ],
      calculate: (inputs) => {
        const S = inputs.stockPrice as number;
        const K = inputs.strikePrice as number;
        const days = inputs.days as number;
        const vol = (inputs.volatility as number) / 100;
        const r = (inputs.riskFree as number) / 100;
        if (!S || !K || !days || !vol) return null;
        const T = days / 365;
        const d1 = (Math.log(S / K) + (r + vol * vol / 2) * T) / (vol * Math.sqrt(T));
        const d2 = d1 - vol * Math.sqrt(T);
        const nd1 = 0.5 * (1 + erf(d1 / Math.sqrt(2)));
        const npd1 = Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
        const delta = nd1;
        const gamma = npd1 / (S * vol * Math.sqrt(T));
        const theta = -(S * npd1 * vol) / (2 * Math.sqrt(T)) / 365;
        const vega = S * npd1 * Math.sqrt(T) / 100;
        function erf(x) { const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429]; const p = 0.3275911; const sign = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + p * x); return sign * (1 - ((((a[4]*t+a[3])*t+a[2])*t+a[1])*t+a[0])*t*Math.exp(-x*x)); }
        return {
          primary: { label: "Delta", value: formatNumber(delta, 4) },
          details: [
            { label: "Gamma", value: formatNumber(gamma, 4) },
            { label: "Theta (daily)", value: "$" + formatNumber(theta) },
            { label: "Vega", value: "$" + formatNumber(vega) },
            { label: "d1", value: formatNumber(d1, 4) },
            { label: "d2", value: formatNumber(d2, 4) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the options greeks work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Delta = N(d1), d1 = [ln(S/K) + (r + sigma^2/2)T] / (sigma * sqrt(T))",
};

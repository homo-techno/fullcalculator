import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function normalCDF(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

export const blackScholesCalculator: CalculatorDefinition = {
  slug: "black-scholes-calculator",
  title: "Black-Scholes Calculator",
  description: "Free Black-Scholes option pricing calculator. Calculate theoretical option prices for calls and puts using the Black-Scholes model.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["black scholes", "option pricing", "options calculator", "call option", "put option", "black scholes model"],
  variants: [
    {
      id: "callOption",
      name: "Call Option Price",
      description: "Calculate theoretical call option price",
      fields: [
        { name: "stockPrice", label: "Current Stock Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "strikePrice", label: "Strike Price", type: "number", prefix: "$", placeholder: "e.g. 105" },
        { name: "timeToExpiry", label: "Time to Expiry (years)", type: "number", placeholder: "e.g. 0.5", step: 0.01 },
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "volatility", label: "Volatility (%)", type: "number", placeholder: "e.g. 20", suffix: "%" },
      ],
      calculate: (inputs) => {
        const S = inputs.stockPrice as number;
        const K = inputs.strikePrice as number;
        const T = inputs.timeToExpiry as number;
        const r = (inputs.riskFreeRate as number) / 100;
        const sigma = (inputs.volatility as number) / 100;
        if (!S || !K || !T || !r || !sigma) return null;
        const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        const callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
        return {
          primary: { label: "Call Option Price", value: `$${formatNumber(callPrice, 4)}` },
          details: [
            { label: "d1", value: formatNumber(d1, 6) },
            { label: "d2", value: formatNumber(d2, 6) },
            { label: "N(d1)", value: formatNumber(normalCDF(d1), 6) },
            { label: "N(d2)", value: formatNumber(normalCDF(d2), 6) },
          ],
        };
      },
    },
    {
      id: "putOption",
      name: "Put Option Price",
      description: "Calculate theoretical put option price",
      fields: [
        { name: "stockPrice", label: "Current Stock Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "strikePrice", label: "Strike Price", type: "number", prefix: "$", placeholder: "e.g. 105" },
        { name: "timeToExpiry", label: "Time to Expiry (years)", type: "number", placeholder: "e.g. 0.5", step: 0.01 },
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "volatility", label: "Volatility (%)", type: "number", placeholder: "e.g. 20", suffix: "%" },
      ],
      calculate: (inputs) => {
        const S = inputs.stockPrice as number;
        const K = inputs.strikePrice as number;
        const T = inputs.timeToExpiry as number;
        const r = (inputs.riskFreeRate as number) / 100;
        const sigma = (inputs.volatility as number) / 100;
        if (!S || !K || !T || !r || !sigma) return null;
        const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        const putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
        return {
          primary: { label: "Put Option Price", value: `$${formatNumber(putPrice, 4)}` },
          details: [
            { label: "d1", value: formatNumber(d1, 6) },
            { label: "d2", value: formatNumber(d2, 6) },
            { label: "N(-d1)", value: formatNumber(normalCDF(-d1), 6) },
            { label: "N(-d2)", value: formatNumber(normalCDF(-d2), 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["options-profit-calculator", "put-call-parity-calculator"],
  faq: [
    { question: "What is the Black-Scholes model?", answer: "The Black-Scholes model is a mathematical model for pricing European-style options. It calculates the theoretical price of call and put options based on stock price, strike price, time to expiration, risk-free rate, and volatility." },
    { question: "What is implied volatility?", answer: "Implied volatility is the market's forecast of a likely movement in a security's price. It is derived by solving the Black-Scholes formula backwards from the market price of an option." },
    { question: "Does the Black-Scholes model work for American options?", answer: "The standard Black-Scholes model is designed for European options (exercisable only at expiration). American options (exercisable any time) may require adjustments, especially for dividend-paying stocks." },
  ],
  formula: "C = S*N(d1) - K*e^(-rT)*N(d2) | P = K*e^(-rT)*N(-d2) - S*N(-d1) | d1 = [ln(S/K) + (r + sigma^2/2)*T] / (sigma*sqrt(T)) | d2 = d1 - sigma*sqrt(T)",
};

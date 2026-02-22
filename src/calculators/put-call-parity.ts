import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const putCallParityCalculator: CalculatorDefinition = {
  slug: "put-call-parity-calculator",
  title: "Put-Call Parity Calculator",
  description: "Free put-call parity calculator. Verify option pricing relationships and identify arbitrage opportunities between calls and puts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["put call parity", "option pricing", "arbitrage", "call price", "put price", "options relationship"],
  variants: [
    {
      id: "findCall",
      name: "Find Call Price",
      description: "Calculate theoretical call price from put price",
      fields: [
        { name: "putPrice", label: "Put Option Price", type: "number", prefix: "$", placeholder: "e.g. 3.50" },
        { name: "stockPrice", label: "Current Stock Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "strikePrice", label: "Strike Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "timeToExpiry", label: "Time to Expiry (years)", type: "number", placeholder: "e.g. 0.5", step: 0.01 },
      ],
      calculate: (inputs) => {
        const P = inputs.putPrice as number;
        const S = inputs.stockPrice as number;
        const K = inputs.strikePrice as number;
        const r = (inputs.riskFreeRate as number) / 100;
        const T = inputs.timeToExpiry as number;
        if (P === undefined || !S || !K || !r || !T) return null;
        const pvK = K * Math.exp(-r * T);
        const C = P + S - pvK;
        return {
          primary: { label: "Theoretical Call Price", value: `$${formatNumber(C, 4)}` },
          details: [
            { label: "Put price", value: `$${formatNumber(P, 4)}` },
            { label: "PV of strike", value: `$${formatNumber(pvK, 4)}` },
            { label: "Parity check: C + PV(K)", value: `$${formatNumber(C + pvK, 4)}` },
            { label: "Parity check: P + S", value: `$${formatNumber(P + S, 4)}` },
          ],
        };
      },
    },
    {
      id: "findPut",
      name: "Find Put Price",
      description: "Calculate theoretical put price from call price",
      fields: [
        { name: "callPrice", label: "Call Option Price", type: "number", prefix: "$", placeholder: "e.g. 7.50" },
        { name: "stockPrice", label: "Current Stock Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "strikePrice", label: "Strike Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "timeToExpiry", label: "Time to Expiry (years)", type: "number", placeholder: "e.g. 0.5", step: 0.01 },
      ],
      calculate: (inputs) => {
        const C = inputs.callPrice as number;
        const S = inputs.stockPrice as number;
        const K = inputs.strikePrice as number;
        const r = (inputs.riskFreeRate as number) / 100;
        const T = inputs.timeToExpiry as number;
        if (C === undefined || !S || !K || !r || !T) return null;
        const pvK = K * Math.exp(-r * T);
        const P = C - S + pvK;
        return {
          primary: { label: "Theoretical Put Price", value: `$${formatNumber(P, 4)}` },
          details: [
            { label: "Call price", value: `$${formatNumber(C, 4)}` },
            { label: "PV of strike", value: `$${formatNumber(pvK, 4)}` },
            { label: "Parity check: C + PV(K)", value: `$${formatNumber(C + pvK, 4)}` },
            { label: "Parity check: P + S", value: `$${formatNumber(P + S, 4)}` },
          ],
        };
      },
    },
    {
      id: "checkParity",
      name: "Check Parity",
      description: "Verify if put-call parity holds",
      fields: [
        { name: "callPrice", label: "Call Price", type: "number", prefix: "$", placeholder: "e.g. 7.50" },
        { name: "putPrice", label: "Put Price", type: "number", prefix: "$", placeholder: "e.g. 3.50" },
        { name: "stockPrice", label: "Stock Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "strikePrice", label: "Strike Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "timeToExpiry", label: "Time to Expiry (years)", type: "number", placeholder: "e.g. 0.5", step: 0.01 },
      ],
      calculate: (inputs) => {
        const C = inputs.callPrice as number;
        const P = inputs.putPrice as number;
        const S = inputs.stockPrice as number;
        const K = inputs.strikePrice as number;
        const r = (inputs.riskFreeRate as number) / 100;
        const T = inputs.timeToExpiry as number;
        if (C === undefined || P === undefined || !S || !K || !r || !T) return null;
        const pvK = K * Math.exp(-r * T);
        const leftSide = C + pvK;
        const rightSide = P + S;
        const difference = Math.abs(leftSide - rightSide);
        const parityHolds = difference < 0.05;
        return {
          primary: { label: "Parity Status", value: parityHolds ? "Holds (within $0.05)" : "Violated" },
          details: [
            { label: "C + PV(K)", value: `$${formatNumber(leftSide, 4)}` },
            { label: "P + S", value: `$${formatNumber(rightSide, 4)}` },
            { label: "Difference", value: `$${formatNumber(difference, 4)}` },
            { label: "Possible arbitrage?", value: parityHolds ? "No" : "Yes" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["black-scholes-calculator", "options-profit-calculator"],
  faq: [
    { question: "What is put-call parity?", answer: "Put-call parity is a fundamental relationship between the price of a European call option and a European put option with the same strike price and expiration date: C + PV(K) = P + S, where C is call price, P is put price, S is stock price, and PV(K) is the present value of the strike." },
    { question: "What happens when parity is violated?", answer: "When put-call parity is violated, an arbitrage opportunity exists. Traders can construct a riskless portfolio to lock in a profit by simultaneously buying the underpriced side and selling the overpriced side." },
    { question: "Does put-call parity work for American options?", answer: "Put-call parity strictly applies to European options. For American options on non-dividend-paying stocks, the relationship becomes an inequality: S - K <= C - P <= S - PV(K)." },
  ],
  formula: "C + PV(K) = P + S | C + K*e^(-rT) = P + S",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaSipCalculator: CalculatorDefinition = {
  slug: "india-sip-calculator",
  title: "India SIP Calculator",
  description: "Free SIP calculator. Calculate returns on Systematic Investment Plan for mutual funds with expected annual return rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sip calculator", "mutual fund sip calculator", "sip return calculator india"],
  variants: [{
    id: "standard",
    name: "India SIP",
    description: "Free SIP calculator",
    fields: [
      { name: "monthly", label: "Monthly SIP Amount", type: "number", prefix: "₹", min: 100 },
      { name: "rate", label: "Expected Annual Return", type: "number", suffix: "%", defaultValue: 12, min: 1, max: 30 },
      { name: "years", label: "Investment Period", type: "number", suffix: "years", min: 1, max: 40 },
    ],
    calculate: (inputs) => {
      const monthly = inputs.monthly as number;
      const rate = inputs.rate as number;
      const years = inputs.years as number;
      if (!monthly || !rate || !years) return null;
      const r = rate / 100 / 12;
      const n = years * 12;
      const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const invested = monthly * n;
      const gains = fv - invested;
      return {
        primary: { label: "Maturity Value", value: "₹" + formatNumber(fv) },
        details: [
          { label: "Total invested", value: "₹" + formatNumber(invested) },
          { label: "Estimated returns", value: "₹" + formatNumber(gains) },
          { label: "Return multiple", value: formatNumber(fv / invested, 1) + "x" },
          { label: "CAGR", value: formatNumber(rate) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is SIP?", answer: "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds, benefiting from rupee cost averaging and compounding." },
    { question: "What is a good SIP return rate?", answer: "Historically, equity mutual funds in India have returned 12-15% annually over 10+ years. Debt funds typically return 7-9%." },
  ],
  formula: "FV = P × [(1+r)^n - 1] / r × (1+r), where P=monthly, r=monthly rate, n=months",
};

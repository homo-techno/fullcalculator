import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentVsBuyBreakEvenCalculator: CalculatorDefinition = {
  slug: "rent-vs-buy-break-even-calculator",
  title: "Rent vs Buy Break Even Calculator",
  description: "Calculate how long it takes for buying to break even versus renting",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rent vs buy","break even buying","rent or buy decision"],
  variants: [{
    id: "standard",
    name: "Rent vs Buy Break Even",
    description: "Calculate how long it takes for buying to break even versus renting",
    fields: [
      { name: "homePrice", label: "Home Price ($)", type: "number", defaultValue: 350000, min: 0, step: 10000 },
      { name: "downPaymentPct", label: "Down Payment (%)", type: "number", defaultValue: 20, min: 0, max: 100, step: 5 },
      { name: "mortgageRate", label: "Mortgage Rate (%)", type: "number", defaultValue: 6.5, min: 0, max: 15, step: 0.1 },
      { name: "monthlyRent", label: "Current Monthly Rent ($)", type: "number", defaultValue: 1800, min: 0, step: 100 },
      { name: "homeAppreciation", label: "Annual Appreciation (%)", type: "number", defaultValue: 3, min: 0, max: 15, step: 0.5 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const price = inputs.homePrice as number || 350000;
      const downPct = (inputs.downPaymentPct as number || 20) / 100;
      const rate = (inputs.mortgageRate as number || 6.5) / 100 / 12;
      const rent = inputs.monthlyRent as number || 1800;
      const appreciation = (inputs.homeAppreciation as number || 3) / 100;
      const down = price * downPct;
      const loan = price - down;
      const mortgagePmt = rate > 0 ? loan * rate / (1 - Math.pow(1 + rate, -360)) : loan / 360;
      const monthlyOwn = mortgagePmt + (price * 0.012 / 12) + (price * 0.005 / 12);
      let buyCost = down;
      let rentCost = 0;
      let breakEvenYear = 0;
      for (let yr = 1; yr <= 30; yr++) {
        buyCost += monthlyOwn * 12;
        rentCost += rent * 12 * Math.pow(1.03, yr - 1);
        const equity = price * Math.pow(1 + appreciation, yr) - loan * 0.95;
        if (rentCost > buyCost - equity && breakEvenYear === 0) {
          breakEvenYear = yr;
        }
      }
      const fiveYearEquity = price * Math.pow(1 + appreciation, 5) - price;
      return {
        primary: { label: "Break Even Point", value: breakEvenYear > 0 ? breakEvenYear + " years" : "30+ years" },
        details: [
          { label: "Monthly Mortgage Payment", value: "$" + formatNumber(Math.round(mortgagePmt)) },
          { label: "Monthly Ownership Cost", value: "$" + formatNumber(Math.round(monthlyOwn)) },
          { label: "Down Payment", value: "$" + formatNumber(Math.round(down)) },
          { label: "5-Year Appreciation", value: "$" + formatNumber(Math.round(fiveYearEquity)) }
        ]
      };
    },
  }],
  relatedSlugs: ["rental-yield-calculator"],
  faq: [
    { question: "How long until buying is cheaper than renting?", answer: "Typically 5-7 years, depending on home prices, mortgage rates, and local rent increases." },
    { question: "What costs are included in ownership?", answer: "This includes mortgage payment, property taxes (1.2%), and insurance/maintenance (0.5%)." },
  ],
  formula: "Break Even = Year when cumulative rent exceeds cumulative ownership costs minus equity",
};

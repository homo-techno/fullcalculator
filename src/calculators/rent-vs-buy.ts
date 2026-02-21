import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentVsBuyCalculator: CalculatorDefinition = {
  slug: "rent-vs-buy-calculator",
  title: "Rent vs Buy Calculator",
  description:
    "Free rent vs buy calculator. Compare the long-term costs of renting versus buying a home over a given time period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rent vs buy", "home buying", "renting", "mortgage", "real estate"],
  variants: [
    {
      id: "comparison",
      name: "Rent vs Buy Comparison",
      fields: [
        { name: "monthlyRent", label: "Monthly Rent ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "rentIncrease", label: "Annual Rent Increase (%)", type: "number", placeholder: "e.g. 3" },
        { name: "homePrice", label: "Home Price ($)", type: "number", placeholder: "e.g. 400000" },
        { name: "downPaymentPct", label: "Down Payment (%)", type: "number", placeholder: "e.g. 20" },
        { name: "mortgageRate", label: "Mortgage Rate (%)", type: "number", placeholder: "e.g. 6.5" },
        { name: "mortgageTerm", label: "Mortgage Term (years)", type: "number", placeholder: "e.g. 30" },
        { name: "appreciationRate", label: "Home Appreciation (%/yr)", type: "number", placeholder: "e.g. 3" },
        { name: "years", label: "Years to Compare", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const monthlyRent = inputs.monthlyRent as number;
        const rentIncrease = inputs.rentIncrease as number || 3;
        const homePrice = inputs.homePrice as number;
        const downPaymentPct = inputs.downPaymentPct as number || 20;
        const mortgageRate = inputs.mortgageRate as number;
        const mortgageTerm = inputs.mortgageTerm as number || 30;
        const appreciationRate = inputs.appreciationRate as number || 3;
        const years = inputs.years as number;

        if (!monthlyRent || !homePrice || !mortgageRate || !years) return null;

        // Renting costs
        let totalRent = 0;
        let currentRent = monthlyRent;
        for (let y = 0; y < years; y++) {
          totalRent += currentRent * 12;
          currentRent *= (1 + rentIncrease / 100);
        }

        // Buying costs
        const downPayment = homePrice * (downPaymentPct / 100);
        const loanAmount = homePrice - downPayment;
        const monthlyRate = (mortgageRate / 100) / 12;
        const totalMonths = mortgageTerm * 12;
        const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

        const yearsPayments = Math.min(years, mortgageTerm) * 12;
        const totalMortgagePayments = monthlyMortgage * yearsPayments;

        // Property tax + insurance + maintenance estimate (~2.5% of home value per year)
        let totalOwnershipCosts = 0;
        let currentHomeValue = homePrice;
        for (let y = 0; y < years; y++) {
          totalOwnershipCosts += currentHomeValue * 0.025;
          currentHomeValue *= (1 + appreciationRate / 100);
        }

        const homeValueAtEnd = homePrice * Math.pow(1 + appreciationRate / 100, years);

        // Calculate remaining balance
        let balance = loanAmount;
        for (let m = 0; m < yearsPayments; m++) {
          const interestPayment = balance * monthlyRate;
          const principalPayment = monthlyMortgage - interestPayment;
          balance -= principalPayment;
        }
        const equity = homeValueAtEnd - Math.max(balance, 0);

        const totalBuyingCost = downPayment + totalMortgagePayments + totalOwnershipCosts;
        const netBuyingCost = totalBuyingCost - (equity - downPayment);

        return {
          primary: { label: "Total Rent Cost", value: `$${formatNumber(totalRent, 2)}` },
          details: [
            { label: "Total Buying Cost (out of pocket)", value: `$${formatNumber(totalBuyingCost, 2)}` },
            { label: "Home Value After " + years + " Years", value: `$${formatNumber(homeValueAtEnd, 2)}` },
            { label: "Equity Built", value: `$${formatNumber(equity, 2)}` },
            { label: "Net Cost of Buying", value: `$${formatNumber(netBuyingCost, 2)}` },
            { label: "Monthly Mortgage Payment", value: `$${formatNumber(monthlyMortgage, 2)}` },
            { label: "Recommendation", value: netBuyingCost < totalRent ? "Buying is cheaper long-term" : "Renting is cheaper" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-refinance-calculator", "home-equity-calculator", "budget-calculator"],
  faq: [
    { question: "Is it always better to buy?", answer: "Not necessarily. Buying makes more financial sense when you plan to stay for many years, home values appreciate, and your mortgage rate is reasonable. Renting can be better for shorter time horizons or in expensive markets." },
    { question: "What costs are included in buying?", answer: "This calculator includes down payment, mortgage payments, and estimated ownership costs (property tax, insurance, maintenance at ~2.5% of home value per year), offset by home appreciation and equity built." },
  ],
  formula: "Total Rent = Σ(Monthly Rent × 12 × (1 + rent increase)^year); Net Buying Cost = Down Payment + Mortgage Payments + Ownership Costs - Equity Built",
};

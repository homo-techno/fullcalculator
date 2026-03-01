import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const goldInvestmentCalculatorIndiaCalculator: CalculatorDefinition = {
  slug: "gold-investment-calculator-india",
  title: "Gold Investment Calculator India",
  description: "Calculate the future value of gold investments in India based on current gold price, quantity, and expected appreciation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gold investment india", "gold returns calculator", "sovereign gold bond calculator"],
  variants: [{
    id: "standard",
    name: "Gold Investment India",
    description: "Calculate the future value of gold investments in India based on current gold price, quantity, and expected appreciation",
    fields: [
      { name: "investmentAmount", label: "Investment Amount", type: "number", prefix: "Rs.", min: 1000, max: 50000000, step: 1000, defaultValue: 200000 },
      { name: "goldPrice", label: "Current Gold Price per Gram", type: "number", prefix: "Rs.", min: 1000, max: 20000, step: 100, defaultValue: 6000 },
      { name: "years", label: "Holding Period", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 8 },
      { name: "expectedAppreciation", label: "Expected Annual Appreciation", type: "number", suffix: "%", min: 0, max: 20, step: 0.5, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const amount = inputs.investmentAmount as number;
      const price = inputs.goldPrice as number;
      const years = inputs.years as number;
      const appreciation = inputs.expectedAppreciation as number;
      if (!amount || !price || !years || amount <= 0 || price <= 0) return null;
      const gramsOwned = amount / price;
      const futurePrice = price * Math.pow(1 + appreciation / 100, years);
      const futureValue = gramsOwned * futurePrice;
      const totalGains = futureValue - amount;
      return {
        primary: { label: "Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Gold Quantity", value: formatNumber(Math.round(gramsOwned * 100) / 100) + " grams" },
          { label: "Future Gold Price", value: "Rs. " + formatNumber(Math.round(futurePrice)) + " per gram" },
          { label: "Total Gains", value: "Rs. " + formatNumber(Math.round(totalGains)) },
        ],
      };
    },
  }],
  relatedSlugs: ["lump-sum-investment-calculator", "sip-step-up-calculator"],
  faq: [
    { question: "What is the average annual return of gold in India?", answer: "Gold in India has historically delivered average annual returns of about 8 to 10 percent over the long term when measured in Indian Rupees, though returns can vary significantly from year to year." },
    { question: "What are the different ways to invest in gold in India?", answer: "Investors in India can purchase physical gold, Sovereign Gold Bonds (SGBs), Gold ETFs, or digital gold. SGBs offer an additional 2.5 percent annual interest and tax-free capital gains if held to maturity." },
  ],
  formula: "Future Value = (Investment / Current Price) x Current Price x (1 + Appreciation Rate) ^ Years",
};

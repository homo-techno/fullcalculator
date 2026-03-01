import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const atmBusinessCalculator: CalculatorDefinition = {
  slug: "atm-business-calculator",
  title: "ATM Business Calculator",
  description: "Calculate the revenue and return on investment for an ATM placement business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ATM business profit", "ATM machine revenue", "ATM investment return"],
  variants: [{
    id: "standard",
    name: "ATM Business",
    description: "Calculate the revenue and return on investment for an ATM placement business",
    fields: [
      { name: "atms", label: "Number of ATMs", type: "number", suffix: "units", min: 1, max: 50, defaultValue: 5 },
      { name: "costPerAtm", label: "Cost per ATM", type: "number", suffix: "$", min: 1000, max: 10000, defaultValue: 3000 },
      { name: "txPerMonth", label: "Transactions per Month per ATM", type: "number", suffix: "tx", min: 50, max: 1000, defaultValue: 300 },
      { name: "surcharge", label: "Surcharge per Transaction", type: "number", suffix: "$", min: 1, max: 5, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const atms = inputs.atms as number;
      const costPer = inputs.costPerAtm as number;
      const tx = inputs.txPerMonth as number;
      const surcharge = inputs.surcharge as number;
      if (!atms || !costPer || !tx || !surcharge) return null;
      const totalInvestment = atms * costPer;
      const monthlyGross = atms * tx * surcharge;
      const monthlyCosts = atms * 150;
      const monthlyNet = monthlyGross - monthlyCosts;
      const annualNet = monthlyNet * 12;
      const payback = monthlyNet > 0 ? Math.ceil(totalInvestment / monthlyNet) : 0;
      const roi = totalInvestment > 0 ? (annualNet / totalInvestment) * 100 : 0;
      return {
        primary: { label: "Annual Net Profit", value: "$" + formatNumber(annualNet) },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(totalInvestment) },
          { label: "Monthly Gross Revenue", value: "$" + formatNumber(monthlyGross) },
          { label: "Monthly Operating Costs", value: "$" + formatNumber(monthlyCosts) },
          { label: "Monthly Net Profit", value: "$" + formatNumber(monthlyNet) },
          { label: "Annual ROI", value: formatNumber(roi) + "%" },
          { label: "Payback Period", value: payback + " months" },
        ],
      };
    },
  }],
  relatedSlugs: ["vending-machine-roi-calculator", "laundromat-startup-calculator"],
  faq: [
    { question: "How much does an ATM business make?", answer: "Each ATM can earn $200 to $1,000 per month in surcharge revenue depending on location and transaction volume. High-traffic locations generate the most income." },
    { question: "How much does an ATM cost?", answer: "A new ATM costs $2,000 to $8,000. Used machines can be purchased for $1,000 to $3,000. You also need cash to load the machines." },
  ],
  formula: "Annual Profit = (ATMs x Transactions x Surcharge - Operating Costs) x 12; ROI = Annual Profit / Investment x 100",
};

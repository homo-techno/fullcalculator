import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const requiredMinimumDistributionCalculator: CalculatorDefinition = {
  slug: "required-minimum-distribution-calculator",
  title: "RMD Calculator",
  description: "Calculate the required minimum distribution from your retirement accounts based on age and balance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["RMD calculator", "required minimum distribution", "IRA RMD calculation"],
  variants: [{
    id: "standard",
    name: "RMD",
    description: "Calculate the required minimum distribution from your retirement accounts based on age and balance",
    fields: [
      { name: "balance", label: "Account Balance (Dec 31 Prior Year)", type: "number", suffix: "$", min: 1000, max: 20000000, defaultValue: 500000 },
      { name: "age", label: "Your Age This Year", type: "number", suffix: "years", min: 73, max: 120, defaultValue: 75 },
      { name: "taxRate", label: "Estimated Tax Rate", type: "number", suffix: "%", min: 10, max: 50, defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const balance = inputs.balance as number;
      const age = inputs.age as number;
      const taxRate = inputs.taxRate as number;
      if (!balance || !age || age < 73) return null;
      const lifeExpTable: Record<number, number> = {73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,88:13.7,89:12.9,90:12.2,91:11.5,92:10.8,93:10.1,94:9.5,95:8.9,96:8.4,97:7.8,98:7.3,99:6.8,100:6.4};
      const factor = lifeExpTable[Math.min(age, 100)] || 6.4;
      const rmd = balance / factor;
      const taxOwed = rmd * (taxRate / 100);
      const netDistribution = rmd - taxOwed;
      const monthlyRmd = rmd / 12;
      return {
        primary: { label: "Annual RMD", value: "$" + formatNumber(rmd) },
        details: [
          { label: "Account Balance", value: "$" + formatNumber(balance) },
          { label: "Distribution Factor", value: formatNumber(factor) },
          { label: "Estimated Tax", value: "$" + formatNumber(taxOwed) },
          { label: "Net After Tax", value: "$" + formatNumber(netDistribution) },
          { label: "Monthly Equivalent", value: "$" + formatNumber(monthlyRmd) },
        ],
      };
    },
  }],
  relatedSlugs: ["backdoor-roth-calculator", "pension-vs-lump-sum-calculator"],
  faq: [
    { question: "When do RMDs start?", answer: "Under the SECURE 2.0 Act, RMDs begin at age 73 for those born between 1951 and 1959, and age 75 for those born in 1960 or later. Roth IRAs do not require RMDs during the owner lifetime." },
    { question: "What happens if you do not take your RMD?", answer: "Failing to take your full RMD results in a 25 percent excise tax on the amount not withdrawn. This penalty can be reduced to 10 percent if corrected within two years." },
  ],
  formula: "RMD = Account Balance / Distribution Factor (based on IRS life expectancy table)",
};

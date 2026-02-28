import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usaRothIraCalculator: CalculatorDefinition = {
  slug: "usa-roth-ira-calculator",
  title: "USA Roth IRA Calculator",
  description: "Free Roth IRA calculator. Project tax-free retirement savings with contribution limits and compound growth.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["roth ira calculator", "ira calculator", "roth ira growth calculator", "retirement savings calculator"],
  variants: [{
    id: "standard",
    name: "USA Roth IRA",
    description: "Free Roth IRA calculator",
    fields: [
      { name: "annual", label: "Annual Contribution", type: "number", prefix: "$", defaultValue: 7000, min: 0, max: 8000 },
      { name: "existing", label: "Current Roth IRA Balance", type: "number", prefix: "$", defaultValue: 0, min: 0 },
      { name: "years", label: "Years Until Retirement", type: "number", min: 1, max: 50 },
      { name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", defaultValue: 7, min: 0, max: 20 },
    ],
    calculate: (inputs) => {
      const annual = inputs.annual as number;
      const existing = (inputs.existing as number) || 0;
      const years = inputs.years as number;
      const ret = (inputs.returnRate as number) / 100;
      if (!years) return null;
      const monthly = annual / 12;
      const r = ret / 12;
      const n = years * 12;
      const fvContrib = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const fvExisting = existing * Math.pow(1 + r, n);
      const total = fvContrib + fvExisting;
      const invested = annual * years + existing;
      return {
        primary: { label: "Projected Balance", value: "$" + formatNumber(total) },
        details: [
          { label: "Total contributions", value: "$" + formatNumber(invested) },
          { label: "Investment growth", value: "$" + formatNumber(total - invested) },
          { label: "Tax savings at withdrawal", value: "$0 (tax-free!)" },
          { label: "Growth multiple", value: formatNumber(total / Math.max(invested, 1), 1) + "x" },
        ],
        note: "2025 limit: $7,000 ($8,000 if 50+). Income phase-out: $150K-$165K (single), $236K-$246K (MFJ). All withdrawals in retirement are tax-free.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the 2025 Roth IRA contribution limit?", answer: "$7,000 per year ($8,000 if age 50 or older). Income phase-out: $150,000-$165,000 for single filers, $236,000-$246,000 for married filing jointly." },
    { question: "What is the advantage of a Roth IRA?", answer: "Contributions are made with after-tax dollars, but all growth and qualified withdrawals in retirement are completely tax-free. Great for people who expect higher tax rates in retirement." },
  ],
  formula: "FV = Monthly × [(1+r)^n - 1] / r × (1+r) + Existing × (1+r)^n",
};

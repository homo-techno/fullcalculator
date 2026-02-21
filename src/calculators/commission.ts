import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commissionCalculator2: CalculatorDefinition = {
  slug: "commission-calculator",
  title: "Commission Calculator",
  description:
    "Free commission calculator. Calculate sales commission earned based on sales amount and commission rate. See total compensation including base salary and commission.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "commission calculator",
    "sales commission calculator",
    "commission rate calculator",
    "sales compensation calculator",
    "commission earnings",
  ],
  variants: [
    {
      id: "commission",
      name: "Calculate Commission",
      description: "Calculate commission earned and total compensation",
      fields: [
        {
          name: "salesAmount",
          label: "Total Sales Amount",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "$",
          min: 0,
        },
        {
          name: "commissionRate",
          label: "Commission Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
        {
          name: "baseSalary",
          label: "Base Salary (period)",
          type: "number",
          placeholder: "e.g. 3000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const sales = inputs.salesAmount as number;
        const rate = inputs.commissionRate as number;
        const base = (inputs.baseSalary as number) || 0;
        if (!sales || !rate) return null;

        const commission = sales * (rate / 100);
        const totalComp = base + commission;
        const commissionPct = totalComp > 0 ? (commission / totalComp) * 100 : 0;

        return {
          primary: {
            label: "Commission Earned",
            value: `$${formatNumber(commission)}`,
          },
          details: [
            { label: "Sales amount", value: `$${formatNumber(sales)}` },
            { label: "Commission rate", value: `${formatNumber(rate, 1)}%` },
            { label: "Base salary", value: `$${formatNumber(base)}` },
            { label: "Total compensation", value: `$${formatNumber(totalComp)}` },
            { label: "Commission % of total pay", value: `${formatNumber(commissionPct, 1)}%` },
          ],
        };
      },
    },
    {
      id: "tiered",
      name: "Tiered Commission",
      description: "Calculate commission with tiered rates",
      fields: [
        {
          name: "salesAmount",
          label: "Total Sales Amount",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
          min: 0,
        },
        {
          name: "tier1Limit",
          label: "Tier 1 Threshold",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "tier1Rate",
          label: "Tier 1 Rate",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
        {
          name: "tier2Limit",
          label: "Tier 2 Threshold",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "tier2Rate",
          label: "Tier 2 Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
        {
          name: "tier3Rate",
          label: "Tier 3 Rate (above Tier 2)",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const sales = inputs.salesAmount as number;
        const t1Limit = (inputs.tier1Limit as number) || 0;
        const t1Rate = (inputs.tier1Rate as number) || 0;
        const t2Limit = (inputs.tier2Limit as number) || 0;
        const t2Rate = (inputs.tier2Rate as number) || 0;
        const t3Rate = (inputs.tier3Rate as number) || 0;
        if (!sales) return null;

        const tier1Sales = Math.min(sales, t1Limit);
        const tier2Sales = Math.min(Math.max(sales - t1Limit, 0), t2Limit - t1Limit);
        const tier3Sales = Math.max(sales - t2Limit, 0);

        const tier1Commission = tier1Sales * (t1Rate / 100);
        const tier2Commission = tier2Sales * (t2Rate / 100);
        const tier3Commission = tier3Sales * (t3Rate / 100);
        const totalCommission = tier1Commission + tier2Commission + tier3Commission;
        const effectiveRate = (totalCommission / sales) * 100;

        return {
          primary: {
            label: "Total Tiered Commission",
            value: `$${formatNumber(totalCommission)}`,
          },
          details: [
            { label: `Tier 1 (up to $${formatNumber(t1Limit)})`, value: `$${formatNumber(tier1Commission)}` },
            { label: `Tier 2 ($${formatNumber(t1Limit)}-$${formatNumber(t2Limit)})`, value: `$${formatNumber(tier2Commission)}` },
            { label: `Tier 3 (above $${formatNumber(t2Limit)})`, value: `$${formatNumber(tier3Commission)}` },
            { label: "Effective commission rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "Total sales", value: `$${formatNumber(sales)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "take-home-pay-calculator", "bonus-tax-calculator"],
  faq: [
    {
      question: "How is sales commission calculated?",
      answer:
        "Basic commission = Sales Amount × Commission Rate. For example, if you sell $100,000 at a 5% commission rate, your commission is $5,000. Some plans use tiered rates where higher sales volumes earn higher percentages.",
    },
    {
      question: "What is a typical commission rate?",
      answer:
        "Commission rates vary widely by industry. Real estate agents typically earn 2.5-3%, car salespeople earn 20-25% of profit, SaaS sales reps earn 5-10% of contract value, and insurance agents may earn 5-20% of premiums.",
    },
    {
      question: "What is the difference between commission and bonus?",
      answer:
        "Commission is directly tied to sales performance and is usually calculated as a percentage of each sale. Bonuses are typically lump-sum payments for meeting specific goals or milestones. Commission is variable; bonuses may be guaranteed or discretionary.",
    },
  ],
  formula: "Commission = Sales Amount × Commission Rate (%). Total Compensation = Base Salary + Commission.",
};

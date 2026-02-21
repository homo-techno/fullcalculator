import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const businessValuationCalculator: CalculatorDefinition = {
  slug: "business-valuation-calculator",
  title: "Business Valuation Calculator",
  description: "Free business valuation calculator. Estimate your business value using earnings multiples, revenue multiples, and asset-based methods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["business valuation calculator", "company valuation", "business worth calculator", "enterprise value", "business value estimator"],
  variants: [
    {
      id: "earningsMultiple",
      name: "Earnings Multiple (SDE)",
      description: "Value a small business using seller's discretionary earnings (SDE) multiple",
      fields: [
        { name: "annualRevenue", label: "Annual Revenue", type: "number", placeholder: "e.g. 1000000", prefix: "$" },
        { name: "ownerSalary", label: "Owner's Salary & Benefits", type: "number", placeholder: "e.g. 120000", prefix: "$" },
        { name: "netIncome", label: "Net Income (after taxes)", type: "number", placeholder: "e.g. 150000", prefix: "$" },
        { name: "depreciation", label: "Depreciation & Amortization", type: "number", placeholder: "e.g. 20000", prefix: "$" },
        { name: "interest", label: "Interest Expense", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "multiple", label: "SDE Multiple", type: "number", placeholder: "e.g. 2.5", step: 0.1, defaultValue: 2.5 },
      ],
      calculate: (inputs) => {
        const revenue = inputs.annualRevenue as number;
        const salary = (inputs.ownerSalary as number) || 0;
        const netIncome = inputs.netIncome as number;
        const depreciation = (inputs.depreciation as number) || 0;
        const interest = (inputs.interest as number) || 0;
        const multiple = inputs.multiple as number;
        if (!netIncome || !multiple) return null;
        const sde = netIncome + salary + depreciation + interest;
        const valuation = sde * multiple;
        const revenueMultiple = revenue ? valuation / revenue : 0;
        return {
          primary: { label: "Estimated Business Value", value: `$${formatNumber(valuation)}` },
          details: [
            { label: "SDE (Seller's Discretionary Earnings)", value: `$${formatNumber(sde)}` },
            { label: "SDE Multiple Used", value: `${formatNumber(multiple, 1)}x` },
            { label: "Implied Revenue Multiple", value: revenue ? `${formatNumber(revenueMultiple, 2)}x` : "N/A" },
            { label: "Annual Revenue", value: revenue ? `$${formatNumber(revenue)}` : "N/A" },
            { label: "Value Range (±0.5x)", value: `$${formatNumber(sde * (multiple - 0.5))} - $${formatNumber(sde * (multiple + 0.5))}` },
          ],
        };
      },
    },
    {
      id: "revenueMultiple",
      name: "Revenue Multiple",
      description: "Value a business using revenue multiples common in your industry",
      fields: [
        { name: "annualRevenue", label: "Annual Revenue", type: "number", placeholder: "e.g. 2000000", prefix: "$" },
        { name: "industry", label: "Industry", type: "select", options: [
          { label: "SaaS/Software (5-10x)", value: "7.5" },
          { label: "E-commerce (1-3x)", value: "2" },
          { label: "Professional Services (1-2x)", value: "1.5" },
          { label: "Manufacturing (0.5-2x)", value: "1.25" },
          { label: "Restaurants (0.3-0.8x)", value: "0.5" },
          { label: "Retail (0.3-1x)", value: "0.6" },
          { label: "Healthcare (1-3x)", value: "2" },
          { label: "Custom Multiple", value: "custom" },
        ], defaultValue: "2" },
        { name: "customMultiple", label: "Custom Revenue Multiple", type: "number", placeholder: "e.g. 3.0", step: 0.1 },
        { name: "growthRate", label: "Annual Revenue Growth %", type: "number", placeholder: "e.g. 20", suffix: "%" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.annualRevenue as number;
        const industryMultiple = inputs.industry as string;
        const customMultiple = inputs.customMultiple as number;
        const growth = (inputs.growthRate as number) || 0;
        if (!revenue) return null;
        const multiple = industryMultiple === "custom" ? (customMultiple || 1) : parseFloat(industryMultiple);
        if (!multiple) return null;
        const growthAdjustment = growth > 30 ? 1.3 : growth > 15 ? 1.15 : growth > 0 ? 1.0 : 0.85;
        const adjustedMultiple = multiple * growthAdjustment;
        const valuation = revenue * adjustedMultiple;
        return {
          primary: { label: "Estimated Business Value", value: `$${formatNumber(valuation)}` },
          details: [
            { label: "Base Revenue Multiple", value: `${formatNumber(multiple, 2)}x` },
            { label: "Growth-Adjusted Multiple", value: `${formatNumber(adjustedMultiple, 2)}x` },
            { label: "Annual Revenue", value: `$${formatNumber(revenue)}` },
            { label: "Revenue Growth", value: `${formatNumber(growth)}%` },
            { label: "Low Range (0.7x base)", value: `$${formatNumber(revenue * multiple * 0.7)}` },
            { label: "High Range (1.3x base)", value: `$${formatNumber(revenue * multiple * 1.3)}` },
          ],
        };
      },
    },
    {
      id: "ebitda",
      name: "EBITDA Multiple",
      description: "Value a business using EBITDA multiples",
      fields: [
        { name: "revenue", label: "Annual Revenue", type: "number", placeholder: "e.g. 5000000", prefix: "$" },
        { name: "ebitda", label: "EBITDA", type: "number", placeholder: "e.g. 800000", prefix: "$" },
        { name: "multiple", label: "EBITDA Multiple", type: "number", placeholder: "e.g. 5", step: 0.1, defaultValue: 5 },
        { name: "debt", label: "Total Debt", type: "number", placeholder: "e.g. 200000", prefix: "$" },
        { name: "cash", label: "Cash on Hand", type: "number", placeholder: "e.g. 100000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const revenue = (inputs.revenue as number) || 0;
        const ebitda = inputs.ebitda as number;
        const multiple = inputs.multiple as number;
        const debt = (inputs.debt as number) || 0;
        const cash = (inputs.cash as number) || 0;
        if (!ebitda || !multiple) return null;
        const enterpriseValue = ebitda * multiple;
        const equityValue = enterpriseValue - debt + cash;
        const ebitdaMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
        return {
          primary: { label: "Equity Value", value: `$${formatNumber(equityValue)}` },
          details: [
            { label: "Enterprise Value (EV)", value: `$${formatNumber(enterpriseValue)}` },
            { label: "EBITDA", value: `$${formatNumber(ebitda)}` },
            { label: "EBITDA Multiple", value: `${formatNumber(multiple, 1)}x` },
            { label: "EBITDA Margin", value: revenue > 0 ? `${formatNumber(ebitdaMargin)}%` : "N/A" },
            { label: "Less: Debt", value: `$${formatNumber(debt)}` },
            { label: "Plus: Cash", value: `$${formatNumber(cash)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "profit-margin-calculator", "net-income-calculator"],
  faq: [
    { question: "How do you value a small business?", answer: "The most common method for small businesses is SDE (Seller's Discretionary Earnings) multiple. SDE = Net Income + Owner's Salary + Depreciation + Interest. Typical multiples for small businesses range from 1.5x to 4x SDE depending on the industry, size, growth, and risk factors." },
    { question: "What EBITDA multiple should I use?", answer: "EBITDA multiples vary by industry and company size. Small businesses: 3-5x. Mid-market: 5-8x. Large companies: 8-15x. SaaS/tech: 10-20x+. Manufacturing: 4-7x. Healthcare: 6-12x. Higher growth and recurring revenue command higher multiples." },
    { question: "What factors affect business valuation?", answer: "Key factors include: recurring revenue, growth rate, profit margins, customer concentration (risk if one client is >20% of revenue), industry trends, competitive moat, owner dependency, and quality of financial records." },
  ],
  formula: "SDE Valuation = SDE × Multiple | Enterprise Value = EBITDA × Multiple | Equity Value = Enterprise Value - Debt + Cash | SDE = Net Income + Owner Salary + D&A + Interest",
};

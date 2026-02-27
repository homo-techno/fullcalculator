import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saasMetricsCalculator: CalculatorDefinition = {
  slug: "saas-metrics",
  title: "SaaS Metrics Calculator",
  description:
    "Calculate key SaaS business metrics including MRR, ARR, LTV, CAC, churn rate, and LTV:CAC ratio to evaluate business health.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "saas metrics",
    "mrr calculator",
    "arr calculator",
    "ltv calculator",
    "cac calculator",
    "churn rate",
    "saas revenue",
    "ltv cac ratio",
    "monthly recurring revenue",
  ],
  variants: [
    {
      slug: "saas-metrics",
      title: "SaaS Core Metrics Calculator",
      description:
        "Calculate MRR, ARR, LTV, CAC, and other key SaaS metrics.",
      fields: [
        {
          id: "totalCustomers",
          label: "Total Active Customers",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "avgMonthlyRevenue",
          label: "Average Revenue per Account ($/mo)",
          type: "number",
          defaultValue: 99,
        },
        {
          id: "monthlyChurnRate",
          label: "Monthly Churn Rate (%)",
          type: "number",
          defaultValue: 3,
        },
        {
          id: "monthlyMarketingSpend",
          label: "Monthly Marketing Spend ($)",
          type: "number",
          defaultValue: 15000,
        },
        {
          id: "monthlySalesSpend",
          label: "Monthly Sales Spend ($)",
          type: "number",
          defaultValue: 10000,
        },
        {
          id: "newCustomersPerMonth",
          label: "New Customers per Month",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "grossMargin",
          label: "Gross Margin (%)",
          type: "number",
          defaultValue: 80,
        },
      ],
      calculate(inputs) {
        const totalCustomers = parseFloat(inputs.totalCustomers as string);
        const avgMonthlyRevenue = parseFloat(inputs.avgMonthlyRevenue as string);
        const monthlyChurnRate = parseFloat(inputs.monthlyChurnRate as string) / 100;
        const monthlyMarketingSpend = parseFloat(
          inputs.monthlyMarketingSpend as string
        );
        const monthlySalesSpend = parseFloat(inputs.monthlySalesSpend as string);
        const newCustomersPerMonth = parseFloat(
          inputs.newCustomersPerMonth as string
        );
        const grossMargin = parseFloat(inputs.grossMargin as string) / 100;

        const mrr = totalCustomers * avgMonthlyRevenue;
        const arr = mrr * 12;
        const avgLifetimeMonths = 1 / monthlyChurnRate;
        const ltv = avgMonthlyRevenue * avgLifetimeMonths * grossMargin;
        const cac =
          (monthlyMarketingSpend + monthlySalesSpend) / newCustomersPerMonth;
        const ltvCacRatio = ltv / cac;
        const monthsToRecoverCac = cac / (avgMonthlyRevenue * grossMargin);
        const annualChurnRate = 1 - Math.pow(1 - monthlyChurnRate, 12);
        const netRevenueGrowth =
          newCustomersPerMonth * avgMonthlyRevenue -
          totalCustomers * monthlyChurnRate * avgMonthlyRevenue;

        return {
          MRR: "$" + formatNumber(mrr),
          ARR: "$" + formatNumber(arr),
          "Customer LTV": "$" + formatNumber(ltv),
          CAC: "$" + formatNumber(cac),
          "LTV:CAC Ratio": formatNumber(ltvCacRatio) + ":1",
          "Months to Recover CAC": formatNumber(monthsToRecoverCac),
          "Annual Churn Rate": formatNumber(annualChurnRate * 100) + "%",
          "Avg Customer Lifetime": formatNumber(avgLifetimeMonths) + " months",
          "Net Monthly Revenue Change": "$" + formatNumber(netRevenueGrowth),
        };
      },
    },
    {
      slug: "saas-growth-projection",
      title: "SaaS Growth Projection",
      description: "Project SaaS revenue growth over time.",
      fields: [
        {
          id: "currentMrr",
          label: "Current MRR ($)",
          type: "number",
          defaultValue: 50000,
        },
        {
          id: "monthlyGrowthRate",
          label: "Monthly MRR Growth Rate (%)",
          type: "number",
          defaultValue: 8,
        },
        {
          id: "monthlyChurn",
          label: "Monthly Revenue Churn (%)",
          type: "number",
          defaultValue: 3,
        },
        {
          id: "monthsToProject",
          label: "Months to Project",
          type: "number",
          defaultValue: 12,
        },
      ],
      calculate(inputs) {
        const currentMrr = parseFloat(inputs.currentMrr as string);
        const monthlyGrowthRate = parseFloat(inputs.monthlyGrowthRate as string) / 100;
        const monthlyChurn = parseFloat(inputs.monthlyChurn as string) / 100;
        const monthsToProject = parseFloat(inputs.monthsToProject as string);

        const netGrowthRate = monthlyGrowthRate - monthlyChurn;
        const projectedMrr = currentMrr * Math.pow(1 + netGrowthRate, monthsToProject);
        const projectedArr = projectedMrr * 12;

        let totalRevenue = 0;
        for (let i = 0; i < monthsToProject; i++) {
          totalRevenue += currentMrr * Math.pow(1 + netGrowthRate, i);
        }

        return {
          "Current MRR": "$" + formatNumber(currentMrr),
          "Current ARR": "$" + formatNumber(currentMrr * 12),
          "Net Monthly Growth Rate": formatNumber(netGrowthRate * 100) + "%",
          "Projected MRR": "$" + formatNumber(projectedMrr),
          "Projected ARR": "$" + formatNumber(projectedArr),
          "MRR Growth": "$" + formatNumber(projectedMrr - currentMrr),
          "Total Revenue Over Period": "$" + formatNumber(totalRevenue),
        };
      },
    },
  ],
  relatedSlugs: [
    "startup-runway",
    "app-revenue",
    "course-pricing",
    "equity-dilution",
  ],
  faq: [
    {
      question: "What is a good LTV:CAC ratio for SaaS?",
      answer:
        "A healthy LTV:CAC ratio is 3:1 or higher, meaning you earn $3 in lifetime value for every $1 spent acquiring a customer. Below 1:1 means you lose money on each customer. Above 5:1 may indicate you are under-investing in growth.",
    },
    {
      question: "What is a good monthly churn rate for SaaS?",
      answer:
        "For B2B SaaS, a monthly churn rate of 3-5% is common for SMB customers, while enterprise SaaS targets under 1% monthly churn. For B2C SaaS, 5-7% monthly churn is typical. Reducing churn by even 1% can dramatically increase LTV.",
    },
    {
      question: "How is ARR different from MRR?",
      answer:
        "MRR (Monthly Recurring Revenue) is the total predictable revenue per month. ARR (Annual Recurring Revenue) is MRR x 12. ARR is the standard metric for SaaS companies doing over $10M in revenue and is used for valuation (typically 5-15x ARR for SaaS).",
    },
  ],
  formula:
    "MRR = Total Customers x ARPA. ARR = MRR x 12. LTV = ARPA x (1 / Monthly Churn) x Gross Margin. CAC = (Marketing + Sales Spend) / New Customers. LTV:CAC Ratio = LTV / CAC.",
};

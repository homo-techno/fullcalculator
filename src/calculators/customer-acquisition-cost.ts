import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const customerAcquisitionCostCalculator: CalculatorDefinition = {
  slug: "customer-acquisition-cost",
  title: "Customer Acquisition Cost Calculator",
  description: "Free customer acquisition cost (CAC) calculator. Calculate how much it costs to acquire a new customer and evaluate your marketing efficiency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cac", "customer acquisition cost", "acquisition cost", "marketing efficiency", "cost per customer"],
  variants: [
    {
      id: "basic",
      name: "Basic CAC",
      fields: [
        { name: "totalMarketingSpend", label: "Total Marketing Spend ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "totalSalesSpend", label: "Total Sales Spend ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "newCustomers", label: "New Customers Acquired", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const marketing = inputs.totalMarketingSpend as number;
        const sales = inputs.totalSalesSpend as number;
        const customers = inputs.newCustomers as number;
        if (!marketing || !customers) return null;
        const totalSpend = marketing + (sales || 0);
        const cac = totalSpend / customers;
        return {
          primary: { label: "Customer Acquisition Cost", value: `$${formatNumber(cac, 2)}` },
          details: [
            { label: "Total Marketing Spend", value: `$${formatNumber(marketing, 2)}` },
            { label: "Total Sales Spend", value: `$${formatNumber(sales || 0, 2)}` },
            { label: "Combined Spend", value: `$${formatNumber(totalSpend, 2)}` },
            { label: "New Customers", value: formatNumber(customers, 0) },
          ],
        };
      },
    },
    {
      id: "withLtv",
      name: "CAC with LTV Ratio",
      fields: [
        { name: "totalSpend", label: "Total Acquisition Spend ($)", type: "number", placeholder: "e.g. 80000" },
        { name: "newCustomers", label: "New Customers Acquired", type: "number", placeholder: "e.g. 200" },
        { name: "avgRevPerCustomer", label: "Avg Revenue per Customer ($)", type: "number", placeholder: "e.g. 500" },
        { name: "avgLifespanMonths", label: "Avg Customer Lifespan (months)", type: "number", placeholder: "e.g. 24" },
      ],
      calculate: (inputs) => {
        const totalSpend = inputs.totalSpend as number;
        const customers = inputs.newCustomers as number;
        const avgRev = inputs.avgRevPerCustomer as number;
        const lifespan = inputs.avgLifespanMonths as number;
        if (!totalSpend || !customers || !avgRev || !lifespan) return null;
        const cac = totalSpend / customers;
        const ltv = avgRev * lifespan;
        const ltvCacRatio = ltv / cac;
        const paybackMonths = cac / avgRev;
        const healthy = ltvCacRatio >= 3;
        return {
          primary: { label: "CAC", value: `$${formatNumber(cac, 2)}` },
          details: [
            { label: "Customer Lifetime Value", value: `$${formatNumber(ltv, 2)}` },
            { label: "LTV:CAC Ratio", value: `${formatNumber(ltvCacRatio, 2)}:1` },
            { label: "Payback Period", value: `${formatNumber(paybackMonths, 1)} months` },
            { label: "Ratio Health", value: healthy ? "Healthy (3:1+)" : "Needs Improvement" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roas-calculator", "retention-rate", "sales-funnel"],
  faq: [
    { question: "What is a good CAC?", answer: "A good CAC depends on your industry and LTV. The ideal LTV:CAC ratio is 3:1 or higher. For SaaS companies, average CAC ranges from $100-$500. For e-commerce, $10-$50 is typical." },
    { question: "What is the LTV:CAC ratio?", answer: "The LTV:CAC ratio compares customer lifetime value to acquisition cost. A ratio of 3:1 means you earn $3 for every $1 spent acquiring customers. Below 1:1 means you are losing money on each customer." },
  ],
  formula: "CAC = Total Acquisition Spend / New Customers Acquired",
};

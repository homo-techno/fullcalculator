import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cacCalculator: CalculatorDefinition = {
  slug: "cac-calculator",
  title: "Customer Acquisition Cost Calculator",
  description: "Free customer acquisition cost (CAC) calculator. Calculate how much it costs to acquire each new customer across all marketing channels.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["CAC calculator", "customer acquisition cost", "cost per acquisition", "CPA calculator", "marketing cost per customer"],
  variants: [
    {
      id: "basic",
      name: "Basic CAC",
      description: "Calculate customer acquisition cost from total spend and new customers",
      fields: [
        { name: "marketingSpend", label: "Total Marketing Spend", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "salesSpend", label: "Total Sales Spend", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        { name: "newCustomers", label: "New Customers Acquired", type: "number", placeholder: "e.g. 200" },
        { name: "period", label: "Time Period", type: "select", options: [
          { label: "Monthly", value: "monthly" },
          { label: "Quarterly", value: "quarterly" },
          { label: "Annually", value: "annually" },
        ], defaultValue: "monthly" },
      ],
      calculate: (inputs) => {
        const marketing = (inputs.marketingSpend as number) || 0;
        const sales = (inputs.salesSpend as number) || 0;
        const customers = inputs.newCustomers as number;
        const period = inputs.period as string;
        if (!customers) return null;
        const totalSpend = marketing + sales;
        const cac = totalSpend / customers;
        let annualCustomers: number;
        if (period === "monthly") annualCustomers = customers * 12;
        else if (period === "quarterly") annualCustomers = customers * 4;
        else annualCustomers = customers;
        let annualSpend: number;
        if (period === "monthly") annualSpend = totalSpend * 12;
        else if (period === "quarterly") annualSpend = totalSpend * 4;
        else annualSpend = totalSpend;
        return {
          primary: { label: "Customer Acquisition Cost", value: `$${formatNumber(cac)}` },
          details: [
            { label: "Total Spend", value: `$${formatNumber(totalSpend)}` },
            { label: "Marketing Spend", value: `$${formatNumber(marketing)}` },
            { label: "Sales Spend", value: `$${formatNumber(sales)}` },
            { label: "New Customers", value: formatNumber(customers, 0) },
            { label: "Projected Annual Customers", value: formatNumber(annualCustomers, 0) },
            { label: "Projected Annual Spend", value: `$${formatNumber(annualSpend)}` },
          ],
        };
      },
    },
    {
      id: "blended",
      name: "Blended CAC (Organic + Paid)",
      description: "Calculate blended CAC separating organic and paid acquisition",
      fields: [
        { name: "paidSpend", label: "Paid Acquisition Spend", type: "number", placeholder: "e.g. 40000", prefix: "$" },
        { name: "paidCustomers", label: "Customers from Paid", type: "number", placeholder: "e.g. 100" },
        { name: "organicCustomers", label: "Organic/Free Customers", type: "number", placeholder: "e.g. 150" },
        { name: "fixedCosts", label: "Fixed Marketing Costs (team, tools)", type: "number", placeholder: "e.g. 15000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const paid = inputs.paidSpend as number;
        const paidCustomers = inputs.paidCustomers as number;
        const organicCustomers = (inputs.organicCustomers as number) || 0;
        const fixed = (inputs.fixedCosts as number) || 0;
        if (!paid || !paidCustomers) return null;
        const totalCustomers = paidCustomers + organicCustomers;
        const paidCAC = paid / paidCustomers;
        const totalSpend = paid + fixed;
        const blendedCAC = totalSpend / totalCustomers;
        const organicPct = (organicCustomers / totalCustomers) * 100;
        return {
          primary: { label: "Blended CAC", value: `$${formatNumber(blendedCAC)}` },
          details: [
            { label: "Paid CAC", value: `$${formatNumber(paidCAC)}` },
            { label: "Total Customers", value: formatNumber(totalCustomers, 0) },
            { label: "Paid Customers", value: formatNumber(paidCustomers, 0) },
            { label: "Organic Customers", value: formatNumber(organicCustomers, 0) },
            { label: "Organic %", value: `${formatNumber(organicPct)}%` },
            { label: "Total Spend", value: `$${formatNumber(totalSpend)}` },
          ],
          note: "Blended CAC is lower because it includes free organic customers. Track both blended and paid CAC separately for better decision making.",
        };
      },
    },
    {
      id: "payback",
      name: "CAC Payback Period",
      description: "Calculate how long it takes to recover customer acquisition cost",
      fields: [
        { name: "cac", label: "Customer Acquisition Cost", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "monthlyRevenue", label: "Monthly Revenue per Customer", type: "number", placeholder: "e.g. 99", prefix: "$" },
        { name: "grossMargin", label: "Gross Margin %", type: "number", placeholder: "e.g. 70", suffix: "%" },
      ],
      calculate: (inputs) => {
        const cac = inputs.cac as number;
        const monthlyRev = inputs.monthlyRevenue as number;
        const margin = inputs.grossMargin as number;
        if (!cac || !monthlyRev || !margin) return null;
        const monthlyGrossProfit = monthlyRev * (margin / 100);
        const paybackMonths = cac / monthlyGrossProfit;
        const annualRev = monthlyRev * 12;
        const annualProfit = monthlyGrossProfit * 12;
        const firstYearROI = ((annualProfit - cac) / cac) * 100;
        let health = "Excellent";
        if (paybackMonths > 18) health = "Poor - too slow";
        else if (paybackMonths > 12) health = "Needs improvement";
        else if (paybackMonths > 6) health = "Good";
        return {
          primary: { label: "CAC Payback Period", value: `${formatNumber(paybackMonths, 1)} months` },
          details: [
            { label: "Monthly Gross Profit", value: `$${formatNumber(monthlyGrossProfit)}` },
            { label: "Annual Revenue/Customer", value: `$${formatNumber(annualRev)}` },
            { label: "Annual Profit/Customer", value: `$${formatNumber(annualProfit)}` },
            { label: "First-Year ROI", value: `${formatNumber(firstYearROI)}%` },
            { label: "Payback Health", value: health },
          ],
          note: paybackMonths > 12 ? "A payback period over 12 months means significant cash tied up in acquisition. Consider improving conversion rates or reducing spend." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["customer-lifetime-value-calculator", "roi-marketing-calculator", "churn-rate-calculator"],
  faq: [
    { question: "What is customer acquisition cost (CAC)?", answer: "CAC is the total cost of acquiring a new customer, including all marketing and sales expenses divided by the number of customers acquired. CAC = (Marketing Spend + Sales Spend) / New Customers. It is one of the most important metrics for any business." },
    { question: "What is a good CAC payback period?", answer: "For SaaS: under 12 months is good, under 6 months is excellent. For e-commerce: ideally on the first purchase. B2B companies typically have longer payback (6-18 months). Venture-funded startups may accept 12-18 months; bootstrapped companies should target under 6 months." },
    { question: "How can I reduce my CAC?", answer: "Improve conversion rates at each funnel stage, optimize ad targeting, invest in organic/content marketing (lower long-term CAC), build referral programs, improve sales efficiency, reduce sales cycle length, and focus on higher-converting channels." },
  ],
  formula: "CAC = (Marketing Spend + Sales Spend) / New Customers | Payback Period = CAC / Monthly Gross Profit | Blended CAC = Total Spend / (Paid + Organic Customers)",
};

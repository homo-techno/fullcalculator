import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workingCapitalCalculator: CalculatorDefinition = {
  slug: "working-capital-calculator",
  title: "Working Capital Calculator",
  description: "Free working capital calculator. Calculate working capital, working capital ratio, and cash conversion cycle for your business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["working capital calculator", "working capital ratio", "net working capital", "cash conversion cycle", "liquidity calculator"],
  variants: [
    {
      id: "basic",
      name: "Working Capital",
      description: "Calculate net working capital and working capital ratio",
      fields: [
        { name: "currentAssets", label: "Total Current Assets", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "currentLiabilities", label: "Total Current Liabilities", type: "number", placeholder: "e.g. 300000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const assets = inputs.currentAssets as number;
        const liabilities = inputs.currentLiabilities as number;
        if (assets === undefined || liabilities === undefined) return null;
        const workingCapital = assets - liabilities;
        const ratio = liabilities > 0 ? assets / liabilities : 0;
        return {
          primary: { label: "Net Working Capital", value: `$${formatNumber(workingCapital)}` },
          details: [
            { label: "Working Capital Ratio", value: `${formatNumber(ratio, 2)}:1` },
            { label: "Current Assets", value: `$${formatNumber(assets)}` },
            { label: "Current Liabilities", value: `$${formatNumber(liabilities)}` },
            { label: "Status", value: workingCapital > 0 ? "Positive (healthy)" : workingCapital === 0 ? "Break even" : "Negative (risk)" },
          ],
          note: workingCapital < 0 ? "Negative working capital means liabilities exceed assets. This may indicate liquidity risk." : undefined,
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed Working Capital",
      description: "Break down current assets and liabilities for detailed analysis",
      fields: [
        { name: "cash", label: "Cash & Equivalents", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "receivables", label: "Accounts Receivable", type: "number", placeholder: "e.g. 150000", prefix: "$" },
        { name: "inventory", label: "Inventory", type: "number", placeholder: "e.g. 200000", prefix: "$" },
        { name: "otherAssets", label: "Other Current Assets", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "payables", label: "Accounts Payable", type: "number", placeholder: "e.g. 120000", prefix: "$" },
        { name: "shortTermDebt", label: "Short-term Debt", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        { name: "otherLiabilities", label: "Other Current Liabilities", type: "number", placeholder: "e.g. 100000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const cash = (inputs.cash as number) || 0;
        const receivables = (inputs.receivables as number) || 0;
        const inventory = (inputs.inventory as number) || 0;
        const otherAssets = (inputs.otherAssets as number) || 0;
        const payables = (inputs.payables as number) || 0;
        const shortTermDebt = (inputs.shortTermDebt as number) || 0;
        const otherLiabilities = (inputs.otherLiabilities as number) || 0;
        const totalAssets = cash + receivables + inventory + otherAssets;
        const totalLiabilities = payables + shortTermDebt + otherLiabilities;
        const workingCapital = totalAssets - totalLiabilities;
        const ratio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;
        const quickAssets = cash + receivables;
        const quickRatio = totalLiabilities > 0 ? quickAssets / totalLiabilities : 0;
        return {
          primary: { label: "Net Working Capital", value: `$${formatNumber(workingCapital)}` },
          details: [
            { label: "Current Ratio", value: `${formatNumber(ratio, 2)}:1` },
            { label: "Quick Ratio", value: `${formatNumber(quickRatio, 2)}:1` },
            { label: "Total Current Assets", value: `$${formatNumber(totalAssets)}` },
            { label: "Total Current Liabilities", value: `$${formatNumber(totalLiabilities)}` },
            { label: "Cash & Equivalents", value: `$${formatNumber(cash)}` },
            { label: "Receivables", value: `$${formatNumber(receivables)}` },
            { label: "Inventory", value: `$${formatNumber(inventory)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["current-ratio-calculator", "quick-ratio-calculator", "cash-flow-calculator"],
  faq: [
    { question: "What is working capital?", answer: "Working capital is Current Assets minus Current Liabilities. It measures a company's short-term liquidity and ability to pay near-term obligations. Positive working capital means the company can cover its short-term debts." },
    { question: "What is a good working capital ratio?", answer: "A ratio between 1.5:1 and 2:1 is generally considered healthy. Below 1:1 means liabilities exceed assets (risk of insolvency). Above 2:1 might mean assets are not being used efficiently. Industry norms vary." },
    { question: "How can I improve working capital?", answer: "Collect receivables faster, negotiate longer payment terms with suppliers, reduce excess inventory, use short-term financing strategically, improve cash flow management, and renegotiate unfavorable loan terms." },
  ],
  formula: "Working Capital = Current Assets - Current Liabilities | Working Capital Ratio = Current Assets / Current Liabilities",
};

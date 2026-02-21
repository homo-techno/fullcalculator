import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const currentRatioCalculator: CalculatorDefinition = {
  slug: "current-ratio-calculator",
  title: "Current Ratio Calculator",
  description: "Free current ratio calculator. Measure your company's ability to pay short-term obligations. Analyze liquidity and financial health.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["current ratio calculator", "current ratio formula", "liquidity ratio", "financial ratio calculator", "solvency calculator"],
  variants: [
    {
      id: "basic",
      name: "Current Ratio",
      description: "Calculate current ratio from current assets and current liabilities",
      fields: [
        { name: "currentAssets", label: "Total Current Assets", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "currentLiabilities", label: "Total Current Liabilities", type: "number", placeholder: "e.g. 300000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const assets = inputs.currentAssets as number;
        const liabilities = inputs.currentLiabilities as number;
        if (!assets || !liabilities) return null;
        const ratio = assets / liabilities;
        const workingCapital = assets - liabilities;
        let status = "Poor - may not cover obligations";
        if (ratio >= 2.0) status = "Strong - well covered";
        else if (ratio >= 1.5) status = "Good - comfortably covered";
        else if (ratio >= 1.0) status = "Adequate - obligations covered";
        return {
          primary: { label: "Current Ratio", value: `${formatNumber(ratio, 2)}:1` },
          details: [
            { label: "Working Capital", value: `$${formatNumber(workingCapital)}` },
            { label: "Current Assets", value: `$${formatNumber(assets)}` },
            { label: "Current Liabilities", value: `$${formatNumber(liabilities)}` },
            { label: "Financial Health", value: status },
          ],
          note: ratio > 3 ? "A very high current ratio (above 3.0) may indicate inefficient use of assets." : undefined,
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed Analysis",
      description: "Break down assets and liabilities for a complete picture",
      fields: [
        { name: "cash", label: "Cash & Equivalents", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        { name: "receivables", label: "Accounts Receivable", type: "number", placeholder: "e.g. 120000", prefix: "$" },
        { name: "inventory", label: "Inventory", type: "number", placeholder: "e.g. 200000", prefix: "$" },
        { name: "otherAssets", label: "Other Current Assets", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        { name: "payables", label: "Accounts Payable", type: "number", placeholder: "e.g. 90000", prefix: "$" },
        { name: "shortTermDebt", label: "Short-term Debt", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "accruedExpenses", label: "Accrued Expenses", type: "number", placeholder: "e.g. 60000", prefix: "$" },
        { name: "otherLiabilities", label: "Other Current Liabilities", type: "number", placeholder: "e.g. 20000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const cash = (inputs.cash as number) || 0;
        const receivables = (inputs.receivables as number) || 0;
        const inventory = (inputs.inventory as number) || 0;
        const otherAssets = (inputs.otherAssets as number) || 0;
        const payables = (inputs.payables as number) || 0;
        const shortTermDebt = (inputs.shortTermDebt as number) || 0;
        const accrued = (inputs.accruedExpenses as number) || 0;
        const otherLiab = (inputs.otherLiabilities as number) || 0;
        const totalAssets = cash + receivables + inventory + otherAssets;
        const totalLiabilities = payables + shortTermDebt + accrued + otherLiab;
        if (!totalAssets || !totalLiabilities) return null;
        const currentRatio = totalAssets / totalLiabilities;
        const quickRatio = (cash + receivables) / totalLiabilities;
        const cashRatio = cash / totalLiabilities;
        const workingCapital = totalAssets - totalLiabilities;
        return {
          primary: { label: "Current Ratio", value: `${formatNumber(currentRatio, 2)}:1` },
          details: [
            { label: "Quick Ratio", value: `${formatNumber(quickRatio, 2)}:1` },
            { label: "Cash Ratio", value: `${formatNumber(cashRatio, 2)}:1` },
            { label: "Working Capital", value: `$${formatNumber(workingCapital)}` },
            { label: "Total Current Assets", value: `$${formatNumber(totalAssets)}` },
            { label: "Total Current Liabilities", value: `$${formatNumber(totalLiabilities)}` },
            { label: "Cash % of Assets", value: `${formatNumber((cash / totalAssets) * 100)}%` },
            { label: "Inventory % of Assets", value: `${formatNumber((inventory / totalAssets) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["quick-ratio-calculator", "working-capital-calculator", "cash-flow-calculator"],
  faq: [
    { question: "What is a good current ratio?", answer: "Generally, 1.5 to 2.0 is considered healthy. Below 1.0 means liabilities exceed assets (potential insolvency risk). Above 3.0 may mean the company is not efficiently using assets. Industry averages vary significantly." },
    { question: "What is the difference between current ratio and quick ratio?", answer: "The current ratio includes ALL current assets. The quick ratio (acid test) excludes inventory and prepaid expenses, showing only the most liquid assets. Quick ratio is more conservative and useful for industries with slow-moving inventory." },
    { question: "Can a company have a high current ratio and still fail?", answer: "Yes. A high current ratio does not guarantee success. If inventory is obsolete or receivables are uncollectible, the ratio is misleading. Cash flow problems can still occur even with a good ratio. Always analyze the quality of assets." },
  ],
  formula: "Current Ratio = Current Assets / Current Liabilities | Working Capital = Current Assets - Current Liabilities",
};

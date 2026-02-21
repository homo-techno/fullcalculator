import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quickRatioCalculator: CalculatorDefinition = {
  slug: "quick-ratio-calculator",
  title: "Quick Ratio Calculator",
  description: "Free quick ratio (acid test) calculator. Measure your company's ability to meet short-term obligations with liquid assets.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["quick ratio calculator", "acid test ratio", "liquidity ratio calculator", "quick ratio formula", "acid test calculator"],
  variants: [
    {
      id: "basic",
      name: "Quick Ratio",
      description: "Calculate the quick ratio from quick assets and current liabilities",
      fields: [
        { name: "cash", label: "Cash & Cash Equivalents", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "marketableSecurities", label: "Marketable Securities", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "receivables", label: "Accounts Receivable (net)", type: "number", placeholder: "e.g. 150000", prefix: "$" },
        { name: "currentLiabilities", label: "Total Current Liabilities", type: "number", placeholder: "e.g. 200000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const cash = (inputs.cash as number) || 0;
        const securities = (inputs.marketableSecurities as number) || 0;
        const receivables = (inputs.receivables as number) || 0;
        const liabilities = inputs.currentLiabilities as number;
        if (!liabilities) return null;
        const quickAssets = cash + securities + receivables;
        const quickRatio = quickAssets / liabilities;
        let status = "Poor";
        if (quickRatio >= 1.5) status = "Excellent";
        else if (quickRatio >= 1.0) status = "Good";
        else if (quickRatio >= 0.5) status = "Fair";
        return {
          primary: { label: "Quick Ratio", value: `${formatNumber(quickRatio, 2)}:1` },
          details: [
            { label: "Quick Assets", value: `$${formatNumber(quickAssets)}` },
            { label: "Current Liabilities", value: `$${formatNumber(liabilities)}` },
            { label: "Cash & Equivalents", value: `$${formatNumber(cash)}` },
            { label: "Marketable Securities", value: `$${formatNumber(securities)}` },
            { label: "Accounts Receivable", value: `$${formatNumber(receivables)}` },
            { label: "Liquidity Status", value: status },
          ],
          note: quickRatio < 1 ? "A quick ratio below 1.0 means the company may struggle to pay short-term obligations without selling inventory." : undefined,
        };
      },
    },
    {
      id: "fromBalance",
      name: "From Balance Sheet",
      description: "Calculate quick ratio by subtracting inventory and prepaid from current assets",
      fields: [
        { name: "currentAssets", label: "Total Current Assets", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "inventory", label: "Inventory", type: "number", placeholder: "e.g. 150000", prefix: "$" },
        { name: "prepaidExpenses", label: "Prepaid Expenses", type: "number", placeholder: "e.g. 20000", prefix: "$" },
        { name: "currentLiabilities", label: "Total Current Liabilities", type: "number", placeholder: "e.g. 250000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const assets = inputs.currentAssets as number;
        const inventory = (inputs.inventory as number) || 0;
        const prepaid = (inputs.prepaidExpenses as number) || 0;
        const liabilities = inputs.currentLiabilities as number;
        if (!assets || !liabilities) return null;
        const quickAssets = assets - inventory - prepaid;
        const quickRatio = quickAssets / liabilities;
        const currentRatio = assets / liabilities;
        return {
          primary: { label: "Quick Ratio", value: `${formatNumber(quickRatio, 2)}:1` },
          details: [
            { label: "Current Ratio (for comparison)", value: `${formatNumber(currentRatio, 2)}:1` },
            { label: "Quick Assets", value: `$${formatNumber(quickAssets)}` },
            { label: "Excluded: Inventory", value: `$${formatNumber(inventory)}` },
            { label: "Excluded: Prepaid", value: `$${formatNumber(prepaid)}` },
            { label: "Current Liabilities", value: `$${formatNumber(liabilities)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["current-ratio-calculator", "working-capital-calculator", "cash-flow-calculator"],
  faq: [
    { question: "What is the quick ratio (acid test)?", answer: "The quick ratio measures a company's ability to pay current liabilities using only liquid assets (cash, marketable securities, and receivables). Unlike the current ratio, it excludes inventory and prepaid expenses because they cannot be quickly converted to cash." },
    { question: "What is a good quick ratio?", answer: "A quick ratio of 1.0 or higher is generally considered acceptable, meaning the company can cover short-term obligations. Above 1.5 is excellent. Below 1.0 may indicate liquidity risk. Some industries (like retail) naturally operate below 1.0." },
    { question: "Quick ratio vs current ratio - what is the difference?", answer: "The current ratio includes ALL current assets (including inventory). The quick ratio excludes inventory and prepaid expenses, giving a more conservative liquidity measure. The quick ratio is stricter because inventory may take time to sell." },
  ],
  formula: "Quick Ratio = (Cash + Marketable Securities + Accounts Receivable) / Current Liabilities | OR Quick Ratio = (Current Assets - Inventory - Prepaid) / Current Liabilities",
};

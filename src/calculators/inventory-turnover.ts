import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inventoryTurnoverCalculator: CalculatorDefinition = {
  slug: "inventory-turnover-calculator",
  title: "Inventory Turnover Calculator",
  description: "Free inventory turnover calculator. Calculate how quickly inventory is sold and replaced. Measure inventory efficiency and days to sell.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["inventory turnover calculator", "inventory turnover ratio", "days to sell inventory", "stock turnover", "inventory efficiency"],
  variants: [
    {
      id: "turnover",
      name: "Inventory Turnover Ratio",
      description: "Calculate how many times inventory is sold and replaced in a period",
      fields: [
        { name: "cogs", label: "Cost of Goods Sold (COGS)", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "beginningInventory", label: "Beginning Inventory", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        { name: "endingInventory", label: "Ending Inventory", type: "number", placeholder: "e.g. 120000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const cogs = inputs.cogs as number;
        const beginning = inputs.beginningInventory as number;
        const ending = inputs.endingInventory as number;
        if (!cogs || beginning === undefined || ending === undefined) return null;
        const avgInventory = (beginning + ending) / 2;
        if (avgInventory <= 0) return null;
        const turnover = cogs / avgInventory;
        const daysToSell = 365 / turnover;
        return {
          primary: { label: "Inventory Turnover Ratio", value: `${formatNumber(turnover, 2)}x` },
          details: [
            { label: "Days to Sell Inventory (DSI)", value: `${formatNumber(daysToSell, 1)} days` },
            { label: "Average Inventory", value: `$${formatNumber(avgInventory)}` },
            { label: "COGS", value: `$${formatNumber(cogs)}` },
            { label: "Turns per Month", value: formatNumber(turnover / 12, 2) },
          ],
        };
      },
    },
    {
      id: "dsi",
      name: "Days Sales of Inventory",
      description: "Calculate how many days it takes to sell through inventory",
      fields: [
        { name: "avgInventory", label: "Average Inventory Value", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "cogs", label: "Annual COGS", type: "number", placeholder: "e.g. 500000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const avgInv = inputs.avgInventory as number;
        const cogs = inputs.cogs as number;
        if (!avgInv || !cogs) return null;
        const dsi = (avgInv / cogs) * 365;
        const turnover = cogs / avgInv;
        const weeksOfSupply = dsi / 7;
        return {
          primary: { label: "Days Sales of Inventory", value: `${formatNumber(dsi, 1)} days` },
          details: [
            { label: "Inventory Turnover", value: `${formatNumber(turnover, 2)}x` },
            { label: "Weeks of Supply", value: formatNumber(weeksOfSupply, 1) },
            { label: "Average Inventory", value: `$${formatNumber(avgInv)}` },
            { label: "Daily COGS", value: `$${formatNumber(cogs / 365)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["working-capital-calculator", "accounts-receivable-calculator", "sales-revenue-calculator"],
  faq: [
    { question: "What is a good inventory turnover ratio?", answer: "It varies by industry. Grocery stores: 14-20x. Retail clothing: 4-6x. Manufacturing: 4-8x. Luxury goods: 1-3x. Higher turnover means faster sales, but too high might mean stockouts. Compare against your industry average." },
    { question: "What is Days Sales of Inventory (DSI)?", answer: "DSI measures the average number of days it takes to sell through inventory. DSI = (Average Inventory / COGS) × 365. Lower DSI means faster inventory movement. Higher DSI may indicate overstocking or slow sales." },
    { question: "How can I improve inventory turnover?", answer: "Reduce excess stock, improve demand forecasting, implement just-in-time ordering, drop slow-moving products, run promotions on stale inventory, optimize reorder points, and improve supply chain efficiency." },
  ],
  formula: "Inventory Turnover = COGS / Average Inventory | DSI = (Average Inventory / COGS) × 365 | Average Inventory = (Beginning + Ending) / 2",
};

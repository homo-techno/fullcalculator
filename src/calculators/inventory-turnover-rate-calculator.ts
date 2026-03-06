import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inventoryTurnoverRateCalculator: CalculatorDefinition = {
  slug: "inventory-turnover-rate-calculator",
  title: "Restaurant Inventory Turnover Rate Calculator",
  description: "Measure how efficiently your restaurant uses inventory by calculating turnover rate, average days on hand, and cost of goods sold ratios.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["inventory turnover rate","restaurant inventory efficiency","COGS ratio","stock turnover"],
  variants: [{
    id: "standard",
    name: "Restaurant Inventory Turnover Rate",
    description: "Measure how efficiently your restaurant uses inventory by calculating turnover rate, average days on hand, and cost of goods sold ratios.",
    fields: [
      { name: "cogsMonthly", label: "Monthly Cost of Goods Sold ($)", type: "number", min: 100, max: 2000000, defaultValue: 24000 },
      { name: "beginInventory", label: "Beginning Inventory Value ($)", type: "number", min: 100, max: 500000, defaultValue: 8000 },
      { name: "endInventory", label: "Ending Inventory Value ($)", type: "number", min: 100, max: 500000, defaultValue: 6000 },
      { name: "monthlyRevenue", label: "Monthly Revenue ($)", type: "number", min: 100, max: 5000000, defaultValue: 80000 },
    ],
    calculate: (inputs) => {
    const cogs = inputs.cogsMonthly as number;
    const beginInv = inputs.beginInventory as number;
    const endInv = inputs.endInventory as number;
    const revenue = inputs.monthlyRevenue as number;
    const avgInventory = (beginInv + endInv) / 2;
    const turnoverRate = avgInventory > 0 ? cogs / avgInventory : 0;
    const daysOnHand = turnoverRate > 0 ? 30 / turnoverRate : 0;
    const cogsPct = revenue > 0 ? (cogs / revenue) * 100 : 0;
    const annualTurnover = turnoverRate * 12;
    return {
      primary: { label: "Monthly Turnover Rate", value: formatNumber(Math.round(turnoverRate * 100) / 100) + "x" },
      details: [
        { label: "Average Inventory Value", value: "$" + formatNumber(Math.round(avgInventory)) },
        { label: "Days of Inventory on Hand", value: formatNumber(Math.round(daysOnHand * 10) / 10) + " days" },
        { label: "COGS as % of Revenue", value: formatNumber(Math.round(cogsPct * 10) / 10) + "%" },
        { label: "Annualized Turnover Rate", value: formatNumber(Math.round(annualTurnover * 10) / 10) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["food-waste-cost-calculator","food-cost-percentage-calculator"],
  faq: [
    { question: "What is a good inventory turnover rate for restaurants?", answer: "Restaurants should turn over their food inventory 4 to 8 times per month. Perishable items like produce should turn over daily or every 2 to 3 days, while dry goods and shelf-stable items may turn over weekly or biweekly." },
    { question: "How does inventory turnover affect profitability?", answer: "Higher turnover means less money tied up in stock, lower waste from spoilage, and fresher ingredients. Low turnover indicates overstocking, potential waste, and cash flow problems." },
    { question: "How do I improve inventory turnover?", answer: "Implement FIFO (first in, first out) rotation, order more frequently in smaller quantities, track waste and spoilage, use inventory management software, conduct regular counts, and adjust pars based on actual usage data." },
  ],
  formula: "Average Inventory = (Beginning Inventory + Ending Inventory) / 2
Turnover Rate = Cost of Goods Sold / Average Inventory
Days on Hand = 30 / Turnover Rate",
};

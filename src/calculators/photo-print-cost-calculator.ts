import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const photoPrintCostCalculator: CalculatorDefinition = {
  slug: "photo-print-cost-calculator",
  title: "Photo Print Cost Per Unit Calculator",
  description: "Calculate cost per print, profit margins, and break-even pricing for photography print sales and lab orders.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["photo print cost","photography pricing","print profit calculator","photo lab cost"],
  variants: [{
    id: "standard",
    name: "Photo Print Cost Per Unit",
    description: "Calculate cost per print, profit margins, and break-even pricing for photography print sales and lab orders.",
    fields: [
      { name: "labCost", label: "Lab Cost Per Print ($)", type: "number", min: 0.1, max: 500, defaultValue: 2.5 },
      { name: "shippingCost", label: "Shipping Cost Per Order ($)", type: "number", min: 0, max: 50, defaultValue: 5 },
      { name: "printsPerOrder", label: "Avg Prints Per Order", type: "number", min: 1, max: 100, defaultValue: 10 },
      { name: "sellingPrice", label: "Selling Price Per Print ($)", type: "number", min: 0.5, max: 1000, defaultValue: 15 },
      { name: "monthlyOrders", label: "Estimated Monthly Orders", type: "number", min: 1, max: 1000, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const labCost = inputs.labCost as number;
    const shipping = inputs.shippingCost as number;
    const perOrder = inputs.printsPerOrder as number;
    const price = inputs.sellingPrice as number;
    const orders = inputs.monthlyOrders as number;
    const costPerPrint = labCost + shipping / perOrder;
    const profitPerPrint = price - costPerPrint;
    const marginPct = Math.round(profitPerPrint / price * 100 * 10) / 10;
    const monthlyRevenue = price * perOrder * orders;
    const monthlyCost = costPerPrint * perOrder * orders;
    const monthlyProfit = monthlyRevenue - monthlyCost;
    return {
      primary: { label: "Profit Per Print", value: "$" + formatNumber(Math.round(profitPerPrint * 100) / 100) },
      details: [
        { label: "Total Cost Per Print", value: "$" + formatNumber(Math.round(costPerPrint * 100) / 100) },
        { label: "Profit Margin", value: formatNumber(marginPct) + "%" },
        { label: "Monthly Revenue", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
        { label: "Monthly Profit", value: "$" + formatNumber(Math.round(monthlyProfit)) }
      ]
    };
  },
  }],
  relatedSlugs: ["film-budget-estimator","wedding-videography-cost-calculator"],
  faq: [
    { question: "What is a good profit margin for photo prints?", answer: "Professional photographers typically aim for 60-80% margins on prints. This accounts for shooting time, editing, and business overhead beyond just the print cost." },
    { question: "How much should I charge for prints?", answer: "Price prints at 2.5 to 4 times your cost of goods. A print costing $5 to produce should sell for $12.50 to $20 minimum." },
    { question: "Should I offer different print sizes?", answer: "Yes. Larger prints have higher perceived value and profit margins. Many photographers make most print revenue from 11x14 and larger sizes." },
  ],
  formula: "Cost Per Print = Lab Cost + (Shipping / Prints Per Order)
Profit Per Print = Selling Price - Cost Per Print
Margin = Profit / Selling Price x 100",
};

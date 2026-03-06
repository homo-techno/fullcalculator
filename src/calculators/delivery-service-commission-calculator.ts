import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deliveryServiceCommissionCalculator: CalculatorDefinition = {
  slug: "delivery-service-commission-calculator",
  title: "Delivery Service Commission Calculator",
  description: "Compare the true cost of third-party delivery platforms by calculating commission fees, service charges, and net revenue per order across different providers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["delivery commission","food delivery fees","third party delivery cost","restaurant delivery profit"],
  variants: [{
    id: "standard",
    name: "Delivery Service Commission",
    description: "Compare the true cost of third-party delivery platforms by calculating commission fees, service charges, and net revenue per order across different providers.",
    fields: [
      { name: "avgOrderValue", label: "Average Order Value ($)", type: "number", min: 5, max: 500, defaultValue: 35 },
      { name: "commissionPct", label: "Platform Commission (%)", type: "number", min: 5, max: 40, defaultValue: 25 },
      { name: "monthlyOrders", label: "Monthly Delivery Orders", type: "number", min: 10, max: 10000, defaultValue: 400 },
      { name: "foodCostPct", label: "Food Cost (%)", type: "number", min: 15, max: 50, defaultValue: 30 },
      { name: "packagingCost", label: "Packaging Cost Per Order ($)", type: "number", min: 0, max: 10, defaultValue: 1.50 },
    ],
    calculate: (inputs) => {
    const orderVal = inputs.avgOrderValue as number;
    const commission = inputs.commissionPct as number / 100;
    const orders = inputs.monthlyOrders as number;
    const foodPct = inputs.foodCostPct as number / 100;
    const packaging = inputs.packagingCost as number;
    const commissionPerOrder = orderVal * commission;
    const foodCostPerOrder = orderVal * foodPct;
    const netPerOrder = orderVal - commissionPerOrder - foodCostPerOrder - packaging;
    const monthlyCommission = commissionPerOrder * orders;
    const monthlyNet = netPerOrder * orders;
    const effectiveMargin = orderVal > 0 ? (netPerOrder / orderVal) * 100 : 0;
    return {
      primary: { label: "Net Revenue Per Order", value: "$" + formatNumber(Math.round(netPerOrder * 100) / 100) },
      details: [
        { label: "Commission Per Order", value: "$" + formatNumber(Math.round(commissionPerOrder * 100) / 100) },
        { label: "Food Cost Per Order", value: "$" + formatNumber(Math.round(foodCostPerOrder * 100) / 100) },
        { label: "Monthly Commission Paid", value: "$" + formatNumber(Math.round(monthlyCommission)) },
        { label: "Monthly Net Revenue", value: "$" + formatNumber(Math.round(monthlyNet)) },
        { label: "Effective Margin", value: formatNumber(Math.round(effectiveMargin * 10) / 10) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["restaurant-profit-margin-calculator","food-cost-percentage-calculator"],
  faq: [
    { question: "How much do delivery apps charge restaurants?", answer: "Major delivery platforms charge restaurants 15 to 30 percent commission per order. Basic listings run 15 to 20 percent, while promoted placements and full delivery service can cost 25 to 30 percent or more." },
    { question: "Is third-party delivery profitable for restaurants?", answer: "Margins are thin after commission, food cost, and packaging. Many restaurants raise delivery menu prices 10 to 20 percent to offset commissions. Delivery is most profitable when it brings incremental volume without requiring additional fixed costs." },
    { question: "Should I build my own delivery service?", answer: "In-house delivery typically costs 10 to 15 percent of revenue versus 25 to 30 percent for third-party apps. However, it requires hiring drivers, insurance, and managing logistics. A hybrid approach using both is common." },
  ],
  formula: "Commission Per Order = Order Value x Commission %; Net Per Order = Order Value - Commission - Food Cost - Packaging; Monthly Net Revenue = Net Per Order x Monthly Orders",
};

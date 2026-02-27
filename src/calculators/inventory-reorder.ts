import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inventoryReorderCalculator: CalculatorDefinition = {
  slug: "inventory-reorder",
  title: "Inventory Reorder Point & EOQ Calculator",
  description:
    "Calculate the optimal reorder point, safety stock, and Economic Order Quantity (EOQ) to minimize inventory costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "inventory",
    "reorder point",
    "EOQ",
    "safety stock",
    "economic order quantity",
    "supply chain",
    "stock management",
  ],
  variants: [
    {
      slug: "inventory-reorder",
      title: "Reorder Point Calculator",
      description:
        "Calculate when to reorder inventory based on demand and lead time.",
      fields: [
        {
          name: "dailyDemand",
          label: "Average Daily Demand (units)",
          type: "number",
          defaultValue: "50",
        },
        {
          name: "leadTimeDays",
          label: "Lead Time (days)",
          type: "number",
          defaultValue: "7",
        },
        {
          name: "demandVariability",
          label: "Daily Demand Std Deviation",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "serviceLevel",
          label: "Desired Service Level",
          type: "select",
          defaultValue: "1.65",
          options: [
            { label: "90%", value: "1.28" },
            { label: "95%", value: "1.65" },
            { label: "97.5%", value: "1.96" },
            { label: "99%", value: "2.33" },
          ],
        },
        {
          name: "unitCost",
          label: "Unit Cost ($)",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "orderingCost",
          label: "Cost Per Order ($)",
          type: "number",
          defaultValue: "25",
        },
        {
          name: "holdingCostPercent",
          label: "Annual Holding Cost (%)",
          type: "number",
          defaultValue: "25",
        },
      ],
      calculate(inputs) {
        const demand = parseFloat(inputs.dailyDemand as string);
        const leadTime = parseFloat(inputs.leadTimeDays as string);
        const stdDev = parseFloat(inputs.demandVariability as string);
        const zScore = parseFloat(inputs.serviceLevel as string);
        const unitCost = parseFloat(inputs.unitCost as string);
        const orderCost = parseFloat(inputs.orderingCost as string);
        const holdingPct = parseFloat(inputs.holdingCostPercent as string) / 100;

        const avgLeadTimeDemand = demand * leadTime;
        const safetyStock = zScore * stdDev * Math.sqrt(leadTime);
        const reorderPoint = avgLeadTimeDemand + safetyStock;

        const annualDemand = demand * 365;
        const holdingCostPerUnit = unitCost * holdingPct;
        const eoq = Math.sqrt((2 * annualDemand * orderCost) / holdingCostPerUnit);
        const ordersPerYear = annualDemand / eoq;
        const annualOrderCost = ordersPerYear * orderCost;
        const avgInventory = eoq / 2 + safetyStock;
        const annualHoldingCost = avgInventory * holdingCostPerUnit;
        const totalInventoryCost = annualOrderCost + annualHoldingCost;
        const daysOfSupply = eoq / demand;

        return {
          "Lead Time Demand": `${formatNumber(avgLeadTimeDemand)} units`,
          "Safety Stock": `${formatNumber(safetyStock)} units`,
          "Reorder Point": `${formatNumber(reorderPoint)} units`,
          "EOQ (Optimal Order Qty)": `${formatNumber(eoq)} units`,
          "Orders Per Year": formatNumber(ordersPerYear),
          "Days of Supply Per Order": formatNumber(daysOfSupply),
          "Annual Ordering Cost": `$${formatNumber(annualOrderCost)}`,
          "Annual Holding Cost": `$${formatNumber(annualHoldingCost)}`,
          "Total Inventory Cost": `$${formatNumber(totalInventoryCost)}`,
          "Average Inventory Value": `$${formatNumber(avgInventory * unitCost)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "wholesale-markup",
    "product-pricing",
    "shipping-rate-compare",
  ],
  faq: [
    {
      question: "What is the Economic Order Quantity (EOQ)?",
      answer:
        "EOQ is the optimal order quantity that minimizes total inventory costs (ordering costs + holding costs). The formula is EOQ = sqrt(2 x Annual Demand x Order Cost / Holding Cost Per Unit). It balances the trade-off between ordering frequently (high ordering cost) and ordering in bulk (high holding cost).",
    },
    {
      question: "How do I calculate safety stock?",
      answer:
        "Safety Stock = Z-score x Standard Deviation of Demand x sqrt(Lead Time). The Z-score corresponds to your desired service level: 1.28 for 90%, 1.65 for 95%, 1.96 for 97.5%, 2.33 for 99%. Higher service levels require more safety stock.",
    },
    {
      question: "What is a reorder point?",
      answer:
        "The reorder point is the inventory level at which you should place a new order. It equals Average Daily Demand x Lead Time + Safety Stock. When your inventory hits this level, it is time to reorder to avoid stockouts.",
    },
  ],
  formula:
    "Reorder Point = (Daily Demand x Lead Time) + Safety Stock. Safety Stock = Z-score x Std Dev x sqrt(Lead Time). EOQ = sqrt(2 x Annual Demand x Order Cost / Holding Cost Per Unit).",
};

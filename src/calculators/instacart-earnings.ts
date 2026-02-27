import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const instacartEarningsCalculator: CalculatorDefinition = {
  slug: "instacart-earnings",
  title: "Instacart Shopper Earnings Calculator",
  description:
    "Estimate your net Instacart shopper earnings per hour after expenses including gas, vehicle wear, and time shopping.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "instacart",
    "shopper",
    "earnings",
    "grocery delivery",
    "gig economy",
    "hourly pay",
  ],
  variants: [
    {
      slug: "instacart-earnings",
      title: "Instacart Weekly Earnings",
      description:
        "Calculate your true weekly net earnings as an Instacart shopper.",
      fields: [
        {
          name: "batchesPerWeek",
          label: "Batches Per Week",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "avgBatchPay",
          label: "Average Batch Pay ($)",
          type: "number",
          defaultValue: "12",
        },
        {
          name: "avgTipPerBatch",
          label: "Average Tip Per Batch ($)",
          type: "number",
          defaultValue: "6",
        },
        {
          name: "avgMilesPerBatch",
          label: "Average Miles Per Batch",
          type: "number",
          defaultValue: "6",
        },
        {
          name: "hoursPerWeek",
          label: "Hours Worked Per Week",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "gasPricePerGallon",
          label: "Gas Price Per Gallon ($)",
          type: "number",
          defaultValue: "3.50",
        },
        {
          name: "mpg",
          label: "Vehicle MPG",
          type: "number",
          defaultValue: "28",
        },
        {
          name: "insuredBags",
          label: "Weekly Insulated Bags/Supplies ($)",
          type: "number",
          defaultValue: "5",
        },
      ],
      calculate(inputs) {
        const batches = parseFloat(inputs.batchesPerWeek as string);
        const batchPay = parseFloat(inputs.avgBatchPay as string);
        const tip = parseFloat(inputs.avgTipPerBatch as string);
        const milesPerBatch = parseFloat(inputs.avgMilesPerBatch as string);
        const hours = parseFloat(inputs.hoursPerWeek as string);
        const gasPrice = parseFloat(inputs.gasPricePerGallon as string);
        const mpg = parseFloat(inputs.mpg as string);
        const supplies = parseFloat(inputs.insuredBags as string);

        const totalBatchPay = batches * batchPay;
        const totalTips = batches * tip;
        const grossWeekly = totalBatchPay + totalTips;
        const totalMiles = batches * milesPerBatch;
        const gasCost = (totalMiles / mpg) * gasPrice;
        const vehicleWear = totalMiles * 0.05;
        const totalExpenses = gasCost + vehicleWear + supplies;
        const netWeekly = grossWeekly - totalExpenses;
        const netHourly = netWeekly / hours;
        const avgEarningsPerBatch = netWeekly / batches;

        return {
          "Total Batch Pay": `$${formatNumber(totalBatchPay)}`,
          "Total Tips": `$${formatNumber(totalTips)}`,
          "Gross Weekly": `$${formatNumber(grossWeekly)}`,
          "Weekly Miles": formatNumber(totalMiles),
          "Gas Cost": `$${formatNumber(gasCost)}`,
          "Vehicle Wear": `$${formatNumber(vehicleWear)}`,
          "Total Expenses": `$${formatNumber(totalExpenses)}`,
          "Net Weekly Earnings": `$${formatNumber(netWeekly)}`,
          "Net Hourly Rate": `$${formatNumber(netHourly)}`,
          "Net Per Batch": `$${formatNumber(avgEarningsPerBatch)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "doordash-earnings",
    "gig-tax-calculator",
    "1099-deduction",
  ],
  faq: [
    {
      question: "How much do Instacart shoppers make per batch?",
      answer:
        "Instacart batch pay starts at $7 minimum and varies based on order size, distance, and items. With tips, most shoppers earn $15-$25 per batch. Cherry-picking higher-paying batches can increase average earnings significantly.",
    },
    {
      question: "Is Instacart shopping harder than food delivery?",
      answer:
        "Instacart requires more active work (shopping, selecting items, communicating with customers) compared to food delivery. However, tips are often higher and batches can be more predictable. Average time per batch is 30-60 minutes.",
    },
  ],
  formula:
    "Net Weekly = (Batches x Batch Pay) + (Batches x Avg Tip) - Gas - Vehicle Wear - Supplies. Gas = (Miles / MPG) x Gas Price. Vehicle Wear = Miles x $0.05.",
};

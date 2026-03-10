import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const instacartShopperPayCalculator: CalculatorDefinition = {
  slug: "instacart-shopper-pay-calculator",
  title: "Instacart Shopper Pay Calculator",
  description:
    "Calculate true Instacart shopper earnings per hour after mileage, vehicle wear, and taxes. Compare full-service vs in-store shopper income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Instacart shopper earnings calculator",
    "how much does Instacart pay shoppers",
    "Instacart net income",
    "Instacart shopper true hourly rate",
    "Instacart vs DoorDash earnings",
  ],
  variants: [
    {
      id: "fullservice",
      name: "Full-Service Shopper",
      description: "Shop and deliver — calculate true net earnings",
      fields: [
        {
          name: "batchPay",
          label: "Average Batch Pay (before tips)",
          type: "number",
          placeholder: "e.g. 12",
          prefix: "$",
        },
        {
          name: "avgTip",
          label: "Average Tip per Batch",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          defaultValue: 7,
        },
        {
          name: "batchesPerHour",
          label: "Batches Completed per Hour",
          type: "number",
          placeholder: "e.g. 1.5",
          suffix: "batches",
          defaultValue: 1,
        },
        {
          name: "milesPerBatch",
          label: "Miles Driven per Batch",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "miles",
          defaultValue: 6,
        },
      ],
      calculate: (inputs) => {
        const batchPay = parseFloat(inputs.batchPay as string) || 0;
        const avgTip = parseFloat(inputs.avgTip as string) || 0;
        const batchesPerHour = parseFloat(inputs.batchesPerHour as string) || 1;
        const milesPerBatch = parseFloat(inputs.milesPerBatch as string) || 6;

        const grossPerBatch = batchPay + avgTip;
        const grossHourly = grossPerBatch * batchesPerHour;
        const vehicleCostPerMile = 0.20; // gas + depreciation + maintenance
        const vehicleCostHourly = milesPerBatch * batchesPerHour * vehicleCostPerMile;

        const netBeforeTax = grossHourly - vehicleCostHourly;
        const netAfterTax = netBeforeTax * 0.70;

        return {
          primary: { label: "True Hourly Rate (after tax)", value: `$${formatNumber(netAfterTax, 2)}/hr` },
          details: [
            { label: "Gross per batch", value: `$${formatNumber(grossPerBatch, 2)}` },
            { label: "Batches per hour", value: `${batchesPerHour}` },
            { label: "Gross hourly", value: `$${formatNumber(grossHourly, 2)}` },
            { label: "Vehicle cost per hour", value: `-$${formatNumber(vehicleCostHourly, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(netBeforeTax, 2)}` },
            { label: "Net after tax (~30%)", value: `$${formatNumber(netAfterTax, 2)}` },
            { label: "Monthly income (20 hrs/wk)", value: `$${formatNumber(netAfterTax * 20 * 4.33, 2)}` },
          ],
          note: "Instacart shoppers with 4.9 ratings get priority access to high-value batches. Tipping correlates strongly with delivery speed and communication.",
        };
      },
    },
  ],
  relatedSlugs: ["doordash-dasher-pay-calculator", "food-delivery-earnings-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "How much does Instacart pay full-service shoppers?",
      answer:
        "Instacart batch pay is $7–$20+ per batch, plus customer tips averaging $5–$15. Full-service shoppers (shop + deliver) gross $15–$30/hr in busy areas. After vehicle costs and taxes, net is typically $10–$18/hr.",
    },
    {
      question: "What is the difference between in-store and full-service Instacart shoppers?",
      answer:
        "In-store shoppers are W-2 employees who only shop — no car required, set hourly wage ($13–$16/hr). Full-service shoppers are independent contractors who shop AND deliver, earning more but paying their own taxes and vehicle costs.",
    },
    {
      question: "How does Instacart calculate batch pay?",
      answer:
        "Instacart batch pay is based on: number of items, weight, distance, and current demand. Higher-effort batches (heavy items, long distances) pay more. Customers can adjust tips up to 24 hours after delivery.",
    },
  ],
  formula: "Net Hourly = (Batch Pay + Tips) × Batches/hr − Vehicle Costs/hr − 30% Taxes",
};

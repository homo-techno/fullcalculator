import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shippingCostCalculator: CalculatorDefinition = {
  slug: "shipping-cost-calculator",
  title: "Shipping Cost Calculator",
  description: "Free shipping cost calculator. Estimate shipping costs based on weight, dimensions, and distance. Calculate cost per order and annual shipping spend.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["shipping cost calculator", "shipping calculator", "freight cost calculator", "package shipping cost", "shipping rate calculator"],
  variants: [
    {
      id: "perPackage",
      name: "Per Package Cost",
      description: "Estimate shipping cost for a single package",
      fields: [
        { name: "weight", label: "Package Weight (lbs)", type: "number", placeholder: "e.g. 5", step: 0.1 },
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "shippingMethod", label: "Shipping Speed", type: "select", options: [
          { label: "Ground (5-7 days)", value: "ground" },
          { label: "3-Day Select", value: "3day" },
          { label: "2-Day", value: "2day" },
          { label: "Overnight", value: "overnight" },
        ], defaultValue: "ground" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const length = (inputs.length as number) || 0;
        const width = (inputs.width as number) || 0;
        const height = (inputs.height as number) || 0;
        const method = inputs.shippingMethod as string;
        if (!weight) return null;
        const dimWeight = (length * width * height) / 139;
        const billableWeight = Math.max(weight, dimWeight);
        const baseRates: Record<string, number> = { ground: 4.50, "3day": 8.00, "2day": 12.00, overnight: 22.00 };
        const perLbRates: Record<string, number> = { ground: 0.50, "3day": 0.85, "2day": 1.20, overnight: 2.00 };
        const baseRate = baseRates[method] || 4.50;
        const perLb = perLbRates[method] || 0.50;
        const estimatedCost = baseRate + (billableWeight * perLb);
        return {
          primary: { label: "Estimated Shipping Cost", value: `$${formatNumber(estimatedCost)}` },
          details: [
            { label: "Actual Weight", value: `${formatNumber(weight, 1)} lbs` },
            { label: "Dimensional Weight", value: `${formatNumber(dimWeight, 1)} lbs` },
            { label: "Billable Weight", value: `${formatNumber(billableWeight, 1)} lbs` },
            { label: "Base Rate", value: `$${formatNumber(baseRate)}` },
            { label: "Per Pound Rate", value: `$${formatNumber(perLb)}` },
          ],
          note: "This is an estimate. Actual rates vary by carrier, origin, destination, and current surcharges. Get quotes from UPS, FedEx, and USPS for exact pricing.",
        };
      },
    },
    {
      id: "business",
      name: "Business Shipping Costs",
      description: "Calculate total shipping costs for your business",
      fields: [
        { name: "ordersPerMonth", label: "Orders per Month", type: "number", placeholder: "e.g. 500" },
        { name: "avgCostPerOrder", label: "Average Shipping Cost/Order", type: "number", placeholder: "e.g. 8.50", prefix: "$", step: 0.01 },
        { name: "avgOrderValue", label: "Average Order Value", type: "number", placeholder: "e.g. 45", prefix: "$" },
        { name: "freeShipThreshold", label: "Free Shipping Threshold ($0 = none)", type: "number", placeholder: "e.g. 50", prefix: "$" },
        { name: "pctAboveThreshold", label: "% of Orders Above Threshold", type: "number", placeholder: "e.g. 40", suffix: "%" },
      ],
      calculate: (inputs) => {
        const orders = inputs.ordersPerMonth as number;
        const avgCost = inputs.avgCostPerOrder as number;
        const avgValue = (inputs.avgOrderValue as number) || 0;
        const threshold = (inputs.freeShipThreshold as number) || 0;
        const pctAbove = (inputs.pctAboveThreshold as number) || 0;
        if (!orders || !avgCost) return null;
        const freeShipOrders = threshold > 0 ? orders * (pctAbove / 100) : 0;
        const paidOrders = orders - freeShipOrders;
        const monthlyCost = paidOrders * avgCost;
        const annualCost = monthlyCost * 12;
        const costPercentOfRevenue = avgValue > 0 ? (avgCost / avgValue) * 100 : 0;
        const absorbedCost = freeShipOrders * avgCost;
        return {
          primary: { label: "Monthly Shipping Cost", value: `$${formatNumber(monthlyCost)}` },
          details: [
            { label: "Annual Shipping Cost", value: `$${formatNumber(annualCost)}` },
            { label: "Orders Billed Shipping", value: formatNumber(paidOrders, 0) },
            { label: "Free Shipping Orders", value: formatNumber(freeShipOrders, 0) },
            { label: "Absorbed Free Ship Cost", value: `$${formatNumber(absorbedCost)}/month` },
            { label: "Shipping % of Order Value", value: `${formatNumber(costPercentOfRevenue)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["price-per-unit-calculator", "storage-cost-calculator", "profit-margin-calculator"],
  faq: [
    { question: "How is shipping cost calculated?", answer: "Shipping cost depends on billable weight (the greater of actual weight or dimensional weight), distance/zone, service speed, and surcharges. Dimensional weight = (L × W × H) / 139 for UPS/FedEx. Carriers also add fuel surcharges, residential delivery fees, and other accessorials." },
    { question: "What is dimensional weight?", answer: "Dimensional weight (DIM weight) estimates a package's weight based on its size. It is calculated as Length × Width × Height / DIM factor (139 for most carriers). If DIM weight exceeds actual weight, you are charged for the DIM weight." },
    { question: "Should I offer free shipping?", answer: "Free shipping increases conversion rates by 10-30%. Consider building shipping into product prices, setting a minimum order threshold, or offering free ground shipping only. Calculate the impact on margins before deciding. 75% of consumers expect free shipping." },
  ],
  formula: "Dimensional Weight = (L × W × H) / 139 | Billable Weight = max(Actual, DIM) | Estimated Cost = Base Rate + (Billable Weight × Per-Lb Rate)",
};

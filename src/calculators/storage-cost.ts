import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const storageCostCalculator: CalculatorDefinition = {
  slug: "storage-cost-calculator",
  title: "Storage Cost Calculator",
  description: "Free storage and warehouse cost calculator. Calculate warehouse storage costs per unit, pallet, or square foot for your business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["storage cost calculator", "warehouse cost calculator", "inventory storage cost", "warehousing calculator", "fulfillment cost calculator"],
  variants: [
    {
      id: "perUnit",
      name: "Storage Cost per Unit",
      description: "Calculate the cost to store each unit of inventory",
      fields: [
        { name: "warehouseRent", label: "Monthly Warehouse Rent/Cost", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "utilities", label: "Monthly Utilities", type: "number", placeholder: "e.g. 800", prefix: "$" },
        { name: "insurance", label: "Monthly Insurance", type: "number", placeholder: "e.g. 400", prefix: "$" },
        { name: "labor", label: "Monthly Labor Cost", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "otherCosts", label: "Other Monthly Costs", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "avgUnits", label: "Average Units in Storage", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const rent = (inputs.warehouseRent as number) || 0;
        const utilities = (inputs.utilities as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const labor = (inputs.labor as number) || 0;
        const other = (inputs.otherCosts as number) || 0;
        const units = inputs.avgUnits as number;
        if (!units) return null;
        const monthlyCost = rent + utilities + insurance + labor + other;
        const annualCost = monthlyCost * 12;
        const costPerUnit = monthlyCost / units;
        const annualCostPerUnit = annualCost / units;
        return {
          primary: { label: "Monthly Storage Cost/Unit", value: `$${formatNumber(costPerUnit, 3)}` },
          details: [
            { label: "Annual Cost per Unit", value: `$${formatNumber(annualCostPerUnit)}` },
            { label: "Total Monthly Cost", value: `$${formatNumber(monthlyCost)}` },
            { label: "Total Annual Cost", value: `$${formatNumber(annualCost)}` },
            { label: "Rent", value: `$${formatNumber(rent)}/mo` },
            { label: "Labor", value: `$${formatNumber(labor)}/mo` },
            { label: "Other (utilities, ins, misc)", value: `$${formatNumber(utilities + insurance + other)}/mo` },
          ],
        };
      },
    },
    {
      id: "perSqFt",
      name: "Cost per Square Foot",
      description: "Calculate warehouse cost per square foot",
      fields: [
        { name: "totalCost", label: "Total Monthly Warehouse Cost", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "totalSqFt", label: "Total Square Footage", type: "number", placeholder: "e.g. 5000" },
        { name: "usedSqFt", label: "Usable/Used Square Footage", type: "number", placeholder: "e.g. 4000" },
      ],
      calculate: (inputs) => {
        const cost = inputs.totalCost as number;
        const totalSqFt = inputs.totalSqFt as number;
        const usedSqFt = (inputs.usedSqFt as number) || totalSqFt;
        if (!cost || !totalSqFt) return null;
        const costPerSqFt = cost / totalSqFt;
        const costPerUsedSqFt = usedSqFt ? cost / usedSqFt : 0;
        const utilization = usedSqFt ? (usedSqFt / totalSqFt) * 100 : 100;
        const annualPerSqFt = costPerSqFt * 12;
        return {
          primary: { label: "Cost per Sq Ft (monthly)", value: `$${formatNumber(costPerSqFt)}` },
          details: [
            { label: "Annual Cost per Sq Ft", value: `$${formatNumber(annualPerSqFt)}` },
            { label: "Cost per Used Sq Ft", value: `$${formatNumber(costPerUsedSqFt)}` },
            { label: "Space Utilization", value: `${formatNumber(utilization)}%` },
            { label: "Unused Space Cost", value: `$${formatNumber((totalSqFt - usedSqFt) * costPerSqFt)}/mo` },
            { label: "Total Monthly Cost", value: `$${formatNumber(cost)}` },
          ],
        };
      },
    },
    {
      id: "pallet",
      name: "Pallet Storage Cost",
      description: "Calculate monthly pallet storage costs",
      fields: [
        { name: "palletCount", label: "Number of Pallets", type: "number", placeholder: "e.g. 100" },
        { name: "costPerPallet", label: "Cost per Pallet/Month", type: "number", placeholder: "e.g. 15", prefix: "$" },
        { name: "handlingIn", label: "Inbound Handling per Pallet", type: "number", placeholder: "e.g. 8", prefix: "$" },
        { name: "handlingOut", label: "Outbound Handling per Pallet", type: "number", placeholder: "e.g. 8", prefix: "$" },
        { name: "avgMonthsStored", label: "Average Months in Storage", type: "number", placeholder: "e.g. 3", step: 0.5 },
      ],
      calculate: (inputs) => {
        const pallets = inputs.palletCount as number;
        const costPerPallet = inputs.costPerPallet as number;
        const handlingIn = (inputs.handlingIn as number) || 0;
        const handlingOut = (inputs.handlingOut as number) || 0;
        const months = (inputs.avgMonthsStored as number) || 1;
        if (!pallets || !costPerPallet) return null;
        const monthlyStorage = pallets * costPerPallet;
        const totalHandling = pallets * (handlingIn + handlingOut);
        const totalCostPerPallet = (costPerPallet * months) + handlingIn + handlingOut;
        const totalCost = monthlyStorage * months + totalHandling;
        return {
          primary: { label: "Monthly Storage Cost", value: `$${formatNumber(monthlyStorage)}` },
          details: [
            { label: "Total Cost (storage + handling)", value: `$${formatNumber(totalCost)}` },
            { label: "Cost per Pallet per Month", value: `$${formatNumber(costPerPallet)}` },
            { label: "All-in Cost per Pallet", value: `$${formatNumber(totalCostPerPallet)}` },
            { label: "Total Handling Fees", value: `$${formatNumber(totalHandling)}` },
            { label: "Annual Storage (no handling)", value: `$${formatNumber(monthlyStorage * 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inventory-turnover-calculator", "shipping-cost-calculator", "working-capital-calculator"],
  faq: [
    { question: "How much does warehouse storage cost?", answer: "Average warehouse costs in the US range from $4-$10 per square foot per year, or $10-$25 per pallet per month. Costs vary by location, climate control, security, and services. Major metros like NYC, LA, and SF are significantly more expensive." },
    { question: "What is carrying cost of inventory?", answer: "Carrying cost (holding cost) includes storage, insurance, depreciation, obsolescence, and capital costs. It is typically 20-30% of inventory value per year. Reducing carrying costs through better inventory management can significantly improve profitability." },
    { question: "How can I reduce storage costs?", answer: "Improve inventory turnover, implement just-in-time ordering, use ABC analysis to prioritize, negotiate better warehouse rates, optimize vertical space usage, reduce dead stock, and consider 3PL providers for more flexible capacity." },
  ],
  formula: "Storage Cost per Unit = Total Monthly Costs / Average Units | Cost per Sq Ft = Total Cost / Square Footage | Pallet Cost = (Rate × Months) + Handling Fees",
};

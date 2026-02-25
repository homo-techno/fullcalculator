import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cloudCostCalculator: CalculatorDefinition = {
  slug: "cloud-cost-calculator",
  title: "Cloud Computing Cost Calculator",
  description: "Free cloud computing cost calculator. Estimate monthly costs for compute, storage, and data transfer on cloud platforms.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cloud cost calculator", "aws cost estimator", "cloud computing cost", "server cost calculator", "cloud pricing calculator"],
  variants: [
    {
      id: "compute-cost",
      name: "Compute Instance Cost",
      description: "Estimate monthly cost for cloud compute instances",
      fields: [
        { name: "instanceCount", label: "Number of Instances", type: "number", placeholder: "e.g. 3", min: 1, defaultValue: 1 },
        { name: "vcpus", label: "vCPUs per Instance", type: "select", options: [
          { label: "1 vCPU", value: "1" },
          { label: "2 vCPUs", value: "2" },
          { label: "4 vCPUs", value: "4" },
          { label: "8 vCPUs", value: "8" },
          { label: "16 vCPUs", value: "16" },
          { label: "32 vCPUs", value: "32" },
          { label: "64 vCPUs", value: "64" },
        ], defaultValue: "4" },
        { name: "ramGB", label: "RAM per Instance (GB)", type: "select", options: [
          { label: "1 GB", value: "1" },
          { label: "2 GB", value: "2" },
          { label: "4 GB", value: "4" },
          { label: "8 GB", value: "8" },
          { label: "16 GB", value: "16" },
          { label: "32 GB", value: "32" },
          { label: "64 GB", value: "64" },
          { label: "128 GB", value: "128" },
        ], defaultValue: "16" },
        { name: "hoursPerMonth", label: "Hours per Month", type: "number", placeholder: "e.g. 730", min: 1, max: 744, defaultValue: 730 },
        { name: "pricing", label: "Pricing Model", type: "select", options: [
          { label: "On-Demand", value: "1" },
          { label: "1-Year Reserved (~40% off)", value: "0.6" },
          { label: "3-Year Reserved (~60% off)", value: "0.4" },
          { label: "Spot/Preemptible (~70% off)", value: "0.3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const instanceCount = (inputs.instanceCount as number) || 1;
        const vcpus = parseInt(inputs.vcpus as string) || 4;
        const ramGB = parseInt(inputs.ramGB as string) || 16;
        const hoursPerMonth = (inputs.hoursPerMonth as number) || 730;
        const pricingMultiplier = parseFloat(inputs.pricing as string) || 1;

        // Approximate pricing based on industry averages
        const cpuCostPerHr = 0.025 * vcpus; // ~$0.025/vCPU/hr
        const ramCostPerHr = 0.003 * ramGB; // ~$0.003/GB/hr
        const instanceCostPerHr = (cpuCostPerHr + ramCostPerHr) * pricingMultiplier;
        const monthlyCostPerInstance = instanceCostPerHr * hoursPerMonth;
        const totalMonthlyCost = monthlyCostPerInstance * instanceCount;
        const annualCost = totalMonthlyCost * 12;

        return {
          primary: { label: "Monthly Compute Cost", value: `$${formatNumber(totalMonthlyCost, 2)}` },
          details: [
            { label: "Instances", value: formatNumber(instanceCount, 0) },
            { label: "Config per Instance", value: `${vcpus} vCPU, ${ramGB} GB RAM` },
            { label: "Cost per Hour (per instance)", value: `$${formatNumber(instanceCostPerHr, 4)}` },
            { label: "Hours per Month", value: formatNumber(hoursPerMonth, 0) },
            { label: "Monthly per Instance", value: `$${formatNumber(monthlyCostPerInstance, 2)}` },
            { label: "Total Monthly Cost", value: `$${formatNumber(totalMonthlyCost, 2)}` },
            { label: "Annual Cost", value: `$${formatNumber(annualCost, 2)}` },
            { label: "Total vCPUs", value: formatNumber(vcpus * instanceCount, 0) },
            { label: "Total RAM", value: `${formatNumber(ramGB * instanceCount, 0)} GB` },
          ],
        };
      },
    },
    {
      id: "full-stack",
      name: "Full Stack Estimate",
      description: "Estimate total monthly cloud bill including compute, storage, and transfer",
      fields: [
        { name: "computeCost", label: "Monthly Compute ($)", type: "number", placeholder: "e.g. 500", min: 0, defaultValue: 500 },
        { name: "storageGB", label: "Storage (GB)", type: "number", placeholder: "e.g. 500", min: 0, defaultValue: 500 },
        { name: "storageType", label: "Storage Type", type: "select", options: [
          { label: "SSD ($0.10/GB/mo)", value: "0.10" },
          { label: "HDD ($0.045/GB/mo)", value: "0.045" },
          { label: "Archive ($0.004/GB/mo)", value: "0.004" },
        ], defaultValue: "0.10" },
        { name: "dataTransferGB", label: "Data Transfer Out (GB/mo)", type: "number", placeholder: "e.g. 1000", min: 0, defaultValue: 100 },
        { name: "dbHours", label: "Managed DB Hours/mo", type: "number", placeholder: "e.g. 730", min: 0, defaultValue: 0 },
        { name: "dbCostPerHr", label: "DB Cost ($/hr)", type: "number", placeholder: "e.g. 0.10", min: 0, step: 0.01, defaultValue: 0.10 },
      ],
      calculate: (inputs) => {
        const computeCost = (inputs.computeCost as number) || 0;
        const storageGB = (inputs.storageGB as number) || 0;
        const storageRate = parseFloat(inputs.storageType as string) || 0.10;
        const dataTransferGB = (inputs.dataTransferGB as number) || 0;
        const dbHours = (inputs.dbHours as number) || 0;
        const dbCostPerHr = (inputs.dbCostPerHr as number) || 0;

        const storageCost = storageGB * storageRate;
        const transferCost = dataTransferGB > 1 ? (dataTransferGB - 1) * 0.09 : 0; // First GB free, then $0.09/GB
        const dbCost = dbHours * dbCostPerHr;
        const totalMonthly = computeCost + storageCost + transferCost + dbCost;
        const annualCost = totalMonthly * 12;

        return {
          primary: { label: "Total Monthly Bill", value: `$${formatNumber(totalMonthly, 2)}` },
          details: [
            { label: "Compute", value: `$${formatNumber(computeCost, 2)}` },
            { label: "Storage", value: `$${formatNumber(storageCost, 2)} (${formatNumber(storageGB, 0)} GB)` },
            { label: "Data Transfer", value: `$${formatNumber(transferCost, 2)} (${formatNumber(dataTransferGB, 0)} GB)` },
            { label: "Managed Database", value: `$${formatNumber(dbCost, 2)}` },
            { label: "Total Monthly", value: `$${formatNumber(totalMonthly, 2)}` },
            { label: "Annual Cost", value: `$${formatNumber(annualCost, 2)}` },
            { label: "Daily Cost", value: `$${formatNumber(totalMonthly / 30, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["container-resources-calculator", "server-bandwidth-calculator", "database-size-estimator"],
  faq: [
    { question: "How can I reduce cloud costs?", answer: "Use reserved instances for predictable workloads (40-60% savings). Use spot/preemptible instances for fault-tolerant workloads (70% savings). Right-size instances. Use auto-scaling. Archive cold data. Delete unused resources. Monitor with cost management tools. Consider multi-cloud for best pricing." },
    { question: "What is typically the biggest cloud cost?", answer: "Compute (EC2/VMs) is usually 60-70% of the total bill. Storage is 15-20%. Data transfer (egress) can be surprisingly expensive at $0.09/GB. Managed services (databases, load balancers) also add up. Always set up billing alerts and review costs weekly." },
  ],
  formula: "Monthly = Compute + (Storage GB x Rate) + (Transfer GB x $0.09) + DB Cost",
};

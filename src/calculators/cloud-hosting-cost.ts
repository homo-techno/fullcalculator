import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cloudHostingCostCalculator: CalculatorDefinition = {
  slug: "cloud-hosting-cost",
  title: "Cloud Hosting Cost Comparison Calculator",
  description:
    "Compare cloud hosting costs across AWS, Google Cloud, and Azure based on compute, storage, bandwidth, and usage patterns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cloud hosting cost",
    "aws pricing",
    "gcp pricing",
    "azure pricing",
    "cloud cost calculator",
    "server cost",
    "hosting comparison",
    "cloud infrastructure cost",
  ],
  variants: [
    {
      slug: "cloud-hosting-cost",
      title: "Cloud Hosting Monthly Cost Estimator",
      description:
        "Estimate monthly cloud hosting costs based on resource needs.",
      fields: [
        {
          id: "provider",
          label: "Cloud Provider",
          type: "select",
          options: [
            { label: "AWS", value: "aws" },
            { label: "Google Cloud (GCP)", value: "gcp" },
            { label: "Microsoft Azure", value: "azure" },
            { label: "DigitalOcean", value: "digitalocean" },
            { label: "Vercel", value: "vercel" },
          ],
          defaultValue: "aws",
        },
        {
          id: "instanceType",
          label: "Instance Size",
          type: "select",
          options: [
            { label: "Small (2 vCPU, 4GB RAM)", value: "small" },
            { label: "Medium (4 vCPU, 16GB RAM)", value: "medium" },
            { label: "Large (8 vCPU, 32GB RAM)", value: "large" },
            { label: "XLarge (16 vCPU, 64GB RAM)", value: "xlarge" },
          ],
          defaultValue: "medium",
        },
        {
          id: "numberOfInstances",
          label: "Number of Instances",
          type: "number",
          defaultValue: 2,
        },
        {
          id: "storageGb",
          label: "Storage (GB)",
          type: "number",
          defaultValue: 100,
        },
        {
          id: "bandwidthGb",
          label: "Monthly Bandwidth / Egress (GB)",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "hoursPerMonth",
          label: "Running Hours per Month",
          type: "number",
          defaultValue: 730,
        },
      ],
      calculate(inputs) {
        const provider = inputs.provider as string;
        const instanceType = inputs.instanceType as string;
        const numberOfInstances = parseFloat(inputs.numberOfInstances as string);
        const storageGb = parseFloat(inputs.storageGb as string);
        const bandwidthGb = parseFloat(inputs.bandwidthGb as string);
        const hoursPerMonth = parseFloat(inputs.hoursPerMonth as string);

        // Hourly compute rates by provider and size
        const computeRates: Record<string, Record<string, number>> = {
          aws: { small: 0.0464, medium: 0.166, large: 0.334, xlarge: 0.668 },
          gcp: { small: 0.042, medium: 0.15, large: 0.302, xlarge: 0.604 },
          azure: { small: 0.047, medium: 0.17, large: 0.34, xlarge: 0.68 },
          digitalocean: { small: 0.03, medium: 0.09, large: 0.18, xlarge: 0.36 },
          vercel: { small: 0.027, medium: 0.055, large: 0.11, xlarge: 0.22 },
        };

        // Storage rates per GB/month
        const storageRates: Record<string, number> = {
          aws: 0.023,
          gcp: 0.02,
          azure: 0.024,
          digitalocean: 0.01,
          vercel: 0.025,
        };

        // Bandwidth rates per GB
        const bandwidthRates: Record<string, number> = {
          aws: 0.09,
          gcp: 0.08,
          azure: 0.087,
          digitalocean: 0.01,
          vercel: 0.04,
        };

        const computeRate = computeRates[provider]?.[instanceType] ?? 0.166;
        const storageRate = storageRates[provider] ?? 0.023;
        const bandwidthRate = bandwidthRates[provider] ?? 0.09;

        const computeCost =
          computeRate * hoursPerMonth * numberOfInstances;
        const storageCost = storageGb * storageRate;
        const bandwidthCost = bandwidthGb * bandwidthRate;
        const totalMonthlyCost = computeCost + storageCost + bandwidthCost;

        return {
          "Compute Cost": "$" + formatNumber(computeCost),
          "Storage Cost": "$" + formatNumber(storageCost),
          "Bandwidth Cost": "$" + formatNumber(bandwidthCost),
          "Total Monthly Cost": "$" + formatNumber(totalMonthlyCost),
          "Total Annual Cost": "$" + formatNumber(totalMonthlyCost * 12),
          "Cost per Instance": "$" + formatNumber(computeCost / numberOfInstances),
          "Cost per Hour (all instances)":
            "$" + formatNumber(computeRate * numberOfInstances),
        };
      },
    },
    {
      slug: "cloud-hosting-comparison",
      title: "Cloud Provider Cost Comparison",
      description:
        "Compare the same workload cost across multiple cloud providers.",
      fields: [
        {
          id: "instanceSize",
          label: "Instance Size",
          type: "select",
          options: [
            { label: "Small (2 vCPU, 4GB)", value: "small" },
            { label: "Medium (4 vCPU, 16GB)", value: "medium" },
            { label: "Large (8 vCPU, 32GB)", value: "large" },
          ],
          defaultValue: "medium",
        },
        {
          id: "instances",
          label: "Number of Instances",
          type: "number",
          defaultValue: 3,
        },
        {
          id: "storageGb",
          label: "Storage (GB)",
          type: "number",
          defaultValue: 200,
        },
        {
          id: "bandwidthGb",
          label: "Bandwidth (GB)",
          type: "number",
          defaultValue: 1000,
        },
      ],
      calculate(inputs) {
        const size = inputs.instanceSize as string;
        const instances = parseFloat(inputs.instances as string);
        const storage = parseFloat(inputs.storageGb as string);
        const bandwidth = parseFloat(inputs.bandwidthGb as string);

        const providers = {
          AWS: { compute: { small: 0.0464, medium: 0.166, large: 0.334 }, storage: 0.023, bandwidth: 0.09 },
          GCP: { compute: { small: 0.042, medium: 0.15, large: 0.302 }, storage: 0.02, bandwidth: 0.08 },
          Azure: { compute: { small: 0.047, medium: 0.17, large: 0.34 }, storage: 0.024, bandwidth: 0.087 },
          DigitalOcean: { compute: { small: 0.03, medium: 0.09, large: 0.18 }, storage: 0.01, bandwidth: 0.01 },
        };

        const results: Record<string, string> = {};
        for (const [name, rates] of Object.entries(providers)) {
          const computeRate = (rates.compute as Record<string, number>)[size] ?? 0.166;
          const total =
            computeRate * 730 * instances +
            storage * rates.storage +
            bandwidth * rates.bandwidth;
          results[name] = "$" + formatNumber(total) + "/mo";
        }

        return results;
      },
    },
  ],
  relatedSlugs: [
    "ai-api-cost",
    "ai-training-cost",
    "saas-metrics",
    "startup-runway",
  ],
  faq: [
    {
      question: "Which cloud provider is cheapest?",
      answer:
        "For basic workloads, DigitalOcean and Hetzner are typically cheapest. Among the Big 3, GCP often edges out AWS and Azure on compute pricing. However, total cost depends on your specific usage of compute, storage, bandwidth, and managed services. Reserved instances can save 30-60% on any provider.",
    },
    {
      question: "How can I reduce cloud hosting costs?",
      answer:
        "Key strategies include using reserved or spot instances (30-70% savings), right-sizing instances, auto-scaling to match demand, using cheaper regions, optimizing storage tiers, reducing data egress, and leveraging free tiers. Cloud cost optimization tools like AWS Cost Explorer or Infracost help identify savings.",
    },
  ],
  formula:
    "Monthly Cost = (Compute Rate x Hours x Instances) + (Storage GB x Storage Rate) + (Bandwidth GB x Bandwidth Rate). Annual Cost = Monthly Cost x 12.",
};

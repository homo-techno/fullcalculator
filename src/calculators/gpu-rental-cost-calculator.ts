import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gpuRentalCostCalculator: CalculatorDefinition = {
  slug: "gpu-rental-cost-calculator",
  title: "GPU Rental Cost Calculator",
  description:
    "Calculate costs for renting GPUs (A100, H100, RTX 4090) on cloud platforms. Compare prices across Lambda Labs, Vast.ai, RunPod, and AWS.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "GPU rental cost",
    "cloud GPU calculator",
    "A100 rental price",
    "H100 cost",
    "GPU hourly rate",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate GPU Rental Cost",
      description: "Estimate GPU rental expenses",
      fields: [
        {
          name: "gpuType",
          label: "GPU Type",
          type: "select",
          options: [
            { label: "NVIDIA H100 (Latest)", value: "h100" },
            { label: "NVIDIA A100 (High-end)", value: "a100" },
            { label: "NVIDIA L40S (Mid-range)", value: "l40s" },
            { label: "NVIDIA RTX 4090 (Consumer)", value: "rtx4090" },
            { label: "NVIDIA V100 (Budget)", value: "v100" },
          ],
          defaultValue: "a100",
        },
        {
          name: "hoursPerMonth",
          label: "GPU Hours Per Month",
          type: "number",
          placeholder: "e.g. 730",
          suffix: "hours",
        },
        {
          name: "quantity",
          label: "Number of GPUs",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const gpuType = inputs.gpuType as string;
        const hoursPerMonth = parseFloat(inputs.hoursPerMonth as string) || 730;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        const pricing = {
          h100: { name: "H100", hourlyRate: 3.5, vram: 80 },
          a100: { name: "A100", hourlyRate: 1.6, vram: 40 },
          l40s: { name: "L40S", hourlyRate: 0.9, vram: 48 },
          rtx4090: { name: "RTX 4090", hourlyRate: 0.5, vram: 24 },
          v100: { name: "V100", hourlyRate: 0.3, vram: 16 },
        };

        const gpu = pricing[gpuType as keyof typeof pricing] || pricing.a100;
        const monthlyCost = gpu.hourlyRate * hoursPerMonth * quantity;
        const yearlyCost = monthlyCost * 12;
        const costPerHour = gpu.hourlyRate * quantity;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(monthlyCost, 2)}` },
          details: [
            { label: "GPU Model", value: gpu.name },
            { label: "Quantity", value: formatNumber(quantity) },
            { label: "Hourly rate (per GPU)", value: `$${gpu.hourlyRate}` },
            { label: "Total hourly rate", value: `$${formatNumber(costPerHour, 2)}` },
            { label: "Hours per month", value: formatNumber(hoursPerMonth) },
            { label: "Monthly cost", value: `$${formatNumber(monthlyCost, 2)}` },
            { label: "Annual cost", value: `$${formatNumber(yearlyCost, 2)}` },
            { label: "VRAM per GPU", value: `${gpu.vram}GB` },
          ],
          note: "Prices approximate. Most providers charge slightly less for sustained monthly rental vs hourly. Egress bandwidth may incur additional costs.",
        };
      },
    },
    {
      id: "compare",
      name: "Compare Providers",
      description: "Compare GPU rental prices across platforms",
      fields: [
        {
          name: "gpuType",
          label: "GPU Type",
          type: "select",
          options: [
            { label: "A100 80GB", value: "a100" },
            { label: "H100 80GB", value: "h100" },
            { label: "RTX 4090", value: "rtx4090" },
          ],
          defaultValue: "a100",
        },
        {
          name: "hoursPerMonth",
          label: "Hours Per Month",
          type: "number",
          placeholder: "e.g. 730",
          suffix: "hours",
        },
      ],
      calculate: (inputs) => {
        const gpuType = inputs.gpuType as string;
        const hoursPerMonth = parseFloat(inputs.hoursPerMonth as string) || 730;

        let providers: { name: string; hourlyRate: number }[] = [];

        if (gpuType === "h100") {
          providers = [
            { name: "Lambda Labs", hourlyRate: 4.0 },
            { name: "RunPod", hourlyRate: 3.5 },
            { name: "Vast.ai", hourlyRate: 3.2 },
            { name: "AWS SageMaker", hourlyRate: 5.5 },
            { name: "Google Vertex AI", hourlyRate: 4.8 },
          ];
        } else if (gpuType === "a100") {
          providers = [
            { name: "Lambda Labs", hourlyRate: 1.75 },
            { name: "RunPod", hourlyRate: 1.6 },
            { name: "Vast.ai", hourlyRate: 1.4 },
            { name: "AWS SageMaker", hourlyRate: 2.1 },
            { name: "Google Vertex AI", hourlyRate: 1.9 },
          ];
        } else if (gpuType === "rtx4090") {
          providers = [
            { name: "Lambda Labs", hourlyRate: 0.6 },
            { name: "RunPod", hourlyRate: 0.5 },
            { name: "Vast.ai", hourlyRate: 0.35 },
            { name: "AWS SageMaker", hourlyRate: 0.85 },
            { name: "Google Vertex AI", hourlyRate: 0.75 },
          ];
        }

        let details: { label: string; value: string }[] = [];
        let cheapest = { name: "", cost: Infinity };

        providers.forEach((p) => {
          const cost = p.hourlyRate * hoursPerMonth;
          details.push({ label: p.name, value: `$${formatNumber(cost, 2)}/mo` });
          if (cost < cheapest.cost) {
            cheapest = { name: p.name, cost };
          }
        });

        return {
          primary: {
            label: "Best Value",
            value: `${cheapest.name} ($${formatNumber(cheapest.cost, 2)}/mo)`
          },
          details,
          note: "Vast.ai and RunPod offer best pricing but variable availability. AWS/Google offer reliability at higher cost. Consider bandwidth and data transfer costs.",
        };
      },
    },
  ],
  relatedSlugs: ["ai-training-cost-estimator", "ai-startup-compute-budget"],
  faq: [
    {
      question: "What's the difference between H100 and A100 GPUs?",
      answer:
        "H100 is newer and ~2x faster for LLM training (Transformer performance). A100 is still powerful and more cost-effective for many tasks. H100s have 141 GB/s memory bandwidth vs A100's 2 TB/s.",
    },
    {
      question: "Which provider is cheapest?",
      answer:
        "Vast.ai and RunPod offer lowest prices for spot/interruptible instances. Lambda Labs and AWS offer premium pricing for reliability. For consistent work, negotiate monthly rates for 20-30% discounts.",
    },
    {
      question: "What's included in GPU rental costs?",
      answer:
        "Most providers charge for GPU hours only. Egress bandwidth, storage, and data transfer often cost extra. Always check terms for idle time charges and cancellation policies.",
    },
  ],
  formula: "Monthly Cost = Hourly Rate × Hours Per Month × Number of GPUs",
};

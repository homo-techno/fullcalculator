import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingPcBuildBudgetCalculator: CalculatorDefinition = {
  slug: "gaming-pc-build-budget-calculator",
  title: "Gaming PC Build Budget Calculator",
  description: "Plan your gaming PC build budget by allocating costs across major components including CPU, GPU, RAM, storage, and peripherals.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gaming pc budget","pc build cost","computer build calculator","custom pc price","gaming rig budget"],
  variants: [{
    id: "standard",
    name: "Gaming PC Build Budget",
    description: "Plan your gaming PC build budget by allocating costs across major components including CPU, GPU, RAM, storage, and peripherals.",
    fields: [
      { name: "totalBudget", label: "Total Budget ($)", type: "number", min: 500, max: 10000, defaultValue: 1500 },
      { name: "buildTier", label: "Build Tier", type: "select", options: [{ value: "1", label: "Budget (1080p)" }, { value: "2", label: "Mid-Range (1440p)" }, { value: "3", label: "High-End (4K)" }, { value: "4", label: "Enthusiast (4K Max)" }], defaultValue: "2" },
      { name: "includeMonitor", label: "Include Monitor", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
      { name: "includePeripherals", label: "Include Peripherals", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const budget = inputs.totalBudget as number;
    const tier = parseInt(inputs.buildTier as string);
    const monitor = parseInt(inputs.includeMonitor as string);
    const peripherals = parseInt(inputs.includePeripherals as string);
    const monitorCost = monitor === 1 ? budget * 0.15 : 0;
    const peripheralCost = peripherals === 1 ? budget * 0.08 : 0;
    const coreBudget = budget - monitorCost - peripheralCost;
    const gpuPercent = { 1: 0.35, 2: 0.38, 3: 0.40, 4: 0.42 };
    const gpu = Math.round(coreBudget * (gpuPercent[tier] || 0.38));
    const cpu = Math.round(coreBudget * 0.22);
    const mobo = Math.round(coreBudget * 0.12);
    const ram = Math.round(coreBudget * 0.08);
    const storage = Math.round(coreBudget * 0.08);
    const psu = Math.round(coreBudget * 0.06);
    const pcCase = Math.round(coreBudget * 0.06);
    const cooling = coreBudget - gpu - cpu - mobo - ram - storage - psu - pcCase;
    return {
      primary: { label: "GPU Budget", value: "$" + formatNumber(gpu) },
      details: [
        { label: "CPU", value: "$" + formatNumber(cpu) },
        { label: "Motherboard", value: "$" + formatNumber(mobo) },
        { label: "RAM + Storage", value: "$" + formatNumber(ram + storage) },
        { label: "PSU + Case + Cooling", value: "$" + formatNumber(psu + pcCase + cooling) },
        { label: "Monitor", value: "$" + formatNumber(Math.round(monitorCost)) },
        { label: "Peripherals", value: "$" + formatNumber(Math.round(peripheralCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["streaming-service-cost-comparison-calculator","electric-bill-device-cost-calculator","monitor-size-distance-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "GPU Budget = Core Budget x GPU Allocation % (35-42%); CPU Budget = Core Budget x 22%; Core Budget = Total Budget - Monitor - Peripherals",
};

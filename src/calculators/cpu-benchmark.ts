import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cpuBenchmarkCalculator: CalculatorDefinition = {
  slug: "cpu-benchmark-comparison",
  title: "CPU Benchmark Comparison",
  description: "Free CPU benchmark comparison calculator. Compare CPU performance using single-core and multi-core scores, calculate performance ratios and workload estimates.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cpu benchmark", "cpu comparison", "processor comparison", "cpu performance calculator", "cpu score comparison"],
  variants: [
    {
      id: "compare-cpus",
      name: "Compare Two CPUs",
      description: "Compare performance of two CPUs by their benchmark scores",
      fields: [
        { name: "cpu1Name", label: "CPU 1 Cores", type: "number", placeholder: "e.g. 8", min: 1, defaultValue: 8 },
        { name: "cpu1Single", label: "CPU 1 Single-Core Score", type: "number", placeholder: "e.g. 1800", min: 1 },
        { name: "cpu1Multi", label: "CPU 1 Multi-Core Score", type: "number", placeholder: "e.g. 12000", min: 1 },
        { name: "cpu2Name", label: "CPU 2 Cores", type: "number", placeholder: "e.g. 12", min: 1, defaultValue: 12 },
        { name: "cpu2Single", label: "CPU 2 Single-Core Score", type: "number", placeholder: "e.g. 2100", min: 1 },
        { name: "cpu2Multi", label: "CPU 2 Multi-Core Score", type: "number", placeholder: "e.g. 18000", min: 1 },
      ],
      calculate: (inputs) => {
        const cpu1Cores = inputs.cpu1Name as number;
        const cpu1Single = inputs.cpu1Single as number;
        const cpu1Multi = inputs.cpu1Multi as number;
        const cpu2Cores = inputs.cpu2Name as number;
        const cpu2Single = inputs.cpu2Single as number;
        const cpu2Multi = inputs.cpu2Multi as number;
        if (!cpu1Single || !cpu1Multi || !cpu2Single || !cpu2Multi) return null;

        const singleRatio = cpu2Single / cpu1Single;
        const multiRatio = cpu2Multi / cpu1Multi;
        const cpu1Scaling = cpu1Multi / (cpu1Single * cpu1Cores);
        const cpu2Scaling = cpu2Multi / (cpu2Single * cpu2Cores);
        const singleWinner = singleRatio >= 1 ? "CPU 2" : "CPU 1";
        const multiWinner = multiRatio >= 1 ? "CPU 2" : "CPU 1";

        return {
          primary: { label: "Multi-Core Advantage", value: `CPU 2 is ${formatNumber(multiRatio, 2)}x of CPU 1` },
          details: [
            { label: "CPU 1 Single-Core", value: formatNumber(cpu1Single, 0) },
            { label: "CPU 1 Multi-Core", value: formatNumber(cpu1Multi, 0) },
            { label: "CPU 1 Cores", value: formatNumber(cpu1Cores, 0) },
            { label: "CPU 1 Scaling Efficiency", value: `${formatNumber(cpu1Scaling * 100, 1)}%` },
            { label: "CPU 2 Single-Core", value: formatNumber(cpu2Single, 0) },
            { label: "CPU 2 Multi-Core", value: formatNumber(cpu2Multi, 0) },
            { label: "CPU 2 Cores", value: formatNumber(cpu2Cores, 0) },
            { label: "CPU 2 Scaling Efficiency", value: `${formatNumber(cpu2Scaling * 100, 1)}%` },
            { label: "Single-Core Ratio (CPU2/CPU1)", value: `${formatNumber(singleRatio, 3)}x` },
            { label: "Multi-Core Ratio (CPU2/CPU1)", value: `${formatNumber(multiRatio, 3)}x` },
            { label: "Single-Core Winner", value: singleWinner },
            { label: "Multi-Core Winner", value: multiWinner },
          ],
        };
      },
    },
    {
      id: "workload-estimate",
      name: "Workload Time Estimate",
      description: "Estimate workload completion time based on CPU benchmark score",
      fields: [
        { name: "baseScore", label: "Reference CPU Score", type: "number", placeholder: "e.g. 10000", min: 1 },
        { name: "baseTime", label: "Reference Time (minutes)", type: "number", placeholder: "e.g. 60", min: 0.1 },
        { name: "targetScore", label: "Your CPU Score", type: "number", placeholder: "e.g. 15000", min: 1 },
        { name: "workloadType", label: "Workload Type", type: "select", options: [
          { label: "Compilation (multi-core)", value: "multi" },
          { label: "Gaming (single-core)", value: "single" },
          { label: "Mixed workload", value: "mixed" },
        ], defaultValue: "multi" },
      ],
      calculate: (inputs) => {
        const baseScore = inputs.baseScore as number;
        const baseTime = inputs.baseTime as number;
        const targetScore = inputs.targetScore as number;
        if (!baseScore || !baseTime || !targetScore) return null;

        const ratio = targetScore / baseScore;
        const estimatedTime = baseTime / ratio;
        const timeSaved = baseTime - estimatedTime;
        const speedupPercent = ((ratio - 1) * 100);

        return {
          primary: { label: "Estimated Time", value: estimatedTime >= 60 ? `${formatNumber(estimatedTime / 60, 1)} hours` : `${formatNumber(estimatedTime, 1)} minutes` },
          details: [
            { label: "Reference CPU Score", value: formatNumber(baseScore, 0) },
            { label: "Reference Time", value: `${formatNumber(baseTime, 1)} minutes` },
            { label: "Your CPU Score", value: formatNumber(targetScore, 0) },
            { label: "Performance Ratio", value: `${formatNumber(ratio, 3)}x` },
            { label: "Estimated Time", value: `${formatNumber(estimatedTime, 1)} minutes` },
            { label: "Time Difference", value: timeSaved >= 0 ? `${formatNumber(timeSaved, 1)} min faster` : `${formatNumber(Math.abs(timeSaved), 1)} min slower` },
            { label: "Speedup", value: `${speedupPercent >= 0 ? "+" : ""}${formatNumber(speedupPercent, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ram-speed-calculator", "container-resources-calculator", "cloud-cost-calculator"],
  faq: [
    { question: "What is single-core vs multi-core performance?", answer: "Single-core score measures how fast one CPU core processes a task -- important for gaming and lightly-threaded apps. Multi-core score measures total throughput across all cores -- important for compilation, video encoding, and server workloads. A CPU can be great at one but average at the other." },
    { question: "How accurate are benchmark comparisons?", answer: "Benchmark scores give a good relative comparison (within 10-15% accuracy for similar workloads). Real-world performance also depends on RAM speed, storage I/O, cooling (thermal throttling), and workload characteristics. Always test with your actual workload when possible." },
  ],
  formula: "Performance Ratio = Score2 / Score1 | Estimated Time = Base Time / Performance Ratio",
};

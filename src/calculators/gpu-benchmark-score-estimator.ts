import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gpuBenchmarkScoreEstimatorCalculator: CalculatorDefinition = {
  slug: "gpu-benchmark-score-estimator",
  title: "GPU Benchmark Score Estimator",
  description: "Estimate your GPU benchmark score based on GPU tier, clock speed, VRAM, and architecture generation for relative performance comparison.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["GPU benchmark","graphics card score","GPU performance estimator","video card benchmark"],
  variants: [{
    id: "standard",
    name: "GPU Benchmark Score Estimator",
    description: "Estimate your GPU benchmark score based on GPU tier, clock speed, VRAM, and architecture generation for relative performance comparison.",
    fields: [
      { name: "gpuTier", label: "GPU Tier", type: "select", options: [{ value: "1", label: "Budget (e.g. RTX 4060)" }, { value: "2", label: "Mid-Range (e.g. RTX 4070)" }, { value: "3", label: "High-End (e.g. RTX 4080)" }, { value: "4", label: "Flagship (e.g. RTX 4090)" }], defaultValue: "2" },
      { name: "clockSpeed", label: "Boost Clock Speed (MHz)", type: "number", min: 500, max: 3500, defaultValue: 2100 },
      { name: "vram", label: "VRAM (GB)", type: "number", min: 2, max: 48, defaultValue: 12 },
      { name: "generation", label: "Architecture Generation", type: "select", options: [{ value: "1", label: "Current Gen" }, { value: "2", label: "Last Gen" }, { value: "3", label: "2 Gens Old" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const tier = parseInt(inputs.gpuTier as string);
    const clock = inputs.clockSpeed as number;
    const vram = inputs.vram as number;
    const gen = parseInt(inputs.generation as string);
    const tierBase = { 1: 8000, 2: 14000, 3: 22000, 4: 30000 };
    const genMultiplier = { 1: 1.0, 2: 0.78, 3: 0.60 };
    const base = (tierBase[tier] || 14000) * (genMultiplier[gen] || 1.0);
    const clockBonus = (clock - 1800) * 3;
    const vramBonus = vram * 50;
    const estimatedScore = Math.round(base + clockBonus + vramBonus);
    const fps1080p = Math.round(estimatedScore / 100);
    const fps1440p = Math.round(fps1080p * 0.72);
    const fps4k = Math.round(fps1080p * 0.42);
    return {
      primary: { label: "Estimated Benchmark Score", value: formatNumber(estimatedScore) },
      details: [
        { label: "Estimated 1080p FPS (AAA)", value: formatNumber(fps1080p) + " FPS" },
        { label: "Estimated 1440p FPS (AAA)", value: formatNumber(fps1440p) + " FPS" },
        { label: "Estimated 4K FPS (AAA)", value: formatNumber(fps4k) + " FPS" },
        { label: "Performance Tier", value: estimatedScore > 25000 ? "Ultra" : estimatedScore > 18000 ? "High" : estimatedScore > 10000 ? "Medium" : "Low" }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-pc-wattage-calculator","gaming-fps-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Base Score = Tier Base Score x Generation Multiplier; Clock Bonus = (Clock Speed - 1800) x 3; VRAM Bonus = VRAM x 50; Estimated Score = Base + Clock Bonus + VRAM Bonus",
};

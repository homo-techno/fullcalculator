import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingFpsCalculator: CalculatorDefinition = {
  slug: "gaming-fps-calculator",
  title: "Gaming FPS Calculator",
  description: "Estimate frames per second from GPU and CPU specs.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gaming FPS","frame rate estimator"],
  variants: [{
    id: "standard",
    name: "Gaming FPS",
    description: "Estimate frames per second from GPU and CPU specs.",
    fields: [
      { name: "gpuScore", label: "GPU Benchmark Score", type: "number", min: 1000, max: 50000, defaultValue: 15000 },
      { name: "cpuScore", label: "CPU Benchmark Score", type: "number", min: 500, max: 20000, defaultValue: 8000 },
      { name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "1.8", label: "1440p" }, { value: "4", label: "4K" }], defaultValue: "1" },
      { name: "quality", label: "Quality Preset", type: "select", options: [{ value: "0.5", label: "Low" }, { value: "0.75", label: "Medium" }, { value: "1", label: "High" }, { value: "1.3", label: "Ultra" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const gpu = inputs.gpuScore as number;
      const cpu = inputs.cpuScore as number;
      const res = inputs.resolution as number;
      const qual = inputs.quality as number;
      if (!gpu || !cpu || !res || !qual) return null;
      const gpuFps = gpu / (res * qual * 100);
      const cpuFps = cpu / 40;
      const estFps = Math.round(Math.min(gpuFps, cpuFps));
      const bottleneck = gpuFps < cpuFps ? "GPU" : "CPU";
      return {
        primary: { label: "Estimated FPS", value: formatNumber(estFps) + " fps" },
        details: [
          { label: "GPU Limited FPS", value: formatNumber(Math.round(gpuFps)) + " fps" },
          { label: "CPU Limited FPS", value: formatNumber(Math.round(cpuFps)) + " fps" },
          { label: "Bottleneck", value: bottleneck },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a good FPS for gaming?", answer: "60 FPS is smooth. 144 FPS is ideal for competitive play." },
    { question: "What causes low FPS?", answer: "Usually a weak GPU at high resolution or quality settings." },
  ],
  formula: "Estimated FPS = min(GPU Score / (Res x Quality x 100), CPU Score / 40)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingMonitorInputLagCalculator: CalculatorDefinition = {
  slug: "gaming-monitor-input-lag-calculator",
  title: "Gaming Monitor Input Lag Calculator",
  description: "Calculate total input lag for your gaming setup including monitor response time, refresh rate delay, and system processing latency to optimize competitive gameplay.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gaming monitor input lag","display latency calculator","monitor response time","gaming delay estimator"],
  variants: [{
    id: "standard",
    name: "Gaming Monitor Input Lag",
    description: "Calculate total input lag for your gaming setup including monitor response time, refresh rate delay, and system processing latency to optimize competitive gameplay.",
    fields: [
      { name: "refreshRate", label: "Monitor Refresh Rate (Hz)", type: "number", min: 30, max: 500, defaultValue: 144 },
      { name: "responseTime", label: "Response Time (ms)", type: "number", min: 0.5, max: 25, defaultValue: 4 },
      { name: "systemLatency", label: "System Processing Latency (ms)", type: "number", min: 1, max: 100, defaultValue: 15 },
      { name: "vsync", label: "V-Sync Enabled", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "On" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const refreshRate = inputs.refreshRate as number;
    const responseTime = inputs.responseTime as number;
    const systemLatency = inputs.systemLatency as number;
    const vsync = parseInt(inputs.vsync as string);
    const frameDuration = 1000 / refreshRate;
    const vsyncPenalty = vsync === 1 ? frameDuration : 0;
    const totalLag = responseTime + frameDuration + systemLatency + vsyncPenalty;
    const rating = totalLag < 20 ? "Excellent" : totalLag < 40 ? "Good" : totalLag < 60 ? "Average" : "Noticeable lag";
    return {
      primary: { label: "Total Input Lag", value: formatNumber(Math.round(totalLag * 10) / 10) + " ms" },
      details: [
        { label: "Frame Duration", value: formatNumber(Math.round(frameDuration * 100) / 100) + " ms" },
        { label: "V-Sync Penalty", value: formatNumber(Math.round(vsyncPenalty * 100) / 100) + " ms" },
        { label: "Response Time", value: formatNumber(responseTime) + " ms" },
        { label: "Rating", value: rating }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-fps-calculator","gaming-monitor-size-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Frame Duration = 1000 / Refresh Rate
V-Sync Penalty = Frame Duration (if enabled, else 0)
Total Input Lag = Response Time + Frame Duration + System Latency + V-Sync Penalty",
};

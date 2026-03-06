import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const videoRenderTimeEstimatorCalculator: CalculatorDefinition = {
  slug: "video-render-time-estimator",
  title: "Video Render Time Estimator",
  description: "Estimate video rendering and export time based on project settings, hardware, and complexity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["video render time","export time calculator","rendering speed","video encoding time"],
  variants: [{
    id: "standard",
    name: "Video Render Time Estimator",
    description: "Estimate video rendering and export time based on project settings, hardware, and complexity.",
    fields: [
      { name: "duration", label: "Project Duration (minutes)", type: "number", min: 1, max: 300, defaultValue: 10 },
      { name: "resolution", label: "Output Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "2", label: "4K" }, { value: "3", label: "6K" }, { value: "4", label: "8K" }], defaultValue: "2" },
      { name: "complexity", label: "Project Complexity", type: "select", options: [{ value: "1", label: "Simple (cuts only)" }, { value: "2", label: "Moderate (color + transitions)" }, { value: "3", label: "Complex (VFX + compositing)" }, { value: "4", label: "Heavy VFX (3D + particles)" }], defaultValue: "2" },
      { name: "hardware", label: "Hardware Tier", type: "select", options: [{ value: "1", label: "Entry (integrated GPU)" }, { value: "2", label: "Mid-range (dedicated GPU)" }, { value: "3", label: "High-end (RTX 4080+)" }, { value: "4", label: "Workstation (multi-GPU)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const duration = inputs.duration as number;
    const res = parseInt(inputs.resolution as string);
    const complexity = parseInt(inputs.complexity as string);
    const hardware = parseInt(inputs.hardware as string);
    const resMultiplier = [0, 1, 3, 6, 12][res];
    const complexMultiplier = [0, 1, 2.5, 5, 10][complexity];
    const hwSpeed = [0, 0.3, 1, 2.5, 5][hardware];
    const renderMinutes = Math.round(duration * resMultiplier * complexMultiplier / hwSpeed);
    const renderHours = Math.floor(renderMinutes / 60);
    const renderMins = renderMinutes % 60;
    const renderTimeStr = renderHours > 0 ? renderHours + "h " + renderMins + "m" : renderMins + " minutes";
    const ratio = Math.round(renderMinutes / duration * 10) / 10;
    return {
      primary: { label: "Estimated Render Time", value: renderTimeStr },
      details: [
        { label: "Render Time (minutes)", value: formatNumber(renderMinutes) },
        { label: "Render-to-Real Ratio", value: formatNumber(ratio) + ":1" },
        { label: "Project Duration", value: formatNumber(duration) + " min" },
        { label: "Effective Speed", value: ratio <= 1 ? "Faster than real-time" : formatNumber(ratio) + "x slower than real-time" }
      ]
    };
  },
  }],
  relatedSlugs: ["video-bitrate-estimator","video-storage-estimator"],
  faq: [
    { question: "Why does rendering take so long?", answer: "Rendering processes every frame individually, applying effects, color grading, and compression. A 10-minute 4K video at 30fps has 18,000 frames to process." },
    { question: "Does GPU matter for video rendering?", answer: "Yes, significantly. A dedicated GPU can speed up rendering by 3-10x compared to CPU-only rendering, especially for effects-heavy projects." },
    { question: "How can I speed up rendering?", answer: "Use proxy editing, enable GPU acceleration, render at lower resolution for previews, and close other applications during export." },
  ],
  formula: "Render Time = Duration x Resolution Multiplier x Complexity Multiplier / Hardware Speed; Render Ratio = Render Time / Project Duration",
};

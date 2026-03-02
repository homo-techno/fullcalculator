import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dataTransferTimeCalculator: CalculatorDefinition = {
  slug: "data-transfer-time-calculator",
  title: "Data Transfer Time Calculator",
  description: "Estimate file transfer time based on size and speed.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["data transfer time","file transfer calculator"],
  variants: [{
    id: "standard",
    name: "Data Transfer Time",
    description: "Estimate file transfer time based on size and speed.",
    fields: [
      { name: "fileSize", label: "File Size (GB)", type: "number", min: 0.01, max: 100000, defaultValue: 10 },
      { name: "speed", label: "Transfer Speed (Mbps)", type: "number", min: 1, max: 100000, defaultValue: 100 },
      { name: "overhead", label: "Protocol Overhead (%)", type: "number", min: 0, max: 50, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const size = inputs.fileSize as number;
      const speed = inputs.speed as number;
      const overhead = inputs.overhead as number;
      if (!size || !speed) return null;
      const effectiveSpeed = speed * (1 - overhead / 100);
      const sizeMb = size * 1024 * 8;
      const seconds = Math.round(sizeMb / effectiveSpeed * 10) / 10;
      const minutes = Math.round(seconds / 60 * 10) / 10;
      const hours = Math.round(seconds / 3600 * 100) / 100;
      return {
        primary: { label: "Transfer Time", value: seconds < 120 ? formatNumber(seconds) + " sec" : formatNumber(minutes) + " min" },
        details: [
          { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed)) + " Mbps" },
          { label: "File Size", value: formatNumber(size) + " GB" },
          { label: "Hours", value: formatNumber(hours) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Why is my transfer slower than the rated speed?", answer: "Protocol overhead and network congestion reduce real throughput." },
    { question: "What is Mbps vs MBps?", answer: "Mbps is megabits per second. MBps is megabytes. Divide Mbps by 8 for MBps." },
  ],
  formula: "Time = (File Size in Mb) / Effective Speed",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const downloadTimeCalculator: CalculatorDefinition = {
  slug: "download-time-calculator",
  title: "Download Time Calculator",
  description: "Free download time calculator. Estimate download or upload time based on file size and internet speed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["download time calculator", "upload time calculator", "file transfer time", "bandwidth calculator", "internet speed"],
  variants: [
    {
      id: "time",
      name: "Calculate Download Time",
      fields: [
        { name: "size", label: "File Size", type: "number", placeholder: "e.g. 4.7" },
        {
          name: "sizeUnit", label: "Size Unit", type: "select",
          options: [
            { label: "MB", value: "MB" }, { label: "GB", value: "GB" },
            { label: "TB", value: "TB" }, { label: "KB", value: "KB" },
          ],
        },
        { name: "speed", label: "Speed", type: "number", placeholder: "e.g. 100" },
        {
          name: "speedUnit", label: "Speed Unit", type: "select",
          options: [
            { label: "Mbps", value: "Mbps" }, { label: "MB/s", value: "MBs" },
            { label: "Gbps", value: "Gbps" }, { label: "Kbps", value: "Kbps" },
          ],
        },
      ],
      calculate: (inputs) => {
        const size = inputs.size as number, speed = inputs.speed as number;
        const sizeUnit = (inputs.sizeUnit as string) || "GB";
        const speedUnit = (inputs.speedUnit as string) || "Mbps";
        if (!size || !speed) return null;
        const sizeMultipliers: Record<string, number> = { KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 };
        const speedMultipliers: Record<string, number> = { Kbps: 1000/8, Mbps: 1000000/8, Gbps: 1000000000/8, MBs: 1000000 };
        const bytes = size * (sizeMultipliers[sizeUnit] || sizeMultipliers.GB);
        const bytesPerSec = speed * (speedMultipliers[speedUnit] || speedMultipliers.Mbps);
        const seconds = bytes / bytesPerSec;
        let timeStr: string;
        if (seconds < 60) timeStr = `${formatNumber(seconds, 1)} seconds`;
        else if (seconds < 3600) timeStr = `${formatNumber(seconds / 60, 1)} minutes`;
        else timeStr = `${formatNumber(seconds / 3600, 2)} hours`;
        return {
          primary: { label: "Download Time", value: timeStr },
          details: [
            { label: "Total seconds", value: formatNumber(seconds, 1) },
            { label: "File size", value: `${size} ${sizeUnit}` },
            { label: "Speed", value: `${speed} ${speedUnit}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["data-storage-calculator", "speed-calculator", "time-duration-calculator"],
  faq: [{ question: "How is download time calculated?", answer: "Time = File Size / Speed. Note: Internet speeds are in bits (Mbps), while files are in bytes (MB). 1 byte = 8 bits. A 1 GB file at 100 Mbps: 1024×8/100 ≈ 82 seconds." }],
  formula: "Time = File Size (bytes) / Speed (bytes/sec)",
};

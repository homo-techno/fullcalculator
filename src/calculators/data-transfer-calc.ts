import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dataTransferCalculator: CalculatorDefinition = {
  slug: "data-transfer-calc",
  title: "Data Transfer Time Calculator",
  description:
    "Free data transfer time calculator. Estimate download and upload times based on file size and connection speed. Supports all common speed units.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "data transfer calculator",
    "download time calculator",
    "upload time",
    "file transfer speed",
    "bandwidth calculator",
    "internet speed",
    "transfer time estimator",
  ],
  variants: [
    {
      id: "transfer-time",
      name: "Transfer Time Calculator",
      description: "Calculate time to transfer a file at a given speed",
      fields: [
        {
          name: "fileSize",
          label: "File Size",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "sizeUnit",
          label: "Size Unit",
          type: "select",
          options: [
            { label: "KB (Kilobytes)", value: "KB" },
            { label: "MB (Megabytes)", value: "MB" },
            { label: "GB (Gigabytes)", value: "GB" },
            { label: "TB (Terabytes)", value: "TB" },
          ],
          defaultValue: "GB",
        },
        {
          name: "speed",
          label: "Connection Speed",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "speedUnit",
          label: "Speed Unit",
          type: "select",
          options: [
            { label: "Mbps (Megabits/s)", value: "Mbps" },
            { label: "Gbps (Gigabits/s)", value: "Gbps" },
            { label: "MB/s (Megabytes/s)", value: "MBps" },
            { label: "KB/s (Kilobytes/s)", value: "KBps" },
          ],
          defaultValue: "Mbps",
        },
      ],
      calculate: (inputs) => {
        const fileSize = parseFloat(inputs.fileSize as string);
        const sizeUnit = inputs.sizeUnit as string;
        const speed = parseFloat(inputs.speed as string);
        const speedUnit = inputs.speedUnit as string;
        if (isNaN(fileSize) || isNaN(speed) || fileSize <= 0 || speed <= 0) return null;

        // Convert file size to bytes
        const sizeMultipliers: Record<string, number> = {
          "KB": 1024,
          "MB": 1024 * 1024,
          "GB": 1024 * 1024 * 1024,
          "TB": 1024 * 1024 * 1024 * 1024,
        };
        const bytes = fileSize * (sizeMultipliers[sizeUnit] || 1);

        // Convert speed to bytes per second
        const speedMultipliers: Record<string, number> = {
          "Mbps": 1000000 / 8,
          "Gbps": 1000000000 / 8,
          "MBps": 1000000,
          "KBps": 1000,
        };
        const bytesPerSec = speed * (speedMultipliers[speedUnit] || 1);

        const totalSeconds = bytes / bytesPerSec;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        let timeStr = "";
        if (hours > 0) timeStr += hours + "h ";
        if (minutes > 0) timeStr += minutes + "m ";
        timeStr += seconds + "s";

        return {
          primary: {
            label: "Transfer Time",
            value: timeStr.trim(),
          },
          details: [
            { label: "Total Seconds", value: formatNumber(totalSeconds, 1) + "s" },
            { label: "File Size", value: formatNumber(fileSize) + " " + sizeUnit },
            { label: "Effective Speed", value: formatNumber(bytesPerSec / (1024 * 1024), 2) + " MB/s" },
            { label: "File Size (bytes)", value: formatNumber(bytes) },
          ],
        };
      },
    },
    {
      id: "speed-compare",
      name: "Speed Comparison",
      description: "Compare transfer times across different connection speeds",
      fields: [
        {
          name: "fileSize",
          label: "File Size (GB)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "connectionType",
          label: "Connection Type",
          type: "select",
          options: [
            { label: "3G Mobile (5 Mbps)", value: "5" },
            { label: "4G LTE (25 Mbps)", value: "25" },
            { label: "5G (200 Mbps)", value: "200" },
            { label: "Cable Internet (100 Mbps)", value: "100" },
            { label: "Fiber (500 Mbps)", value: "500" },
            { label: "Gigabit Fiber (1 Gbps)", value: "1000" },
            { label: "USB 2.0 (480 Mbps)", value: "480" },
            { label: "USB 3.0 (5 Gbps)", value: "5000" },
            { label: "Thunderbolt 3 (40 Gbps)", value: "40000" },
          ],
          defaultValue: "100",
        },
      ],
      calculate: (inputs) => {
        const fileSizeGB = parseFloat(inputs.fileSize as string);
        const speedMbps = parseFloat(inputs.connectionType as string);
        if (isNaN(fileSizeGB) || isNaN(speedMbps) || fileSizeGB <= 0 || speedMbps <= 0) return null;

        const bytes = fileSizeGB * 1024 * 1024 * 1024;
        const bytesPerSec = speedMbps * 1000000 / 8;
        const totalSeconds = bytes / bytesPerSec;

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        let timeStr = "";
        if (hours > 0) timeStr += hours + "h ";
        if (minutes > 0) timeStr += minutes + "m ";
        timeStr += seconds + "s";

        // Also show with overhead (realistic ~80% efficiency)
        const realSeconds = totalSeconds / 0.8;
        const rHours = Math.floor(realSeconds / 3600);
        const rMinutes = Math.floor((realSeconds % 3600) / 60);
        const rSeconds = Math.floor(realSeconds % 60);
        let realTimeStr = "";
        if (rHours > 0) realTimeStr += rHours + "h ";
        if (rMinutes > 0) realTimeStr += rMinutes + "m ";
        realTimeStr += rSeconds + "s";

        return {
          primary: {
            label: "Theoretical Transfer Time",
            value: timeStr.trim(),
          },
          details: [
            { label: "Realistic Time (~80% eff.)", value: realTimeStr.trim() },
            { label: "Speed", value: formatNumber(speedMbps) + " Mbps" },
            { label: "Throughput", value: formatNumber(bytesPerSec / (1024 * 1024), 2) + " MB/s" },
            { label: "File Size", value: formatNumber(fileSizeGB) + " GB" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["data-storage-calculator", "speed-calculator", "subnet-calculator"],
  faq: [
    {
      question: "What is the difference between Mbps and MB/s?",
      answer:
        "Mbps is megabits per second (used for internet speed). MB/s is megabytes per second (used for file transfers). 1 byte = 8 bits, so divide Mbps by 8 to get MB/s. For example, 100 Mbps = 12.5 MB/s.",
    },
    {
      question: "Why are my actual transfer speeds slower than advertised?",
      answer:
        "Real-world speeds are typically 60-80% of advertised speed due to protocol overhead, network congestion, server limitations, and shared bandwidth. Wi-Fi adds additional overhead compared to wired connections.",
    },
    {
      question: "How long does it take to download 1 GB?",
      answer:
        "At 10 Mbps: ~13 minutes. At 50 Mbps: ~2.7 minutes. At 100 Mbps: ~1.3 minutes. At 1 Gbps: ~8 seconds. These are theoretical maximums; actual times will be longer.",
    },
  ],
  formula:
    "Transfer Time = File Size (bytes) / Speed (bytes/s) | 1 Byte = 8 bits | 1 MB = 1,048,576 bytes",
};

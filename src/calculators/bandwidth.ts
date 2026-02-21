import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bandwidthCalculator: CalculatorDefinition = {
  slug: "bandwidth-calculator",
  title: "Bandwidth Calculator",
  description: "Free bandwidth calculator. Calculate file transfer time based on file size and connection speed. Accounts for the 8 bits per byte conversion.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bandwidth", "transfer time", "download", "upload", "speed", "Mbps", "file size", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate Transfer Time",
      fields: [
        { name: "fileSize", label: "File Size", type: "number", placeholder: "e.g. 700" },
        { name: "sizeUnit", label: "Size Unit", type: "select", options: [
          { label: "MB (Megabytes)", value: "MB" },
          { label: "GB (Gigabytes)", value: "GB" },
        ]},
        { name: "speed", label: "Connection Speed (Mbps)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const fileSize = inputs.fileSize as number;
        const sizeUnit = (inputs.sizeUnit as string) || "MB";
        const speed = inputs.speed as number;
        if (!fileSize || !speed) return null;
        const fileSizeMB = sizeUnit === "GB" ? fileSize * 1024 : fileSize;
        // 1 byte = 8 bits; speed is in megabits per second
        const fileSizeBits = fileSizeMB * 1024 * 1024 * 8;
        const speedBps = speed * 1e6;
        const transferTimeSec = fileSizeBits / speedBps;
        const hours = Math.floor(transferTimeSec / 3600);
        const minutes = Math.floor((transferTimeSec % 3600) / 60);
        const seconds = Math.round(transferTimeSec % 60);
        let timeStr = "";
        if (hours > 0) timeStr += `${hours}h `;
        if (minutes > 0 || hours > 0) timeStr += `${minutes}m `;
        timeStr += `${seconds}s`;
        return {
          primary: { label: "Transfer Time", value: timeStr.trim() },
          details: [
            { label: "File Size", value: `${formatNumber(fileSizeMB, 2)} MB (${formatNumber(fileSizeMB / 1024, 3)} GB)` },
            { label: "Connection Speed", value: `${formatNumber(speed, 2)} Mbps` },
            { label: "Effective throughput", value: `${formatNumber(speed / 8, 2)} MB/s` },
            { label: "Transfer time (seconds)", value: formatNumber(transferTimeSec, 2) },
            { label: "Note", value: "1 byte = 8 bits. Actual time may vary due to overhead and network conditions." },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["video-bitrate-calculator", "audio-bitrate-calculator"],
  faq: [
    { question: "Why is my download slower than my connection speed?", answer: "Connection speed is measured in megabits per second (Mbps), but file sizes are in megabytes (MB). Since 1 byte = 8 bits, divide your speed by 8 to get MB/s. Network overhead also reduces effective speed." },
    { question: "How long to download 1 GB at 100 Mbps?", answer: "At 100 Mbps, downloading 1 GB takes approximately 82 seconds (1 min 22 sec), since the effective rate is about 12.5 MB/s." },
  ],
  formula: "Transfer time (seconds) = (file size in MB × 1,048,576 × 8) / (speed in Mbps × 1,000,000). Note: 1 byte = 8 bits.",
};

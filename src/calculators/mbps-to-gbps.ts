import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mbpsToGbpsConverter: CalculatorDefinition = {
  slug: "mbps-to-gbps-converter",
  title: "Mbps to Gbps Converter",
  description: "Free Mbps to Gbps converter. Convert megabits per second to gigabits per second. Includes MB/s, GB/s, and download time estimates.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["mbps to gbps", "megabits to gigabits", "internet speed converter", "bandwidth converter", "network speed converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Mbps to Gbps",
      fields: [
        { name: "value", label: "Speed (Mbps)", type: "number", placeholder: "e.g. 1000" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Mbps to Gbps", value: "mbps_to_gbps" },
          { label: "Gbps to Mbps", value: "gbps_to_mbps" },
        ], defaultValue: "mbps_to_gbps" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        if (direction === "gbps_to_mbps") {
          const mbps = value * 1000;
          const mbytesPerSec = mbps / 8;
          const downloadTime1gb = (1024 * 8) / mbps;
          return {
            primary: { label: `${formatNumber(value, 3)} Gbps`, value: `${formatNumber(mbps, 0)} Mbps` },
            details: [
              { label: "Megabits/sec (Mbps)", value: formatNumber(mbps, 2) },
              { label: "Megabytes/sec (MB/s)", value: formatNumber(mbytesPerSec, 2) },
              { label: "Gigabytes/sec (GB/s)", value: formatNumber(mbytesPerSec / 1024, 4) },
              { label: "Kilobits/sec (Kbps)", value: formatNumber(mbps * 1000, 0) },
              { label: "1 GB download time", value: `${formatNumber(downloadTime1gb, 1)} seconds` },
            ],
          };
        }
        const gbps = value / 1000;
        const mbytesPerSec = value / 8;
        const downloadTime1gb = (1024 * 8) / value;
        return {
          primary: { label: `${formatNumber(value, 0)} Mbps`, value: `${formatNumber(gbps, 4)} Gbps` },
          details: [
            { label: "Gigabits/sec (Gbps)", value: formatNumber(gbps, 4) },
            { label: "Megabytes/sec (MB/s)", value: formatNumber(mbytesPerSec, 2) },
            { label: "Gigabytes/sec (GB/s)", value: formatNumber(mbytesPerSec / 1024, 6) },
            { label: "Kilobits/sec (Kbps)", value: formatNumber(value * 1000, 0) },
            { label: "1 GB download time", value: `${formatNumber(downloadTime1gb, 1)} seconds` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["data-storage-calculator", "unit-converter", "subnet-calculator"],
  faq: [
    { question: "How do I convert Mbps to Gbps?", answer: "Divide Mbps by 1,000. For example, 1000 Mbps = 1 Gbps. Note: Mbps (megabits per second) and MB/s (megabytes per second) are different. 1 byte = 8 bits, so 1000 Mbps = 125 MB/s." },
    { question: "What is the difference between Mbps and MB/s?", answer: "Mbps (megabits per second) measures network speed in bits. MB/s (megabytes per second) measures data transfer in bytes. Since 1 byte = 8 bits, divide Mbps by 8 to get MB/s. A 100 Mbps connection transfers 12.5 MB/s." },
  ],
  formula: "1 Gbps = 1,000 Mbps | 1 Mbps = 0.001 Gbps | 1 byte = 8 bits | 1 Gbps = 125 MB/s",
};

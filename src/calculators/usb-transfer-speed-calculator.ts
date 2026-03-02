import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usbTransferSpeedCalculator: CalculatorDefinition = {
  slug: "usb-transfer-speed-calculator",
  title: "USB Transfer Speed Calculator",
  description: "Calculate file transfer times over USB connections based on USB version, file size, and real-world speed factors.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["usb transfer speed","file transfer time usb","usb 3.0 speed","usb copy time","data transfer usb"],
  variants: [{
    id: "standard",
    name: "USB Transfer Speed",
    description: "Calculate file transfer times over USB connections based on USB version, file size, and real-world speed factors.",
    fields: [
      { name: "fileSize", label: "File Size (GB)", type: "number", min: 0.01, max: 10000, defaultValue: 10 },
      { name: "usbVersion", label: "USB Version", type: "select", options: [{ value: "60", label: "USB 2.0 (480 Mbps)" }, { value: "625", label: "USB 3.0 (5 Gbps)" }, { value: "1250", label: "USB 3.1 (10 Gbps)" }, { value: "2500", label: "USB 3.2 (20 Gbps)" }, { value: "5000", label: "USB 4.0 (40 Gbps)" }], defaultValue: "625" },
      { name: "efficiency", label: "Real-World Efficiency (%)", type: "number", min: 20, max: 100, defaultValue: 60 },
      { name: "numFiles", label: "Number of Files", type: "number", min: 1, max: 1000000, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const fileSizeGB = inputs.fileSize as number;
    const maxSpeedMBps = inputs.usbVersion as number;
    const efficiency = inputs.efficiency as number / 100;
    const numFiles = inputs.numFiles as number;
    const realSpeedMBps = maxSpeedMBps * efficiency;
    const fileSizeMB = fileSizeGB * 1024;
    const overhead = numFiles > 1 ? numFiles * 0.002 : 0;
    const transferTime = (fileSizeMB / realSpeedMBps) + overhead;
    const hours = Math.floor(transferTime / 3600);
    const minutes = Math.floor((transferTime % 3600) / 60);
    const seconds = Math.round(transferTime % 60);
    const timeStr = hours > 0 ? hours + "h " + minutes + "m " + seconds + "s" : minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";
    return {
      primary: { label: "Transfer Time", value: timeStr },
      details: [
        { label: "Real-World Speed", value: formatNumber(Math.round(realSpeedMBps)) + " MB/s" },
        { label: "Max Theoretical Speed", value: formatNumber(Math.round(maxSpeedMBps)) + " MB/s" },
        { label: "Total Data", value: formatNumber(Math.round(fileSizeMB)) + " MB" },
        { label: "File Overhead", value: formatNumber(Math.round(overhead * 100) / 100) + " seconds" }
      ]
    };
  },
  }],
  relatedSlugs: ["data-transfer-time-calculator","ssd-cost-per-gb-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Transfer Time = (File Size in MB / Real Speed in MB/s) + File Overhead
Real Speed = Max Speed x Efficiency %
File Overhead = Number of Files x 0.002 seconds",
};

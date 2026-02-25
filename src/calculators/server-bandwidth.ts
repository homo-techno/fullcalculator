import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const serverBandwidthCalculator: CalculatorDefinition = {
  slug: "server-bandwidth-calculator",
  title: "Server Bandwidth Calculator",
  description: "Free server bandwidth calculator. Estimate monthly bandwidth requirements based on page views, page size, and redundancy. Plan hosting capacity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["server bandwidth calculator", "bandwidth estimator", "hosting bandwidth", "website bandwidth", "data transfer calculator"],
  variants: [
    {
      id: "website-bandwidth",
      name: "Website Bandwidth",
      description: "Estimate bandwidth for a website based on traffic",
      fields: [
        { name: "pageViews", label: "Daily Page Views", type: "number", placeholder: "e.g. 10000", min: 1 },
        { name: "avgPageSize", label: "Avg Page Size (KB)", type: "number", placeholder: "e.g. 2048", min: 1, defaultValue: 2048 },
        { name: "redundancy", label: "Redundancy Factor", type: "select", options: [
          { label: "None (1x)", value: "1" },
          { label: "Low (1.3x)", value: "1.3" },
          { label: "Medium (1.5x)", value: "1.5" },
          { label: "High (2x)", value: "2" },
        ], defaultValue: "1.5" },
      ],
      calculate: (inputs) => {
        const pageViews = inputs.pageViews as number;
        const avgPageSize = inputs.avgPageSize as number;
        const redundancy = parseFloat(inputs.redundancy as string) || 1.5;
        if (!pageViews || !avgPageSize) return null;

        const dailyBandwidthKB = pageViews * avgPageSize * redundancy;
        const dailyBandwidthGB = dailyBandwidthKB / 1048576;
        const monthlyBandwidthGB = dailyBandwidthGB * 30;
        const monthlyBandwidthTB = monthlyBandwidthGB / 1024;

        // Peak bandwidth (assume 4x average during peak hours)
        const peakBandwidthMbps = (dailyBandwidthKB * 4 * 8) / (86400 * 1024);
        const avgBandwidthMbps = (dailyBandwidthKB * 8) / (86400 * 1024);

        return {
          primary: { label: "Monthly Bandwidth", value: monthlyBandwidthTB >= 1 ? `${formatNumber(monthlyBandwidthTB, 2)} TB` : `${formatNumber(monthlyBandwidthGB, 1)} GB` },
          details: [
            { label: "Daily Bandwidth", value: `${formatNumber(dailyBandwidthGB, 2)} GB` },
            { label: "Monthly Bandwidth", value: `${formatNumber(monthlyBandwidthGB, 1)} GB` },
            { label: "Monthly Bandwidth", value: `${formatNumber(monthlyBandwidthTB, 3)} TB` },
            { label: "Avg Throughput Needed", value: `${formatNumber(avgBandwidthMbps, 2)} Mbps` },
            { label: "Peak Throughput (4x avg)", value: `${formatNumber(peakBandwidthMbps, 2)} Mbps` },
            { label: "Daily Page Views", value: formatNumber(pageViews, 0) },
            { label: "Avg Page Size", value: `${formatNumber(avgPageSize, 0)} KB` },
            { label: "Redundancy Factor", value: `${redundancy}x` },
          ],
        };
      },
    },
    {
      id: "streaming-bandwidth",
      name: "Streaming/Download Bandwidth",
      description: "Estimate bandwidth for file downloads or streaming",
      fields: [
        { name: "concurrentUsers", label: "Concurrent Users", type: "number", placeholder: "e.g. 500", min: 1 },
        { name: "bitrate", label: "Stream Bitrate (Mbps)", type: "select", options: [
          { label: "Audio (0.32 Mbps)", value: "0.32" },
          { label: "SD Video (2 Mbps)", value: "2" },
          { label: "HD 720p (5 Mbps)", value: "5" },
          { label: "HD 1080p (8 Mbps)", value: "8" },
          { label: "4K Video (25 Mbps)", value: "25" },
        ], defaultValue: "5" },
        { name: "hoursPerDay", label: "Avg Streaming Hours/Day", type: "number", placeholder: "e.g. 4", min: 0.1, defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const concurrentUsers = inputs.concurrentUsers as number;
        const bitrate = parseFloat(inputs.bitrate as string) || 5;
        const hoursPerDay = (inputs.hoursPerDay as number) || 4;
        if (!concurrentUsers) return null;

        const peakBandwidthMbps = concurrentUsers * bitrate;
        const peakBandwidthGbps = peakBandwidthMbps / 1000;
        const dailyDataGB = (concurrentUsers * bitrate * hoursPerDay * 3600) / (8 * 1024);
        const monthlyDataTB = (dailyDataGB * 30) / 1024;

        return {
          primary: { label: "Peak Bandwidth Needed", value: peakBandwidthGbps >= 1 ? `${formatNumber(peakBandwidthGbps, 2)} Gbps` : `${formatNumber(peakBandwidthMbps, 0)} Mbps` },
          details: [
            { label: "Peak Bandwidth", value: `${formatNumber(peakBandwidthMbps, 0)} Mbps` },
            { label: "Peak Bandwidth", value: `${formatNumber(peakBandwidthGbps, 2)} Gbps` },
            { label: "Daily Data Transfer", value: `${formatNumber(dailyDataGB, 1)} GB` },
            { label: "Monthly Data Transfer", value: `${formatNumber(monthlyDataTB, 2)} TB` },
            { label: "Concurrent Users", value: formatNumber(concurrentUsers, 0) },
            { label: "Bitrate per User", value: `${bitrate} Mbps` },
            { label: "Streaming Hours/Day", value: `${hoursPerDay} hrs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["throughput-calculator", "network-latency-calculator", "api-rate-limit-calculator"],
  faq: [
    { question: "How much bandwidth does a website need?", answer: "A small blog with 1,000 daily visitors and 2MB pages needs ~60 GB/month. A medium site with 50,000 daily visitors needs ~3 TB/month. Always add 30-50% redundancy for traffic spikes, bots, and API calls that are not counted in page views." },
    { question: "What is the difference between bandwidth and data transfer?", answer: "Bandwidth is the maximum throughput capacity (measured in Mbps/Gbps), while data transfer is the total amount of data moved over a period (measured in GB/TB per month). Think of bandwidth as pipe width and data transfer as total water flow." },
  ],
  formula: "Monthly Bandwidth = Daily Page Views x Avg Page Size x Redundancy x 30",
};

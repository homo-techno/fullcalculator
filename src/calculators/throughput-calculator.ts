import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const throughputCalculator: CalculatorDefinition = {
  slug: "throughput-calculator",
  title: "Network Throughput Calculator",
  description: "Free network throughput calculator. Calculate effective throughput, TCP window size impact, and file transfer times across different network conditions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["throughput calculator", "network throughput", "bandwidth throughput", "tcp throughput", "file transfer time"],
  variants: [
    {
      id: "effective-throughput",
      name: "Effective Throughput",
      description: "Calculate effective throughput considering overhead and efficiency",
      fields: [
        { name: "bandwidth", label: "Link Bandwidth (Mbps)", type: "number", placeholder: "e.g. 100", min: 0.1 },
        { name: "overhead", label: "Protocol Overhead", type: "select", options: [
          { label: "Minimal (5% - UDP)", value: "5" },
          { label: "Low (10% - TCP)", value: "10" },
          { label: "Medium (15% - TCP + TLS)", value: "15" },
          { label: "High (25% - VPN/Tunnel)", value: "25" },
        ], defaultValue: "10" },
        { name: "utilization", label: "Link Utilization (%)", type: "number", placeholder: "e.g. 70", min: 1, max: 100, defaultValue: 70 },
      ],
      calculate: (inputs) => {
        const bandwidth = inputs.bandwidth as number;
        const overhead = parseFloat(inputs.overhead as string) || 10;
        const utilization = (inputs.utilization as number) || 70;
        if (!bandwidth) return null;

        const effectiveBandwidth = bandwidth * (1 - overhead / 100) * (utilization / 100);
        const effectiveMBps = effectiveBandwidth / 8;

        // Transfer times for common sizes
        const time1GB = (1024 / effectiveMBps);
        const time10GB = (10240 / effectiveMBps);
        const time100GB = (102400 / effectiveMBps);

        const formatTime = (seconds: number) => {
          if (seconds >= 3600) return `${formatNumber(seconds / 3600, 1)} hours`;
          if (seconds >= 60) return `${formatNumber(seconds / 60, 1)} minutes`;
          return `${formatNumber(seconds, 1)} seconds`;
        };

        return {
          primary: { label: "Effective Throughput", value: `${formatNumber(effectiveBandwidth, 2)} Mbps` },
          details: [
            { label: "Raw Bandwidth", value: `${formatNumber(bandwidth, 0)} Mbps` },
            { label: "Protocol Overhead", value: `${overhead}%` },
            { label: "Link Utilization", value: `${utilization}%` },
            { label: "Effective Throughput", value: `${formatNumber(effectiveBandwidth, 2)} Mbps` },
            { label: "Effective Transfer Rate", value: `${formatNumber(effectiveMBps, 2)} MB/s` },
            { label: "Time to Transfer 1 GB", value: formatTime(time1GB) },
            { label: "Time to Transfer 10 GB", value: formatTime(time10GB) },
            { label: "Time to Transfer 100 GB", value: formatTime(time100GB) },
          ],
        };
      },
    },
    {
      id: "tcp-window",
      name: "TCP Window Throughput",
      description: "Calculate max TCP throughput based on window size and RTT",
      fields: [
        { name: "windowSize", label: "TCP Window Size (KB)", type: "select", options: [
          { label: "16 KB (Legacy)", value: "16" },
          { label: "64 KB (Default)", value: "64" },
          { label: "256 KB", value: "256" },
          { label: "1024 KB (1 MB)", value: "1024" },
          { label: "4096 KB (4 MB)", value: "4096" },
        ], defaultValue: "64" },
        { name: "rtt", label: "Round-Trip Time (ms)", type: "number", placeholder: "e.g. 50", min: 0.1, defaultValue: 50 },
        { name: "linkBandwidth", label: "Link Bandwidth (Mbps)", type: "number", placeholder: "e.g. 1000", min: 0.1, defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const windowSize = parseFloat(inputs.windowSize as string) || 64;
        const rtt = inputs.rtt as number;
        const linkBandwidth = (inputs.linkBandwidth as number) || 1000;
        if (!rtt) return null;

        const windowBytes = windowSize * 1024;
        const rttSeconds = rtt / 1000;
        const maxThroughputBps = (windowBytes * 8) / rttSeconds;
        const maxThroughputMbps = maxThroughputBps / 1000000;
        const effectiveThroughput = Math.min(maxThroughputMbps, linkBandwidth);
        const bottleneck = maxThroughputMbps < linkBandwidth ? "TCP Window Size" : "Link Bandwidth";
        const bandwidthDelayProduct = (linkBandwidth * 1000000 * rttSeconds) / 8;
        const optimalWindowKB = bandwidthDelayProduct / 1024;

        return {
          primary: { label: "Max TCP Throughput", value: `${formatNumber(effectiveThroughput, 2)} Mbps` },
          details: [
            { label: "TCP Window Size", value: `${windowSize} KB` },
            { label: "Round-Trip Time", value: `${rtt} ms` },
            { label: "Max Window Throughput", value: `${formatNumber(maxThroughputMbps, 2)} Mbps` },
            { label: "Link Bandwidth", value: `${formatNumber(linkBandwidth, 0)} Mbps` },
            { label: "Effective Throughput", value: `${formatNumber(effectiveThroughput, 2)} Mbps` },
            { label: "Bottleneck", value: bottleneck },
            { label: "Bandwidth-Delay Product", value: `${formatNumber(bandwidthDelayProduct / 1024, 2)} KB` },
            { label: "Optimal Window Size", value: `${formatNumber(optimalWindowKB, 0)} KB` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["network-latency-calculator", "server-bandwidth-calculator", "api-rate-limit-calculator"],
  faq: [
    { question: "Why is my actual throughput lower than my bandwidth?", answer: "Actual throughput is always less than raw bandwidth due to protocol overhead (TCP/IP headers, TLS encryption), link utilization limits, TCP window size constraints, packet loss causing retransmissions, and contention with other traffic. Typical efficiency is 60-80% of raw bandwidth." },
    { question: "What is the bandwidth-delay product?", answer: "The bandwidth-delay product (BDP) is the maximum amount of data 'in flight' on a network connection: BDP = Bandwidth x RTT. The TCP window size must be at least as large as the BDP to fully utilize the link. A 100 Mbps link with 50ms RTT has a BDP of 625 KB." },
  ],
  formula: "Effective Throughput = Bandwidth x (1 - Overhead%) x Utilization% | TCP Max = Window Size / RTT",
};

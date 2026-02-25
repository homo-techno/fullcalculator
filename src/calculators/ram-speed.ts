import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ramSpeedCalculator: CalculatorDefinition = {
  slug: "ram-speed-calculator",
  title: "RAM Speed Calculator",
  description: "Free RAM speed calculator. Calculate memory bandwidth, latency in nanoseconds, and compare DDR4 vs DDR5 performance characteristics.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ram speed calculator", "memory bandwidth", "ram latency", "ddr4 vs ddr5", "memory speed calculator"],
  variants: [
    {
      id: "bandwidth",
      name: "Memory Bandwidth",
      description: "Calculate theoretical memory bandwidth from clock speed and configuration",
      fields: [
        { name: "clockSpeed", label: "Memory Clock (MHz)", type: "number", placeholder: "e.g. 3200", min: 100 },
        { name: "ddrType", label: "DDR Type", type: "select", options: [
          { label: "DDR3", value: "3" },
          { label: "DDR4", value: "4" },
          { label: "DDR5", value: "5" },
        ], defaultValue: "4" },
        { name: "channels", label: "Memory Channels", type: "select", options: [
          { label: "Single Channel", value: "1" },
          { label: "Dual Channel", value: "2" },
          { label: "Quad Channel", value: "4" },
          { label: "Hexa Channel", value: "6" },
          { label: "Octa Channel", value: "8" },
        ], defaultValue: "2" },
        { name: "busWidth", label: "Bus Width (bits)", type: "select", options: [
          { label: "32-bit", value: "32" },
          { label: "64-bit", value: "64" },
        ], defaultValue: "64" },
      ],
      calculate: (inputs) => {
        const clockSpeed = inputs.clockSpeed as number;
        const ddrType = inputs.ddrType as string;
        const channels = parseInt(inputs.channels as string) || 2;
        const busWidth = parseInt(inputs.busWidth as string) || 64;
        if (!clockSpeed) return null;

        // DDR effective rate is 2x clock for DDR3/4, still 2x base for DDR5
        const transferRate = clockSpeed; // MT/s = MHz for DDR
        const bytesPerTransfer = busWidth / 8;
        const bandwidthPerChannel = (transferRate * bytesPerTransfer) / 1000; // GB/s
        const totalBandwidth = bandwidthPerChannel * channels;

        // Base clock (actual clock)
        const baseClock = clockSpeed / 2;

        return {
          primary: { label: "Total Bandwidth", value: `${formatNumber(totalBandwidth, 2)} GB/s` },
          details: [
            { label: "DDR Type", value: `DDR${ddrType}` },
            { label: "Transfer Rate", value: `${formatNumber(clockSpeed, 0)} MT/s` },
            { label: "Base Clock", value: `${formatNumber(baseClock, 0)} MHz` },
            { label: "Bus Width", value: `${busWidth}-bit` },
            { label: "Channels", value: `${channels}` },
            { label: "Bandwidth per Channel", value: `${formatNumber(bandwidthPerChannel, 2)} GB/s` },
            { label: "Total Bandwidth", value: `${formatNumber(totalBandwidth, 2)} GB/s` },
            { label: "Total Bandwidth (MB/s)", value: `${formatNumber(totalBandwidth * 1000, 0)} MB/s` },
          ],
        };
      },
    },
    {
      id: "latency",
      name: "RAM Latency (ns)",
      description: "Convert CAS latency to nanoseconds",
      fields: [
        { name: "casLatency", label: "CAS Latency (CL)", type: "number", placeholder: "e.g. 16", min: 1, defaultValue: 16 },
        { name: "clockSpeed", label: "Memory Speed (MT/s)", type: "number", placeholder: "e.g. 3200", min: 100, defaultValue: 3200 },
      ],
      calculate: (inputs) => {
        const cas = inputs.casLatency as number;
        const clockSpeed = inputs.clockSpeed as number;
        if (!cas || !clockSpeed) return null;

        const baseClock = clockSpeed / 2;
        const cycletime = 1000 / baseClock; // ns per cycle
        const latencyNs = cas * cycletime;

        // Common comparisons
        const ddr4_3200_cl16 = 16 * (1000 / 1600);
        const ddr5_6000_cl30 = 30 * (1000 / 3000);

        return {
          primary: { label: "True Latency", value: `${formatNumber(latencyNs, 2)} ns` },
          details: [
            { label: "CAS Latency", value: `CL${cas}` },
            { label: "Memory Speed", value: `${formatNumber(clockSpeed, 0)} MT/s` },
            { label: "Base Clock", value: `${formatNumber(baseClock, 0)} MHz` },
            { label: "Cycle Time", value: `${formatNumber(cycletime, 3)} ns` },
            { label: "True Latency", value: `${formatNumber(latencyNs, 2)} ns` },
            { label: "Reference: DDR4-3200 CL16", value: `${formatNumber(ddr4_3200_cl16, 2)} ns` },
            { label: "Reference: DDR5-6000 CL30", value: `${formatNumber(ddr5_6000_cl30, 2)} ns` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cpu-benchmark-comparison", "data-storage-converter", "container-resources-calculator"],
  faq: [
    { question: "How is memory bandwidth calculated?", answer: "Memory bandwidth = Transfer Rate (MT/s) x Bus Width (bytes) x Channels. DDR4-3200 with dual-channel 64-bit = 3200 x 8 x 2 = 51.2 GB/s. Higher transfer rates and more channels increase bandwidth linearly." },
    { question: "Is lower CAS latency always better?", answer: "Not necessarily. True latency (in nanoseconds) depends on both CAS latency and clock speed: True Latency = CL / (Clock/2) x 1000. DDR4-3200 CL16 (10ns) is faster than DDR4-2400 CL12 (10ns) despite higher CL because the higher clock compensates. Always compare true latency in nanoseconds." },
  ],
  formula: "Bandwidth = Transfer Rate x Bus Width x Channels | Latency (ns) = CL / (Clock/2) x 1000",
};

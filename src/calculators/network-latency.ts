import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const networkLatencyCalculator: CalculatorDefinition = {
  slug: "network-latency-calculator",
  title: "Network Latency Calculator",
  description: "Free network latency calculator. Estimate round-trip time, total request latency, and the impact of latency on application performance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["network latency calculator", "latency estimator", "round trip time", "RTT calculator", "ping time calculator"],
  variants: [
    {
      id: "request-latency",
      name: "Request Latency",
      description: "Estimate total request latency including network and processing time",
      fields: [
        { name: "distance", label: "Distance (km)", type: "number", placeholder: "e.g. 5000", min: 1 },
        { name: "medium", label: "Transmission Medium", type: "select", options: [
          { label: "Fiber Optic (200,000 km/s)", value: "200000" },
          { label: "Copper Cable (231,000 km/s)", value: "231000" },
          { label: "Wireless (300,000 km/s)", value: "300000" },
        ], defaultValue: "200000" },
        { name: "hops", label: "Network Hops", type: "number", placeholder: "e.g. 10", min: 0, defaultValue: 10 },
        { name: "hopDelay", label: "Avg Delay per Hop (ms)", type: "number", placeholder: "e.g. 0.5", min: 0, step: 0.1, defaultValue: 0.5 },
        { name: "serverProcessing", label: "Server Processing Time (ms)", type: "number", placeholder: "e.g. 50", min: 0, defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const medium = parseFloat(inputs.medium as string) || 200000;
        const hops = (inputs.hops as number) || 0;
        const hopDelay = (inputs.hopDelay as number) || 0.5;
        const serverProcessing = (inputs.serverProcessing as number) || 0;
        if (!distance) return null;

        const propagationOneWay = (distance / medium) * 1000; // ms
        const propagationRTT = propagationOneWay * 2;
        const routingDelay = hops * hopDelay * 2; // RTT
        const totalRTT = propagationRTT + routingDelay;
        const totalWithProcessing = totalRTT + serverProcessing;

        // TLS handshake adds 1-2 RTTs
        const tlsHandshake = totalRTT * 1.5;
        const firstRequestTotal = totalRTT + tlsHandshake + serverProcessing;

        return {
          primary: { label: "Total Request Latency", value: `${formatNumber(totalWithProcessing, 1)} ms` },
          details: [
            { label: "Propagation Delay (one-way)", value: `${formatNumber(propagationOneWay, 2)} ms` },
            { label: "Propagation RTT", value: `${formatNumber(propagationRTT, 2)} ms` },
            { label: "Routing Delay (RTT)", value: `${formatNumber(routingDelay, 2)} ms` },
            { label: "Network RTT", value: `${formatNumber(totalRTT, 2)} ms` },
            { label: "Server Processing", value: `${formatNumber(serverProcessing, 0)} ms` },
            { label: "Total Latency", value: `${formatNumber(totalWithProcessing, 1)} ms` },
            { label: "TLS Handshake (est.)", value: `${formatNumber(tlsHandshake, 1)} ms` },
            { label: "First HTTPS Request", value: `${formatNumber(firstRequestTotal, 1)} ms` },
          ],
        };
      },
    },
    {
      id: "latency-impact",
      name: "Latency Impact",
      description: "Estimate how latency impacts sequential operations",
      fields: [
        { name: "rtt", label: "Round-Trip Time (ms)", type: "number", placeholder: "e.g. 50", min: 0.1 },
        { name: "sequentialRequests", label: "Sequential Requests", type: "number", placeholder: "e.g. 10", min: 1, defaultValue: 10 },
        { name: "processingPerRequest", label: "Processing per Request (ms)", type: "number", placeholder: "e.g. 20", min: 0, defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const rtt = inputs.rtt as number;
        const sequentialRequests = (inputs.sequentialRequests as number) || 1;
        const processingPerRequest = (inputs.processingPerRequest as number) || 0;
        if (!rtt) return null;

        const totalLatency = sequentialRequests * (rtt + processingPerRequest);
        const networkOnlyTime = sequentialRequests * rtt;
        const processingOnlyTime = sequentialRequests * processingPerRequest;
        const networkPercent = (networkOnlyTime / totalLatency) * 100;

        // If requests could be parallelized
        const parallelTime = rtt + processingPerRequest;
        const speedup = totalLatency / parallelTime;

        return {
          primary: { label: "Total Sequential Time", value: `${formatNumber(totalLatency, 0)} ms` },
          details: [
            { label: "Total Time (sequential)", value: `${formatNumber(totalLatency, 0)} ms` },
            { label: "Network Time", value: `${formatNumber(networkOnlyTime, 0)} ms` },
            { label: "Processing Time", value: `${formatNumber(processingOnlyTime, 0)} ms` },
            { label: "Network % of Total", value: `${formatNumber(networkPercent, 1)}%` },
            { label: "If Fully Parallelized", value: `${formatNumber(parallelTime, 0)} ms` },
            { label: "Parallel Speedup", value: `${formatNumber(speedup, 1)}x` },
            { label: "Time Saved if Parallel", value: `${formatNumber(totalLatency - parallelTime, 0)} ms` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["throughput-calculator", "server-bandwidth-calculator", "uptime-calculator"],
  faq: [
    { question: "What causes network latency?", answer: "Latency comes from propagation delay (speed of light through fiber/copper), routing delays (processing at each network hop), serialization delay (time to push bits onto the wire), and queuing delay (waiting in router buffers). Physical distance is often the dominant factor -- light in fiber travels at ~200,000 km/s." },
    { question: "What is a good latency for web applications?", answer: "Under 100ms RTT feels instant. 100-300ms is noticeable but acceptable. Over 500ms feels slow. Google recommends server response under 200ms. For real-time apps (gaming, video calls), under 50ms is ideal. Use CDNs and edge computing to reduce latency for distant users." },
  ],
  formula: "RTT = 2 x (Distance / Speed) + Hop Delays | Total = RTT + Server Processing",
};

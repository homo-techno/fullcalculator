import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const containerResourcesCalculator: CalculatorDefinition = {
  slug: "container-resources-calculator",
  title: "Container Resource Calculator",
  description: "Free container resource calculator. Estimate CPU and memory requests/limits for Kubernetes pods and Docker containers. Plan cluster capacity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["container resources calculator", "kubernetes calculator", "docker resources", "pod sizing", "k8s capacity planning"],
  variants: [
    {
      id: "pod-resources",
      name: "Pod Resource Sizing",
      description: "Calculate resource requests and limits for Kubernetes pods",
      fields: [
        { name: "avgCpuMillicores", label: "Avg CPU Usage (millicores)", type: "number", placeholder: "e.g. 250", min: 1, defaultValue: 250 },
        { name: "peakCpuMillicores", label: "Peak CPU Usage (millicores)", type: "number", placeholder: "e.g. 800", min: 1, defaultValue: 800 },
        { name: "avgMemoryMB", label: "Avg Memory Usage (MB)", type: "number", placeholder: "e.g. 256", min: 1, defaultValue: 256 },
        { name: "peakMemoryMB", label: "Peak Memory Usage (MB)", type: "number", placeholder: "e.g. 512", min: 1, defaultValue: 512 },
        { name: "replicas", label: "Number of Replicas", type: "number", placeholder: "e.g. 3", min: 1, defaultValue: 3 },
        { name: "headroom", label: "Headroom", type: "select", options: [
          { label: "Tight (10%)", value: "1.1" },
          { label: "Normal (25%)", value: "1.25" },
          { label: "Comfortable (50%)", value: "1.5" },
          { label: "Generous (100%)", value: "2" },
        ], defaultValue: "1.25" },
      ],
      calculate: (inputs) => {
        const avgCpu = inputs.avgCpuMillicores as number;
        const peakCpu = inputs.peakCpuMillicores as number;
        const avgMem = inputs.avgMemoryMB as number;
        const peakMem = inputs.peakMemoryMB as number;
        const replicas = (inputs.replicas as number) || 1;
        const headroom = parseFloat(inputs.headroom as string) || 1.25;
        if (!avgCpu || !peakCpu || !avgMem || !peakMem) return null;

        // Requests = average usage with headroom
        const cpuRequest = Math.ceil(avgCpu * headroom);
        const memRequest = Math.ceil(avgMem * headroom);

        // Limits = peak usage with headroom
        const cpuLimit = Math.ceil(peakCpu * headroom);
        const memLimit = Math.ceil(peakMem * headroom);

        // Total cluster resources needed
        const totalCpuRequest = cpuRequest * replicas;
        const totalMemRequest = memRequest * replicas;
        const totalCpuLimit = cpuLimit * replicas;
        const totalMemLimit = memLimit * replicas;

        // Convert to vCPUs
        const totalCpuCores = totalCpuRequest / 1000;

        return {
          primary: { label: "Per Pod", value: `${cpuRequest}m CPU, ${memRequest}Mi RAM` },
          details: [
            { label: "CPU Request (per pod)", value: `${cpuRequest}m` },
            { label: "CPU Limit (per pod)", value: `${cpuLimit}m` },
            { label: "Memory Request (per pod)", value: `${memRequest}Mi` },
            { label: "Memory Limit (per pod)", value: `${memLimit}Mi` },
            { label: "Replicas", value: formatNumber(replicas, 0) },
            { label: "Total CPU Request", value: `${totalCpuRequest}m (${formatNumber(totalCpuCores, 2)} cores)` },
            { label: "Total CPU Limit", value: `${totalCpuLimit}m` },
            { label: "Total Memory Request", value: `${formatNumber(totalMemRequest, 0)} Mi (${formatNumber(totalMemRequest / 1024, 2)} Gi)` },
            { label: "Total Memory Limit", value: `${formatNumber(totalMemLimit, 0)} Mi (${formatNumber(totalMemLimit / 1024, 2)} Gi)` },
          ],
        };
      },
    },
    {
      id: "cluster-capacity",
      name: "Cluster Capacity Planning",
      description: "Calculate how many pods fit on a cluster",
      fields: [
        { name: "nodeCount", label: "Number of Nodes", type: "number", placeholder: "e.g. 3", min: 1, defaultValue: 3 },
        { name: "nodeCpuCores", label: "CPU Cores per Node", type: "number", placeholder: "e.g. 4", min: 1, defaultValue: 4 },
        { name: "nodeMemGB", label: "RAM per Node (GB)", type: "number", placeholder: "e.g. 16", min: 1, defaultValue: 16 },
        { name: "systemReserved", label: "System Reserved (%)", type: "number", placeholder: "e.g. 15", min: 0, max: 50, defaultValue: 15 },
        { name: "podCpuMillicores", label: "CPU Request per Pod (m)", type: "number", placeholder: "e.g. 250", min: 1, defaultValue: 250 },
        { name: "podMemMB", label: "Memory Request per Pod (MB)", type: "number", placeholder: "e.g. 256", min: 1, defaultValue: 256 },
      ],
      calculate: (inputs) => {
        const nodeCount = (inputs.nodeCount as number) || 3;
        const nodeCpuCores = (inputs.nodeCpuCores as number) || 4;
        const nodeMemGB = (inputs.nodeMemGB as number) || 16;
        const systemReserved = (inputs.systemReserved as number) || 15;
        const podCpu = (inputs.podCpuMillicores as number) || 250;
        const podMem = (inputs.podMemMB as number) || 256;

        const totalCpuMillicores = nodeCount * nodeCpuCores * 1000;
        const totalMemMB = nodeCount * nodeMemGB * 1024;
        const availableCpu = totalCpuMillicores * (1 - systemReserved / 100);
        const availableMem = totalMemMB * (1 - systemReserved / 100);

        const maxPodsByCpu = Math.floor(availableCpu / podCpu);
        const maxPodsByMem = Math.floor(availableMem / podMem);
        const maxPods = Math.min(maxPodsByCpu, maxPodsByMem);
        const bottleneck = maxPodsByCpu < maxPodsByMem ? "CPU" : "Memory";

        const cpuUtilIfMaxPods = (maxPods * podCpu / totalCpuMillicores) * 100;
        const memUtilIfMaxPods = (maxPods * podMem / totalMemMB) * 100;

        return {
          primary: { label: "Max Pods", value: `${formatNumber(maxPods, 0)} pods` },
          details: [
            { label: "Nodes", value: formatNumber(nodeCount, 0) },
            { label: "Total CPU", value: `${formatNumber(totalCpuMillicores, 0)}m (${formatNumber(nodeCpuCores * nodeCount, 0)} cores)` },
            { label: "Total Memory", value: `${formatNumber(totalMemMB / 1024, 1)} GB` },
            { label: "Available CPU (after system)", value: `${formatNumber(availableCpu, 0)}m` },
            { label: "Available Memory (after system)", value: `${formatNumber(availableMem / 1024, 1)} GB` },
            { label: "Max Pods (CPU limited)", value: formatNumber(maxPodsByCpu, 0) },
            { label: "Max Pods (Memory limited)", value: formatNumber(maxPodsByMem, 0) },
            { label: "Max Pods (actual)", value: formatNumber(maxPods, 0) },
            { label: "Bottleneck", value: bottleneck },
            { label: "CPU Utilization at Max", value: `${formatNumber(cpuUtilIfMaxPods, 1)}%` },
            { label: "Memory Utilization at Max", value: `${formatNumber(memUtilIfMaxPods, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cloud-cost-calculator", "cpu-benchmark-comparison", "ram-speed-calculator"],
  faq: [
    { question: "What is the difference between requests and limits?", answer: "Requests are the guaranteed resources a container gets -- the scheduler uses requests to place pods on nodes. Limits are the maximum resources a container can use. If a container exceeds its memory limit, it is OOM-killed. If it exceeds CPU limit, it is throttled. Set requests to average usage and limits to peak usage." },
    { question: "How should I size my containers?", answer: "Start by monitoring actual usage in staging/production. Set requests to the 90th percentile of normal usage plus 20-25% headroom. Set limits to observed peak usage plus 25-50% buffer. Under-requesting wastes cluster resources. Under-limiting causes noisy neighbor issues. Over-limiting causes unnecessary OOM kills." },
  ],
  formula: "Request = Avg Usage x Headroom | Limit = Peak Usage x Headroom | Max Pods = min(Available CPU / Pod CPU, Available Mem / Pod Mem)",
};

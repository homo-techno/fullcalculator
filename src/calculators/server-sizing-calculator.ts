import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const serverSizingCalculator: CalculatorDefinition = {
  slug: "server-sizing-calculator",
  title: "Server Sizing Calculator",
  description: "Estimate server hardware specifications needed based on workload type, users, and performance requirements.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["server sizing", "server specs calculator", "server requirements estimator"],
  variants: [{
    id: "standard",
    name: "Server Sizing",
    description: "Estimate server hardware specifications needed based on workload type, users, and performance requirements",
    fields: [
      { name: "workload", label: "Primary Workload Type", type: "select", options: [{value:"web",label:"Web Server"},{value:"database",label:"Database Server"},{value:"app",label:"Application Server"},{value:"ml",label:"Machine Learning"}], defaultValue: "web" },
      { name: "users", label: "Expected Concurrent Users", type: "number", suffix: "users", min: 10, max: 1000000, step: 100, defaultValue: 1000 },
      { name: "availability", label: "Availability Requirement", type: "select", options: [{value:"standard",label:"Standard (99.9%)"},{value:"high",label:"High (99.99%)"},{value:"critical",label:"Mission Critical (99.999%)"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const workload = inputs.workload as string;
      const users = inputs.users as number;
      const availability = inputs.availability as string;
      if (!users || users <= 0) return null;
      const cpuPerUser: Record<string, number> = { web: 0.01, database: 0.05, app: 0.03, ml: 0.1 };
      const ramPerUser: Record<string, number> = { web: 0.005, database: 0.02, app: 0.01, ml: 0.05 };
      const availMod: Record<string, number> = { standard: 1.0, high: 1.5, critical: 2.0 };
      const mod = availMod[availability] || 1.0;
      const cpuCores = Math.max(2, Math.ceil(users * (cpuPerUser[workload] || 0.03) * mod));
      const ramGB = Math.max(4, Math.ceil(users * (ramPerUser[workload] || 0.01) * mod));
      const servers = availability === "critical" ? 3 : availability === "high" ? 2 : 1;
      return {
        primary: { label: "Recommended CPU Cores", value: formatNumber(cpuCores) + " vCPU" },
        details: [
          { label: "Recommended RAM", value: formatNumber(ramGB) + " GB" },
          { label: "Minimum Server Count", value: formatNumber(servers) + (servers > 1 ? " (with redundancy)" : "") },
          { label: "Workload Type", value: workload === "ml" ? "Machine Learning" : workload.charAt(0).toUpperCase() + workload.slice(1) },
        ],
      };
    },
  }],
  relatedSlugs: ["cloud-cost-calculator", "bandwidth-calculator"],
  faq: [
    { question: "How do I determine what server I need?", answer: "Server sizing depends on your workload type, expected concurrent users, performance requirements, and availability needs. Start with estimated resource usage per user and scale accordingly." },
    { question: "Should I use one large server or multiple smaller ones?", answer: "For most production workloads, multiple smaller servers with load balancing provide better reliability and scalability than a single large server, even if the total cost is slightly higher." },
  ],
  formula: "CPU Cores = Concurrent Users x CPU per User x Availability Modifier",
};

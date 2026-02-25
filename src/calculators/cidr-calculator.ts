import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cidrCalculator: CalculatorDefinition = {
  slug: "cidr-notation-calculator",
  title: "CIDR Notation Calculator",
  description: "Free CIDR notation calculator. Convert between CIDR notation and IP ranges, calculate supernets, and determine the smallest CIDR block for a given number of hosts.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["CIDR calculator", "CIDR notation", "CIDR to IP range", "supernet calculator", "classless routing"],
  variants: [
    {
      id: "cidr-details",
      name: "CIDR Block Details",
      description: "Get full details for a CIDR notation block",
      fields: [
        { name: "ip1", label: "IP Octet 1", type: "number", placeholder: "10", min: 0, max: 255 },
        { name: "ip2", label: "IP Octet 2", type: "number", placeholder: "0", min: 0, max: 255 },
        { name: "ip3", label: "IP Octet 3", type: "number", placeholder: "0", min: 0, max: 255 },
        { name: "ip4", label: "IP Octet 4", type: "number", placeholder: "0", min: 0, max: 255 },
        { name: "cidr", label: "CIDR Prefix Length", type: "number", placeholder: "8", min: 0, max: 32, defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const o1 = inputs.ip1 as number;
        const o2 = inputs.ip2 as number;
        const o3 = inputs.ip3 as number;
        const o4 = inputs.ip4 as number;
        const cidr = inputs.cidr as number;
        if (o1 === undefined || o2 === undefined || o3 === undefined || o4 === undefined) return null;
        if (cidr < 0 || cidr > 32) return null;

        const ip = ((o1 << 24) | (o2 << 16) | (o3 << 8) | o4) >>> 0;
        const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const network = (ip & mask) >>> 0;
        const broadcast = (network | ~mask) >>> 0;
        const totalAddresses = Math.pow(2, 32 - cidr);
        const usableHosts = cidr <= 30 ? totalAddresses - 2 : cidr === 31 ? 2 : 1;

        const toIp = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

        // Determine equivalent class
        let classEquiv = "";
        if (cidr === 8) classEquiv = "Class A (/8)";
        else if (cidr === 16) classEquiv = "Class B (/16)";
        else if (cidr === 24) classEquiv = "Class C (/24)";
        else classEquiv = "Classless";

        // Number of /24s, /16s contained
        const num24s = cidr <= 24 ? Math.pow(2, 24 - cidr) : 0;
        const num16s = cidr <= 16 ? Math.pow(2, 16 - cidr) : 0;

        return {
          primary: { label: "CIDR Block", value: `${toIp(network)}/${cidr}` },
          details: [
            { label: "Network Address", value: toIp(network) },
            { label: "Broadcast Address", value: toIp(broadcast) },
            { label: "Subnet Mask", value: toIp(mask) },
            { label: "Total Addresses", value: formatNumber(totalAddresses, 0) },
            { label: "Usable Hosts", value: formatNumber(usableHosts, 0) },
            { label: "IP Range", value: `${toIp(network)} - ${toIp(broadcast)}` },
            { label: "Classful Equivalent", value: classEquiv },
            { label: "Contains /24 blocks", value: num24s > 0 ? formatNumber(num24s, 0) : "N/A (smaller than /24)" },
            { label: "Contains /16 blocks", value: num16s > 0 ? formatNumber(num16s, 0) : "N/A (smaller than /16)" },
          ],
        };
      },
    },
    {
      id: "hosts-to-cidr",
      name: "Hosts to CIDR",
      description: "Find the smallest CIDR block that fits a given number of hosts",
      fields: [
        { name: "hosts", label: "Required Hosts", type: "number", placeholder: "e.g. 500", min: 1 },
      ],
      calculate: (inputs) => {
        const hosts = inputs.hosts as number;
        if (!hosts || hosts < 1) return null;

        // Find smallest CIDR that fits the required hosts
        let cidr = 32;
        for (let i = 32; i >= 0; i--) {
          const available = i <= 30 ? Math.pow(2, 32 - i) - 2 : i === 31 ? 2 : 1;
          if (available >= hosts) {
            cidr = i;
          } else {
            break;
          }
        }

        const totalAddresses = Math.pow(2, 32 - cidr);
        const usableHosts = cidr <= 30 ? totalAddresses - 2 : cidr === 31 ? 2 : 1;
        const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const toIp = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;
        const wastedAddresses = usableHosts - hosts;

        return {
          primary: { label: "Required CIDR", value: `/${cidr}` },
          details: [
            { label: "CIDR Notation", value: `/${cidr}` },
            { label: "Subnet Mask", value: toIp(mask) },
            { label: "Required Hosts", value: formatNumber(hosts, 0) },
            { label: "Available Hosts", value: formatNumber(usableHosts, 0) },
            { label: "Total Addresses", value: formatNumber(totalAddresses, 0) },
            { label: "Wasted Addresses", value: formatNumber(wastedAddresses, 0) },
            { label: "Utilization", value: `${((hosts / usableHosts) * 100).toFixed(1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["subnet-calculator", "subnet-mask-calculator", "ip-range-calculator"],
  faq: [
    { question: "What is CIDR notation?", answer: "CIDR (Classless Inter-Domain Routing) notation represents an IP address and its associated network mask. Written as IP/prefix (e.g., 192.168.1.0/24), the prefix indicates how many leading bits define the network portion. It replaced classful addressing to allow more flexible allocation of IP addresses." },
    { question: "How do I choose the right CIDR block?", answer: "Choose the smallest CIDR block that fits your required hosts. For 100 hosts, /25 gives 126 usable. For 500 hosts, /23 gives 510 usable. Always plan for growth -- typically allocate 20-50% more addresses than currently needed." },
  ],
  formula: "Usable Hosts = 2^(32-CIDR) - 2 | Total Addresses = 2^(32-CIDR)",
};

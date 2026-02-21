import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subnetCalculator: CalculatorDefinition = {
  slug: "subnet-calculator",
  title: "Subnet Calculator",
  description: "Free subnet calculator. Calculate network address, broadcast address, host range, and number of usable hosts from IP address and CIDR notation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["subnet calculator", "CIDR calculator", "subnet mask calculator", "IP calculator", "network calculator"],
  variants: [
    {
      id: "cidr",
      name: "CIDR / Subnet Mask",
      description: "Calculate subnet details from a CIDR prefix length (e.g., /24)",
      fields: [
        { name: "ip1", label: "IP Octet 1", type: "number", placeholder: "e.g. 192", min: 0, max: 255 },
        { name: "ip2", label: "IP Octet 2", type: "number", placeholder: "e.g. 168", min: 0, max: 255 },
        { name: "ip3", label: "IP Octet 3", type: "number", placeholder: "e.g. 1", min: 0, max: 255 },
        { name: "ip4", label: "IP Octet 4", type: "number", placeholder: "e.g. 0", min: 0, max: 255 },
        { name: "cidr", label: "CIDR Prefix (e.g. 24)", type: "number", placeholder: "e.g. 24", min: 0, max: 32, defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const o1 = inputs.ip1 as number;
        const o2 = inputs.ip2 as number;
        const o3 = inputs.ip3 as number;
        const o4 = inputs.ip4 as number;
        const cidr = (inputs.cidr as number) ?? 24;
        if (o1 === undefined || o2 === undefined || o3 === undefined || o4 === undefined) return null;
        if (o1 < 0 || o1 > 255 || o2 < 0 || o2 > 255 || o3 < 0 || o3 > 255 || o4 < 0 || o4 > 255) return null;
        if (cidr < 0 || cidr > 32) return null;

        const ip = ((o1 << 24) | (o2 << 16) | (o3 << 8) | o4) >>> 0;
        const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const network = (ip & mask) >>> 0;
        const broadcast = (network | ~mask) >>> 0;
        const firstHost = cidr < 31 ? (network + 1) >>> 0 : network;
        const lastHost = cidr < 31 ? (broadcast - 1) >>> 0 : broadcast;
        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = cidr <= 30 ? totalHosts - 2 : cidr === 31 ? 2 : 1;

        const toIp = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

        return {
          primary: { label: `${toIp(ip)}/${cidr}`, value: `${formatNumber(usableHosts, 0)} usable hosts` },
          details: [
            { label: "Network address", value: toIp(network) },
            { label: "Broadcast address", value: toIp(broadcast) },
            { label: "Subnet mask", value: toIp(mask) },
            { label: "First usable host", value: toIp(firstHost) },
            { label: "Last usable host", value: toIp(lastHost) },
            { label: "Total addresses", value: formatNumber(totalHosts, 0) },
            { label: "Usable hosts", value: formatNumber(usableHosts, 0) },
            { label: "CIDR notation", value: `/${cidr}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-hex-converter", "scientific-calculator"],
  faq: [
    { question: "What is a subnet mask?", answer: "A subnet mask divides an IP address into network and host portions. For example, 255.255.255.0 (/24) means the first 24 bits are the network address, and the last 8 bits identify hosts. This allows 254 usable host addresses." },
    { question: "What is CIDR notation?", answer: "CIDR (Classless Inter-Domain Routing) notation like /24 indicates how many bits of the IP address are used for the network portion. /24 = 255.255.255.0, /16 = 255.255.0.0, /8 = 255.0.0.0." },
  ],
  formula: "Usable Hosts = 2^(32-CIDR) - 2 | Network = IP AND Mask | Broadcast = Network OR NOT Mask",
};

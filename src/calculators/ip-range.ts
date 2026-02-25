import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ipRangeCalculator: CalculatorDefinition = {
  slug: "ip-range-calculator",
  title: "IP Address Range Calculator",
  description: "Free IP address range calculator. Calculate the first and last IP addresses in a subnet, total hosts, and usable host range from any IP and CIDR.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ip range calculator", "ip address range", "subnet host range", "first last ip", "ip range finder"],
  variants: [
    {
      id: "ip-range",
      name: "IP Range from CIDR",
      description: "Calculate the full IP range for a given IP address and CIDR prefix",
      fields: [
        { name: "ip1", label: "IP Octet 1", type: "number", placeholder: "192", min: 0, max: 255 },
        { name: "ip2", label: "IP Octet 2", type: "number", placeholder: "168", min: 0, max: 255 },
        { name: "ip3", label: "IP Octet 3", type: "number", placeholder: "1", min: 0, max: 255 },
        { name: "ip4", label: "IP Octet 4", type: "number", placeholder: "0", min: 0, max: 255 },
        { name: "cidr", label: "CIDR Prefix", type: "number", placeholder: "24", min: 0, max: 32, defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const o1 = inputs.ip1 as number;
        const o2 = inputs.ip2 as number;
        const o3 = inputs.ip3 as number;
        const o4 = inputs.ip4 as number;
        const cidr = inputs.cidr as number;
        if (o1 === undefined || o2 === undefined || o3 === undefined || o4 === undefined) return null;
        if (o1 < 0 || o1 > 255 || o2 < 0 || o2 > 255 || o3 < 0 || o3 > 255 || o4 < 0 || o4 > 255) return null;
        if (cidr < 0 || cidr > 32) return null;

        const ip = ((o1 << 24) | (o2 << 16) | (o3 << 8) | o4) >>> 0;
        const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const network = (ip & mask) >>> 0;
        const broadcast = (network | ~mask) >>> 0;
        const firstHost = cidr < 31 ? (network + 1) >>> 0 : network;
        const lastHost = cidr < 31 ? (broadcast - 1) >>> 0 : broadcast;
        const totalAddresses = Math.pow(2, 32 - cidr);
        const usableHosts = cidr <= 30 ? totalAddresses - 2 : cidr === 31 ? 2 : 1;

        const toIp = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

        let ipType = "Private";
        if (o1 === 10) ipType = "Private (Class A)";
        else if (o1 === 172 && o2 >= 16 && o2 <= 31) ipType = "Private (Class B)";
        else if (o1 === 192 && o2 === 168) ipType = "Private (Class C)";
        else if (o1 === 127) ipType = "Loopback";
        else if (o1 >= 224 && o1 <= 239) ipType = "Multicast";
        else ipType = "Public";

        return {
          primary: { label: "IP Range", value: `${toIp(network)} - ${toIp(broadcast)}` },
          details: [
            { label: "Network Address", value: toIp(network) },
            { label: "Broadcast Address", value: toIp(broadcast) },
            { label: "First Usable Host", value: toIp(firstHost) },
            { label: "Last Usable Host", value: toIp(lastHost) },
            { label: "Total Addresses", value: formatNumber(totalAddresses, 0) },
            { label: "Usable Hosts", value: formatNumber(usableHosts, 0) },
            { label: "Subnet Mask", value: toIp(mask) },
            { label: "IP Type", value: ipType },
          ],
        };
      },
    },
    {
      id: "two-ip-range",
      name: "Range Between Two IPs",
      description: "Count the number of IP addresses between two given IP addresses",
      fields: [
        { name: "startIp1", label: "Start IP Octet 1", type: "number", placeholder: "192", min: 0, max: 255 },
        { name: "startIp2", label: "Start IP Octet 2", type: "number", placeholder: "168", min: 0, max: 255 },
        { name: "startIp3", label: "Start IP Octet 3", type: "number", placeholder: "1", min: 0, max: 255 },
        { name: "startIp4", label: "Start IP Octet 4", type: "number", placeholder: "1", min: 0, max: 255 },
        { name: "endIp1", label: "End IP Octet 1", type: "number", placeholder: "192", min: 0, max: 255 },
        { name: "endIp2", label: "End IP Octet 2", type: "number", placeholder: "168", min: 0, max: 255 },
        { name: "endIp3", label: "End IP Octet 3", type: "number", placeholder: "1", min: 0, max: 255 },
        { name: "endIp4", label: "End IP Octet 4", type: "number", placeholder: "254", min: 0, max: 255 },
      ],
      calculate: (inputs) => {
        const s1 = inputs.startIp1 as number;
        const s2 = inputs.startIp2 as number;
        const s3 = inputs.startIp3 as number;
        const s4 = inputs.startIp4 as number;
        const e1 = inputs.endIp1 as number;
        const e2 = inputs.endIp2 as number;
        const e3 = inputs.endIp3 as number;
        const e4 = inputs.endIp4 as number;
        if (s1 === undefined || s2 === undefined || s3 === undefined || s4 === undefined) return null;
        if (e1 === undefined || e2 === undefined || e3 === undefined || e4 === undefined) return null;

        const startIp = ((s1 << 24) | (s2 << 16) | (s3 << 8) | s4) >>> 0;
        const endIp = ((e1 << 24) | (e2 << 16) | (e3 << 8) | e4) >>> 0;
        const count = endIp >= startIp ? endIp - startIp + 1 : startIp - endIp + 1;

        return {
          primary: { label: "Total IPs in Range", value: formatNumber(count, 0) },
          details: [
            { label: "Start IP", value: `${s1}.${s2}.${s3}.${s4}` },
            { label: "End IP", value: `${e1}.${e2}.${e3}.${e4}` },
            { label: "IP Count", value: formatNumber(count, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["subnet-calculator", "subnet-mask-calculator", "binary-hex-converter"],
  faq: [
    { question: "What is an IP address range?", answer: "An IP address range is the set of all IP addresses between a starting and ending address within a subnet. For example, 192.168.1.0/24 has a range from 192.168.1.0 (network) to 192.168.1.255 (broadcast), with usable hosts 192.168.1.1 to 192.168.1.254." },
    { question: "What is the difference between total addresses and usable hosts?", answer: "Total addresses include the network address and broadcast address. Usable hosts exclude those two reserved addresses. A /24 subnet has 256 total addresses but only 254 usable hosts." },
  ],
  formula: "Range = Broadcast - Network + 1 | Usable Hosts = 2^(32-CIDR) - 2",
};

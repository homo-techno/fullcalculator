import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subnetMaskCalculator: CalculatorDefinition = {
  slug: "subnet-mask-calculator",
  title: "Subnet Mask Calculator",
  description: "Free subnet mask calculator. Determine the subnet mask from CIDR prefix length, calculate wildcard mask, network class, and address details.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["subnet mask calculator", "subnet mask", "CIDR to subnet mask", "wildcard mask", "network mask calculator"],
  variants: [
    {
      id: "cidr-to-mask",
      name: "CIDR to Subnet Mask",
      description: "Convert CIDR prefix length to subnet mask and wildcard mask",
      fields: [
        { name: "cidr", label: "CIDR Prefix Length", type: "number", placeholder: "e.g. 24", min: 0, max: 32, defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const cidr = inputs.cidr as number;
        if (cidr === undefined || cidr < 0 || cidr > 32) return null;

        const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const wildcard = (~mask) >>> 0;
        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = cidr <= 30 ? totalHosts - 2 : cidr === 31 ? 2 : 1;

        const toIp = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

        const toBinary = (n: number) => {
          const parts: string[] = [];
          for (let i = 3; i >= 0; i--) {
            parts.push(((n >>> (i * 8)) & 255).toString(2).padStart(8, "0"));
          }
          return parts.join(".");
        };

        let networkClass = "Classless";
        if (cidr >= 1 && cidr <= 8) networkClass = "Class A (large networks)";
        else if (cidr >= 9 && cidr <= 16) networkClass = "Class B (medium networks)";
        else if (cidr >= 17 && cidr <= 24) networkClass = "Class C (small networks)";
        else if (cidr >= 25 && cidr <= 30) networkClass = "Sub-class C";
        else if (cidr === 31) networkClass = "Point-to-point link";
        else if (cidr === 32) networkClass = "Host route";

        return {
          primary: { label: "Subnet Mask", value: toIp(mask) },
          details: [
            { label: "CIDR Notation", value: `/${cidr}` },
            { label: "Subnet Mask", value: toIp(mask) },
            { label: "Wildcard Mask", value: toIp(wildcard) },
            { label: "Mask (Binary)", value: toBinary(mask) },
            { label: "Total Addresses", value: formatNumber(totalHosts, 0) },
            { label: "Usable Hosts", value: formatNumber(usableHosts, 0) },
            { label: "Network Class", value: networkClass },
          ],
        };
      },
    },
    {
      id: "mask-to-cidr",
      name: "Subnet Mask to CIDR",
      description: "Convert dotted-decimal subnet mask octets to CIDR prefix length",
      fields: [
        { name: "o1", label: "Octet 1", type: "number", placeholder: "255", min: 0, max: 255, defaultValue: 255 },
        { name: "o2", label: "Octet 2", type: "number", placeholder: "255", min: 0, max: 255, defaultValue: 255 },
        { name: "o3", label: "Octet 3", type: "number", placeholder: "255", min: 0, max: 255, defaultValue: 255 },
        { name: "o4", label: "Octet 4", type: "number", placeholder: "0", min: 0, max: 255, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const o1 = inputs.o1 as number;
        const o2 = inputs.o2 as number;
        const o3 = inputs.o3 as number;
        const o4 = inputs.o4 as number;
        if (o1 === undefined || o2 === undefined || o3 === undefined || o4 === undefined) return null;

        const mask = ((o1 << 24) | (o2 << 16) | (o3 << 8) | o4) >>> 0;
        const binary = mask.toString(2).padStart(32, "0");

        // Validate contiguous mask
        const firstZero = binary.indexOf("0");
        const lastOne = binary.lastIndexOf("1");
        if (firstZero !== -1 && lastOne > firstZero) {
          return {
            primary: { label: "Error", value: "Invalid subnet mask (not contiguous)" },
            details: [],
          };
        }

        const cidr = firstZero === -1 ? 32 : firstZero;
        const wildcard = (~mask) >>> 0;
        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = cidr <= 30 ? totalHosts - 2 : cidr === 31 ? 2 : 1;

        const toIp = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

        return {
          primary: { label: "CIDR Prefix", value: `/${cidr}` },
          details: [
            { label: "Subnet Mask", value: `${o1}.${o2}.${o3}.${o4}` },
            { label: "CIDR Notation", value: `/${cidr}` },
            { label: "Wildcard Mask", value: toIp(wildcard) },
            { label: "Total Addresses", value: formatNumber(totalHosts, 0) },
            { label: "Usable Hosts", value: formatNumber(usableHosts, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["subnet-calculator", "binary-hex-converter"],
  faq: [
    { question: "What is a subnet mask?", answer: "A subnet mask is a 32-bit number that divides an IP address into network and host portions. It uses contiguous 1-bits for the network part and 0-bits for the host part. For example, 255.255.255.0 (/24) means 24 bits for the network and 8 bits for hosts." },
    { question: "What is a wildcard mask?", answer: "A wildcard mask is the inverse of a subnet mask. Where the subnet mask has 1-bits, the wildcard mask has 0-bits and vice versa. It is commonly used in access control lists (ACLs) on routers. For /24, the wildcard mask is 0.0.0.255." },
  ],
  formula: "Subnet Mask = (2^32 - 1) << (32 - CIDR) | Wildcard = NOT(Subnet Mask) | Usable Hosts = 2^(32-CIDR) - 2",
};

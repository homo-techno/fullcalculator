import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ipSubnetCalculator: CalculatorDefinition = {
  slug: "ip-subnet-calculator",
  title: "IP Subnet Calculator",
  description: "Calculate subnet mask, host count, and address range.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["subnet calculator","IP subnet mask"],
  variants: [{
    id: "standard",
    name: "IP Subnet",
    description: "Calculate subnet mask, host count, and address range.",
    fields: [
      { name: "cidr", label: "CIDR Prefix Length", type: "number", min: 1, max: 30, defaultValue: 24 },
      { name: "subnetsNeeded", label: "Subnets Needed", type: "number", min: 1, max: 256, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const cidr = inputs.cidr as number;
      const subnets = inputs.subnetsNeeded as number;
      if (!cidr || !subnets) return null;
      const totalHosts = Math.pow(2, 32 - cidr) - 2;
      const subnetBits = Math.ceil(Math.log2(subnets));
      const newCidr = Math.min(cidr + subnetBits, 30);
      const hostsPerSubnet = Math.pow(2, 32 - newCidr) - 2;
      const octets = [0, 0, 0, 0];
      let bits = cidr;
      for (let i = 0; i < 4; i++) {
        if (bits >= 8) { octets[i] = 255; bits -= 8; }
        else if (bits > 0) { octets[i] = 256 - Math.pow(2, 8 - bits); bits = 0; }
      }
      const mask = octets.join(".");
      return {
        primary: { label: "Usable Hosts", value: formatNumber(Math.max(totalHosts, 0)) },
        details: [
          { label: "Subnet Mask", value: mask },
          { label: "New CIDR (with subnets)", value: "/" + String(newCidr) },
          { label: "Hosts Per Subnet", value: formatNumber(Math.max(hostsPerSubnet, 0)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is CIDR notation?", answer: "CIDR notation like /24 defines how many bits are used for the network." },
    { question: "How many hosts in a /24 subnet?", answer: "A /24 subnet has 254 usable host addresses." },
  ],
  formula: "Usable Hosts = 2^(32 - CIDR) - 2",
};

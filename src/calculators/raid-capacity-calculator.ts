import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const raidCapacityCalculator: CalculatorDefinition = {
  slug: "raid-capacity-calculator",
  title: "RAID Capacity Calculator",
  description: "Calculate usable capacity of a RAID disk array.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["RAID capacity","disk array calculator"],
  variants: [{
    id: "standard",
    name: "RAID Capacity",
    description: "Calculate usable capacity of a RAID disk array.",
    fields: [
      { name: "diskCount", label: "Number of Disks", type: "number", min: 2, max: 24, defaultValue: 4 },
      { name: "diskSize", label: "Disk Size (TB)", type: "number", min: 0.1, max: 20, defaultValue: 2 },
      { name: "raidLevel", label: "RAID Level", type: "select", options: [{ value: "0", label: "RAID 0 (Stripe)" }, { value: "1", label: "RAID 1 (Mirror)" }, { value: "5", label: "RAID 5 (Single Parity)" }, { value: "6", label: "RAID 6 (Double Parity)" }, { value: "10", label: "RAID 10 (Mirror+Stripe)" }], defaultValue: "5" },
    ],
    calculate: (inputs) => {
      const disks = inputs.diskCount as number;
      const size = inputs.diskSize as number;
      const raid = inputs.raidLevel as number;
      if (!disks || !size) return null;
      let usable = 0;
      let fault = 0;
      if (raid === 0) { usable = disks * size; fault = 0; }
      else if (raid === 1) { usable = size; fault = disks - 1; }
      else if (raid === 5) { usable = (disks - 1) * size; fault = 1; }
      else if (raid === 6) { usable = (disks - 2) * size; fault = 2; }
      else if (raid === 10) { usable = Math.floor(disks / 2) * size; fault = 1; }
      const rawTotal = disks * size;
      const efficiency = Math.round((usable / rawTotal) * 100);
      return {
        primary: { label: "Usable Capacity", value: formatNumber(Math.round(usable * 100) / 100) + " TB" },
        details: [
          { label: "Raw Capacity", value: formatNumber(rawTotal) + " TB" },
          { label: "Storage Efficiency", value: formatNumber(efficiency) + "%" },
          { label: "Fault Tolerance", value: String(fault) + " disk(s)" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Which RAID level is best?", answer: "RAID 5 or 6 offers a good balance of capacity and redundancy." },
    { question: "Does RAID replace backups?", answer: "No. RAID is not a backup. You still need separate backup copies." },
  ],
  formula: "RAID 5 Usable = (Disks - 1) x Disk Size",
};

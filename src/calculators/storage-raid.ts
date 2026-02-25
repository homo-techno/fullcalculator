import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const storageRaidCalculator: CalculatorDefinition = {
  slug: "raid-storage-calculator",
  title: "RAID Storage Calculator",
  description: "Free RAID storage calculator. Calculate usable capacity, fault tolerance, and performance for RAID 0, 1, 5, 6, and 10 configurations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["raid calculator", "raid storage calculator", "raid capacity", "raid 5 calculator", "raid 10 calculator"],
  variants: [
    {
      id: "raid-calc",
      name: "RAID Configuration",
      description: "Calculate usable storage for a RAID configuration",
      fields: [
        { name: "diskCount", label: "Number of Disks", type: "number", placeholder: "e.g. 4", min: 1 },
        { name: "diskSize", label: "Disk Size (TB)", type: "number", placeholder: "e.g. 2", min: 0.001, step: 0.1 },
        { name: "raidLevel", label: "RAID Level", type: "select", options: [
          { label: "RAID 0 (Striping)", value: "0" },
          { label: "RAID 1 (Mirroring)", value: "1" },
          { label: "RAID 5 (Striping + Parity)", value: "5" },
          { label: "RAID 6 (Striping + Double Parity)", value: "6" },
          { label: "RAID 10 (Mirrored Stripes)", value: "10" },
        ], defaultValue: "5" },
      ],
      calculate: (inputs) => {
        const diskCount = inputs.diskCount as number;
        const diskSize = inputs.diskSize as number;
        const raidLevel = inputs.raidLevel as string;
        if (!diskCount || !diskSize || diskCount < 1) return null;

        const totalRaw = diskCount * diskSize;
        let usable = 0;
        let faultTolerance = 0;
        let minDisks = 1;
        let readPerf = "";
        let writePerf = "";
        let description = "";
        let valid = true;

        switch (raidLevel) {
          case "0":
            usable = totalRaw;
            faultTolerance = 0;
            minDisks = 2;
            readPerf = `${diskCount}x`;
            writePerf = `${diskCount}x`;
            description = "Striping only - maximum performance, no redundancy";
            break;
          case "1":
            usable = diskSize;
            faultTolerance = diskCount - 1;
            minDisks = 2;
            readPerf = `${diskCount}x`;
            writePerf = "1x";
            description = "Full mirroring - excellent redundancy, 50% capacity";
            break;
          case "5":
            usable = (diskCount - 1) * diskSize;
            faultTolerance = 1;
            minDisks = 3;
            readPerf = `${diskCount - 1}x`;
            writePerf = "Reduced (parity writes)";
            description = "Striping with single parity - good balance of performance and redundancy";
            break;
          case "6":
            usable = (diskCount - 2) * diskSize;
            faultTolerance = 2;
            minDisks = 4;
            readPerf = `${diskCount - 2}x`;
            writePerf = "Reduced (double parity)";
            description = "Striping with double parity - survives 2 disk failures";
            break;
          case "10":
            usable = (diskCount / 2) * diskSize;
            faultTolerance = 1; // per mirror group
            minDisks = 4;
            readPerf = `${diskCount}x`;
            writePerf = `${Math.floor(diskCount / 2)}x`;
            description = "Mirrored stripes - high performance and redundancy";
            if (diskCount % 2 !== 0) valid = false;
            break;
        }

        if (diskCount < minDisks) {
          return {
            primary: { label: "Error", value: `RAID ${raidLevel} requires at least ${minDisks} disks` },
            details: [],
          };
        }

        if (!valid) {
          return {
            primary: { label: "Error", value: "RAID 10 requires an even number of disks" },
            details: [],
          };
        }

        const efficiency = (usable / totalRaw) * 100;
        const wastedSpace = totalRaw - usable;

        return {
          primary: { label: "Usable Capacity", value: `${formatNumber(usable, 2)} TB` },
          details: [
            { label: "RAID Level", value: `RAID ${raidLevel}` },
            { label: "Description", value: description },
            { label: "Total Raw Capacity", value: `${formatNumber(totalRaw, 2)} TB` },
            { label: "Usable Capacity", value: `${formatNumber(usable, 2)} TB` },
            { label: "Space Used for Redundancy", value: `${formatNumber(wastedSpace, 2)} TB` },
            { label: "Storage Efficiency", value: `${formatNumber(efficiency, 1)}%` },
            { label: "Fault Tolerance", value: `${faultTolerance} disk(s)` },
            { label: "Read Performance", value: readPerf },
            { label: "Write Performance", value: writePerf },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["data-storage-converter", "backup-size-calculator", "ssd-lifespan-calculator"],
  faq: [
    { question: "Which RAID level should I choose?", answer: "RAID 1 for OS/boot drives (simple mirroring). RAID 5 for file servers with 3-8 disks (good capacity/redundancy balance). RAID 6 for large arrays with big disks (survives 2 failures during rebuild). RAID 10 for databases and high-performance workloads. RAID 0 only for scratch/temporary data where loss is acceptable." },
    { question: "What happens when a RAID disk fails?", answer: "In RAID 1/5/6/10, the array continues operating in a degraded state. Performance may drop, especially writes. You must replace the failed disk and rebuild the array. During rebuild (which can take hours to days), RAID 5 is vulnerable since another failure means data loss -- RAID 6 protects against this." },
  ],
  formula: "RAID 0: Usable = N x Disk | RAID 1: Usable = Disk | RAID 5: Usable = (N-1) x Disk | RAID 6: Usable = (N-2) x Disk | RAID 10: Usable = (N/2) x Disk",
};

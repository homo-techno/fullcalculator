import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nasDriveCostCalculator: CalculatorDefinition = {
  slug: "nas-drive-cost-calculator",
  title: "NAS Drive Cost Calculator",
  description: "Estimate the total cost and usable storage of a NAS (Network Attached Storage) setup including drive costs, RAID configuration, and enclosure pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nas cost calculator","network storage cost","raid storage calculator","nas setup price","home server storage"],
  variants: [{
    id: "standard",
    name: "NAS Drive Cost",
    description: "Estimate the total cost and usable storage of a NAS (Network Attached Storage) setup including drive costs, RAID configuration, and enclosure pricing.",
    fields: [
      { name: "numDrives", label: "Number of Drives", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "driveSize", label: "Drive Size (TB)", type: "number", min: 1, max: 24, defaultValue: 8 },
      { name: "driveCost", label: "Cost Per Drive ($)", type: "number", min: 30, max: 800, defaultValue: 180 },
      { name: "raidType", label: "RAID Configuration", type: "select", options: [{ value: "0", label: "RAID 0 (No redundancy)" }, { value: "1", label: "RAID 1 (Mirror)" }, { value: "5", label: "RAID 5 (Single parity)" }, { value: "6", label: "RAID 6 (Double parity)" }, { value: "10", label: "RAID 10 (Striped mirrors)" }], defaultValue: "5" },
      { name: "enclosureCost", label: "NAS Enclosure Cost ($)", type: "number", min: 100, max: 3000, defaultValue: 350 },
    ],
    calculate: (inputs) => {
    const numDrives = inputs.numDrives as number;
    const driveSize = inputs.driveSize as number;
    const driveCost = inputs.driveCost as number;
    const raid = parseInt(inputs.raidType as string);
    const enclosure = inputs.enclosureCost as number;
    const totalRaw = numDrives * driveSize;
    var usable = totalRaw;
    var raidLabel = "None";
    if (raid === 0) { usable = totalRaw; raidLabel = "RAID 0 - No redundancy"; }
    else if (raid === 1) { usable = totalRaw / 2; raidLabel = "RAID 1 - Mirrored"; }
    else if (raid === 5) { usable = (numDrives - 1) * driveSize; raidLabel = "RAID 5 - Single parity"; }
    else if (raid === 6) { usable = (numDrives - 2) * driveSize; raidLabel = "RAID 6 - Double parity"; }
    else if (raid === 10) { usable = totalRaw / 2; raidLabel = "RAID 10 - Striped mirrors"; }
    const totalDriveCost = numDrives * driveCost;
    const totalCost = totalDriveCost + enclosure;
    const costPerTB = usable > 0 ? totalCost / usable : 0;
    const redundancy = totalRaw - usable;
    return {
      primary: { label: "Usable Storage", value: formatNumber(Math.round(usable)) + " TB" },
      details: [
        { label: "Total Raw Storage", value: formatNumber(totalRaw) + " TB" },
        { label: "Redundancy Overhead", value: formatNumber(Math.round(redundancy)) + " TB" },
        { label: "Total System Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Cost Per Usable TB", value: "$" + formatNumber(Math.round(costPerTB)) },
        { label: "RAID Type", value: raidLabel }
      ]
    };
  },
  }],
  relatedSlugs: ["ssd-cost-per-gb-calculator","security-camera-storage-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Usable Storage (RAID 5) = (Number of Drives - 1) x Drive Size
Usable Storage (RAID 1/10) = Total Raw / 2
Cost Per TB = Total Cost / Usable Storage",
};

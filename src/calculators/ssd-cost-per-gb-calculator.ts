import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ssdCostPerGbCalculator: CalculatorDefinition = {
  slug: "ssd-cost-per-gb-calculator",
  title: "SSD Cost Per GB Calculator",
  description: "Compare solid state drive values by calculating cost per gigabyte across different SSD types, capacities, and interfaces to find the best deal.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ssd cost per gb","solid state drive value","ssd price comparison","nvme vs sata cost","storage cost calculator"],
  variants: [{
    id: "standard",
    name: "SSD Cost Per GB",
    description: "Compare solid state drive values by calculating cost per gigabyte across different SSD types, capacities, and interfaces to find the best deal.",
    fields: [
      { name: "ssdPrice", label: "SSD Price ($)", type: "number", min: 10, max: 5000, defaultValue: 89 },
      { name: "capacity", label: "Capacity (GB)", type: "number", min: 32, max: 16000, defaultValue: 1000 },
      { name: "ssdType", label: "SSD Type", type: "select", options: [{ value: "1", label: "SATA 2.5-inch" }, { value: "2", label: "NVMe PCIe 3.0" }, { value: "3", label: "NVMe PCIe 4.0" }, { value: "4", label: "NVMe PCIe 5.0" }], defaultValue: "2" },
      { name: "comparePrice", label: "Compare SSD Price ($)", type: "number", min: 0, max: 5000, defaultValue: 159 },
      { name: "compareCapacity", label: "Compare Capacity (GB)", type: "number", min: 32, max: 16000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
    const price1 = inputs.ssdPrice as number;
    const cap1 = inputs.capacity as number;
    const ssdType = parseInt(inputs.ssdType as string);
    const price2 = inputs.comparePrice as number;
    const cap2 = inputs.compareCapacity as number;
    const costPerGB1 = price1 / cap1;
    const costPerGB2 = price2 > 0 ? price2 / cap2 : 0;
    const costPerTB1 = costPerGB1 * 1000;
    const costPerTB2 = costPerGB2 * 1000;
    const speedLabels = { 1: "Up to 550 MB/s", 2: "Up to 3500 MB/s", 3: "Up to 7000 MB/s", 4: "Up to 12000 MB/s" };
    const betterDeal = costPerGB2 > 0 ? (costPerGB1 < costPerGB2 ? "SSD 1 is cheaper per GB" : costPerGB1 > costPerGB2 ? "SSD 2 is cheaper per GB" : "Both are equal value") : "Add comparison SSD";
    return {
      primary: { label: "Cost Per GB (SSD 1)", value: "$" + formatNumber(Math.round(costPerGB1 * 1000) / 1000) },
      details: [
        { label: "Cost Per TB (SSD 1)", value: "$" + formatNumber(Math.round(costPerTB1 * 100) / 100) },
        { label: "Cost Per GB (SSD 2)", value: costPerGB2 > 0 ? "$" + formatNumber(Math.round(costPerGB2 * 1000) / 1000) : "N/A" },
        { label: "Cost Per TB (SSD 2)", value: costPerGB2 > 0 ? "$" + formatNumber(Math.round(costPerTB2 * 100) / 100) : "N/A" },
        { label: "Max Read Speed", value: speedLabels[ssdType] || "Unknown" },
        { label: "Better Deal", value: betterDeal }
      ]
    };
  },
  }],
  relatedSlugs: ["usb-transfer-speed-calculator","nas-drive-cost-calculator","gaming-pc-build-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Cost Per GB = SSD Price / Capacity (GB); Cost Per TB = Cost Per GB x 1000",
};

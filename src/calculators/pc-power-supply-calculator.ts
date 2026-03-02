import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pcPowerSupplyCalculator: CalculatorDefinition = {
  slug: "pc-power-supply-calculator",
  title: "PC Power Supply Calculator",
  description: "Estimate the wattage needed for your PC power supply based on CPU, GPU, RAM, storage, and peripheral power draw to choose the right PSU.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pc power supply calculator","psu wattage calculator","computer wattage","power supply sizing","pc watt requirements"],
  variants: [{
    id: "standard",
    name: "PC Power Supply",
    description: "Estimate the wattage needed for your PC power supply based on CPU, GPU, RAM, storage, and peripheral power draw to choose the right PSU.",
    fields: [
      { name: "cpuTdp", label: "CPU TDP (Watts)", type: "number", min: 15, max: 350, defaultValue: 105 },
      { name: "gpuTdp", label: "GPU TDP (Watts)", type: "number", min: 0, max: 600, defaultValue: 250 },
      { name: "ramSticks", label: "RAM Sticks", type: "number", min: 1, max: 8, defaultValue: 2 },
      { name: "storageDevices", label: "Storage Drives (SSD/HDD)", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "fans", label: "Case Fans", type: "number", min: 1, max: 12, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const cpuTdp = inputs.cpuTdp as number;
    const gpuTdp = inputs.gpuTdp as number;
    const ramSticks = inputs.ramSticks as number;
    const storage = inputs.storageDevices as number;
    const fans = inputs.fans as number;
    const ramPower = ramSticks * 5;
    const storagePower = storage * 8;
    const fanPower = fans * 3;
    const motherboard = 75;
    const misc = 25;
    const totalDraw = cpuTdp + gpuTdp + ramPower + storagePower + fanPower + motherboard + misc;
    const recommended = Math.ceil(totalDraw * 1.25 / 50) * 50;
    const headroom = recommended - totalDraw;
    const efficiency80Plus = Math.round(totalDraw / 0.87);
    return {
      primary: { label: "Recommended PSU Wattage", value: formatNumber(recommended) + "W" },
      details: [
        { label: "Estimated Total Draw", value: formatNumber(totalDraw) + "W" },
        { label: "Headroom", value: formatNumber(headroom) + "W" },
        { label: "Wall Draw (80+ Gold)", value: formatNumber(efficiency80Plus) + "W" },
        { label: "CPU + GPU Draw", value: formatNumber(cpuTdp + gpuTdp) + "W" }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-pc-build-budget-calculator","electric-bill-device-cost-calculator","ups-runtime-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Draw = CPU TDP + GPU TDP + RAM + Storage + Fans + Motherboard + Misc
Recommended PSU = Total Draw x 1.25 (rounded up to nearest 50W)
Wall Draw = Total Draw / PSU Efficiency",
};

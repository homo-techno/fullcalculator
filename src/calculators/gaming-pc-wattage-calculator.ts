import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingPcWattageCalculator: CalculatorDefinition = {
  slug: "gaming-pc-wattage-calculator",
  title: "Gaming PC Wattage Calculator",
  description: "Estimate total power supply wattage needed for a PC build.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["PC wattage","power supply calculator"],
  variants: [{
    id: "standard",
    name: "Gaming PC Wattage",
    description: "Estimate total power supply wattage needed for a PC build.",
    fields: [
      { name: "cpuTdp", label: "CPU TDP (W)", type: "number", min: 15, max: 500, defaultValue: 125 },
      { name: "gpuTdp", label: "GPU TDP (W)", type: "number", min: 30, max: 700, defaultValue: 300 },
      { name: "ramSticks", label: "RAM Sticks", type: "number", min: 1, max: 8, defaultValue: 2 },
      { name: "storageDevices", label: "Storage Devices", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "fans", label: "Case Fans", type: "number", min: 1, max: 12, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const cpu = inputs.cpuTdp as number;
      const gpu = inputs.gpuTdp as number;
      const ram = inputs.ramSticks as number;
      const stor = inputs.storageDevices as number;
      const fans = inputs.fans as number;
      if (!cpu || !gpu) return null;
      const ramW = ram * 5;
      const storW = stor * 10;
      const fanW = fans * 3;
      const mobo = 80;
      const total = cpu + gpu + ramW + storW + fanW + mobo;
      const recommended = Math.ceil(total * 1.25 / 50) * 50;
      return {
        primary: { label: "Recommended PSU", value: formatNumber(recommended) + " W" },
        details: [
          { label: "Estimated Draw", value: formatNumber(total) + " W" },
          { label: "CPU + GPU", value: formatNumber(cpu + gpu) + " W" },
          { label: "Other Components", value: formatNumber(ramW + storW + fanW + mobo) + " W" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much headroom should a PSU have?", answer: "A 20% to 25% buffer above peak draw is recommended." },
    { question: "Does a bigger PSU use more power?", answer: "No. The PSU only draws what components need." },
  ],
  formula: "Recommended PSU = Total Draw x 1.25 rounded to nearest 50",
};

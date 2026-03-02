import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const upsBatteryCalculator: CalculatorDefinition = {
  slug: "ups-battery-calculator",
  title: "UPS Battery Calculator",
  description: "Estimate UPS runtime based on battery capacity and load.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["UPS runtime","battery backup calculator"],
  variants: [{
    id: "standard",
    name: "UPS Battery",
    description: "Estimate UPS runtime based on battery capacity and load.",
    fields: [
      { name: "upsVa", label: "UPS Rating (VA)", type: "number", min: 100, max: 20000, defaultValue: 1500 },
      { name: "loadWatts", label: "Total Load (W)", type: "number", min: 10, max: 20000, defaultValue: 500 },
      { name: "batteryAh", label: "Battery Capacity (Ah)", type: "number", min: 1, max: 200, defaultValue: 9 },
    ],
    calculate: (inputs) => {
      const va = inputs.upsVa as number;
      const load = inputs.loadWatts as number;
      const ah = inputs.batteryAh as number;
      if (!va || !load || !ah) return null;
      const batteryV = 12;
      const batteryWh = batteryV * ah;
      const efficiency = 0.85;
      const runtime = Math.round((batteryWh * efficiency / load) * 60 * 10) / 10;
      const loadPercent = Math.round((load / (va * 0.6)) * 100);
      return {
        primary: { label: "Estimated Runtime", value: formatNumber(runtime) + " min" },
        details: [
          { label: "Battery Energy", value: formatNumber(batteryWh) + " Wh" },
          { label: "Load Percentage", value: formatNumber(Math.min(loadPercent, 999)) + "%" },
          { label: "Efficiency Factor", value: "85%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How long will a UPS last?", answer: "Runtime depends on battery size and load. Lower load means longer runtime." },
    { question: "What size UPS do I need for a PC?", answer: "A 1000 to 1500 VA UPS handles most desktop computer setups." },
  ],
  formula: "Runtime (min) = (Battery Ah x 12V x 0.85 / Load W) x 60",
};

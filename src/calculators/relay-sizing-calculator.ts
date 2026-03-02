import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const relaySizingCalculator: CalculatorDefinition = {
  slug: "relay-sizing-calculator",
  title: "Relay Sizing Calculator",
  description: "Determine relay contact rating for a given load.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["relay sizing","relay rating","relay current"],
  variants: [{
    id: "standard",
    name: "Relay Sizing",
    description: "Determine relay contact rating for a given load.",
    fields: [
      { name: "loadWatts", label: "Load Power (W)", type: "number", min: 1, max: 5000, defaultValue: 100 },
      { name: "voltage", label: "Supply Voltage (V)", type: "number", min: 5, max: 480, defaultValue: 120 },
      { name: "loadType", label: "Load Type", type: "select", options: [{ value: "resistive", label: "Resistive" }, { value: "inductive", label: "Inductive" }, { value: "motor", label: "Motor" }], defaultValue: "resistive" },
    ],
    calculate: (inputs) => {
      const watts = inputs.loadWatts as number;
      const voltage = inputs.voltage as number;
      const loadType = inputs.loadType as string;
      if (!watts || !voltage) return null;
      const amps = watts / voltage;
      const derating: Record<string, number> = { resistive: 1, inductive: 0.75, motor: 0.5 };
      const factor = derating[loadType] || 1;
      const relayRating = amps / factor;
      return {
        primary: { label: "Relay Rating Needed", value: formatNumber(Math.round(relayRating * 10) / 10) + " A" },
        details: [
          { label: "Load Current", value: formatNumber(Math.round(amps * 100) / 100) + " A" },
          { label: "Derating Factor", value: formatNumber(factor) },
          { label: "Load Type", value: loadType },
        ],
      };
  },
  }],
  relatedSlugs: ["arduino-power-calculator","transformer-sizing-calculator"],
  faq: [
    { question: "How do I size a relay for a motor?", answer: "Derate the relay to 50 percent of its rating for motor loads." },
    { question: "What is relay derating?", answer: "Derating reduces the max rating for inductive or motor loads." },
  ],
  formula: "Relay Rating = (Load Watts / Voltage) / Derating Factor",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transferSwitchCalculator: CalculatorDefinition = {
  slug: "transfer-switch-calculator",
  title: "Transfer Switch Calculator",
  description: "Determine transfer switch amperage needed.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["transfer switch size","transfer switch amps"],
  variants: [{
    id: "standard",
    name: "Transfer Switch",
    description: "Determine transfer switch amperage needed.",
    fields: [
      { name: "generatorWatts", label: "Generator Watts", type: "number", min: 1000, max: 50000, defaultValue: 7500 },
      { name: "voltage", label: "Voltage", type: "select", options: [{ value: "120", label: "120V" }, { value: "240", label: "240V" }], defaultValue: "240" },
      { name: "circuits", label: "Number of Circuits", type: "number", min: 4, max: 30, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const watts = inputs.generatorWatts as number;
      const volts = Number(inputs.voltage as number);
      const circuits = inputs.circuits as number;
      const amps = watts / volts;
      const switchSize = Math.ceil(amps / 10) * 10;
      return {
        primary: { label: "Switch Size", value: formatNumber(switchSize) + " A" },
        details: [
          { label: "Calculated Amps", value: formatNumber(Math.round(amps * 10) / 10) + " A" },
          { label: "Circuits Supported", value: formatNumber(circuits) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What size transfer switch do I need?", answer: "Match the switch amperage to your generator output rating." },
    { question: "Do I need an automatic transfer switch?", answer: "Automatic switches are best for standby generators." },
  ],
  formula: "Amps = Generator Watts / Voltage",
};

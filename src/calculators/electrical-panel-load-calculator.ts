import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricalPanelLoadCalculator: CalculatorDefinition = {
  slug: "electrical-panel-load-calculator",
  title: "Electrical Panel Load Calculator",
  description: "Calculate total electrical panel load in amps.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["panel load","electrical load calculation"],
  variants: [{
    id: "standard",
    name: "Electrical Panel Load",
    description: "Calculate total electrical panel load in amps.",
    fields: [
      { name: "totalWatts", label: "Total Connected Watts", type: "number", min: 1000, max: 100000, defaultValue: 20000 },
      { name: "voltage", label: "Service Voltage", type: "select", options: [{ value: "120", label: "120V" }, { value: "240", label: "240V" }], defaultValue: "240" },
      { name: "demandFactor", label: "Demand Factor (%)", type: "number", min: 30, max: 100, defaultValue: 80 },
    ],
    calculate: (inputs) => {
      const watts = inputs.totalWatts as number;
      const volts = Number(inputs.voltage as number);
      const demand = inputs.demandFactor as number;
      const adjustedWatts = watts * (demand / 100);
      const amps = adjustedWatts / volts;
      const panelSize = Math.ceil(amps / 50) * 50;
      return {
        primary: { label: "Panel Size Needed", value: formatNumber(panelSize) + " A" },
        details: [
          { label: "Calculated Load", value: formatNumber(Math.round(amps)) + " A" },
          { label: "Adjusted Watts", value: formatNumber(Math.round(adjustedWatts)) + " W" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What size panel do most homes need?", answer: "Most modern homes use a 200-amp electrical panel." },
    { question: "What is demand factor?", answer: "Demand factor accounts for not all loads running at once." },
  ],
  formula: "Amps = Total Watts x Demand Factor / Voltage",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const circuitBreakerSizingCalculator: CalculatorDefinition = {
  slug: "circuit-breaker-sizing-calculator",
  title: "Circuit Breaker Sizing Calculator",
  description: "Determine the correct breaker size for a load.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["breaker size","circuit breaker amps"],
  variants: [{
    id: "standard",
    name: "Circuit Breaker Sizing",
    description: "Determine the correct breaker size for a load.",
    fields: [
      { name: "loadWatts", label: "Load Watts", type: "number", min: 100, max: 50000, defaultValue: 1800 },
      { name: "voltage", label: "Circuit Voltage", type: "select", options: [{ value: "120", label: "120V" }, { value: "240", label: "240V" }], defaultValue: "120" },
      { name: "continuous", label: "Continuous Load", type: "select", options: [{ value: "1", label: "No" }, { value: "0.8", label: "Yes (80% rule)" }], defaultValue: "0.8" },
    ],
    calculate: (inputs) => {
      const watts = inputs.loadWatts as number;
      const volts = Number(inputs.voltage as number);
      const factor = Number(inputs.continuous as number);
      const amps = watts / volts;
      const requiredBreaker = amps / factor;
      const sizes = [15, 20, 25, 30, 40, 50, 60, 70, 80, 100];
      const breakerSize = sizes.find(s => s >= requiredBreaker) || 100;
      return {
        primary: { label: "Breaker Size", value: formatNumber(breakerSize) + " A" },
        details: [
          { label: "Load Amps", value: formatNumber(Math.round(amps * 10) / 10) + " A" },
          { label: "Required Minimum", value: formatNumber(Math.round(requiredBreaker * 10) / 10) + " A" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the 80 percent rule?", answer: "Continuous loads must not exceed 80 percent of breaker rating." },
    { question: "When do I need a 20-amp breaker?", answer: "Use 20-amp breakers for kitchen, bathroom, and laundry circuits." },
  ],
  formula: "Breaker = (Watts / Voltage) / Continuous Factor",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wireGaugeAmpacityCalculator: CalculatorDefinition = {
  slug: "wire-gauge-ampacity-calculator",
  title: "Wire Gauge Ampacity Calculator",
  description: "Determine the maximum current carrying capacity of electrical wire based on AWG gauge size, insulation type, and ambient temperature for safe residential and commercial wiring.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wire gauge ampacity","AWG current capacity","wire size calculator","electrical wire ampacity"],
  variants: [{
    id: "standard",
    name: "Wire Gauge Ampacity",
    description: "Determine the maximum current carrying capacity of electrical wire based on AWG gauge size, insulation type, and ambient temperature for safe residential and commercial wiring.",
    fields: [
      { name: "awgGauge", label: "AWG Wire Gauge", type: "select", options: [{ value: "14", label: "14 AWG" }, { value: "12", label: "12 AWG" }, { value: "10", label: "10 AWG" }, { value: "8", label: "8 AWG" }, { value: "6", label: "6 AWG" }, { value: "4", label: "4 AWG" }, { value: "2", label: "2 AWG" }, { value: "1", label: "1 AWG" }], defaultValue: "12" },
      { name: "insulationType", label: "Insulation Type", type: "select", options: [{ value: "1", label: "TW (60C)" }, { value: "2", label: "THW (75C)" }, { value: "3", label: "THHN (90C)" }], defaultValue: "2" },
      { name: "ambientTemp", label: "Ambient Temperature (F)", type: "number", min: 50, max: 150, defaultValue: 86 },
      { name: "conductorsInConduit", label: "Conductors in Conduit", type: "select", options: [{ value: "3", label: "1-3" }, { value: "6", label: "4-6" }, { value: "9", label: "7-9" }], defaultValue: "3" },
    ],
    calculate: (inputs) => {
    const gauge = parseInt(inputs.awgGauge as string);
    const insType = parseInt(inputs.insulationType as string);
    const ambTemp = inputs.ambientTemp as number;
    const condCount = parseInt(inputs.conductorsInConduit as string);
    const baseAmpacity = { 14: [15, 20, 25], 12: [20, 25, 30], 10: [30, 35, 40], 8: [40, 50, 55], 6: [55, 65, 75], 4: [70, 85, 95], 2: [95, 115, 130], 1: [110, 130, 150] };
    const amps = baseAmpacity[gauge] ? baseAmpacity[gauge][insType - 1] : 20;
    const tempDerate = ambTemp > 86 ? Math.max(0.5, 1 - (ambTemp - 86) * 0.01) : 1.0;
    const conduitDerate = condCount <= 3 ? 1.0 : condCount <= 6 ? 0.8 : 0.7;
    const adjustedAmps = amps * tempDerate * conduitDerate;
    const breakerSize = Math.floor(adjustedAmps / 5) * 5;
    return {
      primary: { label: "Adjusted Ampacity", value: formatNumber(Math.round(adjustedAmps * 10) / 10) + " A" },
      details: [
        { label: "Base Ampacity", value: formatNumber(amps) + " A" },
        { label: "Temperature Derating", value: formatNumber(Math.round(tempDerate * 100)) + "%" },
        { label: "Conduit Fill Derating", value: formatNumber(Math.round(conduitDerate * 100)) + "%" },
        { label: "Recommended Breaker", value: formatNumber(breakerSize) + " A" }
      ]
    };
  },
  }],
  relatedSlugs: ["voltage-drop-calculator","circuit-breaker-sizing-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Base Ampacity = NEC Table 310.16 lookup by gauge and insulation
Temp Derating = 1 - (Ambient - 86) x 0.01 (if above 86F)
Conduit Derating = 1.0 (1-3), 0.8 (4-6), 0.7 (7-9)
Adjusted Ampacity = Base x Temp Derating x Conduit Derating",
};

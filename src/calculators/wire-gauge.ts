import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const awgData: Record<number, { diameter: number; area: number; resistance: number; ampacity: number }> = {
  0: { diameter: 8.251, area: 53.49, resistance: 0.3224, ampacity: 195 },
  1: { diameter: 7.348, area: 42.41, resistance: 0.4066, ampacity: 170 },
  2: { diameter: 6.544, area: 33.63, resistance: 0.5127, ampacity: 145 },
  4: { diameter: 5.189, area: 21.15, resistance: 0.8152, ampacity: 95 },
  6: { diameter: 4.115, area: 13.30, resistance: 1.296, ampacity: 65 },
  8: { diameter: 3.264, area: 8.366, resistance: 2.061, ampacity: 45 },
  10: { diameter: 2.588, area: 5.261, resistance: 3.277, ampacity: 30 },
  12: { diameter: 2.053, area: 3.309, resistance: 5.211, ampacity: 20 },
  14: { diameter: 1.628, area: 2.081, resistance: 8.286, ampacity: 15 },
  16: { diameter: 1.291, area: 1.309, resistance: 13.17, ampacity: 10 },
  18: { diameter: 1.024, area: 0.823, resistance: 20.95, ampacity: 7 },
  20: { diameter: 0.812, area: 0.518, resistance: 33.31, ampacity: 5 },
};

export const wireGaugeCalculator: CalculatorDefinition = {
  slug: "wire-gauge-calculator",
  title: "Wire Gauge Calculator",
  description: "Free wire gauge calculator. Find AWG wire specifications including diameter, resistance, and ampacity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wire gauge calculator", "AWG calculator", "wire size", "wire ampacity", "wire resistance"],
  variants: [
    {
      id: "lookup",
      name: "AWG Wire Specifications",
      fields: [
        { name: "gauge", label: "Wire Gauge (AWG)", type: "select", options: [
          { label: "0 AWG", value: "0" }, { label: "1 AWG", value: "1" },
          { label: "2 AWG", value: "2" }, { label: "4 AWG", value: "4" },
          { label: "6 AWG", value: "6" }, { label: "8 AWG", value: "8" },
          { label: "10 AWG", value: "10" }, { label: "12 AWG", value: "12" },
          { label: "14 AWG", value: "14" }, { label: "16 AWG", value: "16" },
          { label: "18 AWG", value: "18" }, { label: "20 AWG", value: "20" },
        ]},
      ],
      calculate: (inputs) => {
        const g = parseInt((inputs.gauge as string) || "12");
        const data = awgData[g];
        if (!data) return null;
        return {
          primary: { label: `${g} AWG`, value: `${data.ampacity}A max` },
          details: [
            { label: "Diameter", value: `${formatNumber(data.diameter, 3)} mm` },
            { label: "Cross-section", value: `${formatNumber(data.area, 3)} mm²` },
            { label: "Resistance", value: `${formatNumber(data.resistance, 3)} Ω/km` },
            { label: "Max ampacity (copper)", value: `${data.ampacity} A` },
            { label: "Common use", value: g <= 2 ? "Service entrance" : g <= 6 ? "Large appliances" : g <= 10 ? "Dryer/AC circuits" : g <= 12 ? "General outlets (20A)" : g <= 14 ? "Lighting (15A)" : "Low-power electronics" },
          ],
        };
      },
    },
    {
      id: "byAmps",
      name: "Find Wire Size by Amps",
      fields: [
        { name: "amps", label: "Required Amperage", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const amps = inputs.amps as number;
        if (!amps) return null;
        const gauges = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1, 0];
        const recommended = gauges.find(g => awgData[g].ampacity >= amps);
        if (!recommended && recommended !== 0) return { primary: { label: "Wire needed", value: "Larger than 0 AWG — consult electrician" }, details: [] };
        const data = awgData[recommended!];
        return {
          primary: { label: "Recommended Wire", value: `${recommended} AWG` },
          details: [
            { label: "Wire ampacity", value: `${data.ampacity} A` },
            { label: "Required amps", value: `${amps} A` },
            { label: "Diameter", value: `${formatNumber(data.diameter, 3)} mm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "electrical-power-calculator", "resistance-calculator"],
  faq: [{ question: "What wire gauge do I need?", answer: "Common residential: 14 AWG for 15A circuits (lighting), 12 AWG for 20A (outlets), 10 AWG for 30A (dryer), 8 AWG for 40A (range), 6 AWG for 50A (large AC). Always follow local electrical codes." }],
  formula: "Lower AWG number = thicker wire = more capacity",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wireGaugeConverterCalculator: CalculatorDefinition = {
  slug: "wire-gauge-converter",
  title: "Wire Gauge Converter",
  description: "Convert between American Wire Gauge (AWG) and metric wire diameter in millimeters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["wire gauge converter", "AWG to mm", "wire size converter"],
  variants: [{
    id: "standard",
    name: "Wire Gauge",
    description: "Convert between American Wire Gauge (AWG) and metric wire diameter in millimeters",
    fields: [
      { name: "awg", label: "AWG Gauge Number", type: "number", suffix: "", min: 0, max: 40, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const awg = inputs.awg as number;
      if (awg === undefined || awg < 0 || awg > 40) return null;
      const diameterMm = 0.127 * Math.pow(92, (36 - awg) / 39);
      const diameterInch = diameterMm / 25.4;
      const areaMm2 = Math.PI * Math.pow(diameterMm / 2, 2);
      const resistancePerKm = 0.0175 / (areaMm2 / 1000000) / 1000;
      const maxAmps15 = awg <= 2 ? 95 - (awg * 10) : awg <= 10 ? 55 - (awg - 2) * 5 : awg <= 14 ? 20 - (awg - 10) * 2.5 : 10;
      return {
        primary: { label: "Wire Diameter", value: formatNumber(Math.round(diameterMm * 1000) / 1000) + " mm" },
        details: [
          { label: "Diameter (inches)", value: formatNumber(Math.round(diameterInch * 10000) / 10000) + " in" },
          { label: "Cross-section Area", value: formatNumber(Math.round(areaMm2 * 1000) / 1000) + " mm2" },
          { label: "Typical Max Amps (copper)", value: formatNumber(Math.round(Math.max(1, maxAmps15))) + " A" },
        ],
      };
    },
  }],
  relatedSlugs: ["number-base-converter", "hex-to-rgb-calculator"],
  faq: [
    { question: "What is AWG?", answer: "American Wire Gauge is a standardized wire size system used primarily in North America. Lower AWG numbers indicate thicker wire with greater current-carrying capacity." },
    { question: "What AWG wire do I need for a 20 amp circuit?", answer: "A 20 amp circuit typically requires 12 AWG copper wire. For longer runs, you may need to use 10 AWG to compensate for voltage drop." },
  ],
  formula: "Diameter (mm) = 0.127 x 92^((36 - AWG) / 39)",
};

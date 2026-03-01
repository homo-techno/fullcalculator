import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speakerWireGaugeCalculator: CalculatorDefinition = {
  slug: "speaker-wire-gauge-calculator",
  title: "Speaker Wire Gauge Calculator",
  description: "Determine the right speaker wire gauge for your setup.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["speaker wire gauge","speaker cable calculator"],
  variants: [{
    id: "standard",
    name: "Speaker Wire Gauge",
    description: "Determine the right speaker wire gauge for your setup.",
    fields: [
      { name: "distance", label: "Distance (ft)", type: "number", min: 1, max: 500, defaultValue: 25 },
      { name: "impedance", label: "Speaker Impedance (ohms)", type: "number", min: 2, max: 16, defaultValue: 8 },
      { name: "watts", label: "Amplifier Watts", type: "number", min: 1, max: 2000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const dist = inputs.distance as number;
      const imp = inputs.impedance as number;
      const watts = inputs.watts as number;
      if (!dist || !imp || !watts) return null;
      const totalLength = dist * 2;
      const maxResistance = imp * 0.05;
      const resistancePerFt16 = 0.00409;
      const resistancePerFt14 = 0.00257;
      const resistancePerFt12 = 0.00162;
      const r16 = totalLength * resistancePerFt16;
      const r14 = totalLength * resistancePerFt14;
      const r12 = totalLength * resistancePerFt12;
      let gauge = "16 AWG";
      if (r16 > maxResistance) gauge = "14 AWG";
      if (r14 > maxResistance) gauge = "12 AWG";
      const powerLoss = (r16 / (imp + r16)) * 100;
      return {
        primary: { label: "Recommended Gauge", value: gauge },
        details: [
          { label: "Total Wire Length", value: formatNumber(totalLength) + " ft" },
          { label: "Max Resistance", value: formatNumber(Math.round(maxResistance * 1000) / 1000) + " ohms" },
          { label: "Power Loss (16 AWG)", value: formatNumber(Math.round(powerLoss * 100) / 100) + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Does speaker wire gauge matter?", answer: "Yes. Thicker wire reduces signal loss over longer distances." },
    { question: "When should I use 12 AWG wire?", answer: "Use 12 AWG for runs over 50 feet or low impedance speakers." },
  ],
  formula: "Recommended gauge based on 5% max impedance loss threshold",
};

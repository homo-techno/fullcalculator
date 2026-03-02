import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coaxCableLossCalculator: CalculatorDefinition = {
  slug: "coax-cable-loss-calculator",
  title: "Coax Cable Loss Calculator",
  description: "Calculate signal attenuation through coaxial cable.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["coax loss","cable attenuation calculator"],
  variants: [{
    id: "standard",
    name: "Coax Cable Loss",
    description: "Calculate signal attenuation through coaxial cable.",
    fields: [
      { name: "cableLength", label: "Cable Length (ft)", type: "number", min: 1, max: 10000, defaultValue: 100 },
      { name: "lossPerFt", label: "Loss Per 100 ft (dB)", type: "number", min: 0.1, max: 50, defaultValue: 6.1 },
      { name: "connectors", label: "Number of Connectors", type: "number", min: 0, max: 20, defaultValue: 2 },
      { name: "connLoss", label: "Loss Per Connector (dB)", type: "number", min: 0, max: 3, defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
      const len = inputs.cableLength as number;
      const lossPer = inputs.lossPerFt as number;
      const conn = inputs.connectors as number;
      const connL = inputs.connLoss as number;
      if (!len || !lossPer) return null;
      const cableLoss = Math.round(len / 100 * lossPer * 100) / 100;
      const connectorLoss = Math.round(conn * connL * 100) / 100;
      const totalLoss = Math.round((cableLoss + connectorLoss) * 100) / 100;
      return {
        primary: { label: "Total Loss", value: formatNumber(totalLoss) + " dB" },
        details: [
          { label: "Cable Loss", value: formatNumber(cableLoss) + " dB" },
          { label: "Connector Loss", value: formatNumber(connectorLoss) + " dB" },
          { label: "Cable Length", value: formatNumber(len) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What causes loss in coaxial cable?", answer: "Resistance in the conductor and dielectric absorption cause signal loss." },
    { question: "Which coax cable has the lowest loss?", answer: "LMR-400 and similar low-loss cables are best for long runs." },
  ],
  formula: "Total Loss = (Length / 100 x Loss per 100 ft) + (Connectors x Connector Loss)",
};

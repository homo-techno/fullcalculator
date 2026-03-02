import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fiberOpticLossCalculator: CalculatorDefinition = {
  slug: "fiber-optic-loss-calculator",
  title: "Fiber Optic Loss Calculator",
  description: "Calculate total loss in a fiber optic link.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["fiber optic loss","fiber link budget"],
  variants: [{
    id: "standard",
    name: "Fiber Optic Loss",
    description: "Calculate total loss in a fiber optic link.",
    fields: [
      { name: "fiberLength", label: "Fiber Length (km)", type: "number", min: 0.01, max: 200, defaultValue: 10 },
      { name: "fiberLoss", label: "Fiber Loss (dB/km)", type: "number", min: 0.1, max: 5, defaultValue: 0.35 },
      { name: "splices", label: "Number of Splices", type: "number", min: 0, max: 50, defaultValue: 4 },
      { name: "connectors", label: "Number of Connectors", type: "number", min: 0, max: 20, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const len = inputs.fiberLength as number;
      const loss = inputs.fiberLoss as number;
      const splices = inputs.splices as number;
      const conn = inputs.connectors as number;
      if (!len || !loss) return null;
      const fiberAtten = Math.round(len * loss * 100) / 100;
      const spliceLoss = Math.round(splices * 0.1 * 100) / 100;
      const connLoss = Math.round(conn * 0.5 * 100) / 100;
      const total = Math.round((fiberAtten + spliceLoss + connLoss) * 100) / 100;
      return {
        primary: { label: "Total Link Loss", value: formatNumber(total) + " dB" },
        details: [
          { label: "Fiber Attenuation", value: formatNumber(fiberAtten) + " dB" },
          { label: "Splice Loss", value: formatNumber(spliceLoss) + " dB" },
          { label: "Connector Loss", value: formatNumber(connLoss) + " dB" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is typical fiber loss per km?", answer: "Single mode fiber has about 0.35 dB/km at 1310 nm wavelength." },
    { question: "How much loss does a splice add?", answer: "A fusion splice adds about 0.1 dB of loss." },
  ],
  formula: "Total = (Length x dB/km) + (Splices x 0.1) + (Connectors x 0.5)",
};

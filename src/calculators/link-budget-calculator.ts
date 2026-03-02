import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const linkBudgetCalculator: CalculatorDefinition = {
  slug: "link-budget-calculator",
  title: "Link Budget Calculator",
  description: "Calculate RF link margin from transmit power and losses.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["link budget","RF link margin calculator"],
  variants: [{
    id: "standard",
    name: "Link Budget",
    description: "Calculate RF link margin from transmit power and losses.",
    fields: [
      { name: "txPower", label: "Transmit Power (dBm)", type: "number", min: -30, max: 60, defaultValue: 30 },
      { name: "txGain", label: "Tx Antenna Gain (dBi)", type: "number", min: 0, max: 60, defaultValue: 10 },
      { name: "rxGain", label: "Rx Antenna Gain (dBi)", type: "number", min: 0, max: 60, defaultValue: 10 },
      { name: "pathLoss", label: "Path Loss (dB)", type: "number", min: 0, max: 300, defaultValue: 100 },
      { name: "rxSensitivity", label: "Rx Sensitivity (dBm)", type: "number", min: -130, max: 0, defaultValue: -90 },
    ],
    calculate: (inputs) => {
      const txP = inputs.txPower as number;
      const txG = inputs.txGain as number;
      const rxG = inputs.rxGain as number;
      const pl = inputs.pathLoss as number;
      const rxS = inputs.rxSensitivity as number;
      if (txP === undefined || !txG || !rxG || !pl || !rxS) return null;
      const received = txP + txG + rxG - pl;
      const margin = Math.round((received - rxS) * 100) / 100;
      return {
        primary: { label: "Link Margin", value: formatNumber(margin) + " dB" },
        details: [
          { label: "Received Power", value: formatNumber(received) + " dBm" },
          { label: "EIRP", value: formatNumber(txP + txG) + " dBm" },
          { label: "Status", value: margin > 0 ? "Link Viable" : "Link Fails" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a link budget?", answer: "It sums gains and subtracts losses to find the received signal margin." },
    { question: "What link margin is considered safe?", answer: "A margin of at least 10 dB provides a reliable link." },
  ],
  formula: "Margin = Tx Power + Tx Gain + Rx Gain - Path Loss - Rx Sensitivity",
};

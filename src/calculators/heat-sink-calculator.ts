import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatSinkCalculator: CalculatorDefinition = {
  slug: "heat-sink-calculator",
  title: "Heat Sink Calculator",
  description: "Calculate required heat sink thermal resistance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["heat sink calculator","thermal resistance"],
  variants: [{
    id: "standard",
    name: "Heat Sink",
    description: "Calculate required heat sink thermal resistance.",
    fields: [
      { name: "powerW", label: "Power Dissipation (W)", type: "number", min: 0.1, max: 500, defaultValue: 10 },
      { name: "maxJunctionTemp", label: "Max Junction Temp (C)", type: "number", min: 50, max: 200, defaultValue: 125 },
      { name: "ambientTemp", label: "Ambient Temp (C)", type: "number", min: 0, max: 60, defaultValue: 25 },
      { name: "thetaJC", label: "Junction-to-Case Theta (C/W)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
      const power = inputs.powerW as number;
      const maxTj = inputs.maxJunctionTemp as number;
      const ambient = inputs.ambientTemp as number;
      const thetaJC = inputs.thetaJC as number;
      if (!power || !maxTj || !thetaJC) return null;
      const totalTheta = (maxTj - ambient) / power;
      const thetaCS = 0.5;
      const thetaHS = Math.round((totalTheta - thetaJC - thetaCS) * 100) / 100;
      const junctionTemp = Math.round(ambient + power * (thetaJC + thetaCS + Math.max(thetaHS, 0)));
      return {
        primary: { label: "Required Heat Sink Theta", value: formatNumber(Math.max(thetaHS, 0)) + " C/W" },
        details: [
          { label: "Total Thermal Budget", value: formatNumber(Math.round(totalTheta * 100) / 100) + " C/W" },
          { label: "Junction Temp (est.)", value: formatNumber(junctionTemp) + " C" },
          { label: "Feasible", value: thetaHS > 0 ? "Yes" : "No - reduce power or raise max temp" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is thermal resistance?", answer: "Thermal resistance measures how well heat flows, in degrees C per watt." },
    { question: "Lower thermal resistance is better?", answer: "Yes. Lower C/W means the heat sink dissipates heat more effectively." },
  ],
  formula: "Theta HS = (Tj Max - Ambient) / Power - Theta JC - Theta CS",
};

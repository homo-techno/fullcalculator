import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricalPowerCalculator: CalculatorDefinition = {
  slug: "electrical-power-calculator",
  title: "Electrical Power Calculator",
  description: "Free electrical power calculator. Calculate watts, volts, amps, and ohms using P=IV, P=I²R, P=V²/R.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["electrical power calculator", "watts calculator", "voltage current", "power formula", "P=IV calculator"],
  variants: [
    {
      id: "fromVI",
      name: "From Voltage & Current",
      fields: [
        { name: "V", label: "Voltage (V)", type: "number", placeholder: "e.g. 120" },
        { name: "I", label: "Current (A)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const V = inputs.V as number, I = inputs.I as number;
        if (!V || !I) return null;
        const P = V * I;
        const R = V / I;
        return {
          primary: { label: "Power", value: `${formatNumber(P, 4)} W` },
          details: [
            { label: "Resistance", value: `${formatNumber(R, 4)} Ω` },
            { label: "kW", value: formatNumber(P / 1000, 4) },
            { label: "HP", value: formatNumber(P / 745.7, 4) },
            { label: "Energy (1hr)", value: `${formatNumber(P / 1000, 4)} kWh` },
          ],
        };
      },
    },
    {
      id: "fromIR",
      name: "From Current & Resistance",
      fields: [
        { name: "I", label: "Current (A)", type: "number", placeholder: "e.g. 10" },
        { name: "R", label: "Resistance (Ω)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const I = inputs.I as number, R = inputs.R as number;
        if (!I || !R) return null;
        const P = I * I * R;
        const V = I * R;
        return {
          primary: { label: "Power", value: `${formatNumber(P, 4)} W` },
          details: [
            { label: "Voltage", value: `${formatNumber(V, 4)} V` },
            { label: "kW", value: formatNumber(P / 1000, 4) },
          ],
        };
      },
    },
    {
      id: "fromVR",
      name: "From Voltage & Resistance",
      fields: [
        { name: "V", label: "Voltage (V)", type: "number", placeholder: "e.g. 120" },
        { name: "R", label: "Resistance (Ω)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const V = inputs.V as number, R = inputs.R as number;
        if (!V || !R) return null;
        const P = (V * V) / R;
        const I = V / R;
        return {
          primary: { label: "Power", value: `${formatNumber(P, 4)} W` },
          details: [
            { label: "Current", value: `${formatNumber(I, 4)} A` },
            { label: "kW", value: formatNumber(P / 1000, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "resistance-calculator", "energy-calculator"],
  faq: [{ question: "How do I calculate electrical power?", answer: "P = I × V (watts = amps × volts). Also: P = I²R and P = V²/R. For household circuits: a 120V outlet with a 10A appliance uses 1,200W (1.2 kW)." }],
  formula: "P = IV | P = I²R | P = V²/R",
};

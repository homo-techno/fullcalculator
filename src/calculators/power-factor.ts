import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerFactorCalculator: CalculatorDefinition = {
  slug: "power-factor-calculator",
  title: "Power Factor Calculator",
  description:
    "Free power factor calculator. Compute real, apparent, and reactive power from voltage, current, and power factor.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "power factor",
    "real power",
    "apparent power",
    "reactive power",
    "AC circuit",
    "PF",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Power Components",
      fields: [
        {
          name: "voltage",
          label: "Voltage (V)",
          type: "number",
          placeholder: "e.g. 230",
        },
        {
          name: "current",
          label: "Current (A)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "pf",
          label: "Power Factor (0 to 1)",
          type: "number",
          placeholder: "e.g. 0.85",
        },
      ],
      calculate: (inputs) => {
        const V = inputs.voltage as number;
        const I = inputs.current as number;
        const pf = inputs.pf as number;
        if (!V || !I || !pf) return null;
        if (pf < 0 || pf > 1) return null;

        const S = V * I; // apparent power (VA)
        const P = S * pf; // real power (W)
        const phiRad = Math.acos(pf);
        const Q = S * Math.sin(phiRad); // reactive power (VAR)
        const phiDeg = phiRad * (180 / Math.PI);

        return {
          primary: {
            label: "Real Power (P)",
            value: formatNumber(P, 4) + " W",
          },
          details: [
            {
              label: "Apparent Power (S)",
              value: formatNumber(S, 4) + " VA",
            },
            {
              label: "Reactive Power (Q)",
              value: formatNumber(Q, 4) + " VAR",
            },
            { label: "Power Factor", value: formatNumber(pf, 4) },
            {
              label: "Phase Angle (φ)",
              value: formatNumber(phiDeg, 2) + "°",
            },
            { label: "Voltage", value: formatNumber(V, 4) + " V" },
            { label: "Current", value: formatNumber(I, 4) + " A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["circuit-calculator", "transformer-calculator"],
  faq: [
    {
      question: "What is power factor?",
      answer:
        "Power factor is the ratio of real power (W) to apparent power (VA). PF = P/S = cos(φ). A PF of 1 means all power is doing useful work; lower values indicate reactive losses.",
    },
    {
      question: "What is reactive power?",
      answer:
        "Reactive power (Q, in VAR) is power stored and released by inductors and capacitors. It does no useful work but increases the current flowing in the system.",
    },
  ],
  formula:
    "S = V × I (apparent power). P = S × PF (real power). Q = S × sin(arccos(PF)) (reactive power). PF = cos(φ).",
};

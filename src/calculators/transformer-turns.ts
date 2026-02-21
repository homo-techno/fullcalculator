import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transformerTurnsCalculator: CalculatorDefinition = {
  slug: "transformer-turns-calculator",
  title: "Transformer Turns Ratio Calculator",
  description:
    "Free transformer turns ratio calculator. Calculate primary/secondary turns, voltage, and current for ideal transformers. Includes step-up and step-down configurations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "transformer turns ratio",
    "transformer calculator",
    "turns ratio",
    "step up transformer",
    "step down transformer",
    "transformer design",
  ],
  variants: [
    {
      id: "voltage-to-turns",
      name: "Voltage to Turns Ratio",
      description: "Np/Ns = Vp/Vs",
      fields: [
        {
          name: "primaryVoltage",
          label: "Primary Voltage (V)",
          type: "number",
          placeholder: "e.g. 240",
        },
        {
          name: "secondaryVoltage",
          label: "Secondary Voltage (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "power",
          label: "Transformer Power Rating (VA)",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const vp = inputs.primaryVoltage as number;
        const vs = inputs.secondaryVoltage as number;
        const power = inputs.power as number;
        if (!vp || !vs) return null;

        const turnsRatio = vp / vs;
        const type = vp > vs ? "Step-Down" : vp < vs ? "Step-Up" : "Isolation (1:1)";
        const primaryCurrent = power ? power / vp : 0;
        const secondaryCurrent = power ? power / vs : 0;
        const impedanceRatio = turnsRatio * turnsRatio;

        return {
          primary: {
            label: "Turns Ratio (Np:Ns)",
            value: `${formatNumber(turnsRatio, 4)}:1`,
          },
          details: [
            { label: "Turns Ratio (Np/Ns)", value: `${formatNumber(turnsRatio, 4)}:1` },
            { label: "Inverse Ratio (Ns/Np)", value: `1:${formatNumber(1 / turnsRatio, 4)}` },
            { label: "Type", value: type },
            ...(power ? [
              { label: "Primary Current", value: `${formatNumber(primaryCurrent, 4)} A` },
              { label: "Secondary Current", value: `${formatNumber(secondaryCurrent, 4)} A` },
            ] : []),
            { label: "Impedance Ratio", value: `${formatNumber(impedanceRatio, 4)}:1` },
          ],
        };
      },
    },
    {
      id: "calculate-voltage",
      name: "Calculate Secondary Voltage",
      description: "Vs = Vp × (Ns / Np)",
      fields: [
        {
          name: "primaryVoltage",
          label: "Primary Voltage (V)",
          type: "number",
          placeholder: "e.g. 240",
        },
        {
          name: "primaryTurns",
          label: "Primary Turns (Np)",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "secondaryTurns",
          label: "Secondary Turns (Ns)",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const vp = inputs.primaryVoltage as number;
        const np = inputs.primaryTurns as number;
        const ns = inputs.secondaryTurns as number;
        if (!vp || !np || !ns) return null;

        const vs = vp * (ns / np);
        const turnsRatio = np / ns;
        const type = np > ns ? "Step-Down" : np < ns ? "Step-Up" : "Isolation (1:1)";

        return {
          primary: {
            label: "Secondary Voltage",
            value: `${formatNumber(vs, 4)} V`,
          },
          details: [
            { label: "Secondary Voltage (Vs)", value: `${formatNumber(vs, 4)} V` },
            { label: "Primary Voltage (Vp)", value: `${formatNumber(vp, 4)} V` },
            { label: "Turns Ratio (Np:Ns)", value: `${np}:${ns} (${formatNumber(turnsRatio, 4)}:1)` },
            { label: "Type", value: type },
            { label: "Volts per Turn", value: `${formatNumber(vp / np, 4)} V/turn` },
          ],
        };
      },
    },
    {
      id: "impedance-matching",
      name: "Impedance Matching",
      description: "Calculate turns ratio for impedance matching: n = √(Zp/Zs)",
      fields: [
        {
          name: "sourceImpedance",
          label: "Source Impedance (Ω)",
          type: "number",
          placeholder: "e.g. 600",
        },
        {
          name: "loadImpedance",
          label: "Load Impedance (Ω)",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const zs = inputs.sourceImpedance as number;
        const zl = inputs.loadImpedance as number;
        if (!zs || !zl) return null;

        const turnsRatio = Math.sqrt(zs / zl);
        const impedanceRatio = zs / zl;

        return {
          primary: {
            label: "Required Turns Ratio",
            value: `${formatNumber(turnsRatio, 4)}:1`,
          },
          details: [
            { label: "Turns Ratio (n)", value: `${formatNumber(turnsRatio, 4)}:1` },
            { label: "Impedance Ratio (n²)", value: `${formatNumber(impedanceRatio, 2)}:1` },
            { label: "Source Impedance", value: `${formatNumber(zs, 2)} Ω` },
            { label: "Load Impedance", value: `${formatNumber(zl, 2)} Ω` },
          ],
          note: "Maximum power transfer occurs when the reflected load impedance equals the source impedance.",
        };
      },
    },
  ],
  relatedSlugs: ["transformer-calculator", "ohms-law-calculator", "three-phase-power-calculator"],
  faq: [
    {
      question: "What is a transformer turns ratio?",
      answer:
        "The turns ratio is the ratio of the number of turns in the primary winding to the secondary winding (Np/Ns). It determines the voltage transformation: Vs = Vp × (Ns/Np). A turns ratio greater than 1 is step-down; less than 1 is step-up.",
    },
    {
      question: "How does a transformer work?",
      answer:
        "A transformer transfers electrical energy between circuits through electromagnetic induction. AC current in the primary winding creates a changing magnetic field in the core, which induces a voltage in the secondary winding. The voltage ratio equals the turns ratio.",
    },
    {
      question: "What is impedance matching with transformers?",
      answer:
        "A transformer can match impedances between source and load for maximum power transfer. The impedance transformation follows: Zp = n² × Zs, where n is the turns ratio. For example, to match a 600Ω source to an 8Ω speaker, you need a turns ratio of √(600/8) ≈ 8.66:1.",
    },
  ],
  formula:
    "Vp/Vs = Np/Ns = Is/Ip | Vs = Vp × (Ns/Np) | Zp = n² × Zs | n = √(Zp/Zs) | Power: Pp = Ps (ideal)",
};

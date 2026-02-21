import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rlTimeConstantCalculator: CalculatorDefinition = {
  slug: "rl-time-constant-calculator",
  title: "RL Time Constant Calculator",
  description:
    "Free RL time constant calculator. Calculate the time constant (τ), current rise time, and current at any time for RL circuits.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "rl time constant",
    "rl circuit",
    "inductor time constant",
    "tau calculator",
    "inductor charging",
    "rl filter",
  ],
  variants: [
    {
      id: "time-constant",
      name: "RL Time Constant (τ)",
      description: "Calculate τ = L / R",
      fields: [
        {
          name: "inductance",
          label: "Inductance",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "inductanceUnit",
          label: "Inductance Unit",
          type: "select",
          options: [
            { label: "H (Henrys)", value: "1" },
            { label: "mH (Millihenrys)", value: "0.001" },
            { label: "µH (Microhenrys)", value: "0.000001" },
            { label: "nH (Nanohenrys)", value: "0.000000001" },
          ],
          defaultValue: "0.001",
        },
        {
          name: "resistance",
          label: "Resistance",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "resistanceUnit",
          label: "Resistance Unit",
          type: "select",
          options: [
            { label: "Ω (Ohms)", value: "1" },
            { label: "kΩ (Kilohms)", value: "1000" },
            { label: "MΩ (Megohms)", value: "1000000" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const l = inputs.inductance as number;
        const lUnit = Number(inputs.inductanceUnit);
        const r = inputs.resistance as number;
        const rUnit = Number(inputs.resistanceUnit);
        if (!l || !r) return null;

        const lHenrys = l * lUnit;
        const rOhms = r * rUnit;
        const tau = lHenrys / rOhms;

        const fc = rOhms / (2 * Math.PI * lHenrys);

        const formatTime = (t: number): string => {
          if (t >= 1) return `${formatNumber(t, 4)} s`;
          if (t >= 0.001) return `${formatNumber(t * 1000, 4)} ms`;
          if (t >= 0.000001) return `${formatNumber(t * 1e6, 4)} µs`;
          return `${formatNumber(t * 1e9, 4)} ns`;
        };

        return {
          primary: {
            label: "Time Constant (τ)",
            value: formatTime(tau),
          },
          details: [
            { label: "τ (seconds)", value: `${formatNumber(tau, 6)} s` },
            { label: "Time to 63.2% (1τ)", value: formatTime(tau) },
            { label: "Time to 86.5% (2τ)", value: formatTime(tau * 2) },
            { label: "Time to 95.0% (3τ)", value: formatTime(tau * 3) },
            { label: "Time to 98.2% (4τ)", value: formatTime(tau * 4) },
            { label: "Time to 99.3% (5τ)", value: formatTime(tau * 5) },
            { label: "Cutoff Frequency (fc)", value: `${formatNumber(fc, 4)} Hz` },
          ],
        };
      },
    },
    {
      id: "current-at-time",
      name: "Current at Time t",
      description: "Calculate inductor current during energizing: I(t) = (V/R) × (1 - e^(-t/τ))",
      fields: [
        {
          name: "voltage",
          label: "Supply Voltage (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "resistance",
          label: "Resistance (Ω)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "inductance",
          label: "Inductance (mH)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "time",
          label: "Time (ms)",
          type: "number",
          placeholder: "e.g. 0.5",
        },
      ],
      calculate: (inputs) => {
        const v = inputs.voltage as number;
        const r = inputs.resistance as number;
        const lMh = inputs.inductance as number;
        const tMs = inputs.time as number;
        if (!v || !r || !lMh || tMs === undefined || tMs === null) return null;

        const l = lMh / 1000;
        const t = tMs / 1000;
        const tau = l / r;
        const iMax = v / r;
        const it = iMax * (1 - Math.exp(-t / tau));
        const currentPercent = (it / iMax) * 100;
        const vl = v * Math.exp(-t / tau);

        return {
          primary: {
            label: "Current at Time t",
            value: `${formatNumber(it * 1000, 4)} mA`,
          },
          details: [
            { label: "Current I(t)", value: `${formatNumber(it * 1000, 4)} mA` },
            { label: "Max Steady-State Current", value: `${formatNumber(iMax * 1000, 4)} mA` },
            { label: "Current Level", value: `${formatNumber(currentPercent, 2)}%` },
            { label: "Inductor Voltage at t", value: `${formatNumber(vl, 4)} V` },
            { label: "Time Constant (τ)", value: `${formatNumber(tau * 1000, 4)} ms` },
            { label: "t / τ Ratio", value: formatNumber(t / tau, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rc-time-constant-calculator", "inductance-calculator", "ohms-law-calculator"],
  faq: [
    {
      question: "What is an RL time constant?",
      answer:
        "The RL time constant (τ = L/R) is the time it takes for the current through an inductor to reach approximately 63.2% of its final steady-state value. After 5τ, the current is considered to have reached its maximum value (99.3%).",
    },
    {
      question: "How does an RL circuit differ from an RC circuit?",
      answer:
        "In an RC circuit, voltage across the capacitor rises exponentially (τ = RC). In an RL circuit, current through the inductor rises exponentially (τ = L/R). Capacitors oppose voltage changes while inductors oppose current changes.",
    },
    {
      question: "What happens when an RL circuit is de-energized?",
      answer:
        "When the voltage source is removed, the inductor tries to maintain current flow, producing a voltage spike (back-EMF). The current decays exponentially: I(t) = I₀ × e^(-t/τ). This is why flyback diodes are used with inductive loads.",
    },
  ],
  formula:
    "τ = L / R | I(t) = (V/R) × (1 - e^(-t/τ)) [energizing] | I(t) = I₀ × e^(-t/τ) [de-energizing] | fc = R / (2πL)",
};

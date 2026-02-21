import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rcTimeConstantCalculator: CalculatorDefinition = {
  slug: "rc-time-constant-calculator",
  title: "RC Time Constant Calculator",
  description:
    "Free RC time constant calculator. Calculate the time constant (τ), charging time, and voltage at any time for RC circuits.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "rc time constant",
    "rc circuit",
    "tau calculator",
    "capacitor charging",
    "rc filter",
    "time constant calculator",
  ],
  variants: [
    {
      id: "time-constant",
      name: "RC Time Constant (τ)",
      description: "Calculate τ = R × C",
      fields: [
        {
          name: "resistance",
          label: "Resistance",
          type: "number",
          placeholder: "e.g. 10000",
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
        {
          name: "capacitance",
          label: "Capacitance",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "capacitanceUnit",
          label: "Capacitance Unit",
          type: "select",
          options: [
            { label: "F (Farads)", value: "1" },
            { label: "mF (Millifarads)", value: "0.001" },
            { label: "µF (Microfarads)", value: "0.000001" },
            { label: "nF (Nanofarads)", value: "0.000000001" },
            { label: "pF (Picofarads)", value: "0.000000000001" },
          ],
          defaultValue: "0.000001",
        },
      ],
      calculate: (inputs) => {
        const r = inputs.resistance as number;
        const rUnit = Number(inputs.resistanceUnit);
        const c = inputs.capacitance as number;
        const cUnit = Number(inputs.capacitanceUnit);
        if (!r || !c) return null;

        const rOhms = r * rUnit;
        const cFarads = c * cUnit;
        const tau = rOhms * cFarads;

        // Cutoff frequency for RC filter
        const fc = 1 / (2 * Math.PI * tau);

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
      id: "voltage-at-time",
      name: "Voltage at Time t",
      description: "Calculate capacitor voltage during charging: V(t) = Vs × (1 - e^(-t/τ))",
      fields: [
        {
          name: "supplyVoltage",
          label: "Supply Voltage (V)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "resistance",
          label: "Resistance (Ω)",
          type: "number",
          placeholder: "e.g. 10000",
        },
        {
          name: "capacitance",
          label: "Capacitance (µF)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "time",
          label: "Time (ms)",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const vs = inputs.supplyVoltage as number;
        const r = inputs.resistance as number;
        const cUf = inputs.capacitance as number;
        const tMs = inputs.time as number;
        if (!vs || !r || !cUf || tMs === undefined || tMs === null) return null;

        const c = cUf * 1e-6;
        const t = tMs / 1000;
        const tau = r * c;
        const vt = vs * (1 - Math.exp(-t / tau));
        const chargePercent = (vt / vs) * 100;
        const current = (vs / r) * Math.exp(-t / tau);

        return {
          primary: {
            label: "Capacitor Voltage at t",
            value: `${formatNumber(vt, 4)} V`,
          },
          details: [
            { label: "Voltage V(t)", value: `${formatNumber(vt, 4)} V` },
            { label: "Charge Level", value: `${formatNumber(chargePercent, 2)}%` },
            { label: "Current at t", value: `${formatNumber(current * 1000, 4)} mA` },
            { label: "Time Constant (τ)", value: `${formatNumber(tau * 1000, 4)} ms` },
            { label: "t / τ Ratio", value: formatNumber(t / tau, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rl-time-constant-calculator", "capacitance-calculator", "ohms-law-calculator"],
  faq: [
    {
      question: "What is an RC time constant?",
      answer:
        "The RC time constant (τ = R × C) is the time it takes for a capacitor to charge to approximately 63.2% of the supply voltage, or discharge to 36.8% of its initial voltage. After 5τ, the capacitor is considered fully charged (99.3%).",
    },
    {
      question: "What are RC circuits used for?",
      answer:
        "RC circuits are used in timing circuits, filters (low-pass and high-pass), signal coupling and decoupling, power supply smoothing, debouncing switches, and wave-shaping circuits. The cutoff frequency of an RC filter is fc = 1/(2πRC).",
    },
    {
      question: "How long does it take to fully charge a capacitor?",
      answer:
        "Theoretically, a capacitor never fully charges in an RC circuit. In practice, after 5 time constants (5τ), the capacitor reaches 99.3% of the supply voltage, which is considered fully charged for most applications.",
    },
  ],
  formula:
    "τ = R × C | V(t) = Vs × (1 - e^(-t/τ)) [charging] | V(t) = V₀ × e^(-t/τ) [discharging] | fc = 1 / (2πRC)",
};

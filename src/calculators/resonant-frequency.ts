import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const resonantFrequencyCalculator: CalculatorDefinition = {
  slug: "resonant-frequency-calculator",
  title: "Resonant Frequency Calculator",
  description:
    "Free LC resonant frequency calculator. Calculate the resonant frequency of an LC circuit from inductance and capacitance values. f = 1 / (2π√(LC)).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "resonant frequency",
    "LC circuit",
    "resonance calculator",
    "tank circuit",
    "tuned circuit",
    "oscillator frequency",
  ],
  variants: [
    {
      id: "find-frequency",
      name: "Find Resonant Frequency",
      description: "f = 1 / (2π√(LC))",
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
          defaultValue: "0.000001",
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
          defaultValue: "0.000000000001",
        },
      ],
      calculate: (inputs) => {
        const l = inputs.inductance as number;
        const lUnit = Number(inputs.inductanceUnit);
        const c = inputs.capacitance as number;
        const cUnit = Number(inputs.capacitanceUnit);
        if (!l || !c) return null;

        const lH = l * lUnit;
        const cF = c * cUnit;
        const freq = 1 / (2 * Math.PI * Math.sqrt(lH * cF));
        const omega = 2 * Math.PI * freq;
        const wavelength = 299792458 / freq;

        const formatFreq = (f: number): string => {
          if (f >= 1e9) return `${formatNumber(f / 1e9, 4)} GHz`;
          if (f >= 1e6) return `${formatNumber(f / 1e6, 4)} MHz`;
          if (f >= 1e3) return `${formatNumber(f / 1e3, 4)} kHz`;
          return `${formatNumber(f, 4)} Hz`;
        };

        return {
          primary: {
            label: "Resonant Frequency",
            value: formatFreq(freq),
          },
          details: [
            { label: "Frequency", value: formatFreq(freq) },
            { label: "Frequency (Hz)", value: `${formatNumber(freq, 2)} Hz` },
            { label: "Angular Frequency (ω)", value: `${formatNumber(omega, 2)} rad/s` },
            { label: "Period", value: `${formatNumber(1 / freq * 1e6, 4)} µs` },
            { label: "Wavelength", value: `${formatNumber(wavelength, 2)} m` },
            { label: "Impedance at Resonance", value: `${formatNumber(Math.sqrt(lH / cF), 4)} Ω` },
          ],
        };
      },
    },
    {
      id: "find-capacitance",
      name: "Find Required Capacitance",
      description: "C = 1 / (4π²f²L)",
      fields: [
        {
          name: "frequency",
          label: "Desired Frequency",
          type: "number",
          placeholder: "e.g. 7.2",
        },
        {
          name: "freqUnit",
          label: "Frequency Unit",
          type: "select",
          options: [
            { label: "Hz", value: "1" },
            { label: "kHz", value: "1000" },
            { label: "MHz", value: "1000000" },
            { label: "GHz", value: "1000000000" },
          ],
          defaultValue: "1000000",
        },
        {
          name: "inductance",
          label: "Inductance",
          type: "number",
          placeholder: "e.g. 10",
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
          defaultValue: "0.000001",
        },
      ],
      calculate: (inputs) => {
        const freq = inputs.frequency as number;
        const fUnit = Number(inputs.freqUnit);
        const l = inputs.inductance as number;
        const lUnit = Number(inputs.inductanceUnit);
        if (!freq || !l) return null;

        const fHz = freq * fUnit;
        const lH = l * lUnit;
        const cF = 1 / (4 * Math.PI * Math.PI * fHz * fHz * lH);

        const formatCap = (cap: number): string => {
          if (cap >= 1) return `${formatNumber(cap, 4)} F`;
          if (cap >= 0.001) return `${formatNumber(cap * 1e3, 4)} mF`;
          if (cap >= 1e-6) return `${formatNumber(cap * 1e6, 4)} µF`;
          if (cap >= 1e-9) return `${formatNumber(cap * 1e9, 4)} nF`;
          return `${formatNumber(cap * 1e12, 4)} pF`;
        };

        return {
          primary: {
            label: "Required Capacitance",
            value: formatCap(cF),
          },
          details: [
            { label: "Capacitance", value: formatCap(cF) },
            { label: "Capacitance (F)", value: `${formatNumber(cF, 10)} F` },
            { label: "Impedance at Resonance", value: `${formatNumber(Math.sqrt(lH / cF), 4)} Ω` },
          ],
        };
      },
    },
    {
      id: "find-inductance",
      name: "Find Required Inductance",
      description: "L = 1 / (4π²f²C)",
      fields: [
        {
          name: "frequency",
          label: "Desired Frequency",
          type: "number",
          placeholder: "e.g. 7.2",
        },
        {
          name: "freqUnit",
          label: "Frequency Unit",
          type: "select",
          options: [
            { label: "Hz", value: "1" },
            { label: "kHz", value: "1000" },
            { label: "MHz", value: "1000000" },
            { label: "GHz", value: "1000000000" },
          ],
          defaultValue: "1000000",
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
            { label: "µF (Microfarads)", value: "0.000001" },
            { label: "nF (Nanofarads)", value: "0.000000001" },
            { label: "pF (Picofarads)", value: "0.000000000001" },
          ],
          defaultValue: "0.000000000001",
        },
      ],
      calculate: (inputs) => {
        const freq = inputs.frequency as number;
        const fUnit = Number(inputs.freqUnit);
        const c = inputs.capacitance as number;
        const cUnit = Number(inputs.capacitanceUnit);
        if (!freq || !c) return null;

        const fHz = freq * fUnit;
        const cF = c * cUnit;
        const lH = 1 / (4 * Math.PI * Math.PI * fHz * fHz * cF);

        const formatInd = (ind: number): string => {
          if (ind >= 1) return `${formatNumber(ind, 4)} H`;
          if (ind >= 0.001) return `${formatNumber(ind * 1e3, 4)} mH`;
          if (ind >= 1e-6) return `${formatNumber(ind * 1e6, 4)} µH`;
          return `${formatNumber(ind * 1e9, 4)} nH`;
        };

        return {
          primary: {
            label: "Required Inductance",
            value: formatInd(lH),
          },
          details: [
            { label: "Inductance", value: formatInd(lH) },
            { label: "Inductance (H)", value: `${formatNumber(lH, 10)} H` },
            { label: "Impedance at Resonance", value: `${formatNumber(Math.sqrt(lH / cF), 4)} Ω` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["coil-inductance-calculator", "antenna-length-calculator", "wavelength-calculator"],
  faq: [
    {
      question: "What is resonant frequency?",
      answer:
        "The resonant frequency of an LC circuit is the frequency at which the inductive and capacitive reactances are equal and cancel each other out. At resonance, the circuit impedance is purely resistive, and energy oscillates between the inductor's magnetic field and the capacitor's electric field.",
    },
    {
      question: "What is a tank circuit?",
      answer:
        "A tank circuit (or LC circuit) consists of an inductor and capacitor connected in parallel or series. At resonance, it stores energy by oscillating it between the inductor and capacitor. Tank circuits are used in radio transmitters, receivers, filters, and oscillators.",
    },
    {
      question: "What determines the bandwidth of an LC circuit?",
      answer:
        "The bandwidth is determined by the Q factor (quality factor): BW = f₀/Q. The Q factor depends on the resistance in the circuit: Q = (1/R)×√(L/C) for series, or Q = R×√(C/L) for parallel. Higher Q means narrower bandwidth and sharper tuning.",
    },
  ],
  formula:
    "f = 1 / (2π√(LC)) | C = 1 / (4π²f²L) | L = 1 / (4π²f²C) | ω₀ = 1 / √(LC)",
};

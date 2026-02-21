import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frequencyCalculator: CalculatorDefinition = {
  slug: "frequency-calculator",
  title: "Frequency Calculator",
  description: "Free frequency calculator. Convert between frequency, period, and wavelength. Calculate Hz, kHz, MHz, GHz.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["frequency calculator", "hertz calculator", "period calculator", "wavelength frequency", "frequency converter"],
  variants: [
    {
      id: "fromFreq",
      name: "From Frequency",
      fields: [
        { name: "freq", label: "Frequency", type: "number", placeholder: "e.g. 440" },
        {
          name: "unit", label: "Unit", type: "select",
          options: [
            { label: "Hz", value: "1" }, { label: "kHz", value: "1000" },
            { label: "MHz", value: "1000000" }, { label: "GHz", value: "1000000000" },
          ],
        },
      ],
      calculate: (inputs) => {
        const freq = inputs.freq as number, mult = parseFloat((inputs.unit as string) || "1");
        if (!freq) return null;
        const hz = freq * mult;
        const period = 1 / hz;
        const wavelengthM = 299792458 / hz;
        let periodStr: string;
        if (period < 1e-6) periodStr = `${formatNumber(period * 1e9, 4)} ns`;
        else if (period < 1e-3) periodStr = `${formatNumber(period * 1e6, 4)} μs`;
        else if (period < 1) periodStr = `${formatNumber(period * 1000, 4)} ms`;
        else periodStr = `${formatNumber(period, 6)} s`;
        return {
          primary: { label: "Period", value: periodStr },
          details: [
            { label: "Frequency (Hz)", value: formatNumber(hz, 4) },
            { label: "Wavelength (EM)", value: wavelengthM > 1 ? `${formatNumber(wavelengthM, 4)} m` : `${formatNumber(wavelengthM * 100, 4)} cm` },
            { label: "Angular freq (ω)", value: `${formatNumber(2 * Math.PI * hz, 4)} rad/s` },
          ],
        };
      },
    },
    {
      id: "fromPeriod",
      name: "From Period",
      fields: [
        { name: "period", label: "Period", type: "number", placeholder: "e.g. 0.002273" },
        {
          name: "unit", label: "Unit", type: "select",
          options: [
            { label: "seconds", value: "1" }, { label: "milliseconds", value: "0.001" },
            { label: "microseconds", value: "0.000001" }, { label: "nanoseconds", value: "0.000000001" },
          ],
        },
      ],
      calculate: (inputs) => {
        const p = inputs.period as number, mult = parseFloat((inputs.unit as string) || "1");
        if (!p) return null;
        const periodSec = p * mult;
        const hz = 1 / periodSec;
        let freqStr: string;
        if (hz >= 1e9) freqStr = `${formatNumber(hz / 1e9, 4)} GHz`;
        else if (hz >= 1e6) freqStr = `${formatNumber(hz / 1e6, 4)} MHz`;
        else if (hz >= 1e3) freqStr = `${formatNumber(hz / 1e3, 4)} kHz`;
        else freqStr = `${formatNumber(hz, 4)} Hz`;
        return {
          primary: { label: "Frequency", value: freqStr },
          details: [
            { label: "Frequency (Hz)", value: formatNumber(hz, 4) },
            { label: "Period (s)", value: formatNumber(periodSec, 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wavelength-calculator", "speed-calculator", "scientific-calculator"],
  faq: [{ question: "What is the relationship between frequency and period?", answer: "Frequency (f) and period (T) are inversely related: f = 1/T. Frequency is measured in Hertz (Hz) = cycles per second. For electromagnetic waves: λ = c/f where c = speed of light." }],
  formula: "f = 1/T | ω = 2πf | λ = c/f",
};

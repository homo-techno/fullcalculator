import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const signalToNoiseCalculator: CalculatorDefinition = {
  slug: "signal-to-noise-calculator",
  title: "Signal-to-Noise Ratio Calculator",
  description: "Free SNR calculator. Calculate signal-to-noise ratio in decibels for electronics, audio, and communications.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["signal to noise ratio", "SNR calculator", "dB calculator", "noise floor", "signal quality"],
  variants: [
    {
      id: "fromPower",
      name: "SNR from Power",
      fields: [
        { name: "signal", label: "Signal Power (watts)", type: "number", placeholder: "e.g. 50" },
        { name: "noise", label: "Noise Power (watts)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const signal = inputs.signal as number, noise = inputs.noise as number;
        if (!signal || !noise) return null;
        const snrLinear = signal / noise;
        const snrDb = 10 * Math.log10(snrLinear);
        let quality = "Poor";
        if (snrDb >= 40) quality = "Excellent";
        else if (snrDb >= 25) quality = "Good";
        else if (snrDb >= 15) quality = "Acceptable";
        else if (snrDb >= 10) quality = "Low";
        return {
          primary: { label: "SNR", value: `${formatNumber(snrDb, 2)} dB` },
          details: [
            { label: "Signal power", value: `${signal} W` },
            { label: "Noise power", value: `${noise} W` },
            { label: "Linear ratio", value: formatNumber(snrLinear, 2) },
            { label: "Signal quality", value: quality },
          ],
        };
      },
    },
    {
      id: "fromDb",
      name: "Convert dB to Linear",
      fields: [
        { name: "snrDb", label: "SNR (dB)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const snrDb = inputs.snrDb as number;
        if (snrDb === undefined || snrDb === null) return null;
        const powerRatio = Math.pow(10, snrDb / 10);
        const voltageRatio = Math.pow(10, snrDb / 20);
        return {
          primary: { label: `${snrDb} dB`, value: `${formatNumber(powerRatio, 4)}× power` },
          details: [
            { label: "Power ratio", value: `${formatNumber(powerRatio, 4)}×` },
            { label: "Voltage/amplitude ratio", value: `${formatNumber(voltageRatio, 4)}×` },
            { label: "SNR (dB)", value: `${snrDb} dB` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["noise-level-calculator", "frequency-calculator", "electrical-power-calculator"],
  faq: [{ question: "What is a good SNR?", answer: "It depends on the application. For Wi-Fi: 25+ dB is good. For audio recording: 60+ dB is professional quality. For digital communications: 10+ dB is often sufficient. Higher SNR means cleaner signal with less noise interference." }],
  formula: "SNR (dB) = 10 × log₁₀(P_signal / P_noise)",
};

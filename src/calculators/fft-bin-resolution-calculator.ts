import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fftBinResolutionCalculator: CalculatorDefinition = {
  slug: "fft-bin-resolution-calculator",
  title: "FFT Bin Resolution Calculator",
  description: "Calculate FFT frequency resolution from sample rate and size.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["FFT resolution","frequency bin calculator"],
  variants: [{
    id: "standard",
    name: "FFT Bin Resolution",
    description: "Calculate FFT frequency resolution from sample rate and size.",
    fields: [
      { name: "sampleRate", label: "Sample Rate (Hz)", type: "number", min: 1, max: 1000000000, defaultValue: 44100 },
      { name: "fftSize", label: "FFT Size (points)", type: "number", min: 16, max: 1048576, defaultValue: 4096 },
    ],
    calculate: (inputs) => {
      const fs = inputs.sampleRate as number;
      const n = inputs.fftSize as number;
      if (!fs || !n) return null;
      const binRes = Math.round(fs / n * 10000) / 10000;
      const maxFreq = fs / 2;
      const numBins = n / 2;
      const windowTime = Math.round(n / fs * 10000) / 10000;
      return {
        primary: { label: "Frequency Resolution", value: formatNumber(binRes) + " Hz" },
        details: [
          { label: "Number of Bins", value: formatNumber(numBins) },
          { label: "Max Frequency", value: formatNumber(maxFreq) + " Hz" },
          { label: "Window Duration", value: formatNumber(windowTime) + " s" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How do I improve FFT frequency resolution?", answer: "Increase the FFT size or lower the sample rate to get finer bins." },
    { question: "What is an FFT bin?", answer: "Each bin represents a frequency range equal to sample rate divided by FFT size." },
  ],
  formula: "Bin Resolution = Sample Rate / FFT Size",
};

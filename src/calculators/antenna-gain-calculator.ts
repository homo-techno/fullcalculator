import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const antennaGainCalculator: CalculatorDefinition = {
  slug: "antenna-gain-calculator",
  title: "Antenna Gain Calculator",
  description: "Calculate antenna gain in dBi from efficiency and aperture.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["antenna gain","dBi calculator"],
  variants: [{
    id: "standard",
    name: "Antenna Gain",
    description: "Calculate antenna gain in dBi from efficiency and aperture.",
    fields: [
      { name: "frequency", label: "Frequency (MHz)", type: "number", min: 1, max: 100000, defaultValue: 2400 },
      { name: "diameter", label: "Dish Diameter (m)", type: "number", min: 0.1, max: 30, defaultValue: 1 },
      { name: "efficiency", label: "Aperture Efficiency (%)", type: "number", min: 10, max: 100, defaultValue: 55 },
    ],
    calculate: (inputs) => {
      const freq = inputs.frequency as number;
      const dia = inputs.diameter as number;
      const eff = inputs.efficiency as number;
      if (!freq || !dia || !eff) return null;
      const wavelength = 300 / freq;
      const area = Math.PI * Math.pow(dia / 2, 2);
      const gainLinear = (eff / 100) * 4 * Math.PI * area / Math.pow(wavelength, 2);
      const gainDbi = Math.round(10 * Math.log10(gainLinear) * 100) / 100;
      return {
        primary: { label: "Antenna Gain", value: formatNumber(gainDbi) + " dBi" },
        details: [
          { label: "Wavelength", value: formatNumber(Math.round(wavelength * 1000) / 1000) + " m" },
          { label: "Aperture Area", value: formatNumber(Math.round(area * 1000) / 1000) + " sq m" },
          { label: "Linear Gain", value: formatNumber(Math.round(gainLinear * 100) / 100) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is antenna gain in dBi?", answer: "Gain in dBi is the directional power relative to an isotropic radiator." },
    { question: "Does a larger dish mean more gain?", answer: "Yes. Doubling the diameter roughly adds 6 dB of gain." },
  ],
  formula: "Gain (dBi) = 10 log10(efficiency x 4 pi A / wavelength^2)",
};

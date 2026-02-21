import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wavelengthCalculator: CalculatorDefinition = {
  slug: "wavelength-calculator",
  title: "Wavelength Calculator",
  description: "Free wavelength calculator. Calculate wavelength, frequency, or wave speed. Convert between Hz, kHz, MHz, and GHz.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wavelength calculator", "frequency calculator", "wave speed calculator", "hz to wavelength", "wavelength frequency"],
  variants: [
    {
      id: "wave",
      name: "Wavelength / Frequency",
      description: "λ = v / f (for electromagnetic waves, v = speed of light)",
      fields: [
        { name: "frequency", label: "Frequency", type: "number", placeholder: "e.g. 100" },
        { name: "freqUnit", label: "Frequency Unit", type: "select", options: [
          { label: "Hz", value: "1" }, { label: "kHz", value: "1000" },
          { label: "MHz", value: "1e6" }, { label: "GHz", value: "1e9" },
        ], defaultValue: "1e6" },
        { name: "medium", label: "Medium", type: "select", options: [
          { label: "Light/Radio (vacuum)", value: "299792458" },
          { label: "Sound in air (20°C)", value: "343" },
          { label: "Sound in water", value: "1480" },
        ], defaultValue: "299792458" },
      ],
      calculate: (inputs) => {
        const freq = inputs.frequency as number;
        const unit = parseFloat(inputs.freqUnit as string) || 1;
        const speed = parseFloat(inputs.medium as string) || 299792458;
        if (!freq) return null;
        const freqHz = freq * unit;
        const wavelength = speed / freqHz;
        let wlStr: string;
        if (wavelength < 0.000001) wlStr = `${formatNumber(wavelength * 1e9, 3)} nm`;
        else if (wavelength < 0.001) wlStr = `${formatNumber(wavelength * 1e6, 3)} μm`;
        else if (wavelength < 1) wlStr = `${formatNumber(wavelength * 1000, 3)} mm`;
        else if (wavelength < 1000) wlStr = `${formatNumber(wavelength, 3)} m`;
        else wlStr = `${formatNumber(wavelength / 1000, 3)} km`;
        return {
          primary: { label: "Wavelength", value: wlStr },
          details: [
            { label: "Wavelength (m)", value: formatNumber(wavelength, 6) },
            { label: "Frequency (Hz)", value: freqHz.toExponential(4) },
            { label: "Wave speed", value: `${formatNumber(speed)} m/s` },
            { label: "Period", value: `${formatNumber(1 / freqHz, 10)} s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "unit-converter", "energy-calculator"],
  faq: [
    { question: "How are wavelength and frequency related?", answer: "λ = v/f. Wavelength and frequency are inversely proportional. Higher frequency = shorter wavelength. For light: visible spectrum is 400nm (violet) to 700nm (red), corresponding to ~750-430 THz." },
  ],
  formula: "λ = v / f | f = v / λ | v = f × λ",
};

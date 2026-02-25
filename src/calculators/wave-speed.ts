import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waveSpeedCalculator: CalculatorDefinition = {
  slug: "wave-speed",
  title: "Wave Speed Calculator",
  description:
    "Calculate the speed of a wave using the formula v = fλ, where v is wave speed, f is frequency, and λ is wavelength.",
  category: "Science",
  categorySlug: "science",
  icon: "Activity",
  keywords: [
    "wave speed",
    "frequency",
    "wavelength",
    "physics",
    "waves",
    "oscillation",
  ],
  variants: [
    {
      id: "speed-from-freq-wavelength",
      name: "Speed from Frequency & Wavelength",
      fields: [
        {
          name: "frequency",
          label: "Frequency (Hz)",
          type: "number",
          placeholder: "Enter frequency in hertz",
        },
        {
          name: "wavelength",
          label: "Wavelength (m)",
          type: "number",
          placeholder: "Enter wavelength in meters",
        },
      ],
      calculate: (inputs) => {
        const f = parseFloat(inputs.frequency as string);
        const lambda = parseFloat(inputs.wavelength as string);
        if (isNaN(f) || isNaN(lambda)) {
          return { primary: { label: "Wave Speed", value: "Invalid input" }, details: [] };
        }
        const speed = f * lambda;
        const period = f !== 0 ? 1 / f : 0;
        return {
          primary: { label: "Wave Speed", value: `${formatNumber(speed)} m/s` },
          details: [
            { label: "Frequency", value: `${formatNumber(f)} Hz` },
            { label: "Wavelength", value: `${formatNumber(lambda)} m` },
            { label: "Period", value: `${formatNumber(period)} s` },
            { label: "Speed (km/s)", value: `${formatNumber(speed / 1000)} km/s` },
          ],
        };
      },
    },
    {
      id: "wavelength-from-speed-freq",
      name: "Wavelength from Speed & Frequency",
      fields: [
        {
          name: "speed",
          label: "Wave Speed (m/s)",
          type: "number",
          placeholder: "Enter wave speed in m/s",
        },
        {
          name: "frequency",
          label: "Frequency (Hz)",
          type: "number",
          placeholder: "Enter frequency in hertz",
        },
      ],
      calculate: (inputs) => {
        const speed = parseFloat(inputs.speed as string);
        const f = parseFloat(inputs.frequency as string);
        if (isNaN(speed) || isNaN(f) || f === 0) {
          return { primary: { label: "Wavelength", value: "Invalid input" }, details: [] };
        }
        const lambda = speed / f;
        return {
          primary: { label: "Wavelength", value: `${formatNumber(lambda)} m` },
          details: [
            { label: "Wave Speed", value: `${formatNumber(speed)} m/s` },
            { label: "Frequency", value: `${formatNumber(f)} Hz` },
            { label: "Wavelength (cm)", value: `${formatNumber(lambda * 100)} cm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["frequency-wavelength", "snells-law", "spring-force"],
  faq: [
    {
      question: "What determines wave speed?",
      answer:
        "Wave speed depends on the medium through which the wave travels. For example, sound travels faster in water than in air. The speed is determined by the properties of the medium, not by the frequency or amplitude of the wave.",
    },
    {
      question: "What is the speed of light?",
      answer:
        "The speed of light in a vacuum is approximately 299,792,458 m/s (about 3 × 10⁸ m/s). In other media, light travels slower depending on the refractive index of the medium.",
    },
  ],
  formula:
    "v = fλ, where v is wave speed in m/s, f is frequency in Hz, and λ (lambda) is wavelength in meters.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const starLuminosityCalculator: CalculatorDefinition = {
  slug: "star-luminosity-calculator",
  title: "Star Luminosity Calculator",
  description: "Free star luminosity calculator. Calculate stellar luminosity from absolute magnitude or from radius and temperature.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["star luminosity", "absolute magnitude", "stellar luminosity", "star brightness", "stefan boltzmann"],
  variants: [
    {
      id: "from-magnitude",
      name: "From Absolute Magnitude",
      description: "L/L_sun = 10^((4.83 - M) / 2.5)",
      fields: [
        { name: "absMag", label: "Absolute Magnitude (M)", type: "number", placeholder: "e.g. 4.83", step: 0.01 },
      ],
      calculate: (inputs) => {
        const M = inputs.absMag as number;
        if (M === undefined) return null;
        const sunM = 4.83;
        const ratio = Math.pow(10, (sunM - M) / 2.5);
        const watts = ratio * 3.828e26;
        return {
          primary: { label: "Luminosity (Solar Units)", value: `${formatNumber(ratio, 4)} L☉` },
          details: [
            { label: "Luminosity (Watts)", value: `${watts.toExponential(3)} W` },
            { label: "Absolute Magnitude", value: formatNumber(M, 2) },
            { label: "Compared to Sun", value: ratio >= 1 ? `${formatNumber(ratio, 2)}x brighter` : `${formatNumber(1 / ratio, 2)}x dimmer` },
          ],
        };
      },
    },
    {
      id: "from-radius-temp",
      name: "From Radius and Temperature",
      description: "L = R^2 * (T/T_sun)^4 in solar units",
      fields: [
        { name: "radius", label: "Radius (Solar Radii)", type: "number", placeholder: "e.g. 1", step: 0.01 },
        { name: "temp", label: "Surface Temperature (K)", type: "number", placeholder: "e.g. 5778" },
      ],
      calculate: (inputs) => {
        const R = inputs.radius as number;
        const T = inputs.temp as number;
        if (!R || !T) return null;
        const ratio = Math.pow(R, 2) * Math.pow(T / 5778, 4);
        const watts = ratio * 3.828e26;
        const absMag = 4.83 - 2.5 * Math.log10(ratio);
        return {
          primary: { label: "Luminosity (Solar Units)", value: `${formatNumber(ratio, 4)} L☉` },
          details: [
            { label: "Luminosity (Watts)", value: `${watts.toExponential(3)} W` },
            { label: "Est. Absolute Magnitude", value: formatNumber(absMag, 2) },
            { label: "Radius", value: `${formatNumber(R, 2)} R☉` },
            { label: "Temperature", value: `${formatNumber(T)} K` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["magnitude-distance-calculator", "stellar-classification-calculator", "habitable-zone-calculator"],
  faq: [
    { question: "What is stellar luminosity?", answer: "Stellar luminosity is the total energy a star emits per second. The Sun emits about 3.828 x 10^26 watts." },
    { question: "How does absolute magnitude relate to luminosity?", answer: "A difference of 5 magnitudes equals a factor of 100 in brightness. Lower magnitudes mean brighter stars." },
  ],
  formula: "L/L_sun = 10^((4.83 - M) / 2.5) | L = R^2 * (T/T_sun)^4",
};

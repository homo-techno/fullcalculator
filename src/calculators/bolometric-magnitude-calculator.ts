import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bolometricMagnitudeCalculator: CalculatorDefinition = {
  slug: "bolometric-magnitude-calculator",
  title: "Bolometric Magnitude Calculator",
  description: "Calculate the bolometric magnitude of a star from its visual magnitude and bolometric correction, giving total luminosity across all wavelengths.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bolometric magnitude","bolometric correction","total luminosity","stellar brightness"],
  variants: [{
    id: "standard",
    name: "Bolometric Magnitude",
    description: "Calculate the bolometric magnitude of a star from its visual magnitude and bolometric correction, giving total luminosity across all wavelengths.",
    fields: [
      { name: "visualMag", label: "Visual Magnitude", type: "number", min: -30, max: 30, defaultValue: 4.83 },
      { name: "bolCorrection", label: "Bolometric Correction", type: "number", min: -10, max: 0, defaultValue: -0.07 },
      { name: "distancePc", label: "Distance (parsecs)", type: "number", min: 0.001, max: 1000000, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const mv = inputs.visualMag as number;
    const bc = inputs.bolCorrection as number;
    const d = inputs.distancePc as number;
    const mBol = mv + bc;
    const MBol = mBol - 5 * Math.log10(d / 10);
    const luminosityRatio = Math.pow(10, (4.74 - MBol) / 2.5);
    return {
      primary: { label: "Bolometric Magnitude (apparent)", value: formatNumber(Math.round(mBol * 1000) / 1000) },
      details: [
        { label: "Absolute Bolometric Magnitude", value: formatNumber(Math.round(MBol * 1000) / 1000) },
        { label: "Luminosity (solar units)", value: formatNumber(Math.round(luminosityRatio * 100) / 100) + " L_sun" },
        { label: "Bolometric Correction", value: formatNumber(bc) }
      ]
    };
  },
  }],
  relatedSlugs: ["star-magnitude-calculator","stellar-parallax-calculator"],
  faq: [
    { question: "What is bolometric magnitude?", answer: "Bolometric magnitude measures the total energy output of a star across all wavelengths of light, not just the visible portion. It gives a more complete picture of a star total luminosity." },
    { question: "What is the bolometric correction?", answer: "The bolometric correction is the difference between visual magnitude and bolometric magnitude. It accounts for light emitted outside the visible spectrum, such as ultraviolet and infrared radiation." },
    { question: "Why is the bolometric correction always negative or zero?", answer: "By convention, the bolometric correction is defined so that bolometric magnitude is always brighter (lower number) than visual magnitude, since total flux across all wavelengths cannot be less than just the visible flux." },
  ],
  formula: "m_bol = m_v + BC; M_bol = m_bol - 5 x log10(d / 10); L / L_sun = 10^((4.74 - M_bol) / 2.5)",
};

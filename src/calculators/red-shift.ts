import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const redShiftCalculator: CalculatorDefinition = {
  slug: "red-shift-calculator",
  title: "Redshift Calculator",
  description: "Free redshift calculator. Calculate redshift, recession velocity, and distance of astronomical objects.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["redshift calculator", "recession velocity", "hubble law", "cosmological redshift", "doppler shift"],
  variants: [
    {
      id: "from-wavelength",
      name: "From Observed and Emitted Wavelength",
      description: "z = (obs - emit) / emit",
      fields: [
        { name: "obsWave", label: "Observed Wavelength (nm)", type: "number", placeholder: "e.g. 700" },
        { name: "emitWave", label: "Emitted (Rest) Wavelength (nm)", type: "number", placeholder: "e.g. 656.3" },
      ],
      calculate: (inputs) => {
        const obs = inputs.obsWave as number;
        const emit = inputs.emitWave as number;
        if (!obs || !emit) return null;
        const z = (obs - emit) / emit;
        const c = 299792.458;
        const vClassical = z * c;
        const vRelativistic = c * ((Math.pow(1 + z, 2) - 1) / (Math.pow(1 + z, 2) + 1));
        const distMpc = vClassical / 70;
        const distLy = distMpc * 3.2616e6;
        return {
          primary: { label: "Redshift (z)", value: formatNumber(z, 6) },
          details: [
            { label: "Recession Velocity (classical)", value: `${formatNumber(vClassical, 2)} km/s` },
            { label: "Recession Velocity (relativistic)", value: `${formatNumber(vRelativistic, 2)} km/s` },
            { label: "Distance (Hubble)", value: `${formatNumber(distMpc, 2)} Mpc` },
            { label: "Distance", value: `${formatNumber(distLy, 0)} light years` },
            { label: "Type", value: z > 0 ? "Redshift (receding)" : z < 0 ? "Blueshift (approaching)" : "No shift" },
          ],
        };
      },
    },
    {
      id: "from-z",
      name: "From Redshift Value",
      fields: [
        { name: "z", label: "Redshift (z)", type: "number", placeholder: "e.g. 0.1", step: 0.001 },
      ],
      calculate: (inputs) => {
        const z = inputs.z as number;
        if (z === undefined) return null;
        const c = 299792.458;
        const vRel = c * ((Math.pow(1 + z, 2) - 1) / (Math.pow(1 + z, 2) + 1));
        const distMpc = (z * c) / 70;
        return {
          primary: { label: "Recession Velocity", value: `${formatNumber(vRel, 2)} km/s` },
          details: [
            { label: "Redshift (z)", value: formatNumber(z, 6) },
            { label: "v/c", value: formatNumber(vRel / c, 6) },
            { label: "Distance", value: `${formatNumber(distMpc, 2)} Mpc` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cosmic-distance-calculator", "light-travel-calculator", "parsec-converter-calculator"],
  faq: [
    { question: "What is redshift?", answer: "Redshift is the increase in wavelength of light from a receding object. It indicates how fast an object moves away." },
    { question: "What is Hubble constant?", answer: "The Hubble constant H0 is about 70 km/s/Mpc, relating recession velocity to distance." },
  ],
  formula: "z = (obs - emit) / emit | v = cz | d = v / H0",
};

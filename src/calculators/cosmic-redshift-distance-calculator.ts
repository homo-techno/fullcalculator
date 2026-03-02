import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cosmicRedshiftDistanceCalculator: CalculatorDefinition = {
  slug: "cosmic-redshift-distance-calculator",
  title: "Cosmic Redshift Distance Calculator",
  description: "Estimate the comoving distance, lookback time, and recession velocity of a distant object from its observed cosmological redshift.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cosmological redshift","comoving distance","lookback time","recession velocity"],
  variants: [{
    id: "standard",
    name: "Cosmic Redshift Distance",
    description: "Estimate the comoving distance, lookback time, and recession velocity of a distant object from its observed cosmological redshift.",
    fields: [
      { name: "redshift", label: "Observed Redshift (z)", type: "number", min: 0.001, max: 20, defaultValue: 1 },
      { name: "hubbleConstant", label: "Hubble Constant (km/s/Mpc)", type: "number", min: 50, max: 100, defaultValue: 70 },
    ],
    calculate: (inputs) => {
    const z = inputs.redshift as number;
    const H0 = inputs.hubbleConstant as number;
    const c = 299792.458;
    const dH = c / H0;
    const comovingApprox = dH * (z + z * z / (2 * (1 + z)));
    const lookbackFraction = 1 - 1 / Math.sqrt(1 + z);
    const hubbleTimeSec = 1 / (H0 / 3.086e19);
    const hubbleTimeGyr = hubbleTimeSec / (365.25 * 24 * 3600 * 1e9);
    const lookbackTime = lookbackFraction * hubbleTimeGyr * 2;
    const recessionVelocity = H0 * comovingApprox;
    return {
      primary: { label: "Comoving Distance", value: formatNumber(Math.round(comovingApprox)) + " Mpc" },
      details: [
        { label: "Lookback Time", value: formatNumber(Math.round(lookbackTime * 100) / 100) + " Gyr" },
        { label: "Recession Velocity", value: formatNumber(Math.round(recessionVelocity)) + " km/s" },
        { label: "Redshift (z)", value: formatNumber(z) }
      ]
    };
  },
  }],
  relatedSlugs: ["light-year-distance-calculator","stellar-parallax-calculator"],
  faq: [
    { question: "What does cosmological redshift mean?", answer: "Cosmological redshift is the stretching of light wavelengths caused by the expansion of the universe. A higher redshift means the light has traveled through more expanding space and the object is farther away." },
    { question: "Can recession velocity exceed the speed of light?", answer: "Yes. Hubble law velocity can exceed the speed of light for very distant objects because it measures the rate of expansion of space itself, not the motion of objects through space. This does not violate relativity." },
    { question: "What is the highest redshift ever observed?", answer: "Galaxies have been observed at redshifts above z = 13, corresponding to when the universe was only a few hundred million years old. The cosmic microwave background has a redshift of about z = 1100." },
  ],
  formula: "Comoving Distance (approx) = c/H0 x (z + z^2 / (2(1+z)))
Recession Velocity = H0 x Comoving Distance
Lookback Time = f(z) x Hubble Time",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gravitationalWaveStrainCalculator: CalculatorDefinition = {
  slug: "gravitational-wave-strain-calculator",
  title: "Gravitational Wave Strain Calculator",
  description: "Estimate the gravitational wave strain amplitude from a binary system based on masses, orbital frequency, and distance to the source.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gravitational wave","strain amplitude","LIGO","binary merger"],
  variants: [{
    id: "standard",
    name: "Gravitational Wave Strain",
    description: "Estimate the gravitational wave strain amplitude from a binary system based on masses, orbital frequency, and distance to the source.",
    fields: [
      { name: "mass1", label: "Mass 1 (solar masses)", type: "number", min: 0.1, max: 1000, defaultValue: 30 },
      { name: "mass2", label: "Mass 2 (solar masses)", type: "number", min: 0.1, max: 1000, defaultValue: 30 },
      { name: "frequency", label: "GW Frequency (Hz)", type: "number", min: 0.001, max: 10000, defaultValue: 100 },
      { name: "distanceMpc", label: "Distance (Mpc)", type: "number", min: 0.01, max: 10000, defaultValue: 400 },
    ],
    calculate: (inputs) => {
    const m1 = inputs.mass1 as number * 1.989e30;
    const m2 = inputs.mass2 as number * 1.989e30;
    const f = inputs.frequency as number;
    const D = inputs.distanceMpc as number * 3.086e22;
    const G = 6.674e-11;
    const c = 3e8;
    const chirpMass = Math.pow(m1 * m2, 3 / 5) / Math.pow(m1 + m2, 1 / 5);
    const chirpSolar = chirpMass / 1.989e30;
    const strain = (4 / D) * Math.pow(G * chirpMass / (c * c), 5 / 3) * Math.pow(Math.PI * f / c, 2 / 3);
    const orbFreq = f / 2;
    return {
      primary: { label: "Strain Amplitude (h)", value: formatNumber(strain) },
      details: [
        { label: "Chirp Mass", value: formatNumber(Math.round(chirpSolar * 100) / 100) + " solar masses" },
        { label: "Orbital Frequency", value: formatNumber(orbFreq) + " Hz" },
        { label: "Distance", value: formatNumber(inputs.distanceMpc as number) + " Mpc" }
      ]
    };
  },
  }],
  relatedSlugs: ["schwarzschild-radius-advanced-calculator","binary-star-mass-calculator"],
  faq: [
    { question: "What is gravitational wave strain?", answer: "Strain is the dimensionless amplitude of a gravitational wave, measuring the fractional change in distance between two points as the wave passes. LIGO detects strains as small as 10^-21." },
    { question: "What is chirp mass?", answer: "Chirp mass is a specific combination of the two component masses that determines the gravitational wave amplitude and frequency evolution of a binary system. It is the most accurately measured parameter in a detection." },
    { question: "What generates detectable gravitational waves?", answer: "The strongest sources are merging compact binaries: pairs of black holes, neutron stars, or mixed systems. The first detection by LIGO in 2015 was from two black holes of about 30 solar masses each merging at about 400 Mpc distance." },
  ],
  formula: "h = (4/D) x (G x M_chirp / c^2)^(5/3) x (pi x f / c)^(2/3)
Chirp Mass = (m1 x m2)^(3/5) / (m1 + m2)^(1/5)",
};

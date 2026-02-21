import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const SIGMA = 5.67e-8; // Stefan-Boltzmann constant W/(m²·K⁴)

export const stefanBoltzmannCalculator: CalculatorDefinition = {
  slug: "stefan-boltzmann-calculator",
  title: "Stefan-Boltzmann Calculator",
  description:
    "Free Stefan-Boltzmann calculator. Compute thermal radiation power P = ε × σ × A × T⁴ for a radiating body.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "stefan-boltzmann",
    "thermal radiation",
    "blackbody",
    "emissivity",
    "radiative power",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Radiated Power",
      fields: [
        {
          name: "emissivity",
          label: "Emissivity ε (0 to 1)",
          type: "number",
          placeholder: "e.g. 1.0 (blackbody)",
        },
        {
          name: "area",
          label: "Surface Area (m²)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "temperature",
          label: "Temperature (K)",
          type: "number",
          placeholder: "e.g. 5778 (Sun surface)",
        },
      ],
      calculate: (inputs) => {
        const epsilon = inputs.emissivity as number;
        const A = inputs.area as number;
        const T = inputs.temperature as number;
        if (!epsilon || !A || !T) return null;
        if (epsilon < 0 || epsilon > 1) return null;
        if (T <= 0) return null;

        const P = epsilon * SIGMA * A * Math.pow(T, 4);
        const flux = epsilon * SIGMA * Math.pow(T, 4); // W/m²

        return {
          primary: {
            label: "Radiated Power (P)",
            value: formatNumber(P, 4) + " W",
          },
          details: [
            {
              label: "Radiative Flux",
              value: formatNumber(flux, 4) + " W/m²",
            },
            {
              label: "Radiated Power (kW)",
              value: formatNumber(P / 1000, 4) + " kW",
            },
            { label: "Emissivity (ε)", value: formatNumber(epsilon, 4) },
            { label: "Surface Area", value: formatNumber(A, 4) + " m²" },
            { label: "Temperature", value: formatNumber(T, 2) + " K" },
            {
              label: "σ (Stefan-Boltzmann constant)",
              value: "5.67 × 10⁻⁸ W/(m²·K⁴)",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["thermal-expansion-calculator", "decay-calculator"],
  faq: [
    {
      question: "What is the Stefan-Boltzmann Law?",
      answer:
        "The Stefan-Boltzmann Law states that the total energy radiated per unit surface area of a blackbody per unit time is proportional to the fourth power of its temperature: P = εσAT⁴.",
    },
    {
      question: "What is emissivity?",
      answer:
        "Emissivity (ε) is a measure of how effectively a surface radiates energy compared to a perfect blackbody. A blackbody has ε = 1; real objects have ε < 1.",
    },
  ],
  formula:
    "P = ε × σ × A × T⁴, where ε is emissivity, σ = 5.67 × 10⁻⁸ W/(m²·K⁴), A is surface area, T is temperature in Kelvin.",
};

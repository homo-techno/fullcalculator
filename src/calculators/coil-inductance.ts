import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coilInductanceCalculator: CalculatorDefinition = {
  slug: "coil-inductance-calculator",
  title: "Coil Inductance Calculator",
  description:
    "Free coil inductance calculator. Calculate the inductance of single-layer and multi-layer air-core coils using Wheeler's formulas.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "coil inductance",
    "inductance calculator",
    "air core coil",
    "wheeler formula",
    "solenoid inductance",
    "coil design",
  ],
  variants: [
    {
      id: "single-layer",
      name: "Single-Layer Coil (Solenoid)",
      description: "Wheeler's formula for single-layer air-core solenoid",
      fields: [
        {
          name: "turns",
          label: "Number of Turns (N)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "diameter",
          label: "Coil Diameter (mm)",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "length",
          label: "Coil Length (mm)",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const n = inputs.turns as number;
        const dMm = inputs.diameter as number;
        const lMm = inputs.length as number;
        if (!n || !dMm || !lMm) return null;

        const radius = dMm / 2; // mm
        const rInches = radius / 25.4;
        const lInches = lMm / 25.4;

        // Wheeler's formula: L (µH) = (r² × N²) / (9r + 10l) — in inches
        const inductanceUh = (rInches * rInches * n * n) / (9 * rInches + 10 * lInches);

        const inductanceNh = inductanceUh * 1000;
        const inductanceMh = inductanceUh / 1000;
        const inductanceH = inductanceUh / 1e6;

        // Wire length approximation
        const wireLength = n * Math.PI * dMm; // mm

        return {
          primary: {
            label: "Inductance",
            value: inductanceUh >= 1000
              ? `${formatNumber(inductanceMh, 4)} mH`
              : inductanceUh >= 1
                ? `${formatNumber(inductanceUh, 4)} µH`
                : `${formatNumber(inductanceNh, 4)} nH`,
          },
          details: [
            { label: "Inductance (µH)", value: `${formatNumber(inductanceUh, 4)} µH` },
            { label: "Inductance (nH)", value: `${formatNumber(inductanceNh, 2)} nH` },
            { label: "Inductance (mH)", value: `${formatNumber(inductanceMh, 6)} mH` },
            { label: "Turns", value: String(n) },
            { label: "Approx. Wire Length", value: `${formatNumber(wireLength / 1000, 2)} m` },
          ],
        };
      },
    },
    {
      id: "multi-layer",
      name: "Multi-Layer Coil",
      description: "Wheeler's formula for multi-layer air-core coil",
      fields: [
        {
          name: "turns",
          label: "Total Number of Turns (N)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "innerDiameter",
          label: "Inner Diameter (mm)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "coilLength",
          label: "Coil Length / Height (mm)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "windingDepth",
          label: "Winding Depth (mm)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const n = inputs.turns as number;
        const dInner = inputs.innerDiameter as number;
        const lMm = inputs.coilLength as number;
        const depth = inputs.windingDepth as number;
        if (!n || !dInner || !lMm || !depth) return null;

        // Mean radius
        const rMean = (dInner / 2 + depth / 2); // mm
        const rInches = rMean / 25.4;
        const lInches = lMm / 25.4;
        const depthInches = depth / 25.4;

        // Wheeler's multilayer formula:
        // L (µH) = 0.8 × (r_mean² × N²) / (6 × r_mean + 9 × l + 10 × depth) — inches
        const inductanceUh = (0.8 * rInches * rInches * n * n) / (6 * rInches + 9 * lInches + 10 * depthInches);

        const inductanceNh = inductanceUh * 1000;
        const inductanceMh = inductanceUh / 1000;

        return {
          primary: {
            label: "Inductance",
            value: inductanceUh >= 1000
              ? `${formatNumber(inductanceMh, 4)} mH`
              : inductanceUh >= 1
                ? `${formatNumber(inductanceUh, 4)} µH`
                : `${formatNumber(inductanceNh, 4)} nH`,
          },
          details: [
            { label: "Inductance (µH)", value: `${formatNumber(inductanceUh, 4)} µH` },
            { label: "Inductance (nH)", value: `${formatNumber(inductanceNh, 2)} nH` },
            { label: "Inductance (mH)", value: `${formatNumber(inductanceMh, 6)} mH` },
            { label: "Mean Radius", value: `${formatNumber(rMean, 2)} mm` },
            { label: "Total Turns", value: String(n) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inductance-calculator", "resonant-frequency-calculator", "rl-time-constant-calculator"],
  faq: [
    {
      question: "What is Wheeler's formula?",
      answer:
        "Wheeler's formula is an empirical approximation for calculating the inductance of air-core coils. For single-layer solenoids: L(µH) = (r² × N²) / (9r + 10l), where r is the radius and l is the length in inches. It is accurate to within 1% when the coil length is greater than 0.4 times the diameter.",
    },
    {
      question: "How does coil geometry affect inductance?",
      answer:
        "Inductance increases with the square of the number of turns, and with larger coil diameter. Longer coils (more spread out turns) have lower inductance. A compact coil with many turns on a small form will have higher inductance per unit length.",
    },
    {
      question: "What about coils with magnetic cores?",
      answer:
        "This calculator is for air-core coils. For coils with ferrite or iron cores, multiply the air-core inductance by the relative permeability (µr) of the core material. Ferrite cores typically have µr from 100 to 10,000.",
    },
  ],
  formula:
    "Single-layer: L(µH) = (r² × N²) / (9r + 10l) | Multi-layer: L(µH) = 0.8 × (r² × N²) / (6r + 9l + 10d) | (r, l, d in inches)",
};

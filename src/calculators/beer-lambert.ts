import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beerLambertCalculator: CalculatorDefinition = {
  slug: "beer-lambert-calculator",
  title: "Beer-Lambert Law Calculator",
  description:
    "Free Beer-Lambert law calculator. Compute absorbance A = ε×l×c and transmittance from molar absorptivity, path length, and concentration.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "beer-lambert",
    "absorbance",
    "transmittance",
    "molar absorptivity",
    "spectrophotometry",
    "concentration",
  ],
  variants: [
    {
      id: "absorbance",
      name: "Calculate Absorbance & Transmittance",
      fields: [
        {
          name: "epsilon",
          label: "Molar Absorptivity ε (L/(mol·cm))",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "pathLength",
          label: "Path Length l (cm)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "concentration",
          label: "Concentration c (mol/L)",
          type: "number",
          placeholder: "e.g. 0.01",
        },
      ],
      calculate: (inputs) => {
        const epsilon = inputs.epsilon as number;
        const l = inputs.pathLength as number;
        const c = inputs.concentration as number;
        if (!epsilon || !l || !c) return null;

        const absorbance = epsilon * l * c;
        const transmittance = Math.pow(10, -absorbance);
        const percentT = transmittance * 100;

        return {
          primary: {
            label: "Absorbance (A)",
            value: formatNumber(absorbance, 4),
          },
          details: [
            {
              label: "Transmittance (T)",
              value: formatNumber(transmittance, 6),
            },
            {
              label: "% Transmittance",
              value: formatNumber(percentT, 2) + "%",
            },
            {
              label: "Molar Absorptivity (ε)",
              value: formatNumber(epsilon, 4) + " L/(mol·cm)",
            },
            { label: "Path Length (l)", value: formatNumber(l, 4) + " cm" },
            {
              label: "Concentration (c)",
              value: formatNumber(c, 6) + " mol/L",
            },
          ],
        };
      },
    },
    {
      id: "concentration",
      name: "Find Concentration from Absorbance",
      fields: [
        {
          name: "absorbance",
          label: "Measured Absorbance (A)",
          type: "number",
          placeholder: "e.g. 0.5",
        },
        {
          name: "epsilon",
          label: "Molar Absorptivity ε (L/(mol·cm))",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "pathLength",
          label: "Path Length l (cm)",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const A = inputs.absorbance as number;
        const epsilon = inputs.epsilon as number;
        const l = inputs.pathLength as number;
        if (!A || !epsilon || !l) return null;
        if (epsilon * l === 0) return null;

        const c = A / (epsilon * l);
        const transmittance = Math.pow(10, -A);
        const percentT = transmittance * 100;

        return {
          primary: {
            label: "Concentration (c)",
            value: formatNumber(c, 6) + " mol/L",
          },
          details: [
            { label: "Absorbance (A)", value: formatNumber(A, 4) },
            {
              label: "Transmittance (T)",
              value: formatNumber(transmittance, 6),
            },
            {
              label: "% Transmittance",
              value: formatNumber(percentT, 2) + "%",
            },
            {
              label: "Molar Absorptivity (ε)",
              value: formatNumber(epsilon, 4) + " L/(mol·cm)",
            },
            { label: "Path Length (l)", value: formatNumber(l, 4) + " cm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dilution-calculator", "refractive-index-calculator"],
  faq: [
    {
      question: "What is the Beer-Lambert Law?",
      answer:
        "The Beer-Lambert Law relates absorbance to the concentration of an absorbing species: A = ε × l × c, where ε is molar absorptivity, l is path length, and c is concentration.",
    },
    {
      question: "How are absorbance and transmittance related?",
      answer:
        "Absorbance A = -log₁₀(T), where T is transmittance (fraction of light passing through). A = 0 means 100% transmittance; A = 1 means 10% transmittance.",
    },
  ],
  formula:
    "A = ε × l × c. Also A = -log₁₀(T). Where ε is molar absorptivity (L/(mol·cm)), l is path length (cm), c is concentration (mol/L), T is transmittance.",
};

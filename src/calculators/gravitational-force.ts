import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const G = 6.674e-11;

export const gravitationalForceCalculator: CalculatorDefinition = {
  slug: "gravitational-force-calculator",
  title: "Gravitational Force Calculator",
  description:
    "Free gravitational force calculator. Compute the force between two masses using Newton's law F = G×m1×m2/r².",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "gravitational force",
    "newton gravity",
    "universal gravitation",
    "F = Gm1m2/r2",
    "attraction",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Gravitational Force",
      fields: [
        {
          name: "m1",
          label: "Mass 1 (kg)",
          type: "number",
          placeholder: "e.g. 5.972e24",
        },
        {
          name: "m2",
          label: "Mass 2 (kg)",
          type: "number",
          placeholder: "e.g. 70",
        },
        {
          name: "r",
          label: "Distance Between Centers (m)",
          type: "number",
          placeholder: "e.g. 6.371e6",
        },
      ],
      calculate: (inputs) => {
        const m1 = inputs.m1 as number;
        const m2 = inputs.m2 as number;
        const r = inputs.r as number;
        if (!m1 || !m2 || !r) return null;
        if (r <= 0) return null;
        const force = (G * m1 * m2) / (r * r);
        return {
          primary: {
            label: "Gravitational Force",
            value: formatNumber(force, 4) + " N",
          },
          details: [
            { label: "Mass 1", value: formatNumber(m1, 4) + " kg" },
            { label: "Mass 2", value: formatNumber(m2, 4) + " kg" },
            { label: "Distance", value: formatNumber(r, 4) + " m" },
            { label: "G", value: "6.674 × 10⁻¹¹ N⋅m²/kg²" },
            {
              label: "Acceleration on m2",
              value: formatNumber(force / m2, 4) + " m/s²",
            },
            {
              label: "Acceleration on m1",
              value: formatNumber(force / m1, 4) + " m/s²",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["escape-velocity-calculator", "orbital-velocity-calculator"],
  faq: [
    {
      question: "What is Newton's Law of Universal Gravitation?",
      answer:
        "Every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers: F = G×m1×m2/r².",
    },
    {
      question: "What is the gravitational constant G?",
      answer:
        "G = 6.674 × 10⁻¹¹ N⋅m²/kg². It is a fundamental physical constant that quantifies the strength of gravitational interaction.",
    },
  ],
  formula:
    "F = G × m1 × m2 / r², where G = 6.674 × 10⁻¹¹ N⋅m²/kg², m1 and m2 are the masses, and r is the distance between their centers.",
};

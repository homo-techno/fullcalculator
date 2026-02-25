import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const elasticCollisionCalculator: CalculatorDefinition = {
  slug: "elastic-collision",
  title: "Elastic Collision Calculator",
  description:
    "Calculate the final velocities of two objects after a perfectly elastic collision in one dimension, where both momentum and kinetic energy are conserved.",
  category: "Science",
  categorySlug: "science",
  icon: "ArrowLeftRight",
  keywords: [
    "elastic collision",
    "momentum",
    "kinetic energy",
    "conservation",
    "physics",
    "velocity",
  ],
  variants: [
    {
      id: "elastic-1d",
      name: "1D Elastic Collision",
      fields: [
        {
          name: "m1",
          label: "Mass 1 (kg)",
          type: "number",
          placeholder: "Enter mass of object 1",
        },
        {
          name: "v1",
          label: "Velocity 1 (m/s)",
          type: "number",
          placeholder: "Enter initial velocity of object 1",
        },
        {
          name: "m2",
          label: "Mass 2 (kg)",
          type: "number",
          placeholder: "Enter mass of object 2",
        },
        {
          name: "v2",
          label: "Velocity 2 (m/s)",
          type: "number",
          placeholder: "Enter initial velocity of object 2",
        },
      ],
      calculate: (inputs) => {
        const m1 = parseFloat(inputs.m1 as string);
        const v1 = parseFloat(inputs.v1 as string);
        const m2 = parseFloat(inputs.m2 as string);
        const v2 = parseFloat(inputs.v2 as string);
        if (isNaN(m1) || isNaN(v1) || isNaN(m2) || isNaN(v2) || m1 <= 0 || m2 <= 0) {
          return { primary: { label: "Result", value: "Invalid input" }, details: [] };
        }
        const totalMass = m1 + m2;
        const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / totalMass;
        const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / totalMass;
        const keInitial = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
        const keFinal = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;
        return {
          primary: { label: "Final Velocity 1", value: `${formatNumber(v1f)} m/s` },
          details: [
            { label: "Final Velocity 2", value: `${formatNumber(v2f)} m/s` },
            { label: "Initial KE", value: `${formatNumber(keInitial)} J` },
            { label: "Final KE", value: `${formatNumber(keFinal)} J` },
            { label: "Momentum Before", value: `${formatNumber(m1 * v1 + m2 * v2)} kg·m/s` },
            { label: "Momentum After", value: `${formatNumber(m1 * v1f + m2 * v2f)} kg·m/s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inelastic-collision", "impulse-calculator", "kinetic-energy-calc"],
  faq: [
    {
      question: "What is an elastic collision?",
      answer:
        "An elastic collision is one in which both momentum and kinetic energy are conserved. The objects bounce off each other without any permanent deformation or generation of heat.",
    },
    {
      question: "Do perfectly elastic collisions occur in real life?",
      answer:
        "Perfectly elastic collisions are an idealization. However, collisions between hard objects like billiard balls or between atoms and molecules can be very close to perfectly elastic.",
    },
  ],
  formula:
    "v1' = ((m1-m2)v1 + 2m2·v2)/(m1+m2) and v2' = ((m2-m1)v2 + 2m1·v1)/(m1+m2), where primed velocities are final velocities.",
};

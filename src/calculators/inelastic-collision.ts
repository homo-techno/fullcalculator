import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inelasticCollisionCalculator: CalculatorDefinition = {
  slug: "inelastic-collision",
  title: "Inelastic Collision Calculator",
  description:
    "Calculate the final velocity and energy loss in a perfectly inelastic (sticky) collision where two objects stick together after impact.",
  category: "Science",
  categorySlug: "science",
  icon: "Merge",
  keywords: [
    "inelastic collision",
    "momentum",
    "energy loss",
    "physics",
    "sticky collision",
    "conservation",
  ],
  variants: [
    {
      id: "perfectly-inelastic",
      name: "Perfectly Inelastic Collision",
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
        const vf = (m1 * v1 + m2 * v2) / totalMass;
        const keInitial = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
        const keFinal = 0.5 * totalMass * vf * vf;
        const energyLost = keInitial - keFinal;
        const percentLost = keInitial !== 0 ? (energyLost / keInitial) * 100 : 0;
        return {
          primary: { label: "Final Velocity", value: `${formatNumber(vf)} m/s` },
          details: [
            { label: "Combined Mass", value: `${formatNumber(totalMass)} kg` },
            { label: "Initial KE", value: `${formatNumber(keInitial)} J` },
            { label: "Final KE", value: `${formatNumber(keFinal)} J` },
            { label: "Energy Lost", value: `${formatNumber(energyLost)} J` },
            { label: "Energy Lost (%)", value: `${formatNumber(percentLost)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["elastic-collision", "impulse-calculator", "kinetic-energy-calc"],
  faq: [
    {
      question: "What is an inelastic collision?",
      answer:
        "An inelastic collision is one in which momentum is conserved but kinetic energy is not. In a perfectly inelastic collision, the two objects stick together and move as one after the collision.",
    },
    {
      question: "Where does the lost energy go?",
      answer:
        "The kinetic energy lost in an inelastic collision is converted into other forms of energy such as heat, sound, and deformation of the objects.",
    },
  ],
  formula:
    "m1·v1 + m2·v2 = (m1+m2)·vf, so vf = (m1·v1 + m2·v2)/(m1+m2). Energy lost = KEi - KEf.",
};

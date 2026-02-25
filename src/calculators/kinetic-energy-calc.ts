import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kineticEnergyCalcCalculator: CalculatorDefinition = {
  slug: "kinetic-energy-calc",
  title: "Kinetic Energy Calculator",
  description:
    "Calculate the kinetic energy of an object given its mass and velocity using the formula KE = ½mv².",
  category: "Science",
  categorySlug: "science",
  icon: "Zap",
  keywords: [
    "kinetic energy",
    "mass",
    "velocity",
    "physics",
    "energy",
    "motion",
    "joules",
  ],
  variants: [
    {
      id: "energy-from-mass-velocity",
      name: "Kinetic Energy from Mass & Velocity",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "Enter mass in kilograms",
        },
        {
          name: "velocity",
          label: "Velocity (m/s)",
          type: "number",
          placeholder: "Enter velocity in m/s",
        },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const velocity = parseFloat(inputs.velocity as string);
        if (isNaN(mass) || isNaN(velocity)) {
          return { primary: { label: "Kinetic Energy", value: "Invalid input" }, details: [] };
        }
        const ke = 0.5 * mass * velocity * velocity;
        return {
          primary: { label: "Kinetic Energy", value: `${formatNumber(ke)} J` },
          details: [
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Velocity", value: `${formatNumber(velocity)} m/s` },
            { label: "Kinetic Energy (kJ)", value: `${formatNumber(ke / 1000)} kJ` },
          ],
        };
      },
    },
    {
      id: "velocity-from-energy-mass",
      name: "Velocity from Energy & Mass",
      fields: [
        {
          name: "energy",
          label: "Kinetic Energy (J)",
          type: "number",
          placeholder: "Enter kinetic energy in joules",
        },
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "Enter mass in kilograms",
        },
      ],
      calculate: (inputs) => {
        const energy = parseFloat(inputs.energy as string);
        const mass = parseFloat(inputs.mass as string);
        if (isNaN(energy) || isNaN(mass) || mass <= 0) {
          return { primary: { label: "Velocity", value: "Invalid input" }, details: [] };
        }
        const velocity = Math.sqrt((2 * energy) / mass);
        return {
          primary: { label: "Velocity", value: `${formatNumber(velocity)} m/s` },
          details: [
            { label: "Kinetic Energy", value: `${formatNumber(energy)} J` },
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Velocity (km/h)", value: `${formatNumber(velocity * 3.6)} km/h` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["potential-energy-calc", "work-done", "power-physics"],
  faq: [
    {
      question: "What is kinetic energy?",
      answer:
        "Kinetic energy is the energy an object possesses due to its motion. It depends on both the mass of the object and the square of its velocity.",
    },
    {
      question: "Why does velocity have a greater effect than mass on kinetic energy?",
      answer:
        "Because kinetic energy is proportional to the square of velocity (v²) but only linearly proportional to mass (m). Doubling the velocity quadruples the kinetic energy, while doubling the mass only doubles it.",
    },
  ],
  formula: "KE = ½mv², where KE is kinetic energy in joules, m is mass in kg, and v is velocity in m/s.",
};

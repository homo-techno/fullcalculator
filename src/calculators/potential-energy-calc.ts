import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potentialEnergyCalcCalculator: CalculatorDefinition = {
  slug: "potential-energy-calc",
  title: "Potential Energy Calculator",
  description:
    "Calculate the gravitational potential energy of an object given its mass, gravitational acceleration, and height using PE = mgh.",
  category: "Science",
  categorySlug: "science",
  icon: "ArrowUp",
  keywords: [
    "potential energy",
    "gravitational",
    "height",
    "mass",
    "gravity",
    "physics",
    "joules",
  ],
  variants: [
    {
      id: "pe-from-mass-height",
      name: "Potential Energy from Mass & Height",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "Enter mass in kilograms",
        },
        {
          name: "gravity",
          label: "Gravitational Acceleration (m/s²)",
          type: "number",
          placeholder: "Enter g (default 9.81)",
        },
        {
          name: "height",
          label: "Height (m)",
          type: "number",
          placeholder: "Enter height in meters",
        },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const gravity = parseFloat(inputs.gravity as string) || 9.81;
        const height = parseFloat(inputs.height as string);
        if (isNaN(mass) || isNaN(height)) {
          return { primary: { label: "Potential Energy", value: "Invalid input" }, details: [] };
        }
        const pe = mass * gravity * height;
        return {
          primary: { label: "Potential Energy", value: `${formatNumber(pe)} J` },
          details: [
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Gravity", value: `${formatNumber(gravity)} m/s²` },
            { label: "Height", value: `${formatNumber(height)} m` },
            { label: "Potential Energy (kJ)", value: `${formatNumber(pe / 1000)} kJ` },
          ],
        };
      },
    },
    {
      id: "height-from-energy-mass",
      name: "Height from Energy & Mass",
      fields: [
        {
          name: "energy",
          label: "Potential Energy (J)",
          type: "number",
          placeholder: "Enter potential energy in joules",
        },
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "Enter mass in kilograms",
        },
        {
          name: "gravity",
          label: "Gravitational Acceleration (m/s²)",
          type: "number",
          placeholder: "Enter g (default 9.81)",
        },
      ],
      calculate: (inputs) => {
        const energy = parseFloat(inputs.energy as string);
        const mass = parseFloat(inputs.mass as string);
        const gravity = parseFloat(inputs.gravity as string) || 9.81;
        if (isNaN(energy) || isNaN(mass) || mass <= 0) {
          return { primary: { label: "Height", value: "Invalid input" }, details: [] };
        }
        const height = energy / (mass * gravity);
        return {
          primary: { label: "Height", value: `${formatNumber(height)} m` },
          details: [
            { label: "Potential Energy", value: `${formatNumber(energy)} J` },
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Gravity", value: `${formatNumber(gravity)} m/s²` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kinetic-energy-calc", "work-done", "power-physics"],
  faq: [
    {
      question: "What is gravitational potential energy?",
      answer:
        "Gravitational potential energy is the energy stored in an object due to its position in a gravitational field. It depends on the object's mass, the gravitational acceleration, and its height above a reference point.",
    },
    {
      question: "What value of g should I use?",
      answer:
        "On Earth's surface, the standard value is approximately 9.81 m/s². On the Moon, it is about 1.62 m/s², and on Mars, about 3.72 m/s².",
    },
  ],
  formula:
    "PE = mgh, where PE is potential energy in joules, m is mass in kg, g is gravitational acceleration in m/s², and h is height in meters.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const impulseCalculator: CalculatorDefinition = {
  slug: "impulse-calculator",
  title: "Impulse Calculator",
  description:
    "Calculate the impulse experienced by an object using J = FΔt or J = mΔv. Impulse equals the change in momentum.",
  category: "Science",
  categorySlug: "science",
  icon: "ArrowRight",
  keywords: [
    "impulse",
    "force",
    "time",
    "momentum",
    "change",
    "physics",
    "newton-second",
  ],
  variants: [
    {
      id: "impulse-from-force-time",
      name: "Impulse from Force & Time",
      fields: [
        {
          name: "force",
          label: "Force (N)",
          type: "number",
          placeholder: "Enter force in newtons",
        },
        {
          name: "time",
          label: "Time Interval (s)",
          type: "number",
          placeholder: "Enter time interval in seconds",
        },
      ],
      calculate: (inputs) => {
        const force = parseFloat(inputs.force as string);
        const time = parseFloat(inputs.time as string);
        if (isNaN(force) || isNaN(time)) {
          return { primary: { label: "Impulse", value: "Invalid input" }, details: [] };
        }
        const impulse = force * time;
        return {
          primary: { label: "Impulse", value: `${formatNumber(impulse)} N·s` },
          details: [
            { label: "Force", value: `${formatNumber(force)} N` },
            { label: "Time Interval", value: `${formatNumber(time)} s` },
            { label: "Equivalent Momentum Change", value: `${formatNumber(impulse)} kg·m/s` },
          ],
        };
      },
    },
    {
      id: "impulse-from-mass-velocity-change",
      name: "Impulse from Mass & Velocity Change",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "Enter mass in kilograms",
        },
        {
          name: "velocityInitial",
          label: "Initial Velocity (m/s)",
          type: "number",
          placeholder: "Enter initial velocity",
        },
        {
          name: "velocityFinal",
          label: "Final Velocity (m/s)",
          type: "number",
          placeholder: "Enter final velocity",
        },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const vi = parseFloat(inputs.velocityInitial as string);
        const vf = parseFloat(inputs.velocityFinal as string);
        if (isNaN(mass) || isNaN(vi) || isNaN(vf)) {
          return { primary: { label: "Impulse", value: "Invalid input" }, details: [] };
        }
        const deltaV = vf - vi;
        const impulse = mass * deltaV;
        return {
          primary: { label: "Impulse", value: `${formatNumber(impulse)} N·s` },
          details: [
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Initial Velocity", value: `${formatNumber(vi)} m/s` },
            { label: "Final Velocity", value: `${formatNumber(vf)} m/s` },
            { label: "Change in Velocity", value: `${formatNumber(deltaV)} m/s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["elastic-collision", "inelastic-collision", "kinetic-energy-calc"],
  faq: [
    {
      question: "What is impulse?",
      answer:
        "Impulse is the product of a force and the time interval over which it acts. It equals the change in momentum of an object and is measured in newton-seconds (N·s) or equivalently kg·m/s.",
    },
    {
      question: "How is impulse related to momentum?",
      answer:
        "The impulse-momentum theorem states that the impulse on an object equals the change in its momentum: J = Δp = mΔv. This is a direct consequence of Newton's second law.",
    },
  ],
  formula:
    "J = FΔt = mΔv, where J is impulse in N·s, F is force in N, Δt is time interval in s, m is mass in kg, and Δv is change in velocity in m/s.",
};

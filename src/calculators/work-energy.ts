import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workEnergyCalculator: CalculatorDefinition = {
  slug: "work-energy-calculator",
  title: "Work Energy Calculator",
  description:
    "Free work and energy calculator. Compute work done W = Fd cos(θ) or kinetic energy KE = ½mv².",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "work",
    "energy",
    "kinetic energy",
    "force",
    "joules",
    "physics",
  ],
  variants: [
    {
      id: "work",
      name: "Work Done (W = Fd cos θ)",
      fields: [
        {
          name: "force",
          label: "Force (N)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "distance",
          label: "Distance (m)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "angle",
          label: "Angle θ (degrees) — default 0",
          type: "number",
          placeholder: "0",
        },
      ],
      calculate: (inputs) => {
        const force = inputs.force as number;
        const distance = inputs.distance as number;
        const angleDeg = (inputs.angle as number) || 0;
        if (!force || !distance) return null;

        const angleRad = (angleDeg * Math.PI) / 180;
        const work = force * distance * Math.cos(angleRad);

        return {
          primary: {
            label: "Work Done",
            value: formatNumber(work, 4) + " J",
          },
          details: [
            { label: "Force", value: formatNumber(force, 4) + " N" },
            { label: "Distance", value: formatNumber(distance, 4) + " m" },
            { label: "Angle (θ)", value: formatNumber(angleDeg, 2) + "°" },
            {
              label: "cos(θ)",
              value: formatNumber(Math.cos(angleRad), 6),
            },
            {
              label: "Work (kJ)",
              value: formatNumber(work / 1000, 4) + " kJ",
            },
          ],
        };
      },
    },
    {
      id: "kinetic-energy",
      name: "Kinetic Energy (KE = ½mv²)",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "e.g. 70",
        },
        {
          name: "velocity",
          label: "Velocity (m/s)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const velocity = inputs.velocity as number;
        if (!mass || !velocity) return null;

        const ke = 0.5 * mass * velocity * velocity;

        return {
          primary: {
            label: "Kinetic Energy",
            value: formatNumber(ke, 4) + " J",
          },
          details: [
            { label: "Mass", value: formatNumber(mass, 4) + " kg" },
            { label: "Velocity", value: formatNumber(velocity, 4) + " m/s" },
            {
              label: "Kinetic Energy (kJ)",
              value: formatNumber(ke / 1000, 4) + " kJ",
            },
            {
              label: "Momentum (p = mv)",
              value: formatNumber(mass * velocity, 4) + " kg⋅m/s",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "centripetal-force-calculator",
    "gravitational-force-calculator",
  ],
  faq: [
    {
      question: "What is the work-energy theorem?",
      answer:
        "The work-energy theorem states that the net work done on an object equals the change in its kinetic energy: W_net = ΔKE = ½mv₂² − ½mv₁².",
    },
    {
      question: "When is work zero?",
      answer:
        "Work is zero when the force is perpendicular to the displacement (θ = 90°), since cos(90°) = 0. For example, the normal force on a sliding object does no work.",
    },
  ],
  formula:
    "W = F × d × cos(θ) for work done. KE = ½mv² for kinetic energy. Both measured in joules (J).",
};

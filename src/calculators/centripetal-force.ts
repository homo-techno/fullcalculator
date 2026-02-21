import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const centripetalForceCalculator: CalculatorDefinition = {
  slug: "centripetal-force-calculator",
  title: "Centripetal Force Calculator",
  description:
    "Free centripetal force calculator. Compute the force and acceleration for circular motion using F = mv²/r.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "centripetal force",
    "circular motion",
    "centripetal acceleration",
    "mv2/r",
    "rotation",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "velocity",
          label: "Velocity (m/s)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "radius",
          label: "Radius (m)",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const velocity = inputs.velocity as number;
        const radius = inputs.radius as number;
        if (!mass || !velocity || !radius) return null;
        if (radius <= 0) return null;
        const acceleration = (velocity * velocity) / radius;
        const force = mass * acceleration;
        const angularVelocity = velocity / radius;
        const period = (2 * Math.PI * radius) / velocity;
        return {
          primary: {
            label: "Centripetal Force",
            value: formatNumber(force, 4) + " N",
          },
          details: [
            {
              label: "Centripetal Acceleration",
              value: formatNumber(acceleration, 4) + " m/s²",
            },
            {
              label: "Angular Velocity (ω)",
              value: formatNumber(angularVelocity, 4) + " rad/s",
            },
            {
              label: "Period",
              value: formatNumber(period, 4) + " s",
            },
            { label: "Mass", value: formatNumber(mass, 4) + " kg" },
            { label: "Velocity", value: formatNumber(velocity, 4) + " m/s" },
            { label: "Radius", value: formatNumber(radius, 4) + " m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gravitational-force-calculator", "work-energy-calculator"],
  faq: [
    {
      question: "What is centripetal force?",
      answer:
        "Centripetal force is the net force directed toward the center of a circular path that keeps an object moving in that circle. It equals mv²/r.",
    },
    {
      question: "What is centripetal acceleration?",
      answer:
        "Centripetal acceleration a = v²/r is the acceleration directed toward the center of the circular path. It changes the direction of velocity without changing its magnitude.",
    },
  ],
  formula:
    "F = mv²/r, a = v²/r, where m is mass, v is velocity, and r is the radius of the circular path.",
};

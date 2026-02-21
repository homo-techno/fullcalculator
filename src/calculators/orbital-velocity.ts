import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const G = 6.674e-11;

const celestialBodies: Record<string, { mass: number; label: string }> = {
  earth: { mass: 5.972e24, label: "Earth" },
  mars: { mass: 6.417e23, label: "Mars" },
  jupiter: { mass: 1.898e27, label: "Jupiter" },
  sun: { mass: 1.989e30, label: "Sun" },
  moon: { mass: 7.342e22, label: "Moon" },
};

export const orbitalVelocityCalculator: CalculatorDefinition = {
  slug: "orbital-velocity-calculator",
  title: "Orbital Velocity Calculator",
  description:
    "Free orbital velocity calculator. Compute the velocity needed to maintain a circular orbit using v = sqrt(GM/r).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "orbital velocity",
    "circular orbit",
    "gravitational",
    "satellite",
    "space",
  ],
  variants: [
    {
      id: "custom",
      name: "Custom Mass & Radius",
      fields: [
        {
          name: "mass",
          label: "Central Body Mass (kg)",
          type: "number",
          placeholder: "e.g. 5.972e24",
        },
        {
          name: "radius",
          label: "Orbital Radius (m)",
          type: "number",
          placeholder: "e.g. 6.771e6",
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const radius = inputs.radius as number;
        if (!mass || !radius) return null;
        if (radius <= 0) return null;
        const velocity = Math.sqrt((G * mass) / radius);
        const period = (2 * Math.PI * radius) / velocity;
        return {
          primary: {
            label: "Orbital Velocity",
            value: formatNumber(velocity, 4) + " m/s",
          },
          details: [
            {
              label: "Velocity (km/s)",
              value: formatNumber(velocity / 1000, 4) + " km/s",
            },
            {
              label: "Orbital Period",
              value: formatNumber(period, 2) + " s",
            },
            {
              label: "Orbital Period (hours)",
              value: formatNumber(period / 3600, 2) + " hr",
            },
            { label: "G", value: "6.674 × 10⁻¹¹ N⋅m²/kg²" },
          ],
        };
      },
    },
    {
      id: "planet",
      name: "Select Planet",
      fields: [
        {
          name: "body",
          label: "Central Body",
          type: "select",
          placeholder: "Select a body",
          options: [
            { value: "earth", label: "Earth (5.972 × 10²⁴ kg)" },
            { value: "mars", label: "Mars (6.417 × 10²³ kg)" },
            { value: "jupiter", label: "Jupiter (1.898 × 10²⁷ kg)" },
            { value: "sun", label: "Sun (1.989 × 10³⁰ kg)" },
            { value: "moon", label: "Moon (7.342 × 10²² kg)" },
          ],
        },
        {
          name: "altitude",
          label: "Orbital Radius (m)",
          type: "number",
          placeholder: "e.g. 7000000",
        },
      ],
      calculate: (inputs) => {
        const bodyKey = inputs.body as string;
        const radius = inputs.altitude as number;
        if (!bodyKey || !radius) return null;
        const body = celestialBodies[bodyKey];
        if (!body) return null;
        if (radius <= 0) return null;
        const velocity = Math.sqrt((G * body.mass) / radius);
        const period = (2 * Math.PI * radius) / velocity;
        return {
          primary: {
            label: "Orbital Velocity",
            value: formatNumber(velocity, 4) + " m/s",
          },
          details: [
            { label: "Central Body", value: body.label },
            {
              label: "Mass",
              value: formatNumber(body.mass, 4) + " kg",
            },
            {
              label: "Velocity (km/s)",
              value: formatNumber(velocity / 1000, 4) + " km/s",
            },
            {
              label: "Orbital Period (hours)",
              value: formatNumber(period / 3600, 2) + " hr",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["escape-velocity-calculator", "gravitational-force-calculator"],
  faq: [
    {
      question: "What is orbital velocity?",
      answer:
        "Orbital velocity is the speed needed for an object to maintain a stable circular orbit around a celestial body. It depends on the mass of the central body and the orbital radius.",
    },
    {
      question: "How does orbital radius affect velocity?",
      answer:
        "Higher orbits require lower velocities. As the orbital radius increases, the required velocity decreases proportionally to 1/sqrt(r).",
    },
  ],
  formula:
    "v = √(GM/r), where G = 6.674 × 10⁻¹¹ N⋅m²/kg², M is the central body mass, and r is the orbital radius.",
};

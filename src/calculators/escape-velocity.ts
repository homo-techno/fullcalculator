import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const G = 6.674e-11;

const planets: Record<string, { mass: number; radius: number; label: string }> = {
  earth: { mass: 5.972e24, radius: 6.371e6, label: "Earth" },
  mars: { mass: 6.417e23, radius: 3.3895e6, label: "Mars" },
  jupiter: { mass: 1.898e27, radius: 6.9911e7, label: "Jupiter" },
  moon: { mass: 7.342e22, radius: 1.7374e6, label: "Moon" },
  sun: { mass: 1.989e30, radius: 6.957e8, label: "Sun" },
};

export const escapeVelocityCalculator: CalculatorDefinition = {
  slug: "escape-velocity-calculator",
  title: "Escape Velocity Calculator",
  description:
    "Free escape velocity calculator. Compute the minimum speed to escape a gravitational field using v = sqrt(2GM/r).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "escape velocity",
    "gravitational escape",
    "space",
    "rocket",
    "planet",
  ],
  variants: [
    {
      id: "planet",
      name: "Select Planet",
      fields: [
        {
          name: "planet",
          label: "Celestial Body",
          type: "select",
          placeholder: "Select a body",
          options: [
            { value: "earth", label: "Earth" },
            { value: "mars", label: "Mars" },
            { value: "jupiter", label: "Jupiter" },
            { value: "moon", label: "Moon" },
            { value: "sun", label: "Sun" },
          ],
        },
      ],
      calculate: (inputs) => {
        const planetKey = inputs.planet as string;
        if (!planetKey) return null;
        const body = planets[planetKey];
        if (!body) return null;
        const v = Math.sqrt((2 * G * body.mass) / body.radius);
        return {
          primary: {
            label: "Escape Velocity",
            value: formatNumber(v, 4) + " m/s",
          },
          details: [
            { label: "Body", value: body.label },
            { label: "Mass", value: formatNumber(body.mass, 4) + " kg" },
            { label: "Radius", value: formatNumber(body.radius, 4) + " m" },
            {
              label: "Escape Velocity (km/s)",
              value: formatNumber(v / 1000, 4) + " km/s",
            },
            {
              label: "Escape Velocity (km/h)",
              value: formatNumber((v / 1000) * 3600, 2) + " km/h",
            },
          ],
        };
      },
    },
    {
      id: "custom",
      name: "Custom Mass & Radius",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "e.g. 5.972e24",
        },
        {
          name: "radius",
          label: "Radius (m)",
          type: "number",
          placeholder: "e.g. 6.371e6",
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const radius = inputs.radius as number;
        if (!mass || !radius) return null;
        if (radius <= 0) return null;
        const v = Math.sqrt((2 * G * mass) / radius);
        return {
          primary: {
            label: "Escape Velocity",
            value: formatNumber(v, 4) + " m/s",
          },
          details: [
            { label: "Mass", value: formatNumber(mass, 4) + " kg" },
            { label: "Radius", value: formatNumber(radius, 4) + " m" },
            {
              label: "Escape Velocity (km/s)",
              value: formatNumber(v / 1000, 4) + " km/s",
            },
            { label: "G", value: "6.674 × 10⁻¹¹ N⋅m²/kg²" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["orbital-velocity-calculator", "gravitational-force-calculator"],
  faq: [
    {
      question: "What is escape velocity?",
      answer:
        "Escape velocity is the minimum speed an object must reach to break free from a celestial body's gravitational pull without further propulsion.",
    },
    {
      question: "Does escape velocity depend on the mass of the escaping object?",
      answer:
        "No. Escape velocity depends only on the mass and radius of the celestial body, not on the mass of the escaping object.",
    },
  ],
  formula:
    "v = √(2GM/r), where G = 6.674 × 10⁻¹¹ N⋅m²/kg², M is the body's mass, and r is the body's radius.",
};

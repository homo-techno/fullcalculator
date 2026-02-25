import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const planetOptions = [
  { label: "Mercury", value: "mercury" },
  { label: "Venus", value: "venus" },
  { label: "Mars", value: "mars" },
  { label: "Jupiter", value: "jupiter" },
  { label: "Saturn", value: "saturn" },
  { label: "Uranus", value: "uranus" },
  { label: "Neptune", value: "neptune" },
  { label: "Moon", value: "moon" },
  { label: "Pluto", value: "pluto" },
  { label: "Sun", value: "sun" },
];

const gravityFactors: Record<string, number> = {
  mercury: 0.378,
  venus: 0.907,
  mars: 0.377,
  jupiter: 2.528,
  saturn: 1.065,
  uranus: 0.886,
  neptune: 1.137,
  moon: 0.166,
  pluto: 0.071,
  sun: 27.95,
};

export const solarSystemWeightCalculator: CalculatorDefinition = {
  slug: "solar-system-weight-calculator",
  title: "Weight on Other Planets Calculator",
  description:
    "Free weight on other planets calculator. Find out how much you would weigh on Mars, Jupiter, the Moon, and every other planet in our solar system.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "weight on planets",
    "weight on mars",
    "weight on moon",
    "solar system weight",
    "planet gravity",
    "space weight",
  ],
  variants: [
    {
      id: "planet-weight",
      name: "Weight on a Planet",
      description: "Calculate your weight on any planet or the Moon",
      fields: [
        {
          name: "weight",
          label: "Your Weight on Earth",
          type: "number",
          placeholder: "e.g. 150",
          min: 1,
          max: 1000,
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { label: "Pounds (lbs)", value: "lbs" },
            { label: "Kilograms (kg)", value: "kg" },
          ],
        },
        {
          name: "planet",
          label: "Planet / Body",
          type: "select",
          options: planetOptions,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const unit = (inputs.unit as string) || "lbs";
        const planet = (inputs.planet as string) || "mars";

        if (!weight) return null;

        const factor = gravityFactors[planet];
        if (factor === undefined) return null;

        const planetWeight = weight * factor;
        const planetLabel =
          planetOptions.find((o) => o.value === planet)?.label ?? planet;
        const suffix = unit === "kg" ? "kg" : "lbs";

        // Build comparison table for all bodies
        const allWeights = planetOptions.map((p) => ({
          label: `Weight on ${p.label}`,
          value: `${formatNumber(weight * (gravityFactors[p.value] || 0), 2)} ${suffix}`,
        }));

        return {
          primary: {
            label: `Weight on ${planetLabel}`,
            value: `${formatNumber(planetWeight, 2)} ${suffix}`,
          },
          details: [
            { label: "Earth weight", value: `${formatNumber(weight, 2)} ${suffix}` },
            { label: "Surface gravity factor", value: `${factor}x Earth` },
            ...allWeights,
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "age-on-planets-calculator",
    "escape-velocity-calculator",
    "planet-surface-gravity-calculator",
  ],
  faq: [
    {
      question: "Why would I weigh different amounts on other planets?",
      answer:
        "Weight is the force of gravity acting on your mass. Each planet has a different mass and radius, producing different surface gravity. Your mass stays the same, but the gravitational pull changes.",
    },
    {
      question: "How much would I weigh on Mars?",
      answer:
        "Mars has about 37.7% of Earth's surface gravity. A 150 lb person on Earth would weigh about 56.6 lbs on Mars.",
    },
  ],
  formula:
    "Weight on Planet = Earth Weight x Planet Surface Gravity Factor. Gravity factors: Mercury 0.378, Venus 0.907, Mars 0.377, Jupiter 2.528, Saturn 1.065, Uranus 0.886, Neptune 1.137, Moon 0.166.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ageOnPlanetsCalculator: CalculatorDefinition = {
  slug: "age-on-planets-calculator",
  title: "Age on Other Planets Calculator",
  description:
    "Free age on other planets calculator. Find out how old you'd be on Mars, Jupiter, Venus, and every planet in our solar system based on your Earth age.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "age on planets",
    "age on mars",
    "age on jupiter",
    "planet age calculator",
    "solar system age",
    "space age",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Your Age on Every Planet",
      fields: [
        {
          name: "earthAge",
          label: "Your Age on Earth (years)",
          type: "number",
          placeholder: "e.g. 25",
        },
      ],
      calculate: (inputs) => {
        const earthAge = inputs.earthAge as number;
        if (!earthAge || earthAge <= 0) return null;

        const earthDays = earthAge * 365.25;

        const planets: { name: string; orbitalDays: number; funFact: string }[] = [
          { name: "Mercury", orbitalDays: 87.97, funFact: "You'd have had a LOT of birthdays!" },
          { name: "Venus", orbitalDays: 224.7, funFact: "A day on Venus is longer than its year!" },
          { name: "Mars", orbitalDays: 687.0, funFact: "You'd be a Martian teenager!" },
          { name: "Jupiter", orbitalDays: 4332.59, funFact: "Jupiter hasn't finished one orbit since you were born!" },
          { name: "Saturn", orbitalDays: 10759.22, funFact: "Saturn's rings are younger than dinosaurs." },
          { name: "Uranus", orbitalDays: 30688.5, funFact: "One Uranus year is an entire human lifetime." },
          { name: "Neptune", orbitalDays: 60182.0, funFact: "Neptune has completed only 1 orbit since its 1846 discovery." },
          { name: "Pluto", orbitalDays: 90560.0, funFact: "No human has ever lived one Pluto year." },
        ];

        const details: { label: string; value: string }[] = [
          { label: "Earth Age", value: `${formatNumber(earthAge, 1)} years (${formatNumber(earthDays, 0)} days)` },
        ];

        for (const planet of planets) {
          const planetAge = earthDays / planet.orbitalDays;
          details.push({
            label: `Age on ${planet.name}`,
            value: `${formatNumber(planetAge, 2)} ${planet.name} years`,
          });
        }

        const mercuryAge = earthDays / 87.97;
        const marsAge = earthDays / 687.0;

        details.push({
          label: "Mercury Birthdays",
          value: `You'd have celebrated ${formatNumber(Math.floor(mercuryAge), 0)} birthdays!`,
        });
        details.push({
          label: "Next Mars Birthday",
          value: `In ${formatNumber((Math.ceil(marsAge) * 687.0 - earthDays) / 365.25, 1)} Earth years`,
        });

        return {
          primary: {
            label: "Age on Mars",
            value: `${formatNumber(marsAge, 2)} Mars years`,
          },
          details,
          note: "Planet ages are based on orbital periods. A 'year' on each planet is one complete orbit around the Sun.",
        };
      },
    },
  ],
  relatedSlugs: ["drake-equation-calculator", "age-calculator", "birthday-calculator"],
  faq: [
    {
      question: "How is age on other planets calculated?",
      answer:
        "Your age on another planet is calculated by dividing your age in Earth days by that planet's orbital period (how long it takes to orbit the Sun). For example, Mars takes 687 Earth days to orbit the Sun, so a 30-year-old Earthling would be about 15.9 Mars years old.",
    },
    {
      question: "Which planet would I be oldest on?",
      answer:
        "Mercury! Since Mercury's year is only 88 Earth days, you'd be about 4.15 times your Earth age. A 20-year-old on Earth would be about 83 Mercury years old. Conversely, on Neptune you'd be youngest — a 25-year-old would only be about 0.15 Neptune years old.",
    },
    {
      question: "Has anyone ever lived a full year on any other planet?",
      answer:
        "In terms of Earth-equivalent time, yes — everyone lives through many Mercury years. But no human has lived long enough to experience a full year on Uranus (84 Earth years), Neptune (165 Earth years), or Pluto (248 Earth years). The oldest verified human, Jeanne Calment, lived 122 years — just over one Uranus year.",
    },
  ],
  formula:
    "Planet Age = (Earth Age x 365.25) / Planet Orbital Period in Earth Days. Each planet's 'year' is one orbit around the Sun.",
};

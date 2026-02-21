import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const g = 9.81;

export const pendulumCalculator: CalculatorDefinition = {
  slug: "pendulum-calculator",
  title: "Pendulum Calculator",
  description:
    "Free pendulum period calculator. Compute the period and frequency of a simple pendulum using T = 2π√(L/g).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "pendulum",
    "period",
    "frequency",
    "simple harmonic motion",
    "oscillation",
  ],
  variants: [
    {
      id: "from-length",
      name: "Period from Length",
      fields: [
        {
          name: "length",
          label: "Pendulum Length (m)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "gravity",
          label: "Gravity (m/s²) — default 9.81",
          type: "number",
          placeholder: "9.81",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const gVal = (inputs.gravity as number) || g;
        if (!length) return null;
        if (length <= 0 || gVal <= 0) return null;
        const period = 2 * Math.PI * Math.sqrt(length / gVal);
        const frequency = 1 / period;
        return {
          primary: {
            label: "Period (T)",
            value: formatNumber(period, 4) + " s",
          },
          details: [
            {
              label: "Frequency (f)",
              value: formatNumber(frequency, 4) + " Hz",
            },
            {
              label: "Angular Frequency (ω)",
              value: formatNumber(2 * Math.PI * frequency, 4) + " rad/s",
            },
            { label: "Length", value: formatNumber(length, 4) + " m" },
            { label: "Gravity", value: formatNumber(gVal, 4) + " m/s²" },
          ],
        };
      },
    },
    {
      id: "from-period",
      name: "Length from Period",
      fields: [
        {
          name: "period",
          label: "Desired Period (s)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "gravity",
          label: "Gravity (m/s²) — default 9.81",
          type: "number",
          placeholder: "9.81",
        },
      ],
      calculate: (inputs) => {
        const period = inputs.period as number;
        const gVal = (inputs.gravity as number) || g;
        if (!period) return null;
        if (period <= 0 || gVal <= 0) return null;
        const length = gVal * (period / (2 * Math.PI)) ** 2;
        const frequency = 1 / period;
        return {
          primary: {
            label: "Required Length",
            value: formatNumber(length, 4) + " m",
          },
          details: [
            { label: "Period", value: formatNumber(period, 4) + " s" },
            {
              label: "Frequency (f)",
              value: formatNumber(frequency, 4) + " Hz",
            },
            {
              label: "Length (cm)",
              value: formatNumber(length * 100, 2) + " cm",
            },
            { label: "Gravity", value: formatNumber(gVal, 4) + " m/s²" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["centripetal-force-calculator", "work-energy-calculator"],
  faq: [
    {
      question: "What factors affect a pendulum's period?",
      answer:
        "For a simple pendulum, only the length and gravitational acceleration affect the period. Mass and amplitude (for small angles) do not.",
    },
    {
      question: "Does this formula work for large swings?",
      answer:
        "This formula is accurate for small angles (less than about 15°). For larger amplitudes, a more complex elliptic integral solution is needed.",
    },
  ],
  formula:
    "T = 2π√(L/g), where L is the pendulum length and g is gravitational acceleration (9.81 m/s² on Earth).",
};

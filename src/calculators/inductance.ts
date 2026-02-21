import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const MU_0 = 4 * Math.PI * 1e-7; // vacuum permeability H/m

export const inductanceCalculator: CalculatorDefinition = {
  slug: "inductance-calculator",
  title: "Inductance Calculator",
  description:
    "Free inductance calculator. Compute solenoid inductance using L = μ₀n²Al for a given coil geometry.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "inductance",
    "solenoid",
    "coil",
    "inductor",
    "henries",
    "magnetic",
  ],
  variants: [
    {
      id: "solenoid",
      name: "Solenoid Inductance",
      fields: [
        {
          name: "turns",
          label: "Number of Turns (N)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "area",
          label: "Cross-Section Area (m²)",
          type: "number",
          placeholder: "e.g. 0.001",
        },
        {
          name: "length",
          label: "Solenoid Length (m)",
          type: "number",
          placeholder: "e.g. 0.1",
        },
      ],
      calculate: (inputs) => {
        const N = inputs.turns as number;
        const A = inputs.area as number;
        const l = inputs.length as number;
        if (!N || !A || !l) return null;
        if (l <= 0) return null;
        const n = N / l; // turns per unit length
        const L = MU_0 * n * n * A * l;
        return {
          primary: {
            label: "Inductance (L)",
            value: formatNumber(L, 6) + " H",
          },
          details: [
            {
              label: "Inductance (mH)",
              value: formatNumber(L * 1000, 4) + " mH",
            },
            {
              label: "Inductance (μH)",
              value: formatNumber(L * 1e6, 4) + " μH",
            },
            {
              label: "Turns per Meter (n)",
              value: formatNumber(n, 2) + " turns/m",
            },
            { label: "Total Turns (N)", value: String(N) },
            { label: "μ₀", value: "4π × 10⁻⁷ H/m" },
            { label: "Cross-Section Area", value: formatNumber(A, 6) + " m²" },
            { label: "Solenoid Length", value: formatNumber(l, 4) + " m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["capacitance-calculator", "transformer-calculator"],
  faq: [
    {
      question: "What is inductance?",
      answer:
        "Inductance is the tendency of an electrical conductor to oppose a change in the current flowing through it. It is measured in henries (H).",
    },
    {
      question: "How does solenoid geometry affect inductance?",
      answer:
        "Inductance increases with more turns, larger cross-section area, and shorter coil length. Specifically, L = μ₀N²A/l, so it scales with the square of the number of turns.",
    },
  ],
  formula:
    "L = μ₀ × n² × A × l = μ₀ × N² × A / l, where μ₀ = 4π × 10⁻⁷ H/m, N is number of turns, A is cross-section area, and l is solenoid length.",
};

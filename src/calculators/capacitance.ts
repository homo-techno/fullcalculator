import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const EPSILON_0 = 8.854e-12; // vacuum permittivity F/m

export const capacitanceCalculator: CalculatorDefinition = {
  slug: "capacitance-calculator",
  title: "Capacitance Calculator",
  description:
    "Free capacitance calculator. Find charge from Q = CV or compute parallel plate capacitance C = ε₀εᵣA/d.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "capacitance",
    "capacitor",
    "charge",
    "parallel plate",
    "permittivity",
    "Q=CV",
  ],
  variants: [
    {
      id: "charge",
      name: "Find Charge (Q = CV)",
      fields: [
        {
          name: "capacitance",
          label: "Capacitance (F)",
          type: "number",
          placeholder: "e.g. 1e-6",
        },
        {
          name: "voltage",
          label: "Voltage (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
      ],
      calculate: (inputs) => {
        const C = inputs.capacitance as number;
        const V = inputs.voltage as number;
        if (!C || !V) return null;
        const Q = C * V;
        const energy = 0.5 * C * V * V;
        return {
          primary: {
            label: "Charge (Q)",
            value: formatNumber(Q, 6) + " C",
          },
          details: [
            { label: "Capacitance", value: formatNumber(C, 6) + " F" },
            {
              label: "Capacitance (μF)",
              value: formatNumber(C * 1e6, 4) + " μF",
            },
            { label: "Voltage", value: formatNumber(V, 4) + " V" },
            {
              label: "Stored Energy",
              value: formatNumber(energy, 6) + " J",
            },
          ],
        };
      },
    },
    {
      id: "parallel-plate",
      name: "Parallel Plate Capacitance",
      fields: [
        {
          name: "epsilonR",
          label: "Relative Permittivity (εᵣ)",
          type: "number",
          placeholder: "e.g. 1 (vacuum), 3.4 (glass)",
        },
        {
          name: "area",
          label: "Plate Area (m²)",
          type: "number",
          placeholder: "e.g. 0.01",
        },
        {
          name: "distance",
          label: "Plate Separation (m)",
          type: "number",
          placeholder: "e.g. 0.001",
        },
      ],
      calculate: (inputs) => {
        const epsilonR = inputs.epsilonR as number;
        const area = inputs.area as number;
        const distance = inputs.distance as number;
        if (!epsilonR || !area || !distance) return null;
        if (distance <= 0) return null;
        const C = (EPSILON_0 * epsilonR * area) / distance;
        return {
          primary: {
            label: "Capacitance",
            value: formatNumber(C, 6) + " F",
          },
          details: [
            {
              label: "Capacitance (pF)",
              value: formatNumber(C * 1e12, 4) + " pF",
            },
            {
              label: "Capacitance (nF)",
              value: formatNumber(C * 1e9, 4) + " nF",
            },
            {
              label: "Capacitance (μF)",
              value: formatNumber(C * 1e6, 4) + " μF",
            },
            { label: "ε₀", value: "8.854 × 10⁻¹² F/m" },
            { label: "εᵣ", value: formatNumber(epsilonR, 2) },
            { label: "Area", value: formatNumber(area, 6) + " m²" },
            { label: "Separation", value: formatNumber(distance, 6) + " m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inductance-calculator", "circuit-calculator"],
  faq: [
    {
      question: "What is capacitance?",
      answer:
        "Capacitance is the ability of a system to store electric charge per unit voltage. It is measured in farads (F). Q = CV relates charge, capacitance, and voltage.",
    },
    {
      question: "How does a parallel plate capacitor work?",
      answer:
        "Two conductive plates separated by a dielectric store energy in the electric field between them. Capacitance increases with plate area and permittivity, and decreases with distance.",
    },
  ],
  formula:
    "Q = CV for charge. Parallel plate: C = ε₀εᵣA/d, where ε₀ = 8.854 × 10⁻¹² F/m, εᵣ is relative permittivity, A is plate area, d is separation.",
};

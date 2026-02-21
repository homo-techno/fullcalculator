import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const materials: Record<string, { alpha: number; label: string }> = {
  aluminum: { alpha: 23.1e-6, label: "Aluminum (23.1 × 10⁻⁶)" },
  steel: { alpha: 12.0e-6, label: "Steel (12.0 × 10⁻⁶)" },
  copper: { alpha: 16.5e-6, label: "Copper (16.5 × 10⁻⁶)" },
  glass: { alpha: 8.5e-6, label: "Glass (8.5 × 10⁻⁶)" },
  concrete: { alpha: 12.0e-6, label: "Concrete (12.0 × 10⁻⁶)" },
  iron: { alpha: 11.8e-6, label: "Iron (11.8 × 10⁻⁶)" },
  brass: { alpha: 19.0e-6, label: "Brass (19.0 × 10⁻⁶)" },
};

export const thermalExpansionCalculator: CalculatorDefinition = {
  slug: "thermal-expansion-calculator",
  title: "Thermal Expansion Calculator",
  description:
    "Free thermal expansion calculator. Compute linear expansion ΔL = α × L₀ × ΔT for common materials.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "thermal expansion",
    "linear expansion",
    "coefficient",
    "temperature change",
    "materials",
  ],
  variants: [
    {
      id: "material",
      name: "Select Material",
      fields: [
        {
          name: "material",
          label: "Material",
          type: "select",
          placeholder: "Select material",
          options: [
            { value: "aluminum", label: "Aluminum" },
            { value: "steel", label: "Steel" },
            { value: "copper", label: "Copper" },
            { value: "glass", label: "Glass" },
            { value: "concrete", label: "Concrete" },
            { value: "iron", label: "Iron" },
            { value: "brass", label: "Brass" },
          ],
        },
        {
          name: "length",
          label: "Original Length L₀ (m)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "deltaT",
          label: "Temperature Change ΔT (°C or K)",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const matKey = inputs.material as string;
        const L0 = inputs.length as number;
        const deltaT = inputs.deltaT as number;
        if (!matKey || !L0 || !deltaT) return null;
        const mat = materials[matKey];
        if (!mat) return null;

        const deltaL = mat.alpha * L0 * deltaT;
        const newLength = L0 + deltaL;

        return {
          primary: {
            label: "Change in Length (ΔL)",
            value: formatNumber(deltaL, 6) + " m",
          },
          details: [
            { label: "Material", value: mat.label },
            {
              label: "Coefficient (α)",
              value: formatNumber(mat.alpha, 8) + " /°C",
            },
            { label: "Original Length (L₀)", value: formatNumber(L0, 4) + " m" },
            { label: "Temperature Change (ΔT)", value: formatNumber(deltaT, 2) + " °C" },
            {
              label: "New Length",
              value: formatNumber(newLength, 6) + " m",
            },
            {
              label: "ΔL (mm)",
              value: formatNumber(deltaL * 1000, 4) + " mm",
            },
          ],
        };
      },
    },
    {
      id: "custom",
      name: "Custom Coefficient",
      fields: [
        {
          name: "alpha",
          label: "Coefficient of Expansion α (/°C)",
          type: "number",
          placeholder: "e.g. 12e-6",
        },
        {
          name: "length",
          label: "Original Length L₀ (m)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "deltaT",
          label: "Temperature Change ΔT (°C or K)",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const alpha = inputs.alpha as number;
        const L0 = inputs.length as number;
        const deltaT = inputs.deltaT as number;
        if (!alpha || !L0 || !deltaT) return null;

        const deltaL = alpha * L0 * deltaT;
        const newLength = L0 + deltaL;

        return {
          primary: {
            label: "Change in Length (ΔL)",
            value: formatNumber(deltaL, 6) + " m",
          },
          details: [
            {
              label: "Coefficient (α)",
              value: formatNumber(alpha, 8) + " /°C",
            },
            { label: "Original Length (L₀)", value: formatNumber(L0, 4) + " m" },
            { label: "Temperature Change (ΔT)", value: formatNumber(deltaT, 2) + " °C" },
            {
              label: "New Length",
              value: formatNumber(newLength, 6) + " m",
            },
            {
              label: "ΔL (mm)",
              value: formatNumber(deltaL * 1000, 4) + " mm",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stefan-boltzmann-calculator", "pendulum-calculator"],
  faq: [
    {
      question: "What is thermal expansion?",
      answer:
        "Thermal expansion is the tendency of matter to change its dimensions (length, area, volume) in response to a change in temperature. ΔL = α × L₀ × ΔT for linear expansion.",
    },
    {
      question: "Is the coefficient of expansion constant?",
      answer:
        "The coefficient is approximately constant over moderate temperature ranges but can vary significantly at extreme temperatures.",
    },
  ],
  formula:
    "ΔL = α × L₀ × ΔT, where α is the coefficient of linear expansion, L₀ is the original length, and ΔT is the temperature change.",
};

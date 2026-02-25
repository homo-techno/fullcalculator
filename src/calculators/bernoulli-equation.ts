import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bernoulliEquationCalculator: CalculatorDefinition = {
  slug: "bernoulli-equation",
  title: "Bernoulli Equation Calculator",
  description:
    "Calculate fluid pressure, velocity, or height at different points along a streamline using Bernoulli's equation: P + ½ρv² + ρgh = constant.",
  category: "Science",
  categorySlug: "science",
  icon: "Droplets",
  keywords: [
    "bernoulli",
    "fluid dynamics",
    "pressure",
    "velocity",
    "flow",
    "streamline",
    "physics",
  ],
  variants: [
    {
      id: "pressure-at-point-2",
      name: "Pressure at Point 2",
      fields: [
        {
          name: "p1",
          label: "Pressure at Point 1 P₁ (Pa)",
          type: "number",
          placeholder: "Enter pressure at point 1 in pascals",
        },
        {
          name: "v1",
          label: "Velocity at Point 1 v₁ (m/s)",
          type: "number",
          placeholder: "Enter velocity at point 1",
        },
        {
          name: "h1",
          label: "Height at Point 1 h₁ (m)",
          type: "number",
          placeholder: "Enter height at point 1",
        },
        {
          name: "v2",
          label: "Velocity at Point 2 v₂ (m/s)",
          type: "number",
          placeholder: "Enter velocity at point 2",
        },
        {
          name: "h2",
          label: "Height at Point 2 h₂ (m)",
          type: "number",
          placeholder: "Enter height at point 2",
        },
        {
          name: "density",
          label: "Fluid Density ρ (kg/m³)",
          type: "number",
          placeholder: "Enter fluid density (1000 for water)",
        },
      ],
      calculate: (inputs) => {
        const P1 = parseFloat(inputs.p1 as string);
        const v1 = parseFloat(inputs.v1 as string);
        const h1 = parseFloat(inputs.h1 as string);
        const v2 = parseFloat(inputs.v2 as string);
        const h2 = parseFloat(inputs.h2 as string);
        const rho = parseFloat(inputs.density as string) || 1000;
        if (isNaN(P1) || isNaN(v1) || isNaN(h1) || isNaN(v2) || isNaN(h2)) {
          return { primary: { label: "Pressure at Point 2", value: "Invalid input" }, details: [] };
        }
        const g = 9.81;
        const P2 = P1 + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * (h1 - h2);
        const dynamicP1 = 0.5 * rho * v1 * v1;
        const dynamicP2 = 0.5 * rho * v2 * v2;
        return {
          primary: { label: "Pressure at Point 2", value: `${formatNumber(P2)} Pa` },
          details: [
            { label: "P₁", value: `${formatNumber(P1)} Pa` },
            { label: "Dynamic Pressure at 1", value: `${formatNumber(dynamicP1)} Pa` },
            { label: "Dynamic Pressure at 2", value: `${formatNumber(dynamicP2)} Pa` },
            { label: "Height Difference (h₁ - h₂)", value: `${formatNumber(h1 - h2)} m` },
            { label: "P₂ (kPa)", value: `${formatNumber(P2 / 1000)} kPa` },
            { label: "P₂ (atm)", value: `${formatNumber(P2 / 101325)} atm` },
          ],
        };
      },
    },
    {
      id: "velocity-at-point-2",
      name: "Velocity at Point 2",
      fields: [
        {
          name: "p1",
          label: "Pressure at Point 1 P₁ (Pa)",
          type: "number",
          placeholder: "Enter pressure at point 1",
        },
        {
          name: "v1",
          label: "Velocity at Point 1 v₁ (m/s)",
          type: "number",
          placeholder: "Enter velocity at point 1",
        },
        {
          name: "h1",
          label: "Height at Point 1 h₁ (m)",
          type: "number",
          placeholder: "Enter height at point 1",
        },
        {
          name: "p2",
          label: "Pressure at Point 2 P₂ (Pa)",
          type: "number",
          placeholder: "Enter pressure at point 2",
        },
        {
          name: "h2",
          label: "Height at Point 2 h₂ (m)",
          type: "number",
          placeholder: "Enter height at point 2",
        },
        {
          name: "density",
          label: "Fluid Density ρ (kg/m³)",
          type: "number",
          placeholder: "Enter fluid density (1000 for water)",
        },
      ],
      calculate: (inputs) => {
        const P1 = parseFloat(inputs.p1 as string);
        const v1 = parseFloat(inputs.v1 as string);
        const h1 = parseFloat(inputs.h1 as string);
        const P2 = parseFloat(inputs.p2 as string);
        const h2 = parseFloat(inputs.h2 as string);
        const rho = parseFloat(inputs.density as string) || 1000;
        if (isNaN(P1) || isNaN(v1) || isNaN(h1) || isNaN(P2) || isNaN(h2) || rho <= 0) {
          return { primary: { label: "Velocity at Point 2", value: "Invalid input" }, details: [] };
        }
        const g = 9.81;
        const v2Squared = v1 * v1 + (2 / rho) * (P1 - P2) + 2 * g * (h1 - h2);
        if (v2Squared < 0) {
          return { primary: { label: "Velocity at Point 2", value: "No real solution (check inputs)" }, details: [] };
        }
        const v2 = Math.sqrt(v2Squared);
        return {
          primary: { label: "Velocity at Point 2", value: `${formatNumber(v2)} m/s` },
          details: [
            { label: "P₁", value: `${formatNumber(P1)} Pa` },
            { label: "v₁", value: `${formatNumber(v1)} m/s` },
            { label: "P₂", value: `${formatNumber(P2)} Pa` },
            { label: "Height Difference", value: `${formatNumber(h1 - h2)} m` },
            { label: "Fluid Density", value: `${formatNumber(rho)} kg/m³` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ideal-gas-calc", "kinetic-energy-calc", "work-done"],
  faq: [
    {
      question: "What is Bernoulli's equation?",
      answer:
        "Bernoulli's equation states that for an ideal, incompressible, steady-flow fluid, the sum of pressure energy, kinetic energy, and potential energy per unit volume is constant along a streamline: P + ½ρv² + ρgh = constant.",
    },
    {
      question: "What are the assumptions of Bernoulli's equation?",
      answer:
        "Bernoulli's equation assumes: (1) the fluid is incompressible, (2) the flow is steady (not changing with time), (3) the flow is along a streamline, (4) there is no friction (inviscid flow), and (5) no work is done on or by the fluid.",
    },
  ],
  formula:
    "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂, where P is pressure, ρ is fluid density, v is flow velocity, g is gravitational acceleration, and h is height.",
};

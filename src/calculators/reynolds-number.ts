import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reynoldsNumberCalculator: CalculatorDefinition = {
  slug: "reynolds-number-calculator",
  title: "Reynolds Number Calculator",
  description:
    "Free Reynolds number calculator. Compute Re = ρvD/μ and classify flow as laminar, transitional, or turbulent.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "reynolds number",
    "fluid dynamics",
    "laminar",
    "turbulent",
    "viscosity",
    "flow regime",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Reynolds Number",
      fields: [
        {
          name: "density",
          label: "Fluid Density ρ (kg/m³)",
          type: "number",
          placeholder: "e.g. 1000 (water)",
        },
        {
          name: "velocity",
          label: "Flow Velocity v (m/s)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "diameter",
          label: "Characteristic Diameter D (m)",
          type: "number",
          placeholder: "e.g. 0.05",
        },
        {
          name: "viscosity",
          label: "Dynamic Viscosity μ (Pa·s)",
          type: "number",
          placeholder: "e.g. 0.001 (water at 20°C)",
        },
      ],
      calculate: (inputs) => {
        const rho = inputs.density as number;
        const v = inputs.velocity as number;
        const D = inputs.diameter as number;
        const mu = inputs.viscosity as number;
        if (!rho || !v || !D || !mu) return null;
        if (mu <= 0) return null;
        const Re = (rho * v * D) / mu;
        let classification: string;
        if (Re < 2300) {
          classification = "Laminar";
        } else if (Re <= 4000) {
          classification = "Transitional";
        } else {
          classification = "Turbulent";
        }
        const kinematicViscosity = mu / rho;
        return {
          primary: {
            label: "Reynolds Number (Re)",
            value: formatNumber(Re, 2),
          },
          details: [
            { label: "Flow Regime", value: classification },
            { label: "Density (ρ)", value: formatNumber(rho, 4) + " kg/m³" },
            { label: "Velocity (v)", value: formatNumber(v, 4) + " m/s" },
            { label: "Diameter (D)", value: formatNumber(D, 4) + " m" },
            {
              label: "Dynamic Viscosity (μ)",
              value: formatNumber(mu, 6) + " Pa·s",
            },
            {
              label: "Kinematic Viscosity (ν)",
              value: formatNumber(kinematicViscosity, 6) + " m²/s",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["buoyancy-calculator", "centripetal-force-calculator"],
  faq: [
    {
      question: "What does the Reynolds number tell us?",
      answer:
        "The Reynolds number predicts flow regime: laminar (Re < 2300), transitional (2300 ≤ Re ≤ 4000), or turbulent (Re > 4000) for pipe flow.",
    },
    {
      question: "What is dynamic viscosity?",
      answer:
        "Dynamic viscosity (μ) measures a fluid's resistance to shear stress. Water at 20°C has μ ≈ 0.001 Pa·s. Air at 20°C has μ ≈ 1.81 × 10⁻⁵ Pa·s.",
    },
  ],
  formula:
    "Re = ρvD/μ, where ρ is density, v is velocity, D is characteristic diameter, and μ is dynamic viscosity. Laminar < 2300, Transition 2300–4000, Turbulent > 4000.",
};

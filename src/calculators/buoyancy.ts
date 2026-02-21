import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const g = 9.81;

export const buoyancyCalculator: CalculatorDefinition = {
  slug: "buoyancy-calculator",
  title: "Buoyancy Calculator",
  description:
    "Free buoyancy calculator. Compute buoyant force Fb = ρ×V×g and determine whether an object floats or sinks.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "buoyancy",
    "archimedes",
    "buoyant force",
    "float",
    "sink",
    "fluid density",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Buoyant Force",
      fields: [
        {
          name: "fluidDensity",
          label: "Fluid Density (kg/m³)",
          type: "number",
          placeholder: "e.g. 1000 (water)",
        },
        {
          name: "volume",
          label: "Submerged Volume (m³)",
          type: "number",
          placeholder: "e.g. 0.01",
        },
        {
          name: "objectWeight",
          label: "Object Weight (N) — optional",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const rho = inputs.fluidDensity as number;
        const V = inputs.volume as number;
        const weight = inputs.objectWeight as number;
        if (!rho || !V) return null;
        const Fb = rho * V * g;

        const details = [
          { label: "Fluid Density (ρ)", value: formatNumber(rho, 4) + " kg/m³" },
          { label: "Submerged Volume (V)", value: formatNumber(V, 6) + " m³" },
          { label: "Gravity (g)", value: formatNumber(g, 2) + " m/s²" },
          {
            label: "Displaced Fluid Mass",
            value: formatNumber(rho * V, 4) + " kg",
          },
        ];

        if (weight) {
          const netForce = Fb - weight;
          const status =
            netForce > 0 ? "Floats (buoyancy > weight)" : netForce < 0 ? "Sinks (weight > buoyancy)" : "Neutrally buoyant";
          details.push(
            { label: "Object Weight", value: formatNumber(weight, 4) + " N" },
            { label: "Net Force", value: formatNumber(netForce, 4) + " N" },
            { label: "Status", value: status }
          );
        }

        return {
          primary: {
            label: "Buoyant Force (Fb)",
            value: formatNumber(Fb, 4) + " N",
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["reynolds-number-calculator", "gravitational-force-calculator"],
  faq: [
    {
      question: "What is Archimedes' Principle?",
      answer:
        "Archimedes' Principle states that the buoyant force on a submerged object equals the weight of the displaced fluid: Fb = ρ_fluid × V_submerged × g.",
    },
    {
      question: "How do I know if an object floats?",
      answer:
        "An object floats if the buoyant force exceeds its weight, or equivalently, if the object's average density is less than the fluid's density.",
    },
  ],
  formula:
    "Fb = ρ_fluid × V × g, where ρ is fluid density, V is submerged volume, and g = 9.81 m/s².",
};

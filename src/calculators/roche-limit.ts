import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rocheLimitCalculator: CalculatorDefinition = {
  slug: "roche-limit-calculator",
  title: "Roche Limit Calculator",
  description: "Free Roche limit calculator. Calculate the minimum distance a satellite can orbit before tidal forces tear it apart.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["roche limit", "tidal disruption", "roche radius", "satellite breakup"],
  variants: [
    {
      id: "roche",
      name: "Calculate Roche Limit",
      description: "d = R_primary * (2 * rho_primary / rho_satellite)^(1/3)",
      fields: [
        { name: "primaryRadius", label: "Primary Body Radius (km)", type: "number", placeholder: "e.g. 6371" },
        { name: "primaryDensity", label: "Primary Body Density (kg/m^3)", type: "number", placeholder: "e.g. 5514" },
        { name: "satDensity", label: "Satellite Density (kg/m^3)", type: "number", placeholder: "e.g. 3346" },
      ],
      calculate: (inputs) => {
        const R = inputs.primaryRadius as number;
        const rhoP = inputs.primaryDensity as number;
        const rhoS = inputs.satDensity as number;
        if (!R || !rhoP || !rhoS) return null;
        const rigid = R * Math.pow(2 * rhoP / rhoS, 1 / 3);
        const fluid = 2.44 * R * Math.pow(rhoP / rhoS, 1 / 3);
        return {
          primary: { label: "Roche Limit (rigid body)", value: `${formatNumber(rigid, 2)} km` },
          details: [
            { label: "Roche Limit (fluid body)", value: `${formatNumber(fluid, 2)} km` },
            { label: "Rigid / Primary Radius", value: `${formatNumber(rigid / R, 3)} R` },
            { label: "Fluid / Primary Radius", value: `${formatNumber(fluid / R, 3)} R` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["schwarzschild-radius-calculator", "tidal-force-calculator", "planet-surface-gravity-calculator"],
  faq: [
    { question: "What is the Roche limit?", answer: "The Roche limit is the closest distance a body held together only by gravity can orbit without being torn apart by tidal forces." },
    { question: "Why are there rigid and fluid limits?", answer: "Rigid bodies resist deformation, so their Roche limit is closer. Fluid bodies deform more easily and break up farther away." },
  ],
  formula: "d_rigid = R(2rho_p / rho_s)^(1/3) | d_fluid = 2.44R(rho_p / rho_s)^(1/3)",
};

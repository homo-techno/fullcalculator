import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const densityCalculator: CalculatorDefinition = {
  slug: "density-calculator",
  title: "Density Calculator",
  description: "Free density calculator. Calculate density, mass, or volume using the formula ρ = m/V. Includes common material densities.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["density calculator", "mass volume density", "density formula", "specific gravity calculator", "material density"],
  variants: [
    {
      id: "density",
      name: "Density / Mass / Volume",
      description: "Enter any two to calculate the third",
      fields: [
        { name: "mass", label: "Mass (g or kg)", type: "number", placeholder: "e.g. 500" },
        { name: "volume", label: "Volume (mL or cm³)", type: "number", placeholder: "e.g. 200" },
        { name: "density", label: "Density (g/cm³)", type: "number", placeholder: "e.g. 2.5" },
      ],
      calculate: (inputs) => {
        const m = inputs.mass as number;
        const v = inputs.volume as number;
        const d = inputs.density as number;
        const hasM = m !== undefined && m !== null && String(m) !== "";
        const hasV = v !== undefined && v !== null && String(v) !== "";
        const hasD = d !== undefined && d !== null && String(d) !== "";
        if ([hasM, hasV, hasD].filter(Boolean).length < 2) return null;
        let mass = m, volume = v, density = d;
        let solved = "";
        if (!hasD) { density = m / v; solved = "Density"; }
        else if (!hasM) { mass = d * v; solved = "Mass"; }
        else if (!hasV) { volume = m / d; solved = "Volume"; }
        else { solved = "All given"; }
        const floats = density < 1.0;
        return {
          primary: { label: solved !== "All given" ? solved : "Density", value: solved === "Mass" ? `${formatNumber(mass, 4)} g` : solved === "Volume" ? `${formatNumber(volume, 4)} cm³` : `${formatNumber(density, 4)} g/cm³` },
          details: [
            { label: "Density", value: `${formatNumber(density, 4)} g/cm³` },
            { label: "Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Volume", value: `${formatNumber(volume, 4)} cm³` },
            { label: "Floats in water?", value: floats ? "Yes (ρ < 1.0)" : "No (ρ ≥ 1.0)" },
          ],
          note: "Common densities: Water = 1.0, Ice = 0.917, Iron = 7.87, Gold = 19.3, Air = 0.001225 g/cm³",
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "unit-converter", "force-calculator"],
  faq: [
    { question: "What is density?", answer: "Density (ρ) = Mass / Volume. It measures how much matter is packed into a given space. Water has a density of 1 g/cm³. Objects denser than water sink; less dense objects float." },
  ],
  formula: "ρ = m / V | m = ρ × V | V = m / ρ",
};

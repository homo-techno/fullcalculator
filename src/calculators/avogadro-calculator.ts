import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const AVOGADRO = 6.02214076e23;

export const avogadroCalculator: CalculatorDefinition = {
  slug: "avogadro-calculator",
  title: "Avogadro's Number Calculator",
  description: "Free Avogadro's number calculator. Convert between moles and number of particles (atoms, molecules, ions). Uses Nₐ = 6.022 × 10²³.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["Avogadro number", "moles to particles", "atoms molecules", "6.022e23", "mole conversion"],
  variants: [
    {
      id: "molesToParticles",
      name: "Moles to Particles",
      fields: [
        { name: "moles", label: "Number of Moles", type: "number", placeholder: "e.g. 1.0" },
        { name: "particleType", label: "Particle Type", type: "select", options: [
          { label: "Molecules", value: "molecules" },
          { label: "Atoms", value: "atoms" },
          { label: "Ions", value: "ions" },
          { label: "Formula Units", value: "formula units" },
        ] },
      ],
      calculate: (inputs) => {
        const moles = inputs.moles as number, pType = inputs.particleType as string;
        if (!moles || moles < 0) return null;
        const particles = moles * AVOGADRO;
        return {
          primary: { label: `Number of ${pType || "particles"}`, value: particles.toExponential(4) },
          details: [
            { label: "Moles", value: formatNumber(moles, 6) },
            { label: "Avogadro's Number", value: `${AVOGADRO.toExponential(4)} /mol` },
            { label: "Particles (full)", value: particles.toExponential(10) },
          ],
        };
      },
    },
    {
      id: "particlesToMoles",
      name: "Particles to Moles",
      fields: [
        { name: "particlesExp", label: "Number of Particles (×10²³)", type: "number", placeholder: "e.g. 6.022" },
        { name: "particleType", label: "Particle Type", type: "select", options: [
          { label: "Molecules", value: "molecules" },
          { label: "Atoms", value: "atoms" },
          { label: "Ions", value: "ions" },
          { label: "Formula Units", value: "formula units" },
        ] },
      ],
      calculate: (inputs) => {
        const pExp = inputs.particlesExp as number, pType = inputs.particleType as string;
        if (!pExp || pExp <= 0) return null;
        const particles = pExp * 1e23;
        const moles = particles / AVOGADRO;
        return {
          primary: { label: "Moles", value: formatNumber(moles, 6) },
          details: [
            { label: `${pType || "Particles"}`, value: particles.toExponential(4) },
            { label: "Avogadro's Number", value: `${AVOGADRO.toExponential(4)} /mol` },
          ],
        };
      },
    },
    {
      id: "massToParticles",
      name: "Mass to Particles",
      description: "Convert mass in grams directly to number of particles",
      fields: [
        { name: "mass", label: "Mass (g)", type: "number", placeholder: "e.g. 18.015" },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 18.015 for H2O" },
        { name: "particleType", label: "Particle Type", type: "select", options: [
          { label: "Molecules", value: "molecules" },
          { label: "Atoms", value: "atoms" },
          { label: "Ions", value: "ions" },
          { label: "Formula Units", value: "formula units" },
        ] },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number, mm = inputs.molarMass as number, pType = inputs.particleType as string;
        if (!mass || !mm || mm <= 0) return null;
        const moles = mass / mm;
        const particles = moles * AVOGADRO;
        return {
          primary: { label: `Number of ${pType || "particles"}`, value: particles.toExponential(4) },
          details: [
            { label: "Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Molar Mass", value: `${formatNumber(mm, 4)} g/mol` },
            { label: "Moles", value: formatNumber(moles, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molar-mass-calculator", "molarity-calculator", "percent-composition-calculator"],
  faq: [
    { question: "What is Avogadro's number?", answer: "Avogadro's number (Nₐ) is 6.02214076 × 10²³ particles per mole. It defines how many atoms, molecules, ions, or other entities are in one mole of a substance. It was redefined in 2019 as an exact number." },
    { question: "How do I convert moles to molecules?", answer: "Multiply moles by Avogadro's number: Number of molecules = moles × 6.022 × 10²³. For example, 2 moles of H2O contains 2 × 6.022 × 10²³ = 1.204 × 10²⁴ molecules." },
    { question: "How do I convert grams to molecules?", answer: "First convert grams to moles: moles = mass / molar mass. Then multiply by Avogadro's number. For example, 36.03 g of H2O = 36.03/18.015 = 2.0 mol = 1.204 × 10²⁴ molecules." },
  ],
  formula: "N = n × Nₐ | n = mass / molar mass | Nₐ = 6.02214076 × 10²³ mol⁻¹",
};

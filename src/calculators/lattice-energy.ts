import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const latticeEnergyCalculator: CalculatorDefinition = {
  slug: "lattice-energy-calculator",
  title: "Lattice Energy Calculator (Born-Haber)",
  description: "Free lattice energy calculator using the Born-Haber cycle. Estimate lattice energy from thermodynamic data or using the Born-Lande equation for ionic compounds.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lattice energy", "Born-Haber cycle", "ionic bonding", "Born-Lande", "crystal energy"],
  variants: [
    {
      id: "born-haber",
      name: "Born-Haber Cycle",
      description: "Calculate lattice energy from thermodynamic cycle data",
      fields: [
        { name: "hfFormation", label: "ΔH°f (formation of compound, kJ/mol)", type: "number", placeholder: "e.g. -411 for NaCl", step: 0.1 },
        { name: "hSublimation", label: "ΔH sublimation of metal (kJ/mol)", type: "number", placeholder: "e.g. 108 for Na", min: 0, step: 0.1 },
        { name: "ionizationEnergy", label: "Ionization energy of metal (kJ/mol)", type: "number", placeholder: "e.g. 496 for Na", min: 0, step: 0.1 },
        { name: "hDissociation", label: "½ Bond dissociation of X₂ (kJ/mol)", type: "number", placeholder: "e.g. 122 for ½Cl₂", min: 0, step: 0.1 },
        { name: "electronAffinity", label: "Electron affinity of nonmetal (kJ/mol)", type: "number", placeholder: "e.g. -349 for Cl", step: 0.1 },
      ],
      calculate: (inputs) => {
        const Hf = inputs.hfFormation as number;
        const Hsub = inputs.hSublimation as number;
        const IE = inputs.ionizationEnergy as number;
        const Hdiss = inputs.hDissociation as number;
        const EA = inputs.electronAffinity as number;
        if (Hf === undefined || Hsub === undefined || IE === undefined || Hdiss === undefined || EA === undefined) return null;
        const latticeEnergy = Hf - Hsub - IE - Hdiss - EA;
        return {
          primary: { label: "Lattice Energy", value: formatNumber(latticeEnergy, 1), suffix: "kJ/mol" },
          details: [
            { label: "ΔH°f (formation)", value: `${formatNumber(Hf, 1)} kJ/mol` },
            { label: "ΔH sublimation", value: `${formatNumber(Hsub, 1)} kJ/mol` },
            { label: "Ionization Energy", value: `${formatNumber(IE, 1)} kJ/mol` },
            { label: "½ Bond Dissociation", value: `${formatNumber(Hdiss, 1)} kJ/mol` },
            { label: "Electron Affinity", value: `${formatNumber(EA, 1)} kJ/mol` },
          ],
          note: "Born-Haber cycle: ΔH°f = ΔH_sub + IE + ½D + EA + U_lattice. Lattice energy is typically large and negative for stable ionic compounds.",
        };
      },
    },
    {
      id: "born-lande",
      name: "Born-Lande Estimation",
      description: "Estimate lattice energy using the Born-Lande equation",
      fields: [
        { name: "madelungConst", label: "Madelung Constant (A)", type: "number", placeholder: "e.g. 1.748 for NaCl", min: 0, step: 0.001 },
        { name: "chargePos", label: "Cation Charge (z+)", type: "number", placeholder: "e.g. 1", min: 1, step: 1 },
        { name: "chargeNeg", label: "Anion Charge (z-)", type: "number", placeholder: "e.g. 1", min: 1, step: 1 },
        { name: "distance", label: "Interionic Distance r₀ (pm)", type: "number", placeholder: "e.g. 282 for NaCl", min: 1, step: 1 },
        { name: "bornExp", label: "Born Exponent (n)", type: "number", placeholder: "e.g. 8", min: 2, step: 1, defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const A = inputs.madelungConst as number;
        const zPlus = inputs.chargePos as number;
        const zMinus = inputs.chargeNeg as number;
        const r0pm = inputs.distance as number;
        const n = inputs.bornExp as number;
        if (!A || !zPlus || !zMinus || !r0pm || !n || A <= 0 || zPlus < 1 || zMinus < 1 || r0pm <= 0 || n <= 1) return null;
        const r0m = r0pm * 1e-12;
        const NA = 6.02214076e23;
        const e = 1.602176634e-19;
        const eps0 = 8.854187817e-12;
        const U = -(NA * A * zPlus * zMinus * e * e) / (4 * Math.PI * eps0 * r0m) * (1 - 1 / n);
        const UkJ = U / 1000;
        return {
          primary: { label: "Lattice Energy", value: formatNumber(UkJ, 1), suffix: "kJ/mol" },
          details: [
            { label: "Madelung Constant", value: formatNumber(A, 4) },
            { label: "Charges", value: `${zPlus}+ / ${zMinus}-` },
            { label: "Interionic Distance", value: `${formatNumber(r0pm, 1)} pm` },
            { label: "Born Exponent", value: formatNumber(n, 0) },
          ],
          note: "Born-Lande equation gives an estimate. Common Madelung constants: NaCl = 1.748, CsCl = 1.763, ZnS = 1.638.",
        };
      },
    },
    {
      id: "known-compounds",
      name: "Known Ionic Compounds",
      fields: [
        {
          name: "compound",
          label: "Ionic Compound",
          type: "select",
          options: [
            { label: "NaCl - Sodium Chloride", value: "-786" },
            { label: "KCl - Potassium Chloride", value: "-715" },
            { label: "MgO - Magnesium Oxide", value: "-3850" },
            { label: "CaO - Calcium Oxide", value: "-3461" },
            { label: "NaF - Sodium Fluoride", value: "-923" },
            { label: "LiF - Lithium Fluoride", value: "-1037" },
            { label: "CsCl - Cesium Chloride", value: "-657" },
            { label: "MgCl₂ - Magnesium Chloride", value: "-2523" },
          ],
        },
      ],
      calculate: (inputs) => {
        const latticeE = parseFloat(inputs.compound as string);
        if (!latticeE) return null;
        return {
          primary: { label: "Lattice Energy", value: formatNumber(latticeE, 0), suffix: "kJ/mol" },
          details: [
            { label: "Magnitude", value: `${formatNumber(Math.abs(latticeE), 0)} kJ/mol` },
            { label: "Stability", value: Math.abs(latticeE) > 2000 ? "Very High" : Math.abs(latticeE) > 800 ? "High" : "Moderate" },
          ],
          note: "Higher magnitude lattice energy = stronger ionic bonding = higher melting point and hardness.",
        };
      },
    },
  ],
  relatedSlugs: ["enthalpy-calculator", "electron-configuration-calculator", "bond-order-calculator"],
  faq: [
    { question: "What is lattice energy?", answer: "Lattice energy is the energy released when gaseous ions combine to form one mole of an ionic solid, or equivalently, the energy required to separate one mole of solid ionic compound into gaseous ions. It indicates the strength of ionic bonding." },
    { question: "What factors affect lattice energy?", answer: "Lattice energy increases with higher ion charges and smaller ionic radii. For example, MgO (2+/2- charges) has much higher lattice energy than NaCl (1+/1-). This explains trends in melting points and solubility of ionic compounds." },
  ],
  formula: "U = ΔH°f - ΔH_sub - IE - ½D - EA (Born-Haber) | U = -(N_A × A × z+ × z- × e²)/(4πε₀r₀) × (1 - 1/n) (Born-Lande)",
};

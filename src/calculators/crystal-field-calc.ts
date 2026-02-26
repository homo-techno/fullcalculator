import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const eVtoJ = 1.602176634e-19;
const h = 6.62607015e-34;
const c = 2.99792458e8;

export const crystalFieldCalculator: CalculatorDefinition = {
  slug: "crystal-field-calculator",
  title: "Crystal Field Splitting Calculator",
  description: "Free crystal field splitting energy calculator. Compute Δ (10Dq), CFSE, and d-electron configurations for octahedral and tetrahedral transition metal complexes.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["crystal field theory", "crystal field splitting", "10Dq", "CFSE", "octahedral complex", "tetrahedral complex", "transition metal"],
  variants: [
    {
      id: "from-wavelength",
      name: "Δ from Absorption Wavelength",
      description: "Calculate crystal field splitting energy from the wavelength of maximum absorption",
      fields: [
        { name: "wavelength", label: "Absorption Wavelength (nm)", type: "number", placeholder: "e.g. 500", min: 1 },
        {
          name: "geometry",
          label: "Complex Geometry",
          type: "select",
          options: [
            { label: "Octahedral", value: "oct" },
            { label: "Tetrahedral", value: "tet" },
          ],
          defaultValue: "oct",
        },
      ],
      calculate: (inputs) => {
        const lambdaNm = parseFloat(inputs.wavelength as string);
        const geometry = (inputs.geometry as string) || "oct";
        if (isNaN(lambdaNm) || lambdaNm <= 0) return null;

        const lambdaM = lambdaNm * 1e-9;
        const energyJ = (h * c) / lambdaM;
        const energyEV = energyJ / eVtoJ;
        const energyCm = 1 / (lambdaM * 100); // cm⁻¹
        const energyKJmol = (energyJ * 6.02214076e23) / 1000;

        // Complementary color (absorbed vs observed)
        let absorbedColor = "Unknown";
        let observedColor = "Unknown";
        if (lambdaNm >= 380 && lambdaNm < 450) { absorbedColor = "Violet"; observedColor = "Yellow-Green"; }
        else if (lambdaNm >= 450 && lambdaNm < 495) { absorbedColor = "Blue"; observedColor = "Orange"; }
        else if (lambdaNm >= 495 && lambdaNm < 570) { absorbedColor = "Green"; observedColor = "Red/Purple"; }
        else if (lambdaNm >= 570 && lambdaNm < 590) { absorbedColor = "Yellow"; observedColor = "Violet/Blue"; }
        else if (lambdaNm >= 590 && lambdaNm < 620) { absorbedColor = "Orange"; observedColor = "Blue"; }
        else if (lambdaNm >= 620 && lambdaNm <= 780) { absorbedColor = "Red"; observedColor = "Green/Blue"; }

        const tetDelta = geometry === "oct" ? energyCm * (4 / 9) : energyCm;
        const octDelta = geometry === "tet" ? energyCm * (9 / 4) : energyCm;

        return {
          primary: { label: `Δ${geometry === "oct" ? "oct" : "tet"}`, value: `${formatNumber(energyCm, 1)} cm⁻¹` },
          details: [
            { label: "Δ (cm⁻¹)", value: `${formatNumber(energyCm, 1)} cm⁻¹` },
            { label: "Δ (eV)", value: `${formatNumber(energyEV, 4)} eV` },
            { label: "Δ (kJ/mol)", value: `${formatNumber(energyKJmol, 2)} kJ/mol` },
            { label: "Wavelength", value: `${formatNumber(lambdaNm, 1)} nm` },
            { label: "Geometry", value: geometry === "oct" ? "Octahedral" : "Tetrahedral" },
            { label: "Color Absorbed", value: absorbedColor },
            { label: "Color Observed", value: observedColor },
            { label: geometry === "oct" ? "Estimated Δ_tet" : "Estimated Δ_oct", value: `${formatNumber(geometry === "oct" ? tetDelta : octDelta, 1)} cm⁻¹` },
          ],
        };
      },
    },
    {
      id: "cfse",
      name: "CFSE from d-Electron Count",
      description: "Calculate Crystal Field Stabilization Energy for a given d-electron count",
      fields: [
        { name: "dElectrons", label: "Number of d-electrons (1-10)", type: "number", placeholder: "e.g. 6", min: 1, max: 10 },
        { name: "delta", label: "Δ (cm⁻¹)", type: "number", placeholder: "e.g. 20000", min: 1 },
        {
          name: "geometry",
          label: "Geometry",
          type: "select",
          options: [
            { label: "Octahedral", value: "oct" },
            { label: "Tetrahedral", value: "tet" },
          ],
          defaultValue: "oct",
        },
        {
          name: "spinState",
          label: "Spin State",
          type: "select",
          options: [
            { label: "High Spin", value: "high" },
            { label: "Low Spin", value: "low" },
          ],
          defaultValue: "high",
        },
      ],
      calculate: (inputs) => {
        const dE = parseFloat(inputs.dElectrons as string);
        const delta = parseFloat(inputs.delta as string);
        const geometry = (inputs.geometry as string) || "oct";
        const spinState = (inputs.spinState as string) || "high";
        if (isNaN(dE) || isNaN(delta) || dE < 1 || dE > 10) return null;

        const d = Math.floor(dE);

        // Octahedral: t2g (-0.4Δ each) and eg (+0.6Δ each)
        // Tetrahedral: e (-0.6Δ each) and t2 (+0.4Δ each)
        let t2gOrE: number, egOrT2: number;
        let cfse: number;
        let unpairedElectrons: number;
        let config: string;

        if (geometry === "oct") {
          // Octahedral high-spin filling
          const hsConfig: [number, number, number][] = [
            [0, 0, 0], // d0
            [1, 0, 1], [2, 0, 2], [3, 0, 3], // d1-d3
            [3, 1, 4], [3, 2, 5], // d4-d5 high spin
            [4, 2, 4], [5, 2, 3], [6, 2, 2], // d6-d8
            [6, 3, 1], // d9
          ];
          // Low spin: fill t2g first
          const lsConfig: [number, number, number][] = [
            [0, 0, 0],
            [1, 0, 1], [2, 0, 2], [3, 0, 3],
            [4, 0, 2], [5, 0, 1], // d4-d5 low spin
            [6, 0, 0], [6, 1, 1], [6, 2, 2],
            [6, 3, 1],
          ];

          const cfgArr = spinState === "low" ? lsConfig : hsConfig;
          const cfg = cfgArr[d] || [0, 0, 0];
          t2gOrE = cfg[0];
          egOrT2 = cfg[1];
          unpairedElectrons = cfg[2];
          cfse = t2gOrE * (-0.4) + egOrT2 * 0.6;
          config = `t₂g^${t2gOrE} eg^${egOrT2}`;
        } else {
          // Tetrahedral (almost always high-spin due to smaller Δ)
          const tetConfig: [number, number, number][] = [
            [0, 0, 0],
            [1, 0, 1], [2, 0, 2], // d1-d2 in e
            [2, 1, 3], [2, 2, 4], // d3-d4
            [2, 3, 5], // d5
            [3, 3, 4], [4, 3, 3], // d6-d7
            [4, 4, 2], [4, 5, 1], [4, 6, 0], // d8-d10
          ];
          const cfg = tetConfig[d] || [0, 0, 0];
          t2gOrE = cfg[0];
          egOrT2 = cfg[1];
          unpairedElectrons = cfg[2];
          cfse = t2gOrE * (-0.6) + egOrT2 * 0.4;
          config = `e^${t2gOrE} t₂^${egOrT2}`;
        }

        const cfseEnergy = cfse * delta; // in cm⁻¹
        const cfseKJ = (cfseEnergy * h * c * 100 * 6.02214076e23) / 1000;
        const magneticMoment = Math.sqrt(unpairedElectrons * (unpairedElectrons + 2));

        return {
          primary: { label: "CFSE", value: `${formatNumber(cfseEnergy, 1)} cm⁻¹` },
          details: [
            { label: "d-electron count", value: formatNumber(d, 0) },
            { label: "Configuration", value: config },
            { label: "CFSE (in Δ units)", value: `${formatNumber(cfse, 2)}Δ` },
            { label: "CFSE (cm⁻¹)", value: `${formatNumber(cfseEnergy, 1)} cm⁻¹` },
            { label: "CFSE (kJ/mol)", value: `${formatNumber(cfseKJ, 2)} kJ/mol` },
            { label: "Unpaired Electrons", value: formatNumber(unpairedElectrons, 0) },
            { label: "Spin-only μ (BM)", value: `${formatNumber(magneticMoment, 2)} BM` },
            { label: "Paramagnetic?", value: unpairedElectrons > 0 ? "Yes" : "No (diamagnetic)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electromagnetic-wave-calculator", "wavelength-calculator", "ph-calculator"],
  faq: [
    { question: "What is crystal field splitting?", answer: "Crystal field splitting (Δ or 10Dq) is the energy difference between sets of d-orbitals caused by the electrostatic field of surrounding ligands. In octahedral complexes, d-orbitals split into lower t₂g and higher eg sets. The size of Δ determines color, magnetism, and stability." },
    { question: "What determines high spin vs low spin?", answer: "If the crystal field splitting Δ is larger than the electron pairing energy P, electrons pair up in lower orbitals (low spin). If Δ < P, electrons spread across all orbitals before pairing (high spin). Strong-field ligands (CN⁻, CO) favor low spin; weak-field ligands (I⁻, Br⁻) favor high spin." },
    { question: "Why is tetrahedral splitting smaller?", answer: "Tetrahedral splitting Δ_tet ≈ (4/9)Δ_oct because fewer ligands interact less directly with the d-orbitals. This is why tetrahedral complexes are almost always high-spin — the splitting is too small to overcome pairing energy." },
  ],
  formula: "Δ = hc/λ | Δ_tet ≈ (4/9)Δ_oct | CFSE = Σ(electrons × orbital energy) | μ = √(n(n+2)) BM",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

interface VseprResult {
  electronGeometry: string;
  molecularGeometry: string;
  bondAngle: string;
  hybridization: string;
  polarity: string;
  example: string;
}

function getVseprGeometry(bondingPairs: number, lonePairs: number): VseprResult | null {
  const total = bondingPairs + lonePairs;
  const key = `${bondingPairs},${lonePairs}`;
  const table: Record<string, VseprResult> = {
    "2,0": { electronGeometry: "Linear", molecularGeometry: "Linear", bondAngle: "180°", hybridization: "sp", polarity: "Nonpolar (if identical atoms)", example: "BeCl₂, CO₂" },
    "3,0": { electronGeometry: "Trigonal Planar", molecularGeometry: "Trigonal Planar", bondAngle: "120°", hybridization: "sp²", polarity: "Nonpolar (if identical atoms)", example: "BF₃, SO₃" },
    "2,1": { electronGeometry: "Trigonal Planar", molecularGeometry: "Bent", bondAngle: "~117°", hybridization: "sp²", polarity: "Polar", example: "SO₂, O₃" },
    "4,0": { electronGeometry: "Tetrahedral", molecularGeometry: "Tetrahedral", bondAngle: "109.5°", hybridization: "sp³", polarity: "Nonpolar (if identical atoms)", example: "CH₄, SiH₄" },
    "3,1": { electronGeometry: "Tetrahedral", molecularGeometry: "Trigonal Pyramidal", bondAngle: "~107°", hybridization: "sp³", polarity: "Polar", example: "NH₃, PCl₃" },
    "2,2": { electronGeometry: "Tetrahedral", molecularGeometry: "Bent", bondAngle: "~104.5°", hybridization: "sp³", polarity: "Polar", example: "H₂O, H₂S" },
    "5,0": { electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "Trigonal Bipyramidal", bondAngle: "90° & 120°", hybridization: "sp³d", polarity: "Nonpolar (if identical atoms)", example: "PCl₅" },
    "4,1": { electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "Seesaw", bondAngle: "~90° & ~120°", hybridization: "sp³d", polarity: "Polar", example: "SF₄" },
    "3,2": { electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "T-shaped", bondAngle: "~90°", hybridization: "sp³d", polarity: "Polar", example: "ClF₃, BrF₃" },
    "2,3": { electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "Linear", bondAngle: "180°", hybridization: "sp³d", polarity: "Nonpolar", example: "XeF₂, I₃⁻" },
    "6,0": { electronGeometry: "Octahedral", molecularGeometry: "Octahedral", bondAngle: "90°", hybridization: "sp³d²", polarity: "Nonpolar (if identical atoms)", example: "SF₆" },
    "5,1": { electronGeometry: "Octahedral", molecularGeometry: "Square Pyramidal", bondAngle: "~90°", hybridization: "sp³d²", polarity: "Polar", example: "BrF₅, IF₅" },
    "4,2": { electronGeometry: "Octahedral", molecularGeometry: "Square Planar", bondAngle: "90°", hybridization: "sp³d²", polarity: "Nonpolar", example: "XeF₄" },
  };
  return table[key] || null;
}

export const molecularGeometryCalculator: CalculatorDefinition = {
  slug: "molecular-geometry-calculator",
  title: "Molecular Geometry (VSEPR) Calculator",
  description: "Free VSEPR molecular geometry calculator. Determine molecular shape, bond angles, hybridization, and polarity from bonding and lone pairs using VSEPR theory.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["molecular geometry", "VSEPR", "bond angle", "molecular shape", "lone pairs", "electron geometry"],
  variants: [
    {
      id: "from-pairs",
      name: "From Bonding & Lone Pairs",
      fields: [
        { name: "bondingPairs", label: "Number of Bonding Pairs (on central atom)", type: "number", placeholder: "e.g. 4", min: 2, max: 6, step: 1 },
        { name: "lonePairs", label: "Number of Lone Pairs (on central atom)", type: "number", placeholder: "e.g. 0", min: 0, max: 3, step: 1 },
      ],
      calculate: (inputs) => {
        const bp = Math.round(inputs.bondingPairs as number);
        const lp = Math.round(inputs.lonePairs as number);
        if (bp === undefined || lp === undefined || bp < 2 || bp > 6 || lp < 0 || lp > 3) return null;
        const result = getVseprGeometry(bp, lp);
        if (!result) return null;
        const total = bp + lp;
        return {
          primary: { label: "Molecular Geometry", value: result.molecularGeometry },
          details: [
            { label: "Electron Geometry", value: result.electronGeometry },
            { label: "Bond Angle", value: result.bondAngle },
            { label: "Hybridization", value: result.hybridization },
            { label: "Polarity", value: result.polarity },
            { label: "Steric Number", value: `${total}` },
            { label: "Example", value: result.example },
          ],
          note: "VSEPR: Valence Shell Electron Pair Repulsion. Electron pairs arrange to minimize repulsion. Lone pairs occupy more space than bonding pairs.",
        };
      },
    },
    {
      id: "common-molecules",
      name: "Common Molecules",
      fields: [
        {
          name: "molecule",
          label: "Molecule",
          type: "select",
          options: [
            { label: "CO₂ - Carbon Dioxide", value: "2,0" },
            { label: "BF₃ - Boron Trifluoride", value: "3,0" },
            { label: "SO₂ - Sulfur Dioxide", value: "2,1" },
            { label: "CH₄ - Methane", value: "4,0" },
            { label: "NH₃ - Ammonia", value: "3,1" },
            { label: "H₂O - Water", value: "2,2" },
            { label: "PCl₅ - Phosphorus Pentachloride", value: "5,0" },
            { label: "SF₄ - Sulfur Tetrafluoride", value: "4,1" },
            { label: "ClF₃ - Chlorine Trifluoride", value: "3,2" },
            { label: "XeF₂ - Xenon Difluoride", value: "2,3" },
            { label: "SF₆ - Sulfur Hexafluoride", value: "6,0" },
            { label: "XeF₄ - Xenon Tetrafluoride", value: "4,2" },
          ],
        },
      ],
      calculate: (inputs) => {
        const molStr = inputs.molecule as string;
        if (!molStr) return null;
        const parts = molStr.split(",");
        const bp = parseInt(parts[0], 10);
        const lp = parseInt(parts[1], 10);
        const result = getVseprGeometry(bp, lp);
        if (!result) return null;
        return {
          primary: { label: "Molecular Geometry", value: result.molecularGeometry },
          details: [
            { label: "Electron Geometry", value: result.electronGeometry },
            { label: "Bond Angle", value: result.bondAngle },
            { label: "Hybridization", value: result.hybridization },
            { label: "Polarity", value: result.polarity },
            { label: "Bonding Pairs", value: `${bp}` },
            { label: "Lone Pairs", value: `${lp}` },
            { label: "Example", value: result.example },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hybridization-calculator", "bond-order-calculator", "electron-configuration-calculator"],
  faq: [
    { question: "What is VSEPR theory?", answer: "VSEPR (Valence Shell Electron Pair Repulsion) theory predicts molecular shapes by assuming electron pairs around a central atom arrange themselves to minimize repulsion. Count bonding and lone pairs on the central atom, then use the steric number to determine geometry." },
    { question: "What is the difference between electron geometry and molecular geometry?", answer: "Electron geometry considers ALL electron pairs (bonding + lone) around the central atom. Molecular geometry only considers the arrangement of atoms (bonding pairs). For example, water has tetrahedral electron geometry but bent molecular geometry." },
  ],
  formula: "Steric Number = bonding pairs + lone pairs | Determines electron geometry → molecular geometry",
};

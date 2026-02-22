import type { CalculatorDefinition } from "./types";

const ELEMENTS: Record<number, { symbol: string; name: string; config: string; shortConfig: string }> = {
  1: { symbol: "H", name: "Hydrogen", config: "1s¹", shortConfig: "1s¹" },
  2: { symbol: "He", name: "Helium", config: "1s²", shortConfig: "1s²" },
  3: { symbol: "Li", name: "Lithium", config: "1s² 2s¹", shortConfig: "[He] 2s¹" },
  4: { symbol: "Be", name: "Beryllium", config: "1s² 2s²", shortConfig: "[He] 2s²" },
  5: { symbol: "B", name: "Boron", config: "1s² 2s² 2p¹", shortConfig: "[He] 2s² 2p¹" },
  6: { symbol: "C", name: "Carbon", config: "1s² 2s² 2p²", shortConfig: "[He] 2s² 2p²" },
  7: { symbol: "N", name: "Nitrogen", config: "1s² 2s² 2p³", shortConfig: "[He] 2s² 2p³" },
  8: { symbol: "O", name: "Oxygen", config: "1s² 2s² 2p⁴", shortConfig: "[He] 2s² 2p⁴" },
  9: { symbol: "F", name: "Fluorine", config: "1s² 2s² 2p⁵", shortConfig: "[He] 2s² 2p⁵" },
  10: { symbol: "Ne", name: "Neon", config: "1s² 2s² 2p⁶", shortConfig: "[He] 2s² 2p⁶" },
  11: { symbol: "Na", name: "Sodium", config: "1s² 2s² 2p⁶ 3s¹", shortConfig: "[Ne] 3s¹" },
  12: { symbol: "Mg", name: "Magnesium", config: "1s² 2s² 2p⁶ 3s²", shortConfig: "[Ne] 3s²" },
  13: { symbol: "Al", name: "Aluminum", config: "1s² 2s² 2p⁶ 3s² 3p¹", shortConfig: "[Ne] 3s² 3p¹" },
  14: { symbol: "Si", name: "Silicon", config: "1s² 2s² 2p⁶ 3s² 3p²", shortConfig: "[Ne] 3s² 3p²" },
  15: { symbol: "P", name: "Phosphorus", config: "1s² 2s² 2p⁶ 3s² 3p³", shortConfig: "[Ne] 3s² 3p³" },
  16: { symbol: "S", name: "Sulfur", config: "1s² 2s² 2p⁶ 3s² 3p⁴", shortConfig: "[Ne] 3s² 3p⁴" },
  17: { symbol: "Cl", name: "Chlorine", config: "1s² 2s² 2p⁶ 3s² 3p⁵", shortConfig: "[Ne] 3s² 3p⁵" },
  18: { symbol: "Ar", name: "Argon", config: "1s² 2s² 2p⁶ 3s² 3p⁶", shortConfig: "[Ne] 3s² 3p⁶" },
  19: { symbol: "K", name: "Potassium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹", shortConfig: "[Ar] 4s¹" },
  20: { symbol: "Ca", name: "Calcium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²", shortConfig: "[Ar] 4s²" },
  21: { symbol: "Sc", name: "Scandium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹", shortConfig: "[Ar] 4s² 3d¹" },
  22: { symbol: "Ti", name: "Titanium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d²", shortConfig: "[Ar] 4s² 3d²" },
  23: { symbol: "V", name: "Vanadium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d³", shortConfig: "[Ar] 4s² 3d³" },
  24: { symbol: "Cr", name: "Chromium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d⁵", shortConfig: "[Ar] 4s¹ 3d⁵" },
  25: { symbol: "Mn", name: "Manganese", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁵", shortConfig: "[Ar] 4s² 3d⁵" },
  26: { symbol: "Fe", name: "Iron", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶", shortConfig: "[Ar] 4s² 3d⁶" },
  27: { symbol: "Co", name: "Cobalt", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁷", shortConfig: "[Ar] 4s² 3d⁷" },
  28: { symbol: "Ni", name: "Nickel", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁸", shortConfig: "[Ar] 4s² 3d⁸" },
  29: { symbol: "Cu", name: "Copper", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d¹⁰", shortConfig: "[Ar] 4s¹ 3d¹⁰" },
  30: { symbol: "Zn", name: "Zinc", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰", shortConfig: "[Ar] 4s² 3d¹⁰" },
  31: { symbol: "Ga", name: "Gallium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p¹", shortConfig: "[Ar] 4s² 3d¹⁰ 4p¹" },
  32: { symbol: "Ge", name: "Germanium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p²", shortConfig: "[Ar] 4s² 3d¹⁰ 4p²" },
  33: { symbol: "As", name: "Arsenic", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p³", shortConfig: "[Ar] 4s² 3d¹⁰ 4p³" },
  34: { symbol: "Se", name: "Selenium", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁴", shortConfig: "[Ar] 4s² 3d¹⁰ 4p⁴" },
  35: { symbol: "Br", name: "Bromine", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁵", shortConfig: "[Ar] 4s² 3d¹⁰ 4p⁵" },
  36: { symbol: "Kr", name: "Krypton", config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶", shortConfig: "[Ar] 4s² 3d¹⁰ 4p⁶" },
};

function getValenceElectrons(z: number): string {
  if (z <= 2) return ELEMENTS[z]?.config || "";
  if (z <= 10) { const parts = ELEMENTS[z]?.config.split(" ") || []; return parts.slice(1).join(" "); }
  if (z <= 18) { const parts = ELEMENTS[z]?.config.split(" ") || []; return parts.slice(3).join(" "); }
  if (z <= 36) { const parts = ELEMENTS[z]?.shortConfig.split(" ") || []; return parts.slice(1).join(" "); }
  return "";
}

function getBlock(z: number): string {
  if (z <= 2) return "s-block";
  if (z <= 4) return "s-block";
  if (z >= 5 && z <= 10) return "p-block";
  if (z <= 12) return "s-block";
  if (z >= 13 && z <= 18) return "p-block";
  if (z <= 20) return "s-block";
  if (z >= 21 && z <= 30) return "d-block";
  if (z >= 31 && z <= 36) return "p-block";
  return "unknown";
}

export const electronConfigurationCalculator: CalculatorDefinition = {
  slug: "electron-configuration-calculator",
  title: "Electron Configuration Calculator",
  description: "Free electron configuration calculator. Find the full and shorthand electron configuration for elements 1-36, including valence electrons, block, and period information.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["electron configuration", "orbital filling", "aufbau principle", "valence electrons", "periodic table"],
  variants: [
    {
      id: "by-number",
      name: "By Atomic Number",
      fields: [
        { name: "atomicNumber", label: "Atomic Number (1-36)", type: "number", placeholder: "e.g. 26 for Iron", min: 1, max: 36, step: 1 },
      ],
      calculate: (inputs) => {
        const z = Math.round(inputs.atomicNumber as number);
        if (!z || z < 1 || z > 36) return null;
        const el = ELEMENTS[z];
        if (!el) return null;
        const period = z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : 4;
        return {
          primary: { label: `${el.symbol} (${el.name})`, value: el.config },
          details: [
            { label: "Noble Gas Notation", value: el.shortConfig },
            { label: "Valence Electrons", value: getValenceElectrons(z) },
            { label: "Block", value: getBlock(z) },
            { label: "Period", value: `${period}` },
            { label: "Total Electrons", value: `${z}` },
          ],
          note: "Filling order follows the Aufbau principle: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p. Exceptions: Cr ([Ar]4s¹3d⁵) and Cu ([Ar]4s¹3d¹⁰) prefer half-filled/filled d subshells.",
        };
      },
    },
    {
      id: "by-element",
      name: "Common Elements",
      fields: [
        {
          name: "element",
          label: "Element",
          type: "select",
          options: [
            { label: "H (1) - Hydrogen", value: "1" },
            { label: "C (6) - Carbon", value: "6" },
            { label: "N (7) - Nitrogen", value: "7" },
            { label: "O (8) - Oxygen", value: "8" },
            { label: "Na (11) - Sodium", value: "11" },
            { label: "Cl (17) - Chlorine", value: "17" },
            { label: "Ca (20) - Calcium", value: "20" },
            { label: "Fe (26) - Iron", value: "26" },
            { label: "Cu (29) - Copper", value: "29" },
            { label: "Zn (30) - Zinc", value: "30" },
            { label: "Br (35) - Bromine", value: "35" },
          ],
        },
      ],
      calculate: (inputs) => {
        const z = parseInt(inputs.element as string, 10);
        if (!z || z < 1 || z > 36) return null;
        const el = ELEMENTS[z];
        if (!el) return null;
        const period = z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : 4;
        return {
          primary: { label: `${el.symbol} (${el.name})`, value: el.config },
          details: [
            { label: "Noble Gas Notation", value: el.shortConfig },
            { label: "Valence Electrons", value: getValenceElectrons(z) },
            { label: "Block", value: getBlock(z) },
            { label: "Period", value: `${period}` },
            { label: "Total Electrons", value: `${z}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hybridization-calculator", "bond-order-calculator", "molecular-geometry-calculator"],
  faq: [
    { question: "What is electron configuration?", answer: "Electron configuration describes how electrons are distributed among the atomic orbitals of an atom. It follows the Aufbau principle (fill lowest energy first), Pauli exclusion principle (max 2 electrons per orbital), and Hund's rule (fill orbitals singly first)." },
    { question: "Why are Cr and Cu exceptions?", answer: "Chromium (Z=24) has [Ar]4s¹3d⁵ instead of [Ar]4s²3d⁴, and copper (Z=29) has [Ar]4s¹3d¹⁰ instead of [Ar]4s²3d⁹. Half-filled (d⁵) and fully filled (d¹⁰) d subshells have extra stability due to exchange energy." },
  ],
  formula: "Aufbau order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → ...",
};

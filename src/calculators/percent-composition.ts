import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percentCompositionCalculator: CalculatorDefinition = {
  slug: "percent-composition-calculator",
  title: "Percent Composition Calculator",
  description: "Free percent composition calculator. Calculate the mass percentage of each element in a chemical compound.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["percent composition", "mass percent", "elemental analysis", "chemical composition", "weight percent"],
  variants: [
    {
      id: "twoElement",
      name: "Two-Element Compound",
      description: "Calculate percent composition of a binary compound",
      fields: [
        { name: "element1", label: "Element 1 Name", type: "select", options: [
          { label: "Hydrogen (H)", value: "H" },
          { label: "Carbon (C)", value: "C" },
          { label: "Nitrogen (N)", value: "N" },
          { label: "Oxygen (O)", value: "O" },
          { label: "Sodium (Na)", value: "Na" },
          { label: "Chlorine (Cl)", value: "Cl" },
          { label: "Sulfur (S)", value: "S" },
          { label: "Iron (Fe)", value: "Fe" },
          { label: "Calcium (Ca)", value: "Ca" },
          { label: "Potassium (K)", value: "K" },
        ] },
        { name: "mass1", label: "Total Mass of Element 1 in Formula (g/mol)", type: "number", placeholder: "e.g. 2.016 for 2H" },
        { name: "element2", label: "Element 2 Name", type: "select", options: [
          { label: "Hydrogen (H)", value: "H" },
          { label: "Carbon (C)", value: "C" },
          { label: "Nitrogen (N)", value: "N" },
          { label: "Oxygen (O)", value: "O" },
          { label: "Sodium (Na)", value: "Na" },
          { label: "Chlorine (Cl)", value: "Cl" },
          { label: "Sulfur (S)", value: "S" },
          { label: "Iron (Fe)", value: "Fe" },
          { label: "Calcium (Ca)", value: "Ca" },
          { label: "Potassium (K)", value: "K" },
        ] },
        { name: "mass2", label: "Total Mass of Element 2 in Formula (g/mol)", type: "number", placeholder: "e.g. 15.999 for 1O" },
      ],
      calculate: (inputs) => {
        const el1 = inputs.element1 as string, m1 = inputs.mass1 as number;
        const el2 = inputs.element2 as string, m2 = inputs.mass2 as number;
        if (!m1 || !m2 || m1 <= 0 || m2 <= 0) return null;
        const total = m1 + m2;
        const pct1 = (m1 / total) * 100;
        const pct2 = (m2 / total) * 100;
        return {
          primary: { label: "Molar Mass", value: `${formatNumber(total, 3)} g/mol` },
          details: [
            { label: `% ${el1 || "Element 1"}`, value: `${formatNumber(pct1, 2)}%` },
            { label: `% ${el2 || "Element 2"}`, value: `${formatNumber(pct2, 2)}%` },
            { label: "Mass Ratio", value: `${formatNumber(m1 / m2, 4)}` },
          ],
        };
      },
    },
    {
      id: "threeElement",
      name: "Three-Element Compound",
      fields: [
        { name: "mass1", label: "Element 1 Total Mass (g/mol)", type: "number", placeholder: "e.g. 40.078 for Ca" },
        { name: "label1", label: "Element 1", type: "select", options: [
          { label: "Hydrogen (H)", value: "H" },
          { label: "Carbon (C)", value: "C" },
          { label: "Nitrogen (N)", value: "N" },
          { label: "Oxygen (O)", value: "O" },
          { label: "Sodium (Na)", value: "Na" },
          { label: "Chlorine (Cl)", value: "Cl" },
          { label: "Sulfur (S)", value: "S" },
          { label: "Iron (Fe)", value: "Fe" },
          { label: "Calcium (Ca)", value: "Ca" },
          { label: "Phosphorus (P)", value: "P" },
        ] },
        { name: "mass2", label: "Element 2 Total Mass (g/mol)", type: "number", placeholder: "e.g. 12.011 for C" },
        { name: "label2", label: "Element 2", type: "select", options: [
          { label: "Hydrogen (H)", value: "H" },
          { label: "Carbon (C)", value: "C" },
          { label: "Nitrogen (N)", value: "N" },
          { label: "Oxygen (O)", value: "O" },
          { label: "Sodium (Na)", value: "Na" },
          { label: "Chlorine (Cl)", value: "Cl" },
          { label: "Sulfur (S)", value: "S" },
          { label: "Iron (Fe)", value: "Fe" },
          { label: "Calcium (Ca)", value: "Ca" },
          { label: "Phosphorus (P)", value: "P" },
        ] },
        { name: "mass3", label: "Element 3 Total Mass (g/mol)", type: "number", placeholder: "e.g. 47.997 for 3O" },
        { name: "label3", label: "Element 3", type: "select", options: [
          { label: "Hydrogen (H)", value: "H" },
          { label: "Carbon (C)", value: "C" },
          { label: "Nitrogen (N)", value: "N" },
          { label: "Oxygen (O)", value: "O" },
          { label: "Sodium (Na)", value: "Na" },
          { label: "Chlorine (Cl)", value: "Cl" },
          { label: "Sulfur (S)", value: "S" },
          { label: "Iron (Fe)", value: "Fe" },
          { label: "Calcium (Ca)", value: "Ca" },
          { label: "Phosphorus (P)", value: "P" },
        ] },
      ],
      calculate: (inputs) => {
        const m1 = inputs.mass1 as number, m2 = inputs.mass2 as number, m3 = inputs.mass3 as number;
        const l1 = inputs.label1 as string, l2 = inputs.label2 as string, l3 = inputs.label3 as string;
        if (!m1 || !m2 || !m3 || m1 <= 0 || m2 <= 0 || m3 <= 0) return null;
        const total = m1 + m2 + m3;
        return {
          primary: { label: "Molar Mass", value: `${formatNumber(total, 3)} g/mol` },
          details: [
            { label: `% ${l1 || "El 1"}`, value: `${formatNumber((m1 / total) * 100, 2)}%` },
            { label: `% ${l2 || "El 2"}`, value: `${formatNumber((m2 / total) * 100, 2)}%` },
            { label: `% ${l3 || "El 3"}`, value: `${formatNumber((m3 / total) * 100, 2)}%` },
            { label: "Total %", value: "100.00%" },
          ],
        };
      },
    },
    {
      id: "fromSample",
      name: "From Experimental Mass",
      description: "Calculate percent composition from lab measurements",
      fields: [
        { name: "totalMass", label: "Total Sample Mass (g)", type: "number", placeholder: "e.g. 10.0" },
        { name: "elementMass", label: "Mass of Element in Sample (g)", type: "number", placeholder: "e.g. 4.0" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalMass as number, elem = inputs.elementMass as number;
        if (!total || !elem || total <= 0 || elem < 0 || elem > total) return null;
        const pct = (elem / total) * 100;
        const remaining = total - elem;
        const pctRemaining = (remaining / total) * 100;
        return {
          primary: { label: "Percent of Element", value: `${formatNumber(pct, 4)}%` },
          details: [
            { label: "Mass of Element", value: `${formatNumber(elem, 4)} g` },
            { label: "Remaining Mass", value: `${formatNumber(remaining, 4)} g` },
            { label: "Remaining %", value: `${formatNumber(pctRemaining, 4)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molar-mass-calculator", "empirical-formula-calculator", "molarity-calculator"],
  faq: [
    { question: "What is percent composition?", answer: "Percent composition is the percentage by mass of each element in a compound. It is calculated as: % element = (total mass of element in formula / molar mass of compound) × 100. All percentages must sum to 100%." },
    { question: "How do I find percent composition of water (H2O)?", answer: "H2O molar mass = 2(1.008) + 15.999 = 18.015 g/mol. %H = (2.016/18.015) × 100 = 11.19%. %O = (15.999/18.015) × 100 = 88.81%." },
    { question: "What is percent composition used for?", answer: "Percent composition is used to verify the purity of a compound, determine empirical formulas from experimental data, and calculate the mass of a specific element in a given mass of compound." },
  ],
  formula: "% element = (mass of element in formula / molar mass) × 100",
};

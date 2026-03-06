import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ligationRatioCalculator: CalculatorDefinition = {
  slug: "ligation-ratio-calculator",
  title: "DNA Ligation Ratio Calculator",
  description: "Calculate the optimal insert-to-vector molar ratio and DNA masses for molecular cloning ligation reactions based on fragment sizes.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ligation ratio","insert vector ratio","molecular cloning","dna ligation","cloning calculator"],
  variants: [{
    id: "standard",
    name: "DNA Ligation Ratio",
    description: "Calculate the optimal insert-to-vector molar ratio and DNA masses for molecular cloning ligation reactions based on fragment sizes.",
    fields: [
      { name: "vectorSize", label: "Vector Size (bp)", type: "number", min: 500, max: 50000, defaultValue: 5000 },
      { name: "insertSize", label: "Insert Size (bp)", type: "number", min: 50, max: 50000, defaultValue: 1000 },
      { name: "vectorMass", label: "Vector Mass (ng)", type: "number", min: 1, max: 1000, defaultValue: 50 },
      { name: "molarRatio", label: "Insert:Vector Molar Ratio", type: "select", options: [{ value: "1", label: "1:1" }, { value: "3", label: "3:1" }, { value: "5", label: "5:1" }, { value: "10", label: "10:1" }], defaultValue: "3" },
    ],
    calculate: (inputs) => {
    const vectorSize = inputs.vectorSize as number;
    const insertSize = inputs.insertSize as number;
    const vectorMass = inputs.vectorMass as number;
    const molarRatio = inputs.molarRatio as number;
    const insertMass = (molarRatio * vectorMass * insertSize) / vectorSize;
    const vectorPmol = (vectorMass * 1000) / (vectorSize * 660);
    const insertPmol = vectorPmol * molarRatio;
    const totalDna = vectorMass + insertMass;
    return {
      primary: { label: "Insert Mass Needed", value: formatNumber(Math.round(insertMass * 100) / 100) + " ng" },
      details: [
        { label: "Vector (pmol)", value: formatNumber(Math.round(vectorPmol * 1000) / 1000) },
        { label: "Insert (pmol)", value: formatNumber(Math.round(insertPmol * 1000) / 1000) },
        { label: "Total DNA in Reaction", value: formatNumber(Math.round(totalDna * 100) / 100) + " ng" },
        { label: "Insert:Vector Ratio", value: formatNumber(molarRatio) + ":1" }
      ]
    };
  },
  }],
  relatedSlugs: ["dna-concentration-calculator","pcr-cycle-number-calculator","serial-dilution-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Insert mass (ng) = Ratio x Vector mass (ng) x Insert size (bp) / Vector size (bp); pmol = mass (ng) x 1000 / (size (bp) x 660)",
};

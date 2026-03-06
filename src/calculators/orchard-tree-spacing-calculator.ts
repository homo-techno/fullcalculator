import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const orchardTreeSpacingCalculator: CalculatorDefinition = {
  slug: "orchard-tree-spacing-calculator",
  title: "Orchard Tree Spacing Calculator",
  description: "Calculate the number of trees per acre, total trees needed, and planting layout based on row and tree spacing for orchard design.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["orchard spacing","tree planting calculator","trees per acre calculator"],
  variants: [{
    id: "standard",
    name: "Orchard Tree Spacing",
    description: "Calculate the number of trees per acre, total trees needed, and planting layout based on row and tree spacing for orchard design.",
    fields: [
      { name: "rowSpacing", label: "Row Spacing (feet)", type: "number", min: 4, max: 50, defaultValue: 20 },
      { name: "treeSpacing", label: "Tree Spacing in Row (feet)", type: "number", min: 2, max: 40, defaultValue: 15 },
      { name: "totalAcres", label: "Total Acres", type: "number", min: 0.1, max: 5000, defaultValue: 10 },
      { name: "costPerTree", label: "Cost Per Tree ($)", type: "number", min: 1, max: 200, defaultValue: 25 },
      { name: "replantPct", label: "Extra for Replanting (%)", type: "number", min: 0, max: 30, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const rs = inputs.rowSpacing as number;
      const ts = inputs.treeSpacing as number;
      const ac = inputs.totalAcres as number;
      const cpt = inputs.costPerTree as number;
      const rp = inputs.replantPct as number;
      if (!rs || !ts || !ac || !cpt) return null;
      const sqFtPerTree = rs * ts;
      const treesPerAcre = Math.floor(43560 / sqFtPerTree);
      const totalTrees = Math.ceil(treesPerAcre * ac);
      const withExtra = Math.ceil(totalTrees * (1 + rp / 100));
      const totalCost = Math.round(withExtra * cpt);
      const rowsPerAcre = Math.floor(Math.sqrt(43560 / rs) / ts * ts / rs);
      return {
        primary: { label: "Trees Per Acre", value: formatNumber(treesPerAcre) },
        details: [
          { label: "Total Trees Needed", value: formatNumber(totalTrees) },
          { label: "With Replant Extra", value: formatNumber(withExtra) },
          { label: "Sq Ft Per Tree", value: formatNumber(sqFtPerTree) + " sq ft" },
          { label: "Total Tree Cost", value: "$" + formatNumber(totalCost) },
        ],
      };
  },
  }],
  relatedSlugs: ["seed-spacing-calculator","vineyard-yield-estimator-calculator"],
  faq: [
    { question: "What is the best spacing for apple trees?", answer: "Standard apple trees need 25 to 35 feet between rows and 15 to 25 feet between trees. Semi-dwarf trees use 12 to 18 foot spacing, and high-density dwarf plantings can be as close as 3 to 6 feet apart." },
    { question: "How many trees fit on one acre?", answer: "It depends on spacing. At 20x15 foot spacing, you get about 145 trees per acre. High-density apple orchards at 12x4 foot spacing can fit over 900 trees per acre." },
  ],
  formula: "Trees Per Acre = 43,560 / (Row Spacing x Tree Spacing); Total Trees = Trees Per Acre x Acres; Total Cost = Trees x (1 + Replant%) x Cost Per Tree",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fruitTreeYieldCalculator: CalculatorDefinition = {
  slug: "fruit-tree-yield-calculator",
  title: "Fruit Tree Yield Calculator",
  description: "Free fruit tree yield calculator. Estimate annual fruit production based on tree type, age, size, and growing conditions for home orchards and small farms.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fruit tree yield calculator", "how much fruit per tree", "apple tree yield", "fruit tree production", "orchard yield calculator"],
  variants: [
    {
      id: "single-tree",
      name: "Single Tree Yield",
      description: "Estimate yield for one fruit tree",
      fields: [
        { name: "treeType", label: "Fruit Tree Type", type: "select", options: [
          { label: "Apple (Standard)", value: "apple_std" },
          { label: "Apple (Semi-Dwarf)", value: "apple_sd" },
          { label: "Apple (Dwarf)", value: "apple_dw" },
          { label: "Peach", value: "peach" },
          { label: "Pear", value: "pear" },
          { label: "Cherry (Sweet)", value: "cherry_sweet" },
          { label: "Cherry (Sour/Tart)", value: "cherry_sour" },
          { label: "Plum", value: "plum" },
          { label: "Orange", value: "orange" },
          { label: "Lemon", value: "lemon" },
          { label: "Avocado", value: "avocado" },
          { label: "Fig", value: "fig" },
          { label: "Pecan", value: "pecan" },
        ], defaultValue: "apple_sd" },
        { name: "treeAge", label: "Tree Age (years)", type: "number", placeholder: "e.g. 8", min: 1, max: 100 },
        { name: "careLevel", label: "Care Level", type: "select", options: [
          { label: "Excellent (Pruned, fertilized, sprayed)", value: "excellent" },
          { label: "Good (Regular care)", value: "good" },
          { label: "Average (Minimal care)", value: "average" },
          { label: "Neglected (No care)", value: "neglected" },
        ], defaultValue: "good" },
      ],
      calculate: (inputs) => {
        const tree = inputs.treeType as string;
        const age = inputs.treeAge as number;
        const care = inputs.careLevel as string;
        if (!tree || !age) return null;

        const matureYield: Record<string, number> = {
          apple_std: 400, apple_sd: 200, apple_dw: 80, peach: 150,
          pear: 200, cherry_sweet: 100, cherry_sour: 60, plum: 120,
          orange: 200, lemon: 150, avocado: 200, fig: 100, pecan: 75,
        };
        const yearsToMature: Record<string, number> = {
          apple_std: 8, apple_sd: 5, apple_dw: 3, peach: 4,
          pear: 6, cherry_sweet: 6, cherry_sour: 4, plum: 5,
          orange: 5, lemon: 4, avocado: 5, fig: 3, pecan: 10,
        };
        const firstFruitYear: Record<string, number> = {
          apple_std: 4, apple_sd: 3, apple_dw: 2, peach: 3,
          pear: 4, cherry_sweet: 4, cherry_sour: 3, plum: 3,
          orange: 3, lemon: 3, avocado: 3, fig: 2, pecan: 6,
        };

        const maxYield = matureYield[tree] || 150;
        const maturityAge = yearsToMature[tree] || 6;
        const firstFruit = firstFruitYear[tree] || 3;
        const careMultiplier: Record<string, number> = {
          excellent: 1.2, good: 1.0, average: 0.7, neglected: 0.4,
        };

        let yieldPct = 0;
        if (age < firstFruit) {
          yieldPct = 0;
        } else if (age >= maturityAge) {
          yieldPct = 1.0;
        } else {
          yieldPct = (age - firstFruit) / (maturityAge - firstFruit) * 0.8 + 0.1;
        }

        const annualYield = maxYield * yieldPct * (careMultiplier[care] || 1.0);
        const avgFruitWeight = tree.includes("pecan") ? 0.02 : tree.includes("cherry") ? 0.02 : tree.includes("fig") ? 0.1 : 0.33;
        const numFruit = annualYield / avgFruitWeight;

        return {
          primary: { label: "Estimated Annual Yield", value: `${formatNumber(annualYield, 0)} lbs` },
          details: [
            { label: "Mature tree yield", value: `${maxYield} lbs/year` },
            { label: "Current production level", value: `${formatNumber(yieldPct * 100, 0)}% of mature yield` },
            { label: "Approximate fruit count", value: formatNumber(numFruit, 0) },
            { label: "First fruit expected", value: `Year ${firstFruit}` },
            { label: "Full maturity", value: `Year ${maturityAge}` },
            { label: "Care adjustment", value: `${(careMultiplier[care] || 1) * 100}% of potential` },
          ],
          note: age < firstFruit ? "This tree is too young to produce fruit. Focus on establishing strong roots and structure through proper pruning." : "Yields vary significantly by variety, climate, pollination, and weather. These are average estimates for healthy trees.",
        };
      },
    },
    {
      id: "orchard",
      name: "Orchard Total Yield",
      description: "Estimate total yield for multiple trees",
      fields: [
        { name: "numTrees", label: "Number of Trees", type: "number", placeholder: "e.g. 20" },
        { name: "treeType", label: "Fruit Tree Type", type: "select", options: [
          { label: "Apple (Standard) - 400 lbs/tree", value: "apple_std" },
          { label: "Apple (Semi-Dwarf) - 200 lbs/tree", value: "apple_sd" },
          { label: "Apple (Dwarf) - 80 lbs/tree", value: "apple_dw" },
          { label: "Peach - 150 lbs/tree", value: "peach" },
          { label: "Pear - 200 lbs/tree", value: "pear" },
          { label: "Cherry (Sweet) - 100 lbs/tree", value: "cherry" },
          { label: "Plum - 120 lbs/tree", value: "plum" },
          { label: "Citrus - 200 lbs/tree", value: "citrus" },
        ], defaultValue: "apple_sd" },
        { name: "maturityPct", label: "Average Maturity of Trees", type: "select", options: [
          { label: "Young (25% production)", value: "25" },
          { label: "Approaching Maturity (50%)", value: "50" },
          { label: "Near Mature (75%)", value: "75" },
          { label: "Fully Mature (100%)", value: "100" },
        ], defaultValue: "75" },
      ],
      calculate: (inputs) => {
        const num = inputs.numTrees as number;
        const tree = inputs.treeType as string;
        const matPct = parseInt(inputs.maturityPct as string);
        if (!num || !tree) return null;

        const yieldPerTree: Record<string, number> = {
          apple_std: 400, apple_sd: 200, apple_dw: 80, peach: 150,
          pear: 200, cherry: 100, plum: 120, citrus: 200,
        };
        const pricePerLb: Record<string, number> = {
          apple_std: 1.5, apple_sd: 1.5, apple_dw: 1.5, peach: 2.0,
          pear: 1.75, cherry: 4.0, plum: 2.0, citrus: 1.0,
        };

        const yieldEach = (yieldPerTree[tree] || 150) * (matPct / 100);
        const totalYield = yieldEach * num;
        const tons = totalYield / 2000;
        const farmValue = totalYield * (pricePerLb[tree] || 1.5);
        const bushels = totalYield / 42;

        return {
          primary: { label: "Total Annual Yield", value: `${formatNumber(totalYield, 0)} lbs` },
          details: [
            { label: "Yield per tree", value: `${formatNumber(yieldEach, 0)} lbs` },
            { label: "Total tons", value: formatNumber(tons, 2) },
            { label: "Bushels (approx)", value: formatNumber(bushels, 0) },
            { label: "Estimated farm value", value: `$${formatNumber(farmValue, 0)}` },
            { label: "Number of trees", value: `${num}` },
            { label: "Maturity level", value: `${matPct}%` },
          ],
          note: "Farm gate prices vary by region and market. U-Pick operations can earn 2-3x wholesale prices. Factor in labor, spraying, and equipment costs for net income.",
        };
      },
    },
  ],
  relatedSlugs: ["tree-spacing-calculator", "vegetable-yield-calculator", "garden-yield-calculator"],
  faq: [
    { question: "How much fruit does an apple tree produce?", answer: "A standard apple tree produces 400-800 lbs (10-20 bushels) per year at maturity. Semi-dwarf trees yield 150-300 lbs, and dwarf trees yield 50-100 lbs. Trees begin producing fruit in 2-5 years depending on rootstock." },
    { question: "How long until a fruit tree produces fruit?", answer: "Dwarf fruit trees: 2-3 years. Semi-dwarf: 3-4 years. Standard: 4-8 years. Peach and cherry trees fruit faster (3-4 years) while pear and apple trees take longer (4-6 years). Grafted trees produce sooner than seed-grown trees." },
    { question: "What affects fruit tree yield?", answer: "Key factors: Proper pollination (many fruits need a second variety), adequate sunlight (6+ hours), proper pruning, pest/disease management, soil nutrition, water availability, and tree age. Young and neglected trees produce significantly less." },
  ],
  formula: "Annual Yield = Mature Yield × Maturity% × Care Factor | Maturity% increases linearly from first fruit year to full maturity year",
};

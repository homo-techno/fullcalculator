import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treeCarbonCalculator: CalculatorDefinition = {
  slug: "tree-carbon-calculator",
  title: "Tree Carbon Offset Calculator",
  description: "Calculate how much CO2 your trees absorb annually and their equivalent carbon offset value.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tree carbon offset", "CO2 absorption trees", "carbon sequestration calculator"],
  variants: [{
    id: "standard",
    name: "Tree Carbon Offset",
    description: "Calculate how much CO2 your trees absorb annually and their equivalent carbon offset value",
    fields: [
      { name: "treeCount", label: "Number of Trees", type: "number", suffix: "trees", min: 1, max: 10000, defaultValue: 10 },
      { name: "treeAge", label: "Average Tree Age", type: "select", options: [{value:"young",label:"Young (1-10 years)"},{value:"mature",label:"Mature (10-30 years)"},{value:"old",label:"Old Growth (30+ years)"}], defaultValue: "mature" },
      { name: "treeType", label: "Tree Type", type: "select", options: [{value:"deciduous",label:"Deciduous (Oak, Maple)"},{value:"conifer",label:"Conifer (Pine, Spruce)"},{value:"tropical",label:"Tropical (Teak, Mahogany)"}], defaultValue: "deciduous" },
    ],
    calculate: (inputs) => {
      const count = inputs.treeCount as number;
      const age = inputs.treeAge as string;
      const tType = inputs.treeType as string;
      if (!count || count <= 0) return null;
      const baseAbsorption: Record<string, number> = { deciduous: 48, conifer: 36, tropical: 55 };
      const ageMod: Record<string, number> = { young: 0.5, mature: 1.0, old: 0.8 };
      const co2PerTree = (baseAbsorption[tType] || 48) * (ageMod[age] || 1.0);
      const totalCO2 = count * co2PerTree;
      const carsOffset = totalCO2 / 10000;
      const carbonCredits = totalCO2 / 2000 * 15;
      return {
        primary: { label: "CO2 Absorbed per Year", value: formatNumber(Math.round(totalCO2)) + " lbs" },
        details: [
          { label: "CO2 per Tree per Year", value: formatNumber(Math.round(co2PerTree)) + " lbs" },
          { label: "Equivalent Cars Offset", value: formatNumber(Math.round(carsOffset * 100) / 100) },
          { label: "Estimated Carbon Credit Value", value: "$" + formatNumber(Math.round(carbonCredits * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["food-forest-calculator", "water-conservation-calculator"],
  faq: [
    { question: "How much CO2 does a tree absorb per year?", answer: "A mature deciduous tree absorbs approximately 48 pounds of CO2 per year, while younger and older trees absorb somewhat less due to growth rates." },
    { question: "How many trees does it take to offset one car?", answer: "It takes approximately 200 mature trees to offset the annual CO2 emissions of one average car, which produces about 10,000 pounds of CO2 per year." },
  ],
  formula: "Total CO2 Absorbed = Number of Trees x CO2 per Tree x Age Modifier",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reagentCostPerExperimentCalculator: CalculatorDefinition = {
  slug: "reagent-cost-per-experiment-calculator",
  title: "Reagent Cost Per Experiment Calculator",
  description: "Estimate the cost of reagents consumed per experiment based on reagent prices, volumes used, and number of replicates to budget lab research spending.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["reagent cost","experiment budget","lab reagent expense","research cost per experiment","laboratory supplies cost"],
  variants: [{
    id: "standard",
    name: "Reagent Cost Per Experiment",
    description: "Estimate the cost of reagents consumed per experiment based on reagent prices, volumes used, and number of replicates to budget lab research spending.",
    fields: [
      { name: "reagentCost", label: "Reagent Bottle Cost ($)", type: "number", min: 1, max: 50000, defaultValue: 250 },
      { name: "bottleVolume", label: "Bottle Volume (mL)", type: "number", min: 0.1, max: 10000, defaultValue: 500 },
      { name: "volumePerExpt", label: "Volume Per Experiment (mL)", type: "number", min: 0.001, max: 5000, defaultValue: 5 },
      { name: "replicates", label: "Replicates Per Experiment", type: "number", min: 1, max: 100, defaultValue: 3 },
      { name: "numReagents", label: "Number of Different Reagents", type: "number", min: 1, max: 50, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const reagentCost = inputs.reagentCost as number;
    const bottleVolume = inputs.bottleVolume as number;
    const volumePerExpt = inputs.volumePerExpt as number;
    const replicates = inputs.replicates as number;
    const numReagents = inputs.numReagents as number;
    const costPerMl = reagentCost / bottleVolume;
    const totalVolume = volumePerExpt * replicates;
    const costPerReagent = costPerMl * totalVolume;
    const totalCostPerExpt = costPerReagent * numReagents;
    const exptPerBottle = Math.floor(bottleVolume / totalVolume);
    return {
      primary: { label: "Total Cost Per Experiment", value: "$" + formatNumber(Math.round(totalCostPerExpt * 100) / 100) },
      details: [
        { label: "Cost Per Reagent Used", value: "$" + formatNumber(Math.round(costPerReagent * 100) / 100) },
        { label: "Cost Per mL", value: "$" + formatNumber(Math.round(costPerMl * 1000) / 1000) },
        { label: "Total Volume Per Experiment", value: formatNumber(totalVolume) + " mL" },
        { label: "Experiments Per Bottle", value: formatNumber(exptPerBottle) }
      ]
    };
  },
  }],
  relatedSlugs: ["molarity-calculator","dilution-calculator","serial-dilution-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Cost Per mL = Reagent Price / Bottle Volume
Cost Per Experiment = Cost/mL x Volume/Expt x Replicates x Number of Reagents",
};

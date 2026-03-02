import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jewelryWireCalculator: CalculatorDefinition = {
  slug: "jewelry-wire-calculator",
  title: "Jewelry Wire Calculator",
  description: "Calculate wire length, gauge recommendations, and cost for jewelry making projects based on design type and dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["jewelry wire","wire wrapping calculator","beading wire","jewelry making supplies"],
  variants: [{
    id: "standard",
    name: "Jewelry Wire",
    description: "Calculate wire length, gauge recommendations, and cost for jewelry making projects based on design type and dimensions.",
    fields: [
      { name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Simple Chain/Necklace" }, { value: "2", label: "Wire Wrapped Pendant" }, { value: "3", label: "Bracelet" }, { value: "4", label: "Earrings (pair)" }, { value: "5", label: "Wire Wrapped Ring" }], defaultValue: "1" },
      { name: "designLength", label: "Finished Length (inches)", type: "number", min: 1, max: 36, defaultValue: 18 },
      { name: "wireGauge", label: "Wire Gauge", type: "select", options: [{ value: "1", label: "18 gauge (Heavy)" }, { value: "2", label: "20 gauge (Medium)" }, { value: "3", label: "22 gauge (Fine)" }, { value: "4", label: "24 gauge (Thin)" }, { value: "5", label: "26 gauge (Extra Thin)" }], defaultValue: "3" },
      { name: "wireMaterial", label: "Wire Material", type: "select", options: [{ value: "1", label: "Copper" }, { value: "2", label: "Sterling Silver" }, { value: "3", label: "Gold-Filled" }, { value: "4", label: "Craft Wire" }], defaultValue: "1" },
      { name: "complexity", label: "Design Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const projType = parseInt(inputs.projectType as string);
    const designLen = inputs.designLength as number;
    const gauge = parseInt(inputs.wireGauge as string);
    const material = parseInt(inputs.wireMaterial as string);
    const complexity = parseInt(inputs.complexity as string);
    const projMultiplier = { 1: 1.3, 2: 5, 3: 1.5, 4: 3, 5: 4 };
    const complexMult = { 1: 1.0, 2: 1.5, 3: 2.5 };
    const mult = (projMultiplier[projType] || 1.5) * (complexMult[complexity] || 1.5);
    const wireInches = Math.round(designLen * mult);
    const wireFeet = Math.round(wireInches / 12 * 10) / 10;
    const pricePerFoot = { 1: 0.15, 2: 2.5, 3: 4.0, 4: 0.08 };
    const gaugePriceMult = { 1: 2.0, 2: 1.5, 3: 1.0, 4: 0.7, 5: 0.5 };
    const costPerFt = (pricePerFoot[material] || 0.15) * (gaugePriceMult[gauge] || 1.0);
    const totalCost = wireFeet * costPerFt;
    return {
      primary: { label: "Wire Needed", value: formatNumber(wireInches) + " inches" },
      details: [
        { label: "Wire in Feet", value: formatNumber(wireFeet) + " ft" },
        { label: "Cost Per Foot", value: "$" + formatNumber(Math.round(costPerFt * 100) / 100) },
        { label: "Total Wire Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        { label: "Multiplier Used", value: formatNumber(Math.round(mult * 10) / 10) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["bead-pattern-calculator","leather-working-cost-calculator"],
  faq: [
    { question: "How much wire do I need for a wrapped pendant?", answer: "A wire-wrapped pendant typically requires 3 to 5 feet of wire depending on stone size and wrapping complexity. Practice pieces first to get an accurate estimate." },
    { question: "What gauge wire is best for jewelry?", answer: "20 gauge is good for structural elements and ear wires. 22 to 24 gauge works for wire wrapping. 26 gauge is used for intricate weaving and coiling." },
    { question: "Is sterling silver wire worth the cost?", answer: "Sterling silver produces professional results and does not cause skin reactions. For practice and learning, use copper wire which behaves similarly at a fraction of the cost." },
  ],
  formula: "Wire Needed = Finished Length x Project Multiplier x Complexity Multiplier
Cost = Wire (feet) x Price Per Foot x Gauge Multiplier",
};

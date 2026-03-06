import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatCanvasCoverCostCalculator: CalculatorDefinition = {
  slug: "boat-canvas-cover-cost-calculator",
  title: "Boat Canvas Cover Cost Calculator",
  description: "Estimate the cost of a custom boat canvas cover or top based on boat size, cover type, material quality, and installation options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["boat cover cost","marine canvas cost","bimini top cost","boat enclosure price"],
  variants: [{
    id: "standard",
    name: "Boat Canvas Cover Cost",
    description: "Estimate the cost of a custom boat canvas cover or top based on boat size, cover type, material quality, and installation options.",
    fields: [
      { name: "boatLength", label: "Boat Length (feet)", type: "number", min: 10, max: 80, defaultValue: 22 },
      { name: "coverType", label: "Cover Type", type: "select", options: [{ value: "1", label: "Mooring Cover" }, { value: "2", label: "Bimini Top" }, { value: "3", label: "Full Enclosure" }, { value: "4", label: "T-Top" }], defaultValue: "1" },
      { name: "material", label: "Material Grade", type: "select", options: [{ value: "1.0", label: "Economy Polyester" }, { value: "1.5", label: "Sunbrella Marine" }, { value: "2.0", label: "Stamoid Premium" }], defaultValue: "1.5" },
      { name: "installation", label: "Installation", type: "select", options: [{ value: "0", label: "Self Install" }, { value: "300", label: "Professional ($300)" }, { value: "600", label: "Professional with Frame ($600)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const length = inputs.boatLength as number;
    const coverType = parseInt(inputs.coverType as string);
    const materialMult = parseFloat(inputs.material as string);
    const installCost = parseFloat(inputs.installation as string);
    const baseCosts = [0, 15, 25, 40, 45];
    const basePerFoot = baseCosts[coverType];
    const coverCost = length * basePerFoot * materialMult;
    const totalCost = coverCost + installCost;
    const lifespanYears = materialMult >= 2.0 ? 10 : materialMult >= 1.5 ? 7 : 4;
    const annualCost = totalCost / lifespanYears;
    return {
      primary: { label: "Estimated Cover Cost", value: "$" + formatNumber(Math.round(coverCost)) },
      details: [
        { label: "Installation Cost", value: installCost > 0 ? "$" + formatNumber(installCost) : "Self Install" },
        { label: "Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Lifespan", value: lifespanYears + " years" },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["marina-slip-cost-calculator","boat-winterization-cost-calculator"],
  faq: [
    { question: "How much does a boat cover cost?", answer: "Boat covers range from $200 to $2,000 or more depending on boat size, cover type, and material quality. Custom Sunbrella covers for a 22-foot boat typically cost $400 to $800." },
    { question: "What is the best material for a boat cover?", answer: "Sunbrella marine canvas is the industry standard, offering excellent UV protection, water resistance, and breathability. It typically lasts 7 to 10 years. Stamoid is a premium PVC-coated polyester used for high-end applications." },
    { question: "How long does a boat cover last?", answer: "Economy polyester covers last 3 to 5 years. Sunbrella marine canvas lasts 7 to 10 years. Premium PVC-coated materials can last 10 or more years with proper care and UV protectant treatment." },
  ],
  formula: "Cover Cost = Boat Length x Base Cost Per Foot x Material Multiplier
Total Cost = Cover Cost + Installation Cost
Annual Cost = Total Cost / Expected Lifespan",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hairExtensionCostCalculator: CalculatorDefinition = {
  slug: "hair-extension-cost-calculator",
  title: "Hair Extension Cost Calculator",
  description: "Calculate the cost of hair extension installation and upkeep.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hair extension cost","extension price","hair extension pricing"],
  variants: [{
    id: "standard",
    name: "Hair Extension Cost",
    description: "Calculate the cost of hair extension installation and upkeep.",
    fields: [
      { name: "method", label: "Extension Method", type: "select", options: [{ value: "200", label: "Clip-In" }, { value: "600", label: "Tape-In" }, { value: "1000", label: "Fusion/Bonded" }, { value: "1500", label: "Hand-Tied Weft" }] },
      { name: "packs", label: "Number of Packs", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "installFee", label: "Installation Fee ($)", type: "number", min: 0, max: 500, defaultValue: 150 },
      { name: "maintenanceVisits", label: "Maintenance Visits Per Year", type: "number", min: 0, max: 12, defaultValue: 4 },
      { name: "maintenanceCost", label: "Maintenance Cost Per Visit ($)", type: "number", min: 0, max: 300, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const method = parseInt(inputs.method as string);
    const packs = inputs.packs as number;
    const installFee = inputs.installFee as number;
    const maintenanceVisits = inputs.maintenanceVisits as number;
    const maintenanceCost = inputs.maintenanceCost as number;
    const hairCost = method * packs;
    const initialTotal = hairCost + installFee;
    const annualMaintenance = maintenanceVisits * maintenanceCost;
    const firstYearTotal = initialTotal + annualMaintenance;
    return {
      primary: { label: "First Year Total Cost", value: "$" + formatNumber(firstYearTotal) },
      details: [
        { label: "Hair Cost", value: "$" + formatNumber(hairCost) },
        { label: "Installation Fee", value: "$" + formatNumber(installFee) },
        { label: "Annual Maintenance", value: "$" + formatNumber(annualMaintenance) }
      ]
    };
  },
  }],
  relatedSlugs: ["hair-color-cost-calculator","haircut-frequency-calculator"],
  faq: [
    { question: "How much do hair extensions cost?", answer: "Clip-ins start at $200. Professional methods range from $600 to $2000." },
    { question: "How long do hair extensions last?", answer: "Clip-ins last 6 to 12 months. Bonded extensions last 3 to 6 months." },
    { question: "Do extensions damage natural hair?", answer: "Proper installation and maintenance minimize damage to natural hair." },
  ],
  formula: "First Year = (Method Price x Packs) + Install Fee + (Visits x Maintenance Cost)",
};

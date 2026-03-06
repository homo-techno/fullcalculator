import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kitchenEquipmentCostCalculator: CalculatorDefinition = {
  slug: "kitchen-equipment-cost-calculator",
  title: "Kitchen Equipment Cost Calculator",
  description: "Estimate the total cost of outfitting a commercial kitchen by selecting equipment categories, quantities, and quality tiers for a new or renovated restaurant.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["commercial kitchen equipment","restaurant equipment cost","kitchen buildout","kitchen startup cost"],
  variants: [{
    id: "standard",
    name: "Kitchen Equipment Cost",
    description: "Estimate the total cost of outfitting a commercial kitchen by selecting equipment categories, quantities, and quality tiers for a new or renovated restaurant.",
    fields: [
      { name: "kitchenSize", label: "Kitchen Size", type: "select", options: [{ value: "1", label: "Small (under 500 sq ft)" }, { value: "2", label: "Medium (500-1000 sq ft)" }, { value: "3", label: "Large (over 1000 sq ft)" }], defaultValue: "2" },
      { name: "qualityTier", label: "Equipment Quality", type: "select", options: [{ value: "1", label: "Budget / Used" }, { value: "2", label: "Mid-Range / New" }, { value: "3", label: "Premium / Commercial Grade" }], defaultValue: "2" },
      { name: "cuisineType", label: "Cuisine Type", type: "select", options: [{ value: "1", label: "Fast Casual" }, { value: "2", label: "Full Service" }, { value: "3", label: "Fine Dining" }, { value: "4", label: "Bakery / Cafe" }], defaultValue: "2" },
      { name: "installationPct", label: "Installation and Delivery (%)", type: "number", min: 0, max: 30, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const size = parseInt(inputs.kitchenSize as string);
    const quality = parseInt(inputs.qualityTier as string);
    const cuisine = parseInt(inputs.cuisineType as string);
    const installPct = inputs.installationPct as number / 100;
    const sizeMultiplier = { 1: 0.6, 2: 1.0, 3: 1.6 };
    const qualityMultiplier = { 1: 0.5, 2: 1.0, 3: 1.8 };
    const cuisineBase = { 1: 35000, 2: 55000, 3: 85000, 4: 40000 };
    const base = cuisineBase[cuisine] || 55000;
    const equipmentCost = Math.round(base * (sizeMultiplier[size] || 1) * (qualityMultiplier[quality] || 1));
    const installCost = Math.round(equipmentCost * installPct);
    const totalCost = equipmentCost + installCost;
    return {
      primary: { label: "Total Kitchen Equipment Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Equipment Cost", value: "$" + formatNumber(equipmentCost) },
        { label: "Installation and Delivery", value: "$" + formatNumber(installCost) },
        { label: "Estimated Monthly Depreciation (7yr)", value: "$" + formatNumber(Math.round(totalCost / 84)) },
        { label: "Budget Range", value: "$" + formatNumber(Math.round(totalCost * 0.85)) + " - $" + formatNumber(Math.round(totalCost * 1.15)) }
      ]
    };
  },
  }],
  relatedSlugs: ["restaurant-break-even-calculator","food-truck-startup-cost-calculator"],
  faq: [
    { question: "How much does it cost to equip a commercial kitchen?", answer: "A typical commercial kitchen costs between $30,000 and $200,000 to equip, depending on size, equipment quality, and cuisine type. Fast casual setups cost less, while fine dining requires more specialized and expensive equipment." },
    { question: "Should I buy new or used restaurant equipment?", answer: "Used equipment can save 40 to 60 percent off new prices. Reliable items to buy used include stainless steel tables, shelving, and ovens. Buy new for refrigeration, ventilation hoods, and anything with complex electronics." },
    { question: "What are the most essential pieces of commercial kitchen equipment?", answer: "Essential items include a commercial range or cooktop, oven, walk-in or reach-in refrigerator, freezer, prep tables, a ventilation hood, three-compartment sink, and a commercial dishwasher." },
  ],
  formula: "Equipment Cost = Cuisine Base Cost x Size Multiplier x Quality Multiplier; Installation = Equipment Cost x Installation %; Total = Equipment Cost + Installation",
};

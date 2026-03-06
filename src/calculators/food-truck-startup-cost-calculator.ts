import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodTruckStartupCostCalculator: CalculatorDefinition = {
  slug: "food-truck-startup-cost-calculator",
  title: "Food Truck Startup Cost Calculator",
  description: "Estimate total startup costs for a food truck business including the vehicle, equipment, permits, branding, and initial inventory.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["food truck startup cost","food truck business cost","mobile food business","food truck investment"],
  variants: [{
    id: "standard",
    name: "Food Truck Startup Cost",
    description: "Estimate total startup costs for a food truck business including the vehicle, equipment, permits, branding, and initial inventory.",
    fields: [
      { name: "truckType", label: "Truck Type", type: "select", options: [{ value: "1", label: "Used Truck ($30k-60k)" }, { value: "2", label: "New Custom Build ($75k-150k)" }, { value: "3", label: "Trailer ($15k-40k)" }], defaultValue: "1" },
      { name: "equipmentBudget", label: "Kitchen Equipment Budget ($)", type: "number", min: 2000, max: 100000, defaultValue: 15000 },
      { name: "permitsFees", label: "Permits and Licenses ($)", type: "number", min: 500, max: 20000, defaultValue: 3000 },
      { name: "branding", label: "Wrap, Branding and Marketing ($)", type: "number", min: 0, max: 20000, defaultValue: 5000 },
      { name: "initialInventory", label: "Initial Inventory ($)", type: "number", min: 500, max: 20000, defaultValue: 2000 },
      { name: "insurance", label: "Annual Insurance ($)", type: "number", min: 1000, max: 15000, defaultValue: 3500 },
    ],
    calculate: (inputs) => {
    const truckType = parseInt(inputs.truckType as string);
    const equipment = inputs.equipmentBudget as number;
    const permits = inputs.permitsFees as number;
    const branding = inputs.branding as number;
    const inventory = inputs.initialInventory as number;
    const insurance = inputs.insurance as number;
    const truckCost = { 1: 45000, 2: 110000, 3: 27000 };
    const truck = truckCost[truckType] || 45000;
    const totalStartup = truck + equipment + permits + branding + inventory + insurance;
    const monthlyInsurance = Math.round(insurance / 12);
    return {
      primary: { label: "Total Startup Cost", value: "$" + formatNumber(totalStartup) },
      details: [
        { label: "Truck or Trailer", value: "$" + formatNumber(truck) },
        { label: "Kitchen Equipment", value: "$" + formatNumber(equipment) },
        { label: "Permits and Licenses", value: "$" + formatNumber(permits) },
        { label: "Branding and Marketing", value: "$" + formatNumber(branding) },
        { label: "Initial Inventory", value: "$" + formatNumber(inventory) },
        { label: "Monthly Insurance", value: "$" + formatNumber(monthlyInsurance) }
      ]
    };
  },
  }],
  relatedSlugs: ["food-trailer-licensing-cost-calculator","restaurant-break-even-calculator"],
  faq: [
    { question: "How much does it cost to start a food truck?", answer: "Most food trucks cost between $50,000 and $200,000 to launch. A used truck with basic equipment starts around $50,000 while a new custom build with premium equipment can exceed $175,000." },
    { question: "What permits do I need for a food truck?", answer: "Requirements vary by city but typically include a business license, food service permit, health department inspection, fire safety certification, vehicle registration, and a mobile food vendor permit. Some cities also require commissary agreements." },
    { question: "Is a food truck more profitable than a restaurant?", answer: "Food trucks have lower overhead and startup costs. Average food truck revenue is $250,000 to $500,000 annually with profit margins of 6 to 9 percent. They offer more flexibility but are weather-dependent and face location competition." },
  ],
  formula: "Total Startup = Truck Cost + Equipment + Permits + Branding + Inventory + Insurance",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingDeskSetupCostCalculator: CalculatorDefinition = {
  slug: "gaming-desk-setup-cost-calculator",
  title: "Gaming Desk Setup Cost Calculator",
  description: "Plan your gaming desk setup budget with itemized cost estimates for desk, chair, monitors, peripherals, and accessories.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gaming desk cost","gaming setup budget","PC desk setup","gaming room cost"],
  variants: [{
    id: "standard",
    name: "Gaming Desk Setup Cost",
    description: "Plan your gaming desk setup budget with itemized cost estimates for desk, chair, monitors, peripherals, and accessories.",
    fields: [
      { name: "deskType", label: "Desk Type", type: "select", options: [{ value: "1", label: "Basic ($100-200)" }, { value: "2", label: "Gaming Desk ($200-400)" }, { value: "3", label: "Standing Desk ($300-600)" }, { value: "4", label: "L-Shaped ($250-500)" }], defaultValue: "2" },
      { name: "monitorCount", label: "Number of Monitors", type: "number", min: 1, max: 4, defaultValue: 2 },
      { name: "monitorBudget", label: "Budget Per Monitor ($)", type: "number", min: 100, max: 3000, defaultValue: 350 },
      { name: "peripheralTier", label: "Peripheral Tier", type: "select", options: [{ value: "1", label: "Budget ($80 total)" }, { value: "2", label: "Mid-Range ($200 total)" }, { value: "3", label: "Premium ($450 total)" }, { value: "4", label: "Enthusiast ($800 total)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const deskType = parseInt(inputs.deskType as string);
    const monitors = inputs.monitorCount as number;
    const monitorBudget = inputs.monitorBudget as number;
    const peripheralTier = parseInt(inputs.peripheralTier as string);
    const deskCosts = { 1: 150, 2: 300, 3: 450, 4: 375 };
    const peripheralCosts = { 1: 80, 2: 200, 3: 450, 4: 800 };
    const deskCost = deskCosts[deskType] || 300;
    const monitorCost = monitors * monitorBudget;
    const peripherals = peripheralCosts[peripheralTier] || 200;
    const accessories = 50 + monitors * 30;
    const totalCost = deskCost + monitorCost + peripherals + accessories;
    return {
      primary: { label: "Total Setup Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Desk", value: "$" + formatNumber(deskCost) },
        { label: "Monitors (" + monitors + ")", value: "$" + formatNumber(monitorCost) },
        { label: "Peripherals", value: "$" + formatNumber(peripherals) },
        { label: "Accessories (mount, cable mgmt)", value: "$" + formatNumber(accessories) }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-pc-build-budget-calculator","gaming-peripheral-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Cost = Desk + (Monitors x Budget Per Monitor) + Peripherals + Accessories
Accessories = $50 base + $30 per monitor",
};

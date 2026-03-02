import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smartLockCostCalculator: CalculatorDefinition = {
  slug: "smart-lock-cost-calculator",
  title: "Smart Lock Cost Calculator",
  description: "Estimate the cost to install smart locks on your doors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["smart lock cost","electronic lock calculator"],
  variants: [{
    id: "standard",
    name: "Smart Lock Cost",
    description: "Estimate the cost to install smart locks on your doors.",
    fields: [
      { name: "doors", label: "Number of Doors", type: "number", min: 1, max: 20, defaultValue: 3 },
      { name: "lockCost", label: "Cost Per Lock ($)", type: "number", min: 50, max: 500, defaultValue: 200 },
      { name: "installCost", label: "Install Per Lock ($)", type: "number", min: 0, max: 300, defaultValue: 75 },
      { name: "bridgeHub", label: "Hub/Bridge Cost ($)", type: "number", min: 0, max: 200, defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const doors = inputs.doors as number;
      const lock = inputs.lockCost as number;
      const inst = inputs.installCost as number;
      const hub = inputs.bridgeHub as number;
      if (!doors || !lock) return null;
      const lockTotal = doors * lock;
      const installTotal = doors * inst;
      const total = lockTotal + installTotal + hub;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Lock Hardware", value: "$" + formatNumber(Math.round(lockTotal)) },
          { label: "Installation", value: "$" + formatNumber(Math.round(installTotal)) },
          { label: "Hub/Bridge", value: "$" + formatNumber(Math.round(hub)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Are smart locks secure?", answer: "Quality smart locks meet ANSI Grade 1 or 2 standards and use AES encryption." },
    { question: "Do smart locks need Wi-Fi?", answer: "Some use Bluetooth only while others require Wi-Fi or a hub for remote access." },
  ],
  formula: "Total = (Doors x Lock Cost) + (Doors x Install) + Hub",
};

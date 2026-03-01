import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawnCareBusinessCalculator: CalculatorDefinition = {
  slug: "lawn-care-business-calculator",
  title: "Lawn Care Business Calculator",
  description: "Estimate startup costs and revenue potential for a lawn care and landscaping business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lawn care business cost", "lawn mowing business profit", "landscaping startup"],
  variants: [{
    id: "standard",
    name: "Lawn Care Business",
    description: "Estimate startup costs and revenue potential for a lawn care and landscaping business",
    fields: [
      { name: "clientsPerWeek", label: "Clients per Week", type: "number", suffix: "clients", min: 5, max: 80, defaultValue: 25 },
      { name: "avgPrice", label: "Average Price per Lawn", type: "number", suffix: "$", min: 25, max: 200, defaultValue: 50 },
      { name: "weeksPerYear", label: "Mowing Season Weeks", type: "number", suffix: "weeks", min: 20, max: 52, defaultValue: 32 },
      { name: "equipmentCost", label: "Equipment Investment", type: "number", suffix: "$", min: 1000, max: 50000, defaultValue: 8000 },
    ],
    calculate: (inputs) => {
      const clients = inputs.clientsPerWeek as number;
      const price = inputs.avgPrice as number;
      const weeks = inputs.weeksPerYear as number;
      const equipment = inputs.equipmentCost as number;
      if (!clients || !price || !weeks) return null;
      const annualRevenue = clients * price * weeks;
      const fuel = clients * weeks * 5;
      const maintenance = equipment * 0.1;
      const insurance = 1800;
      const marketing = 1200;
      const annualExpenses = fuel + maintenance + insurance + marketing;
      const annualProfit = annualRevenue - annualExpenses;
      const profitPerClient = annualProfit / clients;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Fuel Costs", value: "$" + formatNumber(fuel) },
          { label: "Equipment Maintenance", value: "$" + formatNumber(maintenance) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Marketing", value: "$" + formatNumber(marketing) },
          { label: "Profit per Client", value: "$" + formatNumber(profitPerClient) },
        ],
      };
    },
  }],
  relatedSlugs: ["pressure-washing-business-calculator", "cleaning-business-calculator"],
  faq: [
    { question: "How much can you make with a lawn care business?", answer: "A solo lawn care operator can earn $30,000 to $60,000 per year. With a crew and more clients, annual revenue can exceed $100,000." },
    { question: "What equipment do you need to start a lawn care business?", answer: "At minimum you need a commercial mower, trimmer, blower, and a trailer. A basic setup costs $3,000 to $10,000. Commercial zero-turn mowers alone cost $3,000 to $12,000." },
  ],
  formula: "Annual Profit = (Clients x Price x Weeks) - Fuel - Maintenance - Insurance - Marketing",
};

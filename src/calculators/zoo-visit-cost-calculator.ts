import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const zooVisitCostCalculator: CalculatorDefinition = {
  slug: "zoo-visit-cost-calculator",
  title: "Zoo Visit Cost Calculator",
  description: "Plan your zoo visit budget including tickets, food, and animal encounters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["zoo visit cost", "zoo trip budget", "zoo admission price"],
  variants: [{
    id: "standard",
    name: "Zoo Visit Cost",
    description: "Plan your zoo visit budget including tickets, food, and animal encounters",
    fields: [
      { name: "adults", label: "Number of Adults", type: "number", suffix: "adults", min: 0, max: 20, defaultValue: 2 },
      { name: "children", label: "Number of Children", type: "number", suffix: "children", min: 0, max: 20, defaultValue: 2 },
      { name: "foodBudget", label: "Food Budget per Person", type: "number", prefix: "$", min: 0, max: 100, defaultValue: 20 },
      { name: "extras", label: "Extra Experiences", type: "select", options: [{value:"none",label:"None"},{value:"basic",label:"Train Ride ($8)"},{value:"premium",label:"Animal Encounter ($25)"}], defaultValue: "basic" },
    ],
    calculate: (inputs) => {
      const adults = inputs.adults as number;
      const children = inputs.children as number;
      const food = inputs.foodBudget as number;
      const extras = inputs.extras as string;
      const totalPeople = adults + children;
      if (totalPeople <= 0) return null;
      const adultAdmission = adults * 25;
      const childAdmission = children * 18;
      const extraPrices: Record<string, number> = { none: 0, basic: 8, premium: 25 };
      const extrasCost = (extraPrices[extras] || 0) * totalPeople;
      const foodTotal = food * totalPeople;
      const parking = 20;
      const total = adultAdmission + childAdmission + extrasCost + foodTotal + parking;
      return {
        primary: { label: "Total Zoo Visit Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Admission Total", value: "$" + formatNumber(adultAdmission + childAdmission) },
          { label: "Food and Extras", value: "$" + formatNumber(Math.round(foodTotal + extrasCost)) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(total / totalPeople)) },
        ],
      };
    },
  }],
  relatedSlugs: ["museum-visit-calculator", "theme-park-budget-calculator"],
  faq: [
    { question: "How much does a zoo visit cost for a family?", answer: "A typical zoo visit for a family of four costs $120 to $200 including admission, food, and one or two extra experiences." },
    { question: "When is the best time to visit a zoo?", answer: "Weekday mornings are the least crowded and animals tend to be more active. Many zoos offer discounted admission during winter months." },
  ],
  formula: "Total = Adult Admission + Child Admission + Food + Extras + Parking",
};

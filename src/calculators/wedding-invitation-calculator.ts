import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingInvitationCalculator: CalculatorDefinition = {
  slug: "wedding-invitation-calculator",
  title: "Wedding Invitation Calculator",
  description: "Calculate invitation quantity and printing cost.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding invitations","invitation count","invitation cost"],
  variants: [{
    id: "standard",
    name: "Wedding Invitation",
    description: "Calculate invitation quantity and printing cost.",
    fields: [
      { name: "households", label: "Households to Invite", type: "number", min: 10, max: 500, defaultValue: 100 },
      { name: "costPer", label: "Cost per Invitation ($)", type: "number", min: 1, max: 30, defaultValue: 5 },
      { name: "extraPercent", label: "Extra Invitations (%)", type: "number", min: 0, max: 50, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const hh = inputs.households as number;
      const cost = inputs.costPer as number;
      const extra = inputs.extraPercent as number;
      if (!hh || !cost) return null;
      const total = Math.ceil(hh * (1 + extra / 100));
      const totalCost = total * cost;
      return {
        primary: { label: "Total Invitations", value: formatNumber(total) },
        details: [
          { label: "Households", value: formatNumber(hh) },
          { label: "Extra Copies", value: formatNumber(total - hh) },
          { label: "Total Cost", value: "$" + formatNumber(totalCost) },
        ],
      };
  },
  }],
  relatedSlugs: ["wedding-guest-calculator","wedding-budget-calculator"],
  faq: [
    { question: "How many invitations do I need?", answer: "Send one per household, plus 10 percent extra." },
    { question: "When should invitations be sent?", answer: "Send wedding invitations 6 to 8 weeks before the date." },
  ],
  formula: "Total = Households x (1 + Extra Percent / 100)",
};

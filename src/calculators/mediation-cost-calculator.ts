import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mediationCostCalculator: CalculatorDefinition = {
  slug: "mediation-cost-calculator",
  title: "Mediation Cost Calculator",
  description: "Calculate estimated mediation costs for dispute resolution.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mediation cost","mediator fees","dispute mediation","ADR mediation"],
  variants: [{
    id: "standard",
    name: "Mediation Cost",
    description: "Calculate estimated mediation costs for dispute resolution.",
    fields: [
      { name: "mediatorRate", label: "Mediator Hourly Rate ($)", type: "number", min: 100, max: 2000, defaultValue: 400 },
      { name: "sessions", label: "Number of Sessions", type: "number", min: 1, max: 20, defaultValue: 3 },
      { name: "hoursPerSession", label: "Hours Per Session", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "parties", label: "Number of Parties", type: "number", min: 2, max: 10, defaultValue: 2 },
      { name: "venueRental", label: "Venue Rental Per Session ($)", type: "number", min: 0, max: 2000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const mediatorRate = inputs.mediatorRate as number;
    const sessions = inputs.sessions as number;
    const hoursPerSession = inputs.hoursPerSession as number;
    const parties = inputs.parties as number;
    const venueRental = inputs.venueRental as number;
    const totalHours = sessions * hoursPerSession;
    const mediatorCost = totalHours * mediatorRate;
    const venueCost = sessions * venueRental;
    const adminFee = 250;
    const totalCost = mediatorCost + venueCost + adminFee;
    const perPartyCost = totalCost / parties;
    return {
      primary: { label: "Total Mediation Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Total Hours", value: formatNumber(totalHours) },
        { label: "Mediator Fees", value: "$" + formatNumber(mediatorCost) },
        { label: "Venue Costs", value: "$" + formatNumber(venueCost) },
        { label: "Admin Fee", value: "$" + formatNumber(adminFee) },
        { label: "Cost Per Party", value: "$" + formatNumber(perPartyCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["arbitration-cost-calculator","legal-fee-estimator-calculator","settlement-value-estimator-calculator"],
  faq: [
    { question: "How much does mediation cost?", answer: "Mediation typically costs $200 to $500 per hour for the mediator, with total costs often ranging from $2,000 to $10,000 depending on complexity." },
    { question: "How is mediation different from arbitration?", answer: "A mediator facilitates negotiation but cannot impose a decision. An arbitrator acts like a judge and issues a binding decision." },
    { question: "What is the success rate of mediation?", answer: "Mediation resolves approximately 70 to 85 percent of cases that go through the process, making it a highly effective dispute resolution method." },
  ],
  formula: "Total Cost = (Sessions x Hours x Rate) + Venue Costs + Admin Fee",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatRegistrationCostCalculator: CalculatorDefinition = {
  slug: "boat-registration-cost-calculator",
  title: "Boat Registration Cost Calculator",
  description: "Estimate your boat registration and titling fees based on boat length, type, engine size, and state of registration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["boat registration cost","boat title fees","vessel registration","boat license cost"],
  variants: [{
    id: "standard",
    name: "Boat Registration Cost",
    description: "Estimate your boat registration and titling fees based on boat length, type, engine size, and state of registration.",
    fields: [
      { name: "boatLength", label: "Boat Length (feet)", type: "number", min: 8, max: 200, defaultValue: 22 },
      { name: "boatType", label: "Boat Type", type: "select", options: [{ value: "1.0", label: "Non-Motorized" }, { value: "1.2", label: "Motorized (under 50 HP)" }, { value: "1.5", label: "Motorized (50-200 HP)" }, { value: "1.8", label: "Motorized (over 200 HP)" }], defaultValue: "1.5" },
      { name: "boatAge", label: "Boat Age (years)", type: "number", min: 0, max: 50, defaultValue: 5 },
      { name: "registrationPeriod", label: "Registration Period", type: "select", options: [{ value: "1", label: "1 Year" }, { value: "2", label: "2 Years" }, { value: "3", label: "3 Years" }], defaultValue: "2" },
      { name: "titleFee", label: "Title Fee ($)", type: "number", min: 5, max: 200, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const length = inputs.boatLength as number;
    const typeMult = parseFloat(inputs.boatType as string);
    const age = inputs.boatAge as number;
    const period = parseInt(inputs.registrationPeriod as string);
    const title = inputs.titleFee as number;
    let baseFee = 0;
    if (length <= 16) baseFee = 25;
    else if (length <= 26) baseFee = 40;
    else if (length <= 40) baseFee = 65;
    else if (length <= 65) baseFee = 100;
    else baseFee = 150;
    const regFee = baseFee * typeMult * period;
    const ageSurcharge = age <= 1 ? 15 : 0;
    const totalCost = regFee + title + ageSurcharge;
    const perYear = totalCost / period;
    return {
      primary: { label: "Total Registration Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Base Registration Fee", value: "$" + formatNumber(Math.round(regFee)) },
        { label: "Title Fee", value: "$" + formatNumber(title) },
        { label: "New Boat Surcharge", value: ageSurcharge > 0 ? "$" + formatNumber(ageSurcharge) : "N/A" },
        { label: "Cost Per Year", value: "$" + formatNumber(Math.round(perYear)) },
        { label: "Registration Period", value: period + " year(s)" }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-insurance-cost-calculator","boat-trailer-weight-calculator"],
  faq: [
    { question: "How much does it cost to register a boat?", answer: "Boat registration fees vary by state and range from $15 to over $300 depending on boat length, type, and engine size. Most states charge between $25 and $100 for typical recreational boats." },
    { question: "Do I need to register a kayak or canoe?", answer: "Requirements vary by state. Many states exempt non-motorized vessels under a certain length. Some states require registration for all vessels, while others only require a launch permit or sticker." },
    { question: "How often do I renew boat registration?", answer: "Most states offer annual or biennial (every 2 years) registration. Some states offer 3-year options. Registration typically expires on a fixed date regardless of when you register." },
  ],
  formula: "Base Fee is determined by boat length bracket; Registration Fee = Base Fee x Boat Type Multiplier x Registration Period; Total Cost = Registration Fee + Title Fee + Surcharges",
};

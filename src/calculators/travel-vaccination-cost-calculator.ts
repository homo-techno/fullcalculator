import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelVaccinationCostCalculator: CalculatorDefinition = {
  slug: "travel-vaccination-cost-calculator",
  title: "Travel Vaccination Cost Calculator",
  description: "Estimate the total cost of required and recommended travel vaccinations for your destination.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["travel vaccination cost","travel immunization","travel health","vaccine cost estimator"],
  variants: [{
    id: "standard",
    name: "Travel Vaccination Cost",
    description: "Estimate the total cost of required and recommended travel vaccinations for your destination.",
    fields: [
      { name: "numVaccines", label: "Number of Vaccines Needed", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "avgCostPerVaccine", label: "Average Cost Per Vaccine ($)", type: "number", min: 20, max: 500, defaultValue: 150 },
      { name: "consultFee", label: "Travel Clinic Consultation ($)", type: "number", min: 0, max: 300, defaultValue: 50 },
      { name: "malariaWeeks", label: "Weeks of Malaria Prophylaxis", type: "number", min: 0, max: 52, defaultValue: 0 },
      { name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const numVaccines = inputs.numVaccines as number;
    const avgCost = inputs.avgCostPerVaccine as number;
    const consultFee = inputs.consultFee as number;
    const malariaWeeks = inputs.malariaWeeks as number;
    const travelers = inputs.travelers as number;
    const vaccineCost = numVaccines * avgCost;
    const malariaCost = malariaWeeks > 0 ? malariaWeeks * 12 : 0;
    const perPersonTotal = vaccineCost + consultFee + malariaCost;
    const grandTotal = perPersonTotal * travelers;
    return {
      primary: { label: "Total Vaccination Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Vaccines Cost", value: "$" + formatNumber(Math.round(vaccineCost * travelers)) },
        { label: "Consultation Fee", value: "$" + formatNumber(Math.round(consultFee * travelers)) },
        { label: "Malaria Prophylaxis", value: "$" + formatNumber(Math.round(malariaCost * travelers)) },
        { label: "Cost Per Person", value: "$" + formatNumber(Math.round(perPersonTotal)) }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","travel-insurance-value-calculator","travel-daily-budget-calculator"],
  faq: [
    { question: "Which travel vaccines are most expensive?", answer: "Yellow Fever ($200 to $350), Japanese Encephalitis ($300 to $400 for the series), and Rabies ($300 to $800 for the 3-dose series) are typically the most expensive." },
    { question: "Does insurance cover travel vaccinations?", answer: "Some insurance plans cover recommended travel vaccines. Hepatitis A and B, Tdap, and flu shots are often covered, but yellow fever and Japanese encephalitis usually are not." },
    { question: "How far in advance should I get travel vaccines?", answer: "Ideally 4 to 8 weeks before travel. Some vaccines require multiple doses over several weeks to be fully effective." },
  ],
  formula: "Total Cost = (Vaccines x Avg Cost + Consultation + Malaria Meds) x Travelers",
};

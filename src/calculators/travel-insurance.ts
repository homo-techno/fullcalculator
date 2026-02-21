import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelInsuranceCalculator: CalculatorDefinition = {
  slug: "travel-insurance-calculator",
  title: "Travel Insurance Cost Calculator",
  description:
    "Free travel insurance cost calculator. Estimate travel insurance premiums based on trip length, destination, age, and coverage level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel insurance",
    "travel insurance cost",
    "trip insurance",
    "travel coverage",
    "travel medical insurance",
  ],
  variants: [
    {
      id: "estimate",
      name: "Estimate Insurance Cost",
      description: "Estimate travel insurance premium for your trip",
      fields: [
        {
          name: "tripCost",
          label: "Total Trip Cost ($)",
          type: "number",
          placeholder: "e.g. 3000",
        },
        {
          name: "tripDays",
          label: "Trip Duration (days)",
          type: "number",
          placeholder: "e.g. 14",
        },
        {
          name: "travelers",
          label: "Number of Travelers",
          type: "select",
          options: [
            { label: "1 traveler", value: "1" },
            { label: "2 travelers", value: "2" },
            { label: "3 travelers", value: "3" },
            { label: "4 travelers", value: "4" },
            { label: "5+ travelers", value: "5" },
          ],
          defaultValue: "1",
        },
        {
          name: "age",
          label: "Oldest Traveler Age",
          type: "select",
          options: [
            { label: "18-35", value: "young" },
            { label: "36-50", value: "mid" },
            { label: "51-64", value: "senior" },
            { label: "65-74", value: "elderly" },
            { label: "75+", value: "older" },
          ],
          defaultValue: "mid",
        },
        {
          name: "destination",
          label: "Destination Region",
          type: "select",
          options: [
            { label: "Domestic (within country)", value: "domestic" },
            { label: "Canada/Mexico/Caribbean", value: "nearby" },
            { label: "Europe/UK", value: "europe" },
            { label: "Asia/Pacific", value: "asia" },
            { label: "Africa/Middle East/South America", value: "remote" },
          ],
          defaultValue: "europe",
        },
        {
          name: "coverage",
          label: "Coverage Level",
          type: "select",
          options: [
            { label: "Basic (cancellation only)", value: "basic" },
            { label: "Standard (cancel + medical)", value: "standard" },
            { label: "Comprehensive (all coverage)", value: "comprehensive" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const tripCost = inputs.tripCost as number;
        const tripDays = inputs.tripDays as number;
        const travelers = parseInt(inputs.travelers as string) || 1;
        const age = inputs.age as string;
        const destination = inputs.destination as string;
        const coverage = inputs.coverage as string;
        if (!tripCost || !tripDays || tripCost <= 0 || tripDays <= 0) return null;

        const baseRate = tripCost * 0.05;

        const ageMultipliers: Record<string, number> = {
          young: 0.8,
          mid: 1.0,
          senior: 1.4,
          elderly: 1.8,
          older: 2.5,
        };

        const destMultipliers: Record<string, number> = {
          domestic: 0.7,
          nearby: 0.9,
          europe: 1.0,
          asia: 1.1,
          remote: 1.3,
        };

        const coverageMultipliers: Record<string, number> = {
          basic: 0.6,
          standard: 1.0,
          comprehensive: 1.5,
        };

        const ageMult = ageMultipliers[age] || 1.0;
        const destMult = destMultipliers[destination] || 1.0;
        const covMult = coverageMultipliers[coverage] || 1.0;

        const durationFactor = tripDays > 30 ? 1.2 : tripDays > 14 ? 1.1 : 1.0;

        const perPersonCost = baseRate * ageMult * destMult * covMult * durationFactor;
        const totalCost = perPersonCost * travelers;
        const costPerDay = totalCost / tripDays;
        const percentOfTrip = (totalCost / tripCost) * 100;

        const medicalCoverage = coverage === "basic" ? 0 : coverage === "standard" ? 50000 : 250000;
        const cancelCoverage = tripCost;

        return {
          primary: {
            label: "Estimated Insurance Cost",
            value: `$${formatNumber(totalCost, 2)}`,
          },
          details: [
            { label: "Per person", value: `$${formatNumber(perPersonCost, 2)}` },
            { label: "Total cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Cost per day", value: `$${formatNumber(costPerDay, 2)}/day` },
            { label: "% of trip cost", value: `${formatNumber(percentOfTrip, 1)}%` },
            { label: "Trip cancellation coverage", value: `Up to $${formatNumber(cancelCoverage, 0)}` },
            { label: "Medical coverage", value: medicalCoverage > 0 ? `Up to $${formatNumber(medicalCoverage, 0)}` : "Not included" },
            { label: "Travelers covered", value: `${travelers}` },
          ],
          note: `Estimated premium is ${formatNumber(percentOfTrip, 1)}% of your trip cost. Travel insurance typically costs 4-10% of total trip cost depending on age, destination, and coverage level.`,
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-calculator", "travel-checklist-calculator"],
  faq: [
    {
      question: "How much does travel insurance typically cost?",
      answer:
        "Travel insurance typically costs 4-10% of your total trip cost. A $5,000 trip might cost $200-$500 to insure. Factors affecting price include age, destination, trip length, coverage level, and pre-existing medical conditions.",
    },
    {
      question: "What does travel insurance cover?",
      answer:
        "Common coverages include trip cancellation/interruption, emergency medical expenses, medical evacuation, baggage loss/delay, travel delay, and 24/7 travel assistance. Comprehensive plans may also cover adventure activities and rental car damage.",
    },
    {
      question: "When should I buy travel insurance?",
      answer:
        "Buy travel insurance as soon as you book your trip. Many policies require purchase within 14-21 days of your initial trip deposit to get pre-existing condition coverage and cancel-for-any-reason benefits.",
    },
  ],
  formula:
    "Estimated Premium = (Trip Cost x 5%) x Age Factor x Destination Factor x Coverage Factor x Duration Factor; per person then multiplied by number of travelers.",
};

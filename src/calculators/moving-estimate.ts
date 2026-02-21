import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingEstimateCalculator: CalculatorDefinition = {
  slug: "moving-estimate-calculator",
  title: "Moving Cost Estimator",
  description:
    "Free moving cost estimator. Calculate the cost of moving locally or long distance based on home size, distance, and services needed.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "moving cost calculator",
    "moving estimate",
    "cost to move",
    "moving cost estimator",
    "how much does it cost to move",
  ],
  variants: [
    {
      id: "local-move",
      name: "Local Move",
      description: "Estimate costs for a local move (under 100 miles)",
      fields: [
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Studio / 1 Bedroom", value: "1" },
            { label: "2 Bedrooms", value: "2" },
            { label: "3 Bedrooms", value: "3" },
            { label: "4 Bedrooms", value: "4" },
            { label: "5+ Bedrooms", value: "5" },
          ],
          defaultValue: "2",
        },
        { name: "hours", label: "Estimated Hours", type: "number", placeholder: "e.g. 6", suffix: "hours", min: 1, max: 24, step: 0.5, defaultValue: 6 },
        {
          name: "movers",
          label: "Number of Movers",
          type: "select",
          options: [
            { label: "2 movers", value: "2" },
            { label: "3 movers", value: "3" },
            { label: "4 movers", value: "4" },
          ],
          defaultValue: "2",
        },
        { name: "hourlyRate", label: "Hourly Rate Per Mover", type: "number", placeholder: "e.g. 50", prefix: "$", min: 0, defaultValue: 50 },
        { name: "packingService", label: "Packing Service Cost (optional)", type: "number", placeholder: "e.g. 500", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const hours = inputs.hours as number;
        const movers = parseInt(inputs.movers as string) || 2;
        const rate = (inputs.hourlyRate as number) || 50;
        const packing = (inputs.packingService as number) || 0;
        if (!hours) return null;

        const laborCost = hours * movers * rate;
        const truckFee = 150; // flat estimate
        const suppliesFee = 100;
        const travelFee = rate * movers; // 1 hour travel time
        const insurance = 75;
        const subtotal = laborCost + truckFee + suppliesFee + travelFee + insurance + packing;
        const tip = laborCost * 0.15;
        const total = subtotal + tip;

        return {
          primary: { label: "Estimated Moving Cost", value: `$${formatNumber(total)}` },
          details: [
            { label: "Labor cost", value: `$${formatNumber(laborCost)}` },
            { label: "Truck / fuel / equipment", value: `$${formatNumber(truckFee)}` },
            { label: "Travel time fee (1 hr)", value: `$${formatNumber(travelFee)}` },
            { label: "Packing supplies", value: `$${formatNumber(suppliesFee)}` },
            { label: "Packing service", value: `$${formatNumber(packing)}` },
            { label: "Basic valuation insurance", value: `$${formatNumber(insurance)}` },
            { label: "Suggested tip (15%)", value: `$${formatNumber(tip)}` },
          ],
        };
      },
    },
    {
      id: "long-distance",
      name: "Long Distance Move",
      description: "Estimate costs for a move over 100 miles",
      fields: [
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Studio / 1 Bedroom (~2,000 lbs)", value: "2000" },
            { label: "2 Bedrooms (~3,500 lbs)", value: "3500" },
            { label: "3 Bedrooms (~6,000 lbs)", value: "6000" },
            { label: "4 Bedrooms (~8,000 lbs)", value: "8000" },
            { label: "5+ Bedrooms (~10,000+ lbs)", value: "10000" },
          ],
          defaultValue: "3500",
        },
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 500", suffix: "miles", min: 100, max: 5000 },
        { name: "packing", label: "Full Packing Service", type: "select", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const weight = parseInt(inputs.homeSize as string) || 3500;
        const distance = inputs.distance as number;
        const needsPacking = inputs.packing === "yes";
        if (!distance) return null;

        // Long distance rates: base rate per pound + per mile
        const baseCostPerPound = 0.50;
        const perMile = 0.50;
        const baseCost = weight * baseCostPerPound + distance * perMile;
        const packingCost = needsPacking ? weight * 0.25 : 0;
        const insurance = baseCost * 0.03;
        const total = baseCost + packingCost + insurance;
        const lowEstimate = total * 0.85;
        const highEstimate = total * 1.20;

        return {
          primary: { label: "Estimated Cost", value: `$${formatNumber(lowEstimate)} – $${formatNumber(highEstimate)}` },
          details: [
            { label: "Base moving cost", value: `$${formatNumber(baseCost)}` },
            { label: "Packing service", value: needsPacking ? `$${formatNumber(packingCost)}` : "Not included" },
            { label: "Insurance estimate", value: `$${formatNumber(insurance)}` },
            { label: "Estimated weight", value: `${formatNumber(weight)} lbs` },
            { label: "Distance", value: `${formatNumber(distance)} miles` },
          ],
          note: "Long distance moves are priced by weight and distance. Get at least 3 quotes and ask about binding estimates.",
        };
      },
    },
  ],
  relatedSlugs: ["security-deposit-calculator", "rent-affordability-calculator", "cost-living-calculator"],
  faq: [
    {
      question: "How much does it cost to move?",
      answer:
        "Local moves (under 100 miles) typically cost $800-$2,500 for a 2-bedroom home. Long distance moves range from $2,000-$8,000+ depending on weight and distance. Costs vary by season (summer is most expensive), location, and services needed.",
    },
    {
      question: "How much should I tip movers?",
      answer:
        "A standard tip is 15-20% of the total labor cost, or $5-10 per mover per hour for local moves. For long distance moves, $50-100 per mover per day is customary. Tip more for difficult moves (stairs, heavy items, extreme weather).",
    },
    {
      question: "What's the cheapest way to move?",
      answer:
        "In order of cost (lowest to highest): DIY with a rental truck, portable storage containers (PODS), hiring labor-only movers (you drive the truck), and full-service movers. Moving off-peak (October-April, mid-month, mid-week) also saves money.",
    },
  ],
  formula:
    "Local: Cost = (Hours × Movers × Hourly Rate) + Truck + Supplies + Insurance | Long Distance: Cost = (Weight × Rate/lb) + (Distance × Rate/mi) + Packing + Insurance",
};

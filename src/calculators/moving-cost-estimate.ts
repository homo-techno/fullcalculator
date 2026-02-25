import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingCostEstimateCalculator: CalculatorDefinition = {
  slug: "moving-cost-estimate-calculator",
  title: "Moving Cost Estimator",
  description:
    "Free moving cost estimator. Calculate the cost of local and long-distance moves based on distance, home size, and additional services.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "moving cost calculator",
    "moving estimate",
    "cost to move",
    "relocation cost",
    "moving expenses calculator",
  ],
  variants: [
    {
      id: "local-move",
      name: "Local Move",
      description: "Estimate cost for a local move (under 100 miles)",
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
        {
          name: "hourlyRate",
          label: "Hourly Rate Per Mover",
          type: "number",
          placeholder: "e.g. 40",
          prefix: "$",
          min: 0,
          defaultValue: 40,
        },
        {
          name: "estimatedHours",
          label: "Estimated Hours",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "hours",
          min: 1,
          max: 24,
        },
        {
          name: "packingService",
          label: "Packing Service",
          type: "select",
          options: [
            { label: "No packing service", value: "0" },
            { label: "Partial packing", value: "500" },
            { label: "Full packing service", value: "1000" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const bedrooms = parseInt(inputs.homeSize as string) || 2;
        const movers = parseInt(inputs.movers as string) || 2;
        const hourlyRate = (inputs.hourlyRate as number) || 40;
        const hours = inputs.estimatedHours as number;
        const packing = parseInt(inputs.packingService as string) || 0;
        if (!hours) return null;

        const laborCost = movers * hourlyRate * hours;
        const truckFee = bedrooms <= 2 ? 150 : bedrooms <= 3 ? 250 : 350;
        const supplies = bedrooms * 50;
        const totalCost = laborCost + truckFee + supplies + packing;

        return {
          primary: {
            label: "Estimated Moving Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "Labor cost", value: `$${formatNumber(laborCost)}` },
            { label: "Truck fee", value: `$${formatNumber(truckFee)}` },
            { label: "Supplies estimate", value: `$${formatNumber(supplies)}` },
            { label: "Packing service", value: `$${formatNumber(packing)}` },
            { label: "Tip (15% suggested)", value: `$${formatNumber(laborCost * 0.15)}` },
          ],
        };
      },
    },
    {
      id: "long-distance",
      name: "Long-Distance Move",
      description: "Estimate cost for a long-distance move",
      fields: [
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Studio / 1 Bedroom", value: "2000" },
            { label: "2 Bedrooms", value: "3500" },
            { label: "3 Bedrooms", value: "5000" },
            { label: "4 Bedrooms", value: "7000" },
            { label: "5+ Bedrooms", value: "9000" },
          ],
          defaultValue: "3500",
        },
        {
          name: "distance",
          label: "Distance",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "miles",
          min: 100,
        },
        {
          name: "additionalServices",
          label: "Additional Services",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "Packing only ($500)", value: "500" },
            { label: "Pack + Unpack ($1000)", value: "1000" },
            { label: "Full service ($2000)", value: "2000" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const weightLbs = parseInt(inputs.homeSize as string) || 3500;
        const distance = inputs.distance as number;
        const services = parseInt(inputs.additionalServices as string) || 0;
        if (!distance) return null;

        const baseCost = (weightLbs / 100) * 0.5 * distance;
        const fuelSurcharge = baseCost * 0.12;
        const insurance = weightLbs * 0.03;
        const totalCost = baseCost + fuelSurcharge + insurance + services;

        return {
          primary: {
            label: "Estimated Moving Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "Base cost (weight + distance)", value: `$${formatNumber(baseCost)}` },
            { label: "Fuel surcharge", value: `$${formatNumber(fuelSurcharge)}` },
            { label: "Basic insurance", value: `$${formatNumber(insurance)}` },
            { label: "Additional services", value: `$${formatNumber(services)}` },
            { label: "Estimated weight", value: `${formatNumber(weightLbs)} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "cost-living-calculator", "home-inspection-cost-calculator"],
  faq: [
    {
      question: "How much does it cost to move?",
      answer:
        "Local moves (under 100 miles) typically cost $800-$2,500. Long-distance moves range from $2,000-$7,500+ depending on distance and weight. The national average is about $1,400 for local and $4,300 for long-distance moves.",
    },
    {
      question: "What factors affect moving costs?",
      answer:
        "Key factors include distance, weight/volume of belongings, time of year (summer is most expensive), additional services (packing, storage), accessibility (stairs, narrow streets), and special items (piano, hot tub).",
    },
    {
      question: "How much should I tip movers?",
      answer:
        "The standard tip for movers is 15-20% of the total bill, or $4-8 per hour per mover. For a full-day move, $20-50 per mover is common. Tip more for exceptional service, heavy items, or difficult conditions.",
    },
  ],
  formula: "Local: Labor (movers x rate x hours) + Truck + Supplies | Long-Distance: Weight x Distance Rate + Fees",
};

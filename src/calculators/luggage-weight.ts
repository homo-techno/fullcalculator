import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const luggageWeightCalculator: CalculatorDefinition = {
  slug: "luggage-weight-calculator",
  title: "Luggage Weight Calculator",
  description:
    "Free luggage weight calculator. Check if your bags meet airline weight limits and calculate excess baggage fees before your flight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "luggage weight",
    "airline baggage",
    "bag weight limit",
    "excess baggage",
    "checked bag weight",
  ],
  variants: [
    {
      id: "check",
      name: "Check Luggage Weight",
      description: "Check if your bags meet airline weight limits",
      fields: [
        {
          name: "bagWeight",
          label: "Bag Weight",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "kg",
        },
        {
          name: "weightUnit",
          label: "Weight Unit",
          type: "select",
          options: [
            { label: "Kilograms (kg)", value: "kg" },
            { label: "Pounds (lbs)", value: "lbs" },
          ],
          defaultValue: "kg",
        },
        {
          name: "airline",
          label: "Airline Class",
          type: "select",
          options: [
            { label: "Economy (23 kg / 50 lbs)", value: "economy" },
            { label: "Premium Economy (23 kg / 50 lbs)", value: "premium" },
            { label: "Business (32 kg / 70 lbs)", value: "business" },
            { label: "First Class (32 kg / 70 lbs)", value: "first" },
            { label: "Budget Airline (20 kg / 44 lbs)", value: "budget" },
          ],
          defaultValue: "economy",
        },
      ],
      calculate: (inputs) => {
        const bagWeight = inputs.bagWeight as number;
        const weightUnit = inputs.weightUnit as string;
        const airline = inputs.airline as string;
        if (!bagWeight || bagWeight <= 0) return null;

        const weightKg = weightUnit === "lbs" ? bagWeight * 0.453592 : bagWeight;
        const weightLbs = weightUnit === "lbs" ? bagWeight : bagWeight * 2.20462;

        const limits: Record<string, number> = {
          economy: 23,
          premium: 23,
          business: 32,
          first: 32,
          budget: 20,
        };

        const limitKg = limits[airline] || 23;
        const limitLbs = limitKg * 2.20462;
        const overUnderKg = weightKg - limitKg;
        const overUnderLbs = overUnderKg * 2.20462;
        const isOver = overUnderKg > 0;
        const excessFee = isOver ? Math.ceil(overUnderKg) * 15 : 0;

        return {
          primary: {
            label: isOver ? "Over Limit" : "Within Limit",
            value: isOver
              ? `${formatNumber(Math.abs(overUnderKg), 1)} kg over`
              : `${formatNumber(Math.abs(overUnderKg), 1)} kg under`,
          },
          details: [
            { label: "Your bag weight", value: `${formatNumber(weightKg, 1)} kg (${formatNumber(weightLbs, 1)} lbs)` },
            { label: "Weight limit", value: `${formatNumber(limitKg, 0)} kg (${formatNumber(limitLbs, 0)} lbs)` },
            { label: "Difference", value: `${isOver ? "+" : "-"}${formatNumber(Math.abs(overUnderKg), 1)} kg (${formatNumber(Math.abs(overUnderLbs), 1)} lbs)` },
            { label: "Estimated excess fee", value: excessFee > 0 ? `$${formatNumber(excessFee, 0)}` : "None" },
          ],
          note: isOver
            ? "Your bag exceeds the weight limit. Consider removing items or paying excess baggage fees."
            : "Your bag is within the weight limit. You're good to go!",
        };
      },
    },
    {
      id: "multi",
      name: "Multiple Bags Total",
      description: "Calculate total weight for multiple bags",
      fields: [
        {
          name: "bag1",
          label: "Bag 1 Weight (kg)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "bag2",
          label: "Bag 2 Weight (kg)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "bag3",
          label: "Bag 3 Weight (kg, optional)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "allowance",
          label: "Total Weight Allowance (kg)",
          type: "number",
          placeholder: "e.g. 46",
        },
      ],
      calculate: (inputs) => {
        const bag1 = (inputs.bag1 as number) || 0;
        const bag2 = (inputs.bag2 as number) || 0;
        const bag3 = (inputs.bag3 as number) || 0;
        const allowance = inputs.allowance as number;
        if (!allowance || allowance <= 0) return null;

        const totalWeight = bag1 + bag2 + bag3;
        const remaining = allowance - totalWeight;
        const bagCount = (bag1 > 0 ? 1 : 0) + (bag2 > 0 ? 1 : 0) + (bag3 > 0 ? 1 : 0);

        return {
          primary: {
            label: "Total Luggage Weight",
            value: `${formatNumber(totalWeight, 1)} kg`,
          },
          details: [
            { label: "Number of bags", value: `${bagCount}` },
            { label: "Total weight", value: `${formatNumber(totalWeight, 1)} kg` },
            { label: "Allowance", value: `${formatNumber(allowance, 1)} kg` },
            { label: "Remaining", value: `${formatNumber(remaining, 1)} kg` },
          ],
          note: remaining >= 0
            ? `You have ${formatNumber(remaining, 1)} kg of allowance remaining.`
            : `You are ${formatNumber(Math.abs(remaining), 1)} kg over your total allowance.`,
        };
      },
    },
  ],
  relatedSlugs: ["carry-on-size-calculator", "travel-packing-calculator"],
  faq: [
    {
      question: "What is the standard checked luggage weight limit?",
      answer:
        "Most airlines allow 23 kg (50 lbs) per checked bag for economy class and 32 kg (70 lbs) for business/first class. Budget airlines may limit checked bags to 20 kg (44 lbs). Always verify with your specific airline before traveling.",
    },
    {
      question: "How much do excess baggage fees cost?",
      answer:
        "Excess baggage fees typically range from $50 to $200+ depending on the airline and how much you exceed the limit. Fees are usually charged per kilogram over the limit, with rates between $10-$25 per kg. Pre-purchasing extra baggage online is usually cheaper.",
    },
    {
      question: "How can I reduce my luggage weight?",
      answer:
        "Use a lightweight suitcase, wear your heaviest items on the plane, use packing cubes to organize and reduce volume, pack multi-purpose clothing, use travel-size toiletries, and weigh your bag at home before heading to the airport.",
    },
  ],
  formula:
    "Excess = Bag Weight - Airline Limit; Estimated Fee = Excess kg x $15/kg (varies by airline).",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const giftBudgetCalculator: CalculatorDefinition = {
  slug: "gift-budget-calculator",
  title: "Holiday Gift Budget Planner",
  description:
    "Free holiday gift budget planner. Calculate your total gift-giving budget, allocate per person, and plan ahead to avoid holiday overspending.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gift budget calculator",
    "holiday gift planner",
    "Christmas budget calculator",
    "gift spending planner",
    "holiday budget calculator",
  ],
  variants: [
    {
      id: "budget-planner",
      name: "Gift Budget Planner",
      description: "Plan your total gift budget by recipient category",
      fields: [
        {
          name: "totalBudget",
          label: "Total Gift Budget",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 50,
          max: 10000,
          step: 25,
          defaultValue: 500,
        },
        {
          name: "immediateFamily",
          label: "Immediate Family Members",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          max: 20,
          step: 1,
          defaultValue: 4,
        },
        {
          name: "extendedFamily",
          label: "Extended Family / Close Friends",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 30,
          step: 1,
          defaultValue: 6,
        },
        {
          name: "coworkers",
          label: "Coworkers / Acquaintances",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 20,
          step: 1,
          defaultValue: 3,
        },
        {
          name: "kids",
          label: "Children (to buy for)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 15,
          step: 1,
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const budget = parseFloat(inputs.totalBudget as string);
        const immediate = parseFloat(inputs.immediateFamily as string) || 0;
        const extended = parseFloat(inputs.extendedFamily as string) || 0;
        const coworkers = parseFloat(inputs.coworkers as string) || 0;
        const kids = parseFloat(inputs.kids as string) || 0;
        if (!budget) return null;

        const totalPeople = immediate + extended + coworkers + kids;
        if (totalPeople === 0) return null;

        // Weighted allocation: immediate gets more, coworkers less
        const immediateWeight = 3;
        const extendedWeight = 2;
        const kidsWeight = 2.5;
        const coworkerWeight = 1;

        const totalWeight = immediate * immediateWeight + extended * extendedWeight + kids * kidsWeight + coworkers * coworkerWeight;
        const perWeightUnit = budget / totalWeight;

        const perImmediate = perWeightUnit * immediateWeight;
        const perExtended = perWeightUnit * extendedWeight;
        const perKid = perWeightUnit * kidsWeight;
        const perCoworker = perWeightUnit * coworkerWeight;

        const immediateBudget = perImmediate * immediate;
        const extendedBudget = perExtended * extended;
        const kidsBudget = perKid * kids;
        const coworkerBudget = perCoworker * coworkers;

        // Savings plan: months until December
        const monthsToSave = 6; // assume 6 months of saving
        const monthlySave = budget / monthsToSave;

        return {
          primary: { label: "Budget per Immediate Family", value: `$${formatNumber(perImmediate)}` },
          details: [
            { label: "Per Extended Family/Friend", value: `$${formatNumber(perExtended)}` },
            { label: "Per Child", value: `$${formatNumber(perKid)}` },
            { label: "Per Coworker", value: `$${formatNumber(perCoworker)}` },
            { label: "Total Recipients", value: formatNumber(totalPeople, 0) },
            { label: "Average per Person", value: `$${formatNumber(budget / totalPeople)}` },
            { label: "Save per Month (6 mo)", value: `$${formatNumber(monthlySave)}` },
          ],
          note: "Budget allocations are weighted: immediate family gets the most per person, followed by children, extended family, then coworkers/acquaintances.",
        };
      },
    },
    {
      id: "savings-plan",
      name: "Gift Savings Plan",
      description: "Plan monthly savings to reach your gift budget",
      fields: [
        {
          name: "targetBudget",
          label: "Target Gift Budget",
          type: "number",
          placeholder: "e.g. 800",
          prefix: "$",
          min: 50,
          max: 10000,
          step: 25,
          defaultValue: 800,
        },
        {
          name: "monthsToSave",
          label: "Months to Save",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "6 months", value: "6" },
            { label: "9 months", value: "9" },
            { label: "12 months (full year)", value: "12" },
          ],
          defaultValue: "6",
        },
        {
          name: "wrappingPercent",
          label: "Add for Wrapping/Cards/Shipping",
          type: "select",
          options: [
            { label: "5% extra", value: "5" },
            { label: "10% extra", value: "10" },
            { label: "15% extra", value: "15" },
            { label: "20% extra", value: "20" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const target = parseFloat(inputs.targetBudget as string);
        const months = parseFloat(inputs.monthsToSave as string);
        const extraPct = parseFloat(inputs.wrappingPercent as string);
        if (!target || !months) return null;

        const extras = target * ((extraPct || 0) / 100);
        const totalNeeded = target + extras;
        const monthlySavings = totalNeeded / months;
        const weeklySavings = monthlySavings / 4.33;

        return {
          primary: { label: "Monthly Savings Needed", value: `$${formatNumber(monthlySavings)}` },
          details: [
            { label: "Weekly Savings", value: `$${formatNumber(weeklySavings)}` },
            { label: "Gift Budget", value: `$${formatNumber(target)}` },
            { label: "Wrapping/Cards/Shipping", value: `$${formatNumber(extras)}` },
            { label: "Total Needed", value: `$${formatNumber(totalNeeded)}` },
            { label: "Savings Period", value: `${formatNumber(months, 0)} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["birthday-party-cost-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "How much should I spend on holiday gifts?",
      answer:
        "Financial experts recommend spending no more than 1-2% of your annual income on holiday gifts. The average American spends about $850-$1,000 per holiday season. Set a firm budget and stick to it to avoid holiday debt.",
    },
    {
      question: "How can I save money on holiday gifts?",
      answer:
        "Start saving early (January), shop sales year-round, set per-person budgets, consider homemade gifts, use cashback and coupons, and suggest gift exchanges for large families to reduce the number of gifts needed.",
    },
  ],
  formula:
    "Per Person = Total Budget x (Weight / Total Weight) | Monthly Savings = Total Needed / Months to Save",
};

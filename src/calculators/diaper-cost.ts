import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const diaperCostCalculator: CalculatorDefinition = {
  slug: "diaper-cost-calculator",
  title: "Diaper Cost Calculator",
  description:
    "Free diaper cost calculator. Estimate how much you'll spend on diapers from birth to potty training, including diaper and wipes costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "diaper cost",
    "diaper budget",
    "how much diapers cost",
    "diaper expense calculator",
    "baby diaper calculator",
  ],
  variants: [
    {
      id: "diaper-cost",
      name: "Diaper Cost Estimator",
      description: "Estimate your total diaper expenses",
      fields: [
        {
          name: "currentAgeMonths",
          label: "Baby's Current Age (months)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 36,
          defaultValue: 0,
        },
        {
          name: "pottyTrainAge",
          label: "Expected Potty Training Age (months)",
          type: "number",
          placeholder: "e.g. 30",
          min: 18,
          max: 48,
          defaultValue: 30,
        },
        {
          name: "diaperType",
          label: "Diaper Type",
          type: "select",
          options: [
            { label: "Budget Brand (~$0.15/diaper)", value: "budget" },
            { label: "Store Brand (~$0.20/diaper)", value: "store" },
            { label: "Name Brand (~$0.28/diaper)", value: "name" },
            { label: "Premium/Organic (~$0.40/diaper)", value: "premium" },
          ],
          defaultValue: "store",
        },
        {
          name: "includeWipes",
          label: "Include Wipes Cost?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          defaultValue: "yes",
        },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAgeMonths as number;
        const pottyAge = (inputs.pottyTrainAge as number) || 30;
        const diaperType = inputs.diaperType as string;
        const includeWipes = inputs.includeWipes as string;

        if (currentAge === undefined || currentAge === null) return null;
        if (currentAge >= pottyAge) return null;

        const costPerDiaper: Record<string, number> = {
          budget: 0.15, store: 0.20, name: 0.28, premium: 0.40,
        };
        const pricePerDiaper = costPerDiaper[diaperType] || 0.20;

        // Average diapers per day by age
        const diapersPerDay = (ageMonths: number): number => {
          if (ageMonths < 1) return 10;
          if (ageMonths < 6) return 8;
          if (ageMonths < 12) return 7;
          if (ageMonths < 24) return 6;
          return 5;
        };

        let totalDiapers = 0;
        for (let m = currentAge; m < pottyAge; m++) {
          totalDiapers += diapersPerDay(m) * 30.44; // avg days per month
        }

        const diaperCost = totalDiapers * pricePerDiaper;
        const monthsRemaining = pottyAge - currentAge;

        // Wipes: ~4 wipes per change, ~$0.02 per wipe
        const totalWipes = totalDiapers * 4;
        const wipesCost = totalWipes * 0.02;

        const totalCost = includeWipes === "yes" ? diaperCost + wipesCost : diaperCost;
        const monthlyCost = totalCost / monthsRemaining;

        return {
          primary: {
            label: "Estimated Total Cost",
            value: `$${formatNumber(totalCost, 0)}`,
          },
          details: [
            { label: "Monthly Average", value: `$${formatNumber(monthlyCost, 0)}/month` },
            { label: "Total Diapers", value: `${formatNumber(totalDiapers, 0)} diapers` },
            { label: "Diaper Cost", value: `$${formatNumber(diaperCost, 0)}` },
            { label: "Wipes Cost", value: includeWipes === "yes" ? `$${formatNumber(wipesCost, 0)}` : "Not included" },
            { label: "Cost Per Diaper", value: `$${formatNumber(pricePerDiaper, 2)}` },
            { label: "Months Until Potty Training", value: `${monthsRemaining} months` },
          ],
          note: "Costs are estimates based on average U.S. prices. Buying in bulk, using coupons, or subscribing to delivery services can reduce costs by 15-30%. Cloth diapers can save $1,000+ but have upfront and laundry costs.",
        };
      },
    },
  ],
  relatedSlugs: ["childcare-cost-calculator", "baby-formula-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "How many diapers does a baby use?",
      answer:
        "On average, a baby uses about 2,500-3,000 diapers in the first year alone. Newborns use 8-10 per day, decreasing to 5-6 per day by age 2. From birth to potty training (around 2.5 years), expect to use roughly 6,000-7,000 diapers total.",
    },
    {
      question: "How much do diapers cost per year?",
      answer:
        "The average family spends $500-$900 per year on disposable diapers, depending on brand choice. Budget brands cost around $500/year, name brands around $700/year, and premium/organic brands can exceed $1,000/year.",
    },
    {
      question: "Are cloth diapers cheaper than disposable?",
      answer:
        "Cloth diapers can save $1,000-$2,000 over disposable diapers. An initial investment of $300-$500 for cloth diapers plus $300-$500 in laundering costs over 2.5 years compares to $1,500-$2,500 for disposables. However, cloth diapers require more time and effort.",
    },
  ],
  formula:
    "Total Cost = (Total Diapers × Cost Per Diaper) + Wipes Cost | Diapers vary by age: newborn ~10/day, 6mo ~7/day, 12mo+ ~6/day, 24mo+ ~5/day | Wipes ≈ 4 per change × $0.02 each.",
};

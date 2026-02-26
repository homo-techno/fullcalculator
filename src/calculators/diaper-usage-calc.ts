import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const diaperUsageCalculator: CalculatorDefinition = {
  slug: "diaper-usage-calculator",
  title: "Diaper Usage & Cost Calculator",
  description:
    "Free diaper usage calculator. Estimate how many diapers your baby needs per day, month, and year, plus total cost based on age and diaper brand price.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "diaper calculator",
    "diaper cost",
    "baby diaper usage",
    "how many diapers",
    "diaper budget",
  ],
  variants: [
    {
      id: "by-age",
      name: "Usage by Age",
      description: "Estimate diaper usage and cost by baby's age",
      fields: [
        {
          name: "ageRange",
          label: "Baby's Age",
          type: "select",
          options: [
            { label: "Newborn (0-1 month)", value: "0" },
            { label: "1-5 months", value: "3" },
            { label: "5-9 months", value: "7" },
            { label: "9-12 months", value: "10" },
            { label: "12-18 months", value: "15" },
            { label: "18-24 months", value: "21" },
            { label: "24-36 months", value: "30" },
          ],
          defaultValue: "3",
        },
        {
          name: "costPerDiaper",
          label: "Cost per Diaper",
          type: "number",
          placeholder: "e.g. 0.25",
          prefix: "$",
          min: 0.01,
          max: 2,
          step: 0.01,
          defaultValue: 0.25,
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.ageRange as string);
        const costPerDiaper = parseFloat(inputs.costPerDiaper as string);
        if (isNaN(age) || !costPerDiaper) return null;

        let diapersPerDay: number;
        let sizeRecommendation: string;

        if (age <= 1) {
          diapersPerDay = 10;
          sizeRecommendation = "Newborn / Size 1";
        } else if (age <= 5) {
          diapersPerDay = 8;
          sizeRecommendation = "Size 1-2";
        } else if (age <= 9) {
          diapersPerDay = 7;
          sizeRecommendation = "Size 3";
        } else if (age <= 12) {
          diapersPerDay = 6;
          sizeRecommendation = "Size 3-4";
        } else if (age <= 18) {
          diapersPerDay = 5;
          sizeRecommendation = "Size 4";
        } else if (age <= 24) {
          diapersPerDay = 5;
          sizeRecommendation = "Size 5";
        } else {
          diapersPerDay = 4;
          sizeRecommendation = "Size 5-6";
        }

        const perWeek = diapersPerDay * 7;
        const perMonth = diapersPerDay * 30;
        const perYear = diapersPerDay * 365;
        const monthlyCost = perMonth * costPerDiaper;
        const yearlyCost = perYear * costPerDiaper;

        return {
          primary: { label: "Diapers per Day", value: formatNumber(diapersPerDay, 0) },
          details: [
            { label: "Diapers per Week", value: formatNumber(perWeek, 0) },
            { label: "Diapers per Month", value: formatNumber(perMonth, 0) },
            { label: "Diapers per Year", value: formatNumber(perYear, 0) },
            { label: "Monthly Cost", value: `$${formatNumber(monthlyCost)}` },
            { label: "Yearly Cost", value: `$${formatNumber(yearlyCost)}` },
            { label: "Recommended Size", value: sizeRecommendation },
          ],
        };
      },
    },
    {
      id: "total-cost",
      name: "Total Until Potty Training",
      description: "Estimate total diaper cost from birth to potty training",
      fields: [
        {
          name: "pottyAge",
          label: "Expected Potty Training Age",
          type: "select",
          options: [
            { label: "24 months", value: "24" },
            { label: "30 months", value: "30" },
            { label: "36 months", value: "36" },
            { label: "42 months", value: "42" },
          ],
          defaultValue: "30",
        },
        {
          name: "costPerDiaper",
          label: "Average Cost per Diaper",
          type: "number",
          placeholder: "e.g. 0.25",
          prefix: "$",
          min: 0.01,
          max: 2,
          step: 0.01,
          defaultValue: 0.25,
        },
      ],
      calculate: (inputs) => {
        const pottyAge = parseFloat(inputs.pottyAge as string);
        const cost = parseFloat(inputs.costPerDiaper as string);
        if (!pottyAge || !cost) return null;

        // Average diapers per day by phase
        const phases = [
          { months: 1, perDay: 10 },
          { months: 5, perDay: 8 },
          { months: 9, perDay: 7 },
          { months: 12, perDay: 6 },
          { months: 18, perDay: 5 },
          { months: 24, perDay: 5 },
          { months: 42, perDay: 4 },
        ];

        let totalDiapers = 0;
        let prevMonth = 0;
        for (const phase of phases) {
          if (prevMonth >= pottyAge) break;
          const endMonth = Math.min(phase.months, pottyAge);
          const durationDays = (endMonth - prevMonth) * 30;
          if (durationDays > 0) {
            totalDiapers += durationDays * phase.perDay;
          }
          prevMonth = phase.months;
        }

        const totalCost = totalDiapers * cost;

        return {
          primary: { label: "Total Diapers", value: formatNumber(totalDiapers, 0) },
          details: [
            { label: "Total Cost", value: `$${formatNumber(totalCost)}` },
            { label: "Avg Monthly Cost", value: `$${formatNumber(totalCost / pottyAge)}` },
            { label: "Potty Training Age", value: `${formatNumber(pottyAge, 0)} months` },
          ],
          note: "Estimates based on average usage. Actual usage varies by child. Does not include wipes, creams, or other supplies.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-shoe-size-calculator", "baby-sleep-schedule-calculator"],
  faq: [
    {
      question: "How many diapers does a newborn use per day?",
      answer:
        "Newborns typically use 10-12 diapers per day. This decreases to about 8 per day by 1-5 months, and gradually reduces to 4-5 per day by age 2.",
    },
    {
      question: "How much do diapers cost per year?",
      answer:
        "At an average cost of $0.20-$0.35 per diaper, parents can expect to spend $700-$900 in the first year and $500-$700 in subsequent years until potty training.",
    },
  ],
  formula:
    "Monthly Diapers = Diapers per Day x 30 | Monthly Cost = Monthly Diapers x Cost per Diaper",
};

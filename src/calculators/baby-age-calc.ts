import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyAgeCalc: CalculatorDefinition = {
  slug: "baby-age-calculator",
  title: "Baby Age Calculator",
  description:
    "Free online baby age calculator. Calculate your baby's age in weeks, months, and days from their date of birth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "baby age calculator",
    "infant age",
    "baby weeks old",
    "baby months old",
    "newborn age",
    "baby milestone",
  ],
  variants: [
    {
      id: "baby-age",
      name: "Baby Age",
      description: "Calculate your baby's exact age in weeks and months",
      fields: [
        {
          name: "birthYear",
          label: "Birth Year",
          type: "number",
          placeholder: "e.g. 2025",
          min: 2015,
          max: 2030,
        },
        {
          name: "birthMonth",
          label: "Birth Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "birthDay",
          label: "Birth Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const bY = parseFloat(inputs.birthYear as string) || 0;
        const bM = parseFloat(inputs.birthMonth as string) || 0;
        const bD = parseFloat(inputs.birthDay as string) || 0;
        if (!bY || !bM || !bD) return null;

        const birth = new Date(bY, bM - 1, bD);
        const now = new Date();

        if (birth > now) return null;

        const totalDays = Math.floor(
          (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        const totalMonths = years * 12 + months;

        // Milestones
        const milestones = [
          { weeks: 6, label: "First smile" },
          { weeks: 16, label: "Rolling over" },
          { weeks: 26, label: "Sitting up" },
          { weeks: 36, label: "Crawling" },
          { weeks: 44, label: "Standing" },
          { weeks: 52, label: "First birthday / First steps" },
          { weeks: 78, label: "Running" },
          { weeks: 104, label: "Second birthday" },
        ];

        const nextMilestone = milestones.find((m) => m.weeks > totalWeeks);
        const milestoneText = nextMilestone
          ? `${nextMilestone.label} (~${nextMilestone.weeks} weeks)`
          : "All early milestones passed";

        return {
          primary: {
            label: "Baby's Age",
            value:
              totalMonths < 1
                ? `${totalDays} days`
                : totalMonths < 24
                  ? `${totalMonths} months, ${days} days`
                  : `${years} years, ${months} months`,
          },
          details: [
            { label: "In weeks and days", value: `${formatNumber(totalWeeks)} weeks, ${formatNumber(remainingDays)} days` },
            { label: "Total days", value: formatNumber(totalDays) },
            { label: "Total weeks", value: formatNumber(totalWeeks) },
            { label: "Total months", value: formatNumber(totalMonths) },
            { label: "Next milestone", value: milestoneText },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "chronological-age-calculator"],
  faq: [
    {
      question: "How is baby age typically measured?",
      answer:
        "For newborns up to a few months, age is often measured in days or weeks. After that, months are used until the child is about 2 years old, when years become the standard.",
    },
    {
      question: "Why track baby age in weeks?",
      answer:
        "Pediatricians and developmental guides often use weeks for the first year because developmental milestones are closely tied to specific week ranges.",
    },
  ],
  formula: "Baby Age = Current Date - Birth Date (in weeks, months, and days)",
};

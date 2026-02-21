import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ageInMonthsCalculator: CalculatorDefinition = {
  slug: "age-in-months-calculator",
  title: "Age in Months Calculator",
  description:
    "Free age in months calculator. Find out exactly how many months old you are from your date of birth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "age in months",
    "months old calculator",
    "how many months old am I",
    "baby age in months",
    "age months calculator",
  ],
  variants: [
    {
      id: "age-months",
      name: "Your Age in Months",
      description: "Calculate your exact age in months from your birth date",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2026 },
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "birthDay", label: "Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        if (!year || !month || !day) return null;

        const birth = new Date(year, month - 1, day);
        const now = new Date();
        if (birth > now) return null;

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
        const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);

        return {
          primary: {
            label: "Your Age in Months",
            value: formatNumber(totalMonths),
            suffix: "months",
          },
          details: [
            { label: "Years and months", value: `${years} years, ${months} months` },
            { label: "Extra days", value: `${days} days` },
            { label: "Total weeks", value: formatNumber(totalWeeks) },
            { label: "Total days", value: formatNumber(totalDays) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "age-calculator",
    "age-in-weeks-calculator",
    "age-in-days-calculator",
  ],
  faq: [
    {
      question: "How do I calculate my age in months?",
      answer:
        "Multiply the number of full years by 12 and add any additional months. For example, if you are 30 years and 5 months old, your age in months is 365 months.",
    },
    {
      question: "Why is age in months useful?",
      answer:
        "Age in months is commonly used for tracking infant and toddler development milestones. Pediatricians often reference a child's age in months up to age 2 or 3.",
    },
  ],
  formula: "Age in Months = (Years × 12) + Months",
};

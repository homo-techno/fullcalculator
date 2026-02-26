import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const immigrationWaitTimeCalculator: CalculatorDefinition = {
  slug: "immigration-wait-time",
  title: "Immigration Visa Wait Time Calculator",
  description: "Free online immigration visa wait time estimator. Estimate processing times for various visa categories and countries of origin.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["immigration", "visa wait time", "green card", "visa processing", "immigration timeline", "visa backlog", "priority date"],
  variants: [
    {
      id: "family-based",
      name: "Family-Based Immigration",
      fields: [
        {
          name: "category",
          label: "Visa Category",
          type: "select",
          options: [
            { label: "F1 - Unmarried Sons/Daughters of US Citizens", value: "F1" },
            { label: "F2A - Spouses/Children of Permanent Residents", value: "F2A" },
            { label: "F2B - Unmarried Sons/Daughters of Permanent Residents", value: "F2B" },
            { label: "F3 - Married Sons/Daughters of US Citizens", value: "F3" },
            { label: "F4 - Siblings of US Citizens", value: "F4" },
          ],
        },
        {
          name: "country",
          label: "Country of Origin",
          type: "select",
          options: [
            { label: "All Other Countries", value: "other" },
            { label: "Mexico", value: "mexico" },
            { label: "Philippines", value: "philippines" },
            { label: "India", value: "india" },
            { label: "China (Mainland)", value: "china" },
          ],
        },
        {
          name: "monthsWaited",
          label: "Months Already Waited",
          type: "number",
          placeholder: "e.g. 12",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const category = inputs.category as string;
        const country = inputs.country as string;
        const monthsWaited = parseFloat(inputs.monthsWaited as string) || 0;

        const waitTimesMonths: Record<string, Record<string, number>> = {
          F1: { other: 84, mexico: 252, philippines: 264, india: 84, china: 84 },
          F2A: { other: 36, mexico: 48, philippines: 36, india: 36, china: 36 },
          F2B: { other: 108, mexico: 252, philippines: 132, india: 108, china: 108 },
          F3: { other: 156, mexico: 288, philippines: 276, india: 156, china: 156 },
          F4: { other: 180, mexico: 300, philippines: 288, india: 180, china: 180 },
        };

        const totalMonths = waitTimesMonths[category]?.[country] || 60;
        const remainingMonths = Math.max(0, totalMonths - monthsWaited);
        const remainingYears = remainingMonths / 12;
        const progressPercent = (monthsWaited / totalMonths) * 100;

        return {
          primary: { label: "Estimated Remaining Wait", value: formatNumber(remainingYears, 1) + " years" },
          details: [
            { label: "Total Estimated Wait", value: formatNumber(totalMonths / 12, 1) + " years" },
            { label: "Time Already Waited", value: formatNumber(monthsWaited, 0) + " months" },
            { label: "Remaining Months", value: formatNumber(remainingMonths, 0) },
            { label: "Progress", value: formatNumber(Math.min(progressPercent, 100), 1) + "%" },
          ],
          note: "Wait times are estimates based on historical data and can change significantly due to policy changes, visa bulletin updates, and annual quota adjustments.",
        };
      },
    },
    {
      id: "employment-based",
      name: "Employment-Based Immigration",
      fields: [
        {
          name: "category",
          label: "Visa Category",
          type: "select",
          options: [
            { label: "EB-1 - Priority Workers", value: "EB1" },
            { label: "EB-2 - Advanced Degree Professionals", value: "EB2" },
            { label: "EB-3 - Skilled Workers", value: "EB3" },
            { label: "EB-4 - Special Immigrants", value: "EB4" },
            { label: "EB-5 - Investor Visa", value: "EB5" },
          ],
        },
        {
          name: "country",
          label: "Country of Origin",
          type: "select",
          options: [
            { label: "All Other Countries", value: "other" },
            { label: "India", value: "india" },
            { label: "China (Mainland)", value: "china" },
            { label: "Philippines", value: "philippines" },
            { label: "Mexico", value: "mexico" },
          ],
        },
        {
          name: "monthsWaited",
          label: "Months Already Waited",
          type: "number",
          placeholder: "e.g. 24",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const category = inputs.category as string;
        const country = inputs.country as string;
        const monthsWaited = parseFloat(inputs.monthsWaited as string) || 0;

        const waitTimesMonths: Record<string, Record<string, number>> = {
          EB1: { other: 12, india: 72, china: 48, philippines: 12, mexico: 12 },
          EB2: { other: 18, india: 144, china: 60, philippines: 18, mexico: 18 },
          EB3: { other: 24, india: 120, china: 48, philippines: 24, mexico: 24 },
          EB4: { other: 12, india: 12, china: 12, philippines: 12, mexico: 12 },
          EB5: { other: 24, india: 36, china: 72, philippines: 24, mexico: 24 },
        };

        const totalMonths = waitTimesMonths[category]?.[country] || 24;
        const remainingMonths = Math.max(0, totalMonths - monthsWaited);
        const remainingYears = remainingMonths / 12;
        const progressPercent = (monthsWaited / totalMonths) * 100;

        return {
          primary: { label: "Estimated Remaining Wait", value: formatNumber(remainingYears, 1) + " years" },
          details: [
            { label: "Total Estimated Wait", value: formatNumber(totalMonths / 12, 1) + " years" },
            { label: "Time Already Waited", value: formatNumber(monthsWaited, 0) + " months" },
            { label: "Remaining Months", value: formatNumber(remainingMonths, 0) },
            { label: "Progress", value: formatNumber(Math.min(progressPercent, 100), 1) + "%" },
          ],
          note: "EB wait times vary significantly, especially for India and China. Check the monthly Visa Bulletin for current priority dates.",
        };
      },
    },
  ],
  relatedSlugs: ["statute-limitations", "sentencing-guidelines"],
  faq: [
    {
      question: "Why are immigration wait times so long for some countries?",
      answer: "The US has per-country caps that limit the number of visas issued to any single country to 7% of the total. Countries with high demand (India, China, Philippines, Mexico) have significant backlogs because demand far exceeds the annual cap.",
    },
    {
      question: "What is a priority date?",
      answer: "Your priority date is the date your immigration petition was filed (or labor certification for employment-based). Your visa becomes available when the State Department processes priority dates up to your date.",
    },
    {
      question: "Can I speed up my immigration process?",
      answer: "Options include premium processing (for certain employment petitions), upgrading to a different visa category, or seeking expedited processing due to humanitarian reasons. An immigration attorney can advise on available options.",
    },
  ],
  formula: "Remaining Wait = Total Estimated Wait Time - Months Already Waited",
};

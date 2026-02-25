import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pellGrantCalculator: CalculatorDefinition = {
  slug: "pell-grant-calculator",
  title: "Pell Grant Calculator",
  description:
    "Free Pell Grant calculator. Estimate your federal Pell Grant amount based on income, family size, and enrollment status.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pell grant calculator",
    "federal pell grant",
    "pell grant estimate",
    "pell grant eligibility",
    "fafsa pell grant",
  ],
  variants: [
    {
      id: "estimate",
      name: "Pell Grant Estimate",
      description: "Estimate your Pell Grant based on income and enrollment (max award ~$7,395 for 2024-25)",
      fields: [
        { name: "familyIncome", label: "Annual Family Income ($)", type: "number", placeholder: "e.g. 40000", min: 0 },
        { name: "familySize", label: "Family Size", type: "number", placeholder: "e.g. 4", min: 1, max: 15 },
        { name: "enrollment", label: "Enrollment Status", type: "select", options: [{ label: "Full-time", value: "1" }, { label: "3/4 time", value: "0.75" }, { label: "Half-time", value: "0.5" }, { label: "Less than half-time", value: "0.25" }], defaultValue: "1" },
        { name: "costOfAttendance", label: "Annual Cost of Attendance ($)", type: "number", placeholder: "e.g. 25000", min: 0 },
      ],
      calculate: (inputs) => {
        const income = (inputs.familyIncome as number) || 0;
        const famSize = (inputs.familySize as number) || 4;
        const enrollment = parseFloat(inputs.enrollment as string || "1");
        const coa = (inputs.costOfAttendance as number) || 25000;

        const maxPell = 7395;

        // Simplified eligibility model
        const incomeThreshold = 30000 + (famSize - 1) * 8000;
        let pellPercent: number;

        if (income <= incomeThreshold * 0.3) pellPercent = 1.0;
        else if (income <= incomeThreshold * 0.5) pellPercent = 0.75;
        else if (income <= incomeThreshold * 0.7) pellPercent = 0.5;
        else if (income <= incomeThreshold) pellPercent = 0.25;
        else pellPercent = 0;

        const fullTimePell = Math.min(maxPell * pellPercent, coa);
        const actualPell = Math.round(fullTimePell * enrollment);

        let eligibility: string;
        if (pellPercent >= 1) eligibility = "Likely full Pell Grant";
        else if (pellPercent >= 0.5) eligibility = "Likely partial Pell Grant";
        else if (pellPercent > 0) eligibility = "Minimum Pell Grant range";
        else eligibility = "Likely not eligible for Pell Grant";

        const annualValue = actualPell;
        const fourYearValue = actualPell * 4;

        return {
          primary: { label: "Estimated Pell Grant", value: `$${formatNumber(actualPell, 0)}` },
          details: [
            { label: "Eligibility", value: eligibility },
            { label: "Full-time equivalent", value: `$${formatNumber(fullTimePell, 0)}` },
            { label: "Enrollment adjustment", value: `${enrollment * 100}%` },
            { label: "4-year total (if consistent)", value: `$${formatNumber(fourYearValue, 0)}` },
          ],
        };
      },
    },
    {
      id: "lifetime",
      name: "Lifetime Pell Eligibility",
      description: "Track how much of your Pell Grant lifetime eligibility you've used",
      fields: [
        { name: "semestersUsed", label: "Semesters of Pell Received", type: "number", placeholder: "e.g. 4", min: 0, max: 12 },
        { name: "avgAward", label: "Average Semester Award ($)", type: "number", placeholder: "e.g. 3000", min: 0 },
        { name: "plannedSemesters", label: "Remaining Semesters Planned", type: "number", placeholder: "e.g. 4", min: 0, max: 12 },
      ],
      calculate: (inputs) => {
        const used = (inputs.semestersUsed as number) || 0;
        const avgAward = (inputs.avgAward as number) || 0;
        const planned = (inputs.plannedSemesters as number) || 0;

        const maxSemesters = 12; // Lifetime limit is 6 years (12 semesters)
        const remaining = Math.max(0, maxSemesters - used);
        const percentUsed = (used / maxSemesters) * 100;
        const totalReceived = used * avgAward;
        const projectedTotal = (used + Math.min(planned, remaining)) * avgAward;
        const canComplete = planned <= remaining;

        return {
          primary: { label: "Semesters Remaining", value: formatNumber(remaining, 0) },
          details: [
            { label: "Lifetime eligibility used", value: `${formatNumber(percentUsed, 0)}%` },
            { label: "Total Pell received", value: `$${formatNumber(totalReceived, 0)}` },
            { label: "Projected total", value: `$${formatNumber(projectedTotal, 0)}` },
            { label: "Can cover planned semesters?", value: canComplete ? "Yes" : "No - exceeds lifetime limit" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["financial-aid-estimate-calculator", "student-loan-calculator"],
  faq: [
    {
      question: "Who is eligible for a Pell Grant?",
      answer:
        "Pell Grants are for undergraduate students with demonstrated financial need. Eligibility depends on EFC/SAI, cost of attendance, enrollment status, and full-time/part-time status. There is no GPA requirement to initially qualify.",
    },
    {
      question: "What is the maximum Pell Grant?",
      answer:
        "The maximum Pell Grant is adjusted annually. For 2024-25 it is $7,395. You must be enrolled full-time to receive the maximum. The actual amount depends on your financial need and cost of attendance.",
    },
  ],
  formula: "Pell Grant = Max Award x Eligibility Percentage x Enrollment Status",
};

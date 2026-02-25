import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scholarshipOddsCalculator: CalculatorDefinition = {
  slug: "scholarship-odds-calculator",
  title: "Scholarship Odds Calculator",
  description:
    "Free scholarship odds calculator. Estimate your chances of winning scholarships based on GPA, applicant pool size, and number of awards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "scholarship odds calculator",
    "scholarship chances",
    "scholarship probability",
    "scholarship calculator",
    "merit scholarship odds",
  ],
  variants: [
    {
      id: "single",
      name: "Single Scholarship",
      description: "Estimate your odds of winning a specific scholarship",
      fields: [
        { name: "applicants", label: "Estimated Number of Applicants", type: "number", placeholder: "e.g. 500", min: 1 },
        { name: "awards", label: "Number of Awards Given", type: "number", placeholder: "e.g. 5", min: 1 },
        { name: "gpa", label: "Your GPA (0-4.0)", type: "number", placeholder: "e.g. 3.7", min: 0, max: 4, step: 0.01 },
        { name: "minGPA", label: "Minimum GPA Required", type: "number", placeholder: "e.g. 3.0", min: 0, max: 4, step: 0.01, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const applicants = inputs.applicants as number;
        const awards = inputs.awards as number;
        const gpa = inputs.gpa as number;
        const minGPA = (inputs.minGPA as number) || 0;
        if (!applicants || !awards || gpa === undefined) return null;

        const baseOdds = (awards / applicants) * 100;
        // GPA bonus: higher GPA relative to min improves odds
        const gpaRange = 4.0 - minGPA;
        const gpaPosition = gpaRange > 0 ? (gpa - minGPA) / gpaRange : 0.5;
        const gpaMultiplier = 0.5 + gpaPosition * 1.5; // 0.5x to 2x
        const adjustedOdds = Math.min(95, baseOdds * gpaMultiplier);

        let assessment: string;
        if (adjustedOdds >= 20) assessment = "Strong chance - apply!";
        else if (adjustedOdds >= 10) assessment = "Decent odds - worth applying";
        else if (adjustedOdds >= 5) assessment = "Competitive - prepare strong application";
        else assessment = "Long shot - apply to many scholarships";

        return {
          primary: { label: "Estimated Odds", value: `${formatNumber(adjustedOdds, 1)}%` },
          details: [
            { label: "Assessment", value: assessment },
            { label: "Base odds (random)", value: `${formatNumber(baseOdds, 1)}%` },
            { label: "GPA competitiveness", value: `${formatNumber(gpaPosition * 100, 0)}th percentile (est.)` },
            { label: "Award ratio", value: `${awards} of ${applicants} applicants` },
          ],
        };
      },
    },
    {
      id: "multiple",
      name: "Multiple Applications",
      description: "Calculate odds of winning at least one scholarship when applying to several",
      fields: [
        { name: "numApplications", label: "Number of Scholarships to Apply", type: "number", placeholder: "e.g. 10", min: 1, max: 100 },
        { name: "avgOdds", label: "Average Odds per Scholarship (%)", type: "number", placeholder: "e.g. 5", min: 0.1, max: 100, step: 0.1 },
        { name: "hoursPerApp", label: "Hours per Application", type: "number", placeholder: "e.g. 3", min: 0.5, max: 20, step: 0.5 },
        { name: "avgAward", label: "Average Award Amount ($)", type: "number", placeholder: "e.g. 2000", min: 0 },
      ],
      calculate: (inputs) => {
        const apps = inputs.numApplications as number;
        const avgOdds = inputs.avgOdds as number;
        const hours = (inputs.hoursPerApp as number) || 3;
        const award = (inputs.avgAward as number) || 0;
        if (!apps || !avgOdds) return null;

        const probNone = Math.pow(1 - avgOdds / 100, apps);
        const probAtLeastOne = (1 - probNone) * 100;
        const expectedWins = apps * (avgOdds / 100);
        const expectedValue = expectedWins * award;
        const totalHours = apps * hours;
        const dollarPerHour = totalHours > 0 ? expectedValue / totalHours : 0;

        return {
          primary: { label: "Chance of Winning At Least One", value: `${formatNumber(probAtLeastOne, 1)}%` },
          details: [
            { label: "Expected scholarships won", value: formatNumber(expectedWins, 1) },
            { label: "Expected total value", value: `$${formatNumber(expectedValue, 0)}` },
            { label: "Total time investment", value: `${formatNumber(totalHours, 0)} hours` },
            { label: "Expected $/hour of effort", value: `$${formatNumber(dollarPerHour, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["college-acceptance-calculator", "financial-aid-estimate-calculator"],
  faq: [
    {
      question: "How many scholarships should I apply to?",
      answer:
        "Apply to as many as you qualify for. Experts recommend at least 10-20 applications. The more you apply, the higher your cumulative chances of winning at least one.",
    },
    {
      question: "What improves scholarship odds?",
      answer:
        "Strong GPA, extracurriculars, compelling essays, letters of recommendation, and targeting scholarships where you closely match the criteria all improve your chances significantly.",
    },
  ],
  formula: "P(at least one win) = 1 - (1 - odds)^applications",
};

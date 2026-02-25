import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeAcceptanceCalculator: CalculatorDefinition = {
  slug: "college-acceptance-calculator",
  title: "College Acceptance Rate",
  description:
    "Free college acceptance rate calculator. Estimate your chances of admission based on GPA, test scores, and school acceptance rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "college acceptance calculator",
    "admission chances",
    "college admission calculator",
    "acceptance rate calculator",
    "college probability",
  ],
  variants: [
    {
      id: "single",
      name: "Single School Estimate",
      description: "Estimate your admission chances for a specific school",
      fields: [
        { name: "acceptanceRate", label: "School Acceptance Rate (%)", type: "number", placeholder: "e.g. 25", min: 0.1, max: 100, step: 0.1 },
        { name: "gpa", label: "Your GPA (0-4.0)", type: "number", placeholder: "e.g. 3.8", min: 0, max: 4, step: 0.01 },
        { name: "satScore", label: "SAT Score (400-1600)", type: "number", placeholder: "e.g. 1350", min: 400, max: 1600, step: 10 },
        { name: "schoolAvgSAT", label: "School's Avg Admitted SAT", type: "number", placeholder: "e.g. 1400", min: 400, max: 1600, step: 10 },
      ],
      calculate: (inputs) => {
        const rate = inputs.acceptanceRate as number;
        const gpa = inputs.gpa as number;
        const sat = inputs.satScore as number;
        const avgSAT = inputs.schoolAvgSAT as number;
        if (!rate || gpa === undefined || !sat || !avgSAT) return null;

        // Adjust base rate by academic profile
        const gpaFactor = gpa >= 3.8 ? 1.3 : gpa >= 3.5 ? 1.1 : gpa >= 3.0 ? 0.9 : 0.6;
        const satDiff = sat - avgSAT;
        const satFactor = satDiff >= 100 ? 1.3 : satDiff >= 0 ? 1.1 : satDiff >= -100 ? 0.9 : 0.6;

        const adjustedChance = Math.min(95, Math.max(1, rate * gpaFactor * satFactor));

        let classification: string;
        if (adjustedChance >= rate * 1.5) classification = "Reach is realistic";
        else if (adjustedChance >= rate * 0.8) classification = "Target school";
        else classification = "Reach school";

        let tier: string;
        if (rate < 10) tier = "Most selective";
        else if (rate < 25) tier = "Highly selective";
        else if (rate < 50) tier = "Selective";
        else tier = "Less selective";

        return {
          primary: { label: "Estimated Admission Chance", value: `${formatNumber(adjustedChance, 1)}%` },
          details: [
            { label: "School classification", value: classification },
            { label: "Selectivity tier", value: tier },
            { label: "Base acceptance rate", value: `${formatNumber(rate, 1)}%` },
            { label: "SAT vs school average", value: `${satDiff >= 0 ? "+" : ""}${formatNumber(satDiff, 0)} points` },
          ],
        };
      },
    },
    {
      id: "portfolio",
      name: "Application Portfolio",
      description: "Calculate odds of getting into at least one school from your application list",
      fields: [
        { name: "safetySchools", label: "Safety Schools (acceptance 60%+)", type: "number", placeholder: "e.g. 2", min: 0, max: 10 },
        { name: "targetSchools", label: "Target Schools (acceptance 30-60%)", type: "number", placeholder: "e.g. 4", min: 0, max: 10 },
        { name: "reachSchools", label: "Reach Schools (acceptance <30%)", type: "number", placeholder: "e.g. 3", min: 0, max: 10 },
        { name: "avgChance", label: "Your Avg Estimated Chance (%)", type: "number", placeholder: "e.g. 40", min: 1, max: 100 },
      ],
      calculate: (inputs) => {
        const safety = (inputs.safetySchools as number) || 0;
        const target = (inputs.targetSchools as number) || 0;
        const reach = (inputs.reachSchools as number) || 0;
        const avgChance = inputs.avgChance as number;
        if (!avgChance) return null;

        const totalApps = safety + target + reach;
        if (totalApps === 0) return null;

        // Estimate odds by category
        const safetyChance = Math.min(95, avgChance * 1.5);
        const targetChance = avgChance;
        const reachChance = Math.max(5, avgChance * 0.4);

        const probNoSafety = Math.pow(1 - safetyChance / 100, safety);
        const probNoTarget = Math.pow(1 - targetChance / 100, target);
        const probNoReach = Math.pow(1 - reachChance / 100, reach);

        const probNone = probNoSafety * probNoTarget * probNoReach;
        const probAtLeastOne = (1 - probNone) * 100;

        let assessment: string;
        if (probAtLeastOne >= 99) assessment = "Almost certain";
        else if (probAtLeastOne >= 90) assessment = "Very likely";
        else if (probAtLeastOne >= 70) assessment = "Likely";
        else assessment = "Add more safety schools";

        return {
          primary: { label: "Chance of At Least One Admission", value: `${formatNumber(probAtLeastOne, 1)}%` },
          details: [
            { label: "Assessment", value: assessment },
            { label: "Total applications", value: formatNumber(totalApps, 0) },
            { label: "Safety / Target / Reach", value: `${safety} / ${target} / ${reach}` },
            { label: "Recommended split", value: "2+ safety, 3-4 target, 2-3 reach" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sat-score-calculator", "gpa-calculator"],
  faq: [
    {
      question: "How many colleges should I apply to?",
      answer:
        "Most counselors recommend 6-10 schools: 2-3 safety schools, 3-4 target schools, and 2-3 reach schools. This provides a good balance of options.",
    },
    {
      question: "Does a higher GPA guarantee admission?",
      answer:
        "No. Selective colleges use holistic admissions considering essays, extracurriculars, recommendations, and other factors. A high GPA and test scores improve odds but don't guarantee admission.",
    },
  ],
  formula: "Adjusted Chance = Base Rate x GPA Factor x SAT Factor",
};

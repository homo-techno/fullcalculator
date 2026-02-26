import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const agilityTestCalculator: CalculatorDefinition = {
  slug: "agility-test-calculator",
  title: "Agility Test Scoring Calculator",
  description: "Free agility test scoring calculator. Score your T-test, 5-10-5 shuttle, pro agility, and Illinois agility test results against normative data.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["agility test calculator", "t-test agility", "5-10-5 shuttle", "pro agility", "illinois agility test"],
  variants: [
    {
      id: "ttest",
      name: "T-Test",
      description: "Score your T-test agility time",
      fields: [
        { name: "time", label: "T-Test Time (seconds)", type: "number", placeholder: "e.g. 10.5", min: 5, max: 20, step: 0.01 },
        { name: "sex", label: "Sex", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ] },
        { name: "level", label: "Competition Level", type: "select", options: [
          { label: "Recreational", value: "recreational" },
          { label: "High School", value: "highschool" },
          { label: "College", value: "college" },
          { label: "Professional", value: "pro" },
        ], defaultValue: "college" },
      ],
      calculate: (inputs) => {
        const time = parseFloat(inputs.time as string);
        const sex = inputs.sex as string;
        const level = inputs.level as string;
        if (isNaN(time)) return null;

        const maleNorms = { excellent: 9.5, good: 10.5, average: 11.5, below: 12.5 };
        const femaleNorms = { excellent: 10.5, good: 11.5, average: 12.5, below: 13.5 };
        const norms = sex === "male" ? maleNorms : femaleNorms;

        let rating = "Poor";
        if (time <= norms.excellent) rating = "Excellent";
        else if (time <= norms.good) rating = "Good";
        else if (time <= norms.average) rating = "Average";
        else if (time <= norms.below) rating = "Below Average";

        const percentile = Math.max(0, Math.min(100, 100 - ((time - norms.excellent) / (norms.below - norms.excellent + 2)) * 100));

        return {
          primary: { label: "T-Test Rating", value: rating },
          details: [
            { label: "Time", value: `${formatNumber(time, 2)} sec` },
            { label: "Approx. Percentile", value: `${formatNumber(percentile, 0)}th` },
            { label: "Excellent Cutoff", value: `< ${formatNumber(norms.excellent, 1)} sec` },
            { label: "Good Cutoff", value: `< ${formatNumber(norms.good, 1)} sec` },
            { label: "Average Cutoff", value: `< ${formatNumber(norms.average, 1)} sec` },
            { label: "Test Distance", value: "40 yards total (T-shape pattern)" },
          ],
        };
      },
    },
    {
      id: "pro-agility",
      name: "5-10-5 Pro Agility",
      description: "Score your pro agility shuttle time",
      fields: [
        { name: "time", label: "5-10-5 Time (seconds)", type: "number", placeholder: "e.g. 4.5", min: 3, max: 8, step: 0.01 },
        { name: "sex", label: "Sex", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ] },
        { name: "sport", label: "Sport Context", type: "select", options: [
          { label: "Football", value: "football" },
          { label: "Basketball", value: "basketball" },
          { label: "Soccer", value: "soccer" },
          { label: "General Fitness", value: "general" },
        ], defaultValue: "general" },
      ],
      calculate: (inputs) => {
        const time = parseFloat(inputs.time as string);
        const sex = inputs.sex as string;
        if (isNaN(time)) return null;

        const maleNorms = { elite: 4.0, excellent: 4.2, good: 4.4, average: 4.7, below: 5.0 };
        const femaleNorms = { elite: 4.5, excellent: 4.7, good: 4.9, average: 5.2, below: 5.5 };
        const norms = sex === "male" ? maleNorms : femaleNorms;

        let rating = "Needs Improvement";
        if (time <= norms.elite) rating = "Elite";
        else if (time <= norms.excellent) rating = "Excellent";
        else if (time <= norms.good) rating = "Good";
        else if (time <= norms.average) rating = "Average";
        else if (time <= norms.below) rating = "Below Average";

        return {
          primary: { label: "Pro Agility Rating", value: rating },
          details: [
            { label: "Time", value: `${formatNumber(time, 2)} sec` },
            { label: "Elite Cutoff", value: `< ${formatNumber(norms.elite, 1)} sec` },
            { label: "Excellent Cutoff", value: `< ${formatNumber(norms.excellent, 1)} sec` },
            { label: "Good Cutoff", value: `< ${formatNumber(norms.good, 1)} sec` },
            { label: "Average Cutoff", value: `< ${formatNumber(norms.average, 1)} sec` },
            { label: "Test Pattern", value: "5 yds right, 10 yds left, 5 yds right" },
          ],
        };
      },
    },
    {
      id: "illinois",
      name: "Illinois Agility Test",
      description: "Score your Illinois agility test time",
      fields: [
        { name: "time", label: "Illinois Test Time (seconds)", type: "number", placeholder: "e.g. 17.0", min: 10, max: 30, step: 0.01 },
        { name: "sex", label: "Sex", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ] },
      ],
      calculate: (inputs) => {
        const time = parseFloat(inputs.time as string);
        const sex = inputs.sex as string;
        if (isNaN(time)) return null;

        const maleNorms = { excellent: 15.2, good: 16.1, average: 18.1, below: 19.3 };
        const femaleNorms = { excellent: 17.0, good: 17.9, average: 21.7, below: 23.0 };
        const norms = sex === "male" ? maleNorms : femaleNorms;

        let rating = "Poor";
        if (time <= norms.excellent) rating = "Excellent";
        else if (time <= norms.good) rating = "Above Average";
        else if (time <= norms.average) rating = "Average";
        else if (time <= norms.below) rating = "Below Average";

        return {
          primary: { label: "Illinois Test Rating", value: rating },
          details: [
            { label: "Time", value: `${formatNumber(time, 2)} sec` },
            { label: "Excellent", value: `< ${formatNumber(norms.excellent, 1)} sec` },
            { label: "Above Average", value: `< ${formatNumber(norms.good, 1)} sec` },
            { label: "Average", value: `< ${formatNumber(norms.average, 1)} sec` },
            { label: "Course Length", value: "10m x 5m with 4 cones to weave" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["training-load-calculator", "heart-rate-calculator", "pace-calculator"],
  faq: [
    { question: "What is the T-test agility test?", answer: "The T-test measures agility through a T-shaped course requiring forward sprinting, lateral shuffling, and backpedaling. Athletes sprint 10 yards forward, shuffle 5 yards left, 10 yards right, 5 yards back to center, then backpedal to start." },
    { question: "How do I improve agility test scores?", answer: "Practice change-of-direction drills, lateral movements, and deceleration. Strengthen legs with squats and lunges. Work on hip mobility. Improve reaction time with sport-specific drills. Most athletes can improve 5-10% with 6-8 weeks of focused training." },
  ],
  formula: "Scores are compared against published normative data tables for sex and competition level. Percentiles estimated from standard deviation models.",
};

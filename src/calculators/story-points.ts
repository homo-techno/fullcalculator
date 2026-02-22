import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const storyPointsCalculator: CalculatorDefinition = {
  slug: "story-points-calculator",
  title: "Story Points Estimator Calculator",
  description: "Free story points estimator calculator. Estimate story points based on complexity, effort, and uncertainty for Agile teams.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["story points calculator", "story point estimator", "agile estimation", "scrum estimation", "fibonacci points calculator"],
  variants: [
    {
      id: "estimate",
      name: "Story Point Estimator",
      description: "Estimate story points from factors",
      fields: [
        { name: "complexity", label: "Complexity", type: "select", options: [
          { label: "Very Low (1)", value: "1" },
          { label: "Low (2)", value: "2" },
          { label: "Medium (3)", value: "3" },
          { label: "High (5)", value: "5" },
          { label: "Very High (8)", value: "8" },
        ], defaultValue: "3" },
        { name: "effort", label: "Effort Required", type: "select", options: [
          { label: "Minimal (1)", value: "1" },
          { label: "Small (2)", value: "2" },
          { label: "Medium (3)", value: "3" },
          { label: "Large (5)", value: "5" },
          { label: "Very Large (8)", value: "8" },
        ], defaultValue: "3" },
        { name: "uncertainty", label: "Uncertainty / Risk", type: "select", options: [
          { label: "Very Low (1)", value: "1" },
          { label: "Low (2)", value: "2" },
          { label: "Medium (3)", value: "3" },
          { label: "High (5)", value: "5" },
          { label: "Very High (8)", value: "8" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const complexity = parseInt(inputs.complexity as string) || 3;
        const effort = parseInt(inputs.effort as string) || 3;
        const uncertainty = parseInt(inputs.uncertainty as string) || 3;

        const rawScore = (complexity + effort + uncertainty) / 3;
        const fibonacci = [1, 2, 3, 5, 8, 13, 21];
        const storyPoints = fibonacci.reduce((prev, curr) =>
          Math.abs(curr - rawScore) < Math.abs(prev - rawScore) ? curr : prev
        );

        return {
          primary: { label: "Recommended Story Points", value: `${storyPoints}` },
          details: [
            { label: "Raw average score", value: formatNumber(rawScore, 1) },
            { label: "Nearest Fibonacci", value: `${storyPoints}` },
            { label: "Complexity factor", value: `${complexity}` },
            { label: "Effort factor", value: `${effort}` },
            { label: "Uncertainty factor", value: `${uncertainty}` },
          ],
          note: "Story points use the Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21. The recommended value is the nearest Fibonacci number to the average of your three factors.",
        };
      },
    },
    {
      id: "hours",
      name: "Points to Hours",
      description: "Convert story points to estimated hours",
      fields: [
        { name: "storyPoints", label: "Story Points", type: "number", placeholder: "e.g. 8" },
        { name: "hoursPerPoint", label: "Hours per Story Point", type: "number", placeholder: "e.g. 4", suffix: "hours", defaultValue: 4 },
        { name: "teamSize", label: "Team Members", type: "number", placeholder: "e.g. 3", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const points = inputs.storyPoints as number;
        const hpp = (inputs.hoursPerPoint as number) || 4;
        const team = (inputs.teamSize as number) || 1;
        if (!points) return null;

        const totalHours = points * hpp;
        const hoursPerPerson = totalHours / team;
        const daysPerPerson = hoursPerPerson / 6;

        return {
          primary: { label: "Estimated Total Hours", value: `${formatNumber(totalHours)}` },
          details: [
            { label: "Hours per person", value: formatNumber(hoursPerPerson, 1) },
            { label: "Days per person (6hr/day)", value: formatNumber(daysPerPerson, 1) },
            { label: "Person-days total", value: formatNumber(totalHours / 6, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sprint-velocity-calculator", "date-calculator", "average-calculator"],
  faq: [
    { question: "What are story points?", answer: "Story points are a unit of measure used in Agile to estimate the overall effort required to implement a product backlog item. They combine complexity, effort, and uncertainty rather than pure time estimates." },
    { question: "Why use Fibonacci numbers for story points?", answer: "Fibonacci numbers (1, 2, 3, 5, 8, 13, 21) are used because larger tasks have inherently more uncertainty. The increasing gaps between numbers reflect that it is harder to precisely estimate large items, encouraging teams to break them down." },
  ],
  formula: "Story Points = nearest Fibonacci to avg(Complexity, Effort, Uncertainty) | Hours = Points x Hours per Point",
};

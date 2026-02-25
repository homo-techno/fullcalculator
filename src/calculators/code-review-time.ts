import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const codeReviewTimeCalculator: CalculatorDefinition = {
  slug: "code-review-time-estimator",
  title: "Code Review Time Estimator",
  description: "Free code review time estimator. Calculate how long code reviews should take based on lines changed, complexity, and reviewer experience.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["code review time", "code review calculator", "pull request time", "review time estimator", "code review effort"],
  variants: [
    {
      id: "review-time",
      name: "Review Time Estimate",
      description: "Estimate time needed to review a pull request",
      fields: [
        { name: "linesChanged", label: "Lines Changed (added + modified)", type: "number", placeholder: "e.g. 300", min: 1 },
        { name: "complexity", label: "Code Complexity", type: "select", options: [
          { label: "Low (config, simple logic)", value: "0.5" },
          { label: "Medium (business logic)", value: "1" },
          { label: "High (algorithms, concurrency)", value: "2" },
          { label: "Very High (security, crypto)", value: "3" },
        ], defaultValue: "1" },
        { name: "familiarity", label: "Reviewer Familiarity", type: "select", options: [
          { label: "Expert (owns the code)", value: "0.7" },
          { label: "Familiar (regular contributor)", value: "1" },
          { label: "Somewhat familiar", value: "1.5" },
          { label: "Unfamiliar (new to codebase)", value: "2" },
        ], defaultValue: "1" },
        { name: "filesChanged", label: "Files Changed", type: "number", placeholder: "e.g. 8", min: 1, defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const linesChanged = inputs.linesChanged as number;
        const complexity = parseFloat(inputs.complexity as string) || 1;
        const familiarity = parseFloat(inputs.familiarity as string) || 1;
        const filesChanged = (inputs.filesChanged as number) || 1;
        if (!linesChanged) return null;

        // Base rate: ~200 lines per hour for medium complexity
        const baseLinesPerHour = 200;
        const effectiveRate = baseLinesPerHour / (complexity * familiarity);
        const reviewHours = linesChanged / effectiveRate;
        const reviewMinutes = reviewHours * 60;

        // Context switching overhead per file (2-3 min per file)
        const contextSwitchMin = filesChanged * 2.5;
        const totalMinutes = reviewMinutes + contextSwitchMin;
        const totalHours = totalMinutes / 60;

        // Quality metrics
        let sizeCategory = "";
        if (linesChanged <= 50) sizeCategory = "Small (ideal)";
        else if (linesChanged <= 200) sizeCategory = "Medium (good)";
        else if (linesChanged <= 400) sizeCategory = "Large (consider splitting)";
        else sizeCategory = "Very Large (should be split)";

        // Defect detection effectiveness decreases with size
        let effectiveness = "";
        if (linesChanged <= 200) effectiveness = "~60-70% (optimal)";
        else if (linesChanged <= 400) effectiveness = "~40-50% (declining)";
        else effectiveness = "~20-30% (fatigue sets in)";

        // Recommended review sessions
        const sessions = Math.ceil(totalMinutes / 60); // Max 60 min per session

        return {
          primary: { label: "Estimated Review Time", value: totalHours >= 1 ? `${formatNumber(totalHours, 1)} hours` : `${formatNumber(totalMinutes, 0)} minutes` },
          details: [
            { label: "Lines Changed", value: formatNumber(linesChanged, 0) },
            { label: "Files Changed", value: formatNumber(filesChanged, 0) },
            { label: "PR Size Category", value: sizeCategory },
            { label: "Review Rate", value: `${formatNumber(effectiveRate, 0)} lines/hour` },
            { label: "Code Review Time", value: `${formatNumber(reviewMinutes, 0)} min` },
            { label: "Context Switching", value: `${formatNumber(contextSwitchMin, 0)} min` },
            { label: "Total Review Time", value: `${formatNumber(totalMinutes, 0)} min` },
            { label: "Recommended Sessions", value: `${sessions} (max 60 min each)` },
            { label: "Defect Detection Effectiveness", value: effectiveness },
          ],
        };
      },
    },
    {
      id: "team-review-load",
      name: "Team Review Load",
      description: "Calculate weekly review workload for a team",
      fields: [
        { name: "prsPerWeek", label: "PRs per Week (team)", type: "number", placeholder: "e.g. 20", min: 1 },
        { name: "avgLinesPerPR", label: "Avg Lines per PR", type: "number", placeholder: "e.g. 200", min: 1, defaultValue: 200 },
        { name: "reviewersPerPR", label: "Reviewers per PR", type: "number", placeholder: "e.g. 2", min: 1, defaultValue: 2 },
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 6", min: 1 },
      ],
      calculate: (inputs) => {
        const prsPerWeek = inputs.prsPerWeek as number;
        const avgLinesPerPR = (inputs.avgLinesPerPR as number) || 200;
        const reviewersPerPR = (inputs.reviewersPerPR as number) || 2;
        const teamSize = inputs.teamSize as number;
        if (!prsPerWeek || !teamSize) return null;

        const avgReviewMinutes = (avgLinesPerPR / 200) * 60 + 10; // base rate + overhead
        const totalReviewHours = (prsPerWeek * reviewersPerPR * avgReviewMinutes) / 60;
        const hoursPerDevPerWeek = totalReviewHours / teamSize;
        const percentOfWeek = (hoursPerDevPerWeek / 40) * 100;
        const prsPerDevPerWeek = (prsPerWeek * reviewersPerPR) / teamSize;

        return {
          primary: { label: "Review Time per Dev/Week", value: `${formatNumber(hoursPerDevPerWeek, 1)} hours (${formatNumber(percentOfWeek, 1)}%)` },
          details: [
            { label: "PRs per Week", value: formatNumber(prsPerWeek, 0) },
            { label: "Avg Lines per PR", value: formatNumber(avgLinesPerPR, 0) },
            { label: "Reviewers per PR", value: formatNumber(reviewersPerPR, 0) },
            { label: "Avg Review Time per PR", value: `${formatNumber(avgReviewMinutes, 0)} min` },
            { label: "Total Team Review Hours/Week", value: formatNumber(totalReviewHours, 1) },
            { label: "Hours per Dev per Week", value: formatNumber(hoursPerDevPerWeek, 1) },
            { label: "PRs per Dev per Week", value: formatNumber(prsPerDevPerWeek, 1) },
            { label: "% of Work Week in Reviews", value: `${formatNumber(percentOfWeek, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sprint-capacity-calculator", "function-point-calculator", "cloud-cost-calculator"],
  faq: [
    { question: "How long should a code review take?", answer: "Research from SmartBear suggests reviewing no more than 200-400 lines per hour for effective defect detection. Reviews longer than 60 minutes show diminishing returns. Ideal PR size is under 200 lines. For a 200-line PR, expect 30-60 minutes depending on complexity." },
    { question: "What is the optimal PR size?", answer: "Studies show PRs under 200 lines have the highest defect detection rate (60-70%). PRs over 400 lines see detection drop to 20-30% as reviewer fatigue sets in. Google recommends PRs under 100 lines. Split large changes into focused, reviewable chunks." },
  ],
  formula: "Review Time = Lines / (Base Rate / Complexity / Familiarity) + Context Switch Overhead",
};

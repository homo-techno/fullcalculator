import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marinePftCalculator: CalculatorDefinition = {
  slug: "marine-pft-calculator",
  title: "Marine PFT Score Calculator",
  description:
    "Free Marine Corps Physical Fitness Test (PFT) score calculator. Calculate your PFT score for pull-ups/push-ups, crunches/plank, and 3-mile run.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "marine pft calculator",
    "marine corps fitness test",
    "usmc pft score",
    "marine pull-ups score",
    "military fitness test",
  ],
  variants: [
    {
      id: "male",
      name: "Male PFT",
      description: "Marine Corps PFT scoring for males",
      fields: [
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "17-20", value: "17" },
            { label: "21-25", value: "21" },
            { label: "26-30", value: "26" },
            { label: "31-35", value: "31" },
            { label: "36-40", value: "36" },
            { label: "41-45", value: "41" },
            { label: "46-50", value: "46" },
            { label: "51+", value: "51" },
          ],
        },
        {
          name: "upperEvent",
          label: "Upper Body Event",
          type: "select",
          options: [
            { label: "Pull-Ups", value: "pullups" },
            { label: "Push-Ups", value: "pushups" },
          ],
          defaultValue: "pullups",
        },
        { name: "upperReps", label: "Reps Completed", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "plankMin", label: "Plank Hold (minutes)", type: "number", placeholder: "e.g. 3", min: 0 },
        { name: "plankSec", label: "Plank Hold (seconds)", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "runMin", label: "3-Mile Run (minutes)", type: "number", placeholder: "e.g. 22", min: 0 },
        { name: "runSec", label: "3-Mile Run (seconds)", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const upperEvent = inputs.upperEvent as string;
        const upperReps = (inputs.upperReps as number) || 0;
        const plankMin = (inputs.plankMin as number) || 0;
        const plankSec = (inputs.plankSec as number) || 0;
        const runMin = (inputs.runMin as number) || 0;
        const runSec = (inputs.runSec as number) || 0;

        if (!upperReps && !plankMin && !runMin) return null;

        // Simplified PFT scoring (max 100 per event, 300 total)
        let upperScore = 0;
        if (upperEvent === "pullups") {
          // Max 100 at 23 pull-ups, min 40 at 4 pull-ups (male)
          if (upperReps >= 23) upperScore = 100;
          else if (upperReps >= 4) upperScore = 40 + ((upperReps - 4) / 19) * 60;
          else upperScore = 0;
        } else {
          // Push-ups: max 70 at 82 reps, min at 40 reps (male) - capped at 70
          if (upperReps >= 82) upperScore = 70;
          else if (upperReps >= 40) upperScore = 40 + ((upperReps - 40) / 42) * 30;
          else upperScore = 0;
        }

        // Plank: max 100 at 4:20 (260s), min at 1:03 (63s) for male
        const plankTotalSec = plankMin * 60 + plankSec;
        let plankScore = 0;
        if (plankTotalSec >= 260) plankScore = 100;
        else if (plankTotalSec >= 63) plankScore = 40 + ((plankTotalSec - 63) / 197) * 60;

        // Run: max 100 at 18:00 (1080s), min at 27:40 (1660s) for male
        const runTotalSec = runMin * 60 + runSec;
        let runScore = 0;
        if (runTotalSec > 0) {
          if (runTotalSec <= 1080) runScore = 100;
          else if (runTotalSec <= 1660) runScore = 40 + ((1660 - runTotalSec) / 580) * 60;
        }

        const totalScore = upperScore + plankScore + runScore;

        let pftClass = "Not Classified";
        if (totalScore >= 285) pftClass = "1st Class";
        else if (totalScore >= 235) pftClass = "2nd Class";
        else if (totalScore >= 150) pftClass = "3rd Class";
        else pftClass = "Below Minimum";

        return {
          primary: { label: "PFT Score", value: formatNumber(totalScore, 0), suffix: "/ 300" },
          details: [
            { label: `${upperEvent === "pullups" ? "Pull-Up" : "Push-Up"} Score`, value: `${formatNumber(upperScore, 0)} / 100` },
            { label: "Plank Score", value: `${formatNumber(plankScore, 0)} / 100` },
            { label: "3-Mile Run Score", value: `${formatNumber(runScore, 0)} / 100` },
            { label: "PFT Class", value: pftClass },
          ],
          note: "Note: Push-ups are capped at 70 points max. Pull-ups can earn up to 100 points. Plank has replaced crunches as the core event.",
        };
      },
    },
    {
      id: "female",
      name: "Female PFT",
      description: "Marine Corps PFT scoring for females",
      fields: [
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "17-20", value: "17" },
            { label: "21-25", value: "21" },
            { label: "26-30", value: "26" },
            { label: "31-35", value: "31" },
            { label: "36-40", value: "36" },
            { label: "41-45", value: "41" },
            { label: "46-50", value: "46" },
            { label: "51+", value: "51" },
          ],
        },
        {
          name: "upperEvent",
          label: "Upper Body Event",
          type: "select",
          options: [
            { label: "Pull-Ups", value: "pullups" },
            { label: "Push-Ups", value: "pushups" },
          ],
          defaultValue: "pullups",
        },
        { name: "upperReps", label: "Reps Completed", type: "number", placeholder: "e.g. 8", min: 0 },
        { name: "plankMin", label: "Plank Hold (minutes)", type: "number", placeholder: "e.g. 3", min: 0 },
        { name: "plankSec", label: "Plank Hold (seconds)", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "runMin", label: "3-Mile Run (minutes)", type: "number", placeholder: "e.g. 25", min: 0 },
        { name: "runSec", label: "3-Mile Run (seconds)", type: "number", placeholder: "e.g. 0", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const upperEvent = inputs.upperEvent as string;
        const upperReps = (inputs.upperReps as number) || 0;
        const plankMin = (inputs.plankMin as number) || 0;
        const plankSec = (inputs.plankSec as number) || 0;
        const runMin = (inputs.runMin as number) || 0;
        const runSec = (inputs.runSec as number) || 0;

        if (!upperReps && !plankMin && !runMin) return null;

        let upperScore = 0;
        if (upperEvent === "pullups") {
          // Max 100 at 12 pull-ups, min 40 at 1 pull-up (female)
          if (upperReps >= 12) upperScore = 100;
          else if (upperReps >= 1) upperScore = 40 + ((upperReps - 1) / 11) * 60;
          else upperScore = 0;
        } else {
          if (upperReps >= 50) upperScore = 70;
          else if (upperReps >= 18) upperScore = 40 + ((upperReps - 18) / 32) * 30;
          else upperScore = 0;
        }

        const plankTotalSec = plankMin * 60 + plankSec;
        let plankScore = 0;
        if (plankTotalSec >= 260) plankScore = 100;
        else if (plankTotalSec >= 63) plankScore = 40 + ((plankTotalSec - 63) / 197) * 60;

        const runTotalSec = runMin * 60 + runSec;
        let runScore = 0;
        if (runTotalSec > 0) {
          if (runTotalSec <= 1260) runScore = 100;
          else if (runTotalSec <= 1800) runScore = 40 + ((1800 - runTotalSec) / 540) * 60;
        }

        const totalScore = upperScore + plankScore + runScore;

        let pftClass = "Not Classified";
        if (totalScore >= 285) pftClass = "1st Class";
        else if (totalScore >= 235) pftClass = "2nd Class";
        else if (totalScore >= 150) pftClass = "3rd Class";
        else pftClass = "Below Minimum";

        return {
          primary: { label: "PFT Score", value: formatNumber(totalScore, 0), suffix: "/ 300" },
          details: [
            { label: `${upperEvent === "pullups" ? "Pull-Up" : "Push-Up"} Score`, value: `${formatNumber(upperScore, 0)} / 100` },
            { label: "Plank Score", value: `${formatNumber(plankScore, 0)} / 100` },
            { label: "3-Mile Run Score", value: `${formatNumber(runScore, 0)} / 100` },
            { label: "PFT Class", value: pftClass },
          ],
          note: "Note: Push-ups are capped at 70 points max. Pull-ups can earn up to 100 points. Plank has replaced crunches as the core event.",
        };
      },
    },
  ],
  relatedSlugs: ["army-pt-score-calculator", "push-up-test-calculator", "plank-time-calculator"],
  faq: [
    {
      question: "What are the Marine PFT events?",
      answer:
        "The Marine Corps PFT consists of three events: (1) Pull-ups or push-ups (upper body), (2) Plank hold (core, replaced crunches), and (3) 3-mile run (cardio). Each event is scored up to 100 points for a maximum total of 300.",
    },
    {
      question: "What is a 1st Class PFT score?",
      answer:
        "A 1st Class PFT score requires 285 or more points out of 300. Second Class is 235-284 points. Third Class (minimum passing) is 150-234 points.",
    },
    {
      question: "Why are push-ups capped at 70 points?",
      answer:
        "Push-ups are the alternative to pull-ups and are capped at 70 points to incentivize Marines to perform pull-ups instead, which can earn up to 100 points. This encourages upper body pulling strength.",
    },
  ],
  formula: "Total PFT Score = Upper Body Score + Plank Score + Run Score (max 100 each, 300 total)",
};

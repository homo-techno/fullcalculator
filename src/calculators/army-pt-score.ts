import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const armyPtScoreCalculator: CalculatorDefinition = {
  slug: "army-pt-score-calculator",
  title: "Army PFT Score Calculator",
  description:
    "Free Army Physical Fitness Test (APFT) score calculator. Calculate your APFT score based on push-ups, sit-ups, and 2-mile run time by age and gender.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "army pft score",
    "apft calculator",
    "army fitness test",
    "army pt test score",
    "military fitness calculator",
  ],
  variants: [
    {
      id: "apft",
      name: "APFT Score Calculator",
      description: "Calculate your Army Physical Fitness Test score (legacy 3-event)",
      fields: [
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "17-21", value: "17" },
            { label: "22-26", value: "22" },
            { label: "27-31", value: "27" },
            { label: "32-36", value: "32" },
            { label: "37-41", value: "37" },
            { label: "42-46", value: "42" },
            { label: "47-51", value: "47" },
            { label: "52-56", value: "52" },
          ],
        },
        { name: "pushups", label: "Push-Ups (reps)", type: "number", placeholder: "e.g. 50", min: 0 },
        { name: "situps", label: "Sit-Ups (reps)", type: "number", placeholder: "e.g. 55", min: 0 },
        { name: "runMin", label: "2-Mile Run (minutes)", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "runSec", label: "2-Mile Run (seconds)", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const ageGroup = parseInt(inputs.ageGroup as string);
        const pushups = (inputs.pushups as number) || 0;
        const situps = (inputs.situps as number) || 0;
        const runMin = (inputs.runMin as number) || 0;
        const runSec = (inputs.runSec as number) || 0;

        if (!pushups && !situps && !runMin) return null;

        // Simplified scoring model based on APFT standards
        // 100 points max per event, 300 total
        // Using approximate linear interpolation for the 17-21 male age group as baseline

        // Min/max values for 100 points and 60 points (passing)
        const standards: Record<string, Record<number, { pu: number[]; su: number[]; run: number[] }>> = {
          male: {
            17: { pu: [42, 71], su: [53, 78], run: [15.54 * 60, 13.00 * 60] },
            22: { pu: [40, 75], su: [50, 80], run: [16.36 * 60, 13.00 * 60] },
            27: { pu: [39, 77], su: [50, 82], run: [16.36 * 60, 13.18 * 60] },
            32: { pu: [36, 75], su: [47, 80], run: [16.54 * 60, 13.18 * 60] },
            37: { pu: [34, 73], su: [45, 78], run: [17.12 * 60, 13.36 * 60] },
            42: { pu: [30, 66], su: [40, 72], run: [17.42 * 60, 14.06 * 60] },
            47: { pu: [25, 58], su: [36, 66], run: [18.18 * 60, 14.24 * 60] },
            52: { pu: [20, 50], su: [30, 60], run: [19.00 * 60, 15.00 * 60] },
          },
          female: {
            17: { pu: [19, 42], su: [53, 78], run: [18.54 * 60, 15.36 * 60] },
            22: { pu: [17, 46], su: [50, 80], run: [19.36 * 60, 15.36 * 60] },
            27: { pu: [16, 50], su: [50, 82], run: [19.36 * 60, 15.48 * 60] },
            32: { pu: [14, 45], su: [47, 80], run: [20.30 * 60, 15.48 * 60] },
            37: { pu: [12, 40], su: [45, 78], run: [21.00 * 60, 16.30 * 60] },
            42: { pu: [10, 36], su: [40, 72], run: [21.42 * 60, 17.00 * 60] },
            47: { pu: [8, 30], su: [36, 66], run: [22.18 * 60, 17.24 * 60] },
            52: { pu: [6, 25], su: [30, 60], run: [23.00 * 60, 18.00 * 60] },
          },
        };

        const std = standards[gender]?.[ageGroup];
        if (!std) return null;

        const scoreEvent = (value: number, min60: number, max100: number, invert: boolean = false) => {
          if (invert) {
            if (value <= max100) return 100;
            if (value >= min60) return 60;
            return 60 + ((min60 - value) / (min60 - max100)) * 40;
          }
          if (value >= max100) return 100;
          if (value <= min60) return Math.max(0, (value / min60) * 60);
          return 60 + ((value - min60) / (max100 - min60)) * 40;
        };

        const puScore = scoreEvent(pushups, std.pu[0], std.pu[1]);
        const suScore = scoreEvent(situps, std.su[0], std.su[1]);
        const runTimeSec = runMin * 60 + runSec;
        const runScore = runTimeSec > 0 ? scoreEvent(runTimeSec, std.run[0], std.run[1], true) : 0;

        const totalScore = puScore + suScore + runScore;
        const passed = puScore >= 60 && suScore >= 60 && runScore >= 60;

        let rating = "Fail";
        if (passed && totalScore >= 270) rating = "Extended Scale (270+)";
        else if (passed && totalScore >= 240) rating = "Excellent (240+)";
        else if (passed && totalScore >= 210) rating = "Good (210+)";
        else if (passed) rating = "Pass (180+)";

        return {
          primary: { label: "Total Score", value: formatNumber(totalScore, 0), suffix: "/ 300" },
          details: [
            { label: "Push-Up Score", value: `${formatNumber(puScore, 0)} / 100` },
            { label: "Sit-Up Score", value: `${formatNumber(suScore, 0)} / 100` },
            { label: "2-Mile Run Score", value: `${formatNumber(runScore, 0)} / 100` },
            { label: "Result", value: passed ? `PASS - ${rating}` : "FAIL" },
          ],
          note: "Based on the legacy APFT scoring standards. Each event must score at least 60 points to pass. The ACFT (Army Combat Fitness Test) has replaced the APFT for most units.",
        };
      },
    },
  ],
  relatedSlugs: ["marine-pft-calculator", "push-up-test-calculator", "running-calorie-calculator"],
  faq: [
    {
      question: "What is a passing APFT score?",
      answer:
        "To pass the APFT, you must score at least 60 points in each of the three events (push-ups, sit-ups, 2-mile run) for a minimum total of 180 points out of 300.",
    },
    {
      question: "What is the APFT vs ACFT?",
      answer:
        "The APFT (Army Physical Fitness Test) was the legacy 3-event test (push-ups, sit-ups, 2-mile run). It has been replaced by the ACFT (Army Combat Fitness Test), which is a 6-event test designed to better assess combat readiness.",
    },
    {
      question: "What is a good APFT score?",
      answer:
        "A total score of 270+ (90+ in each event) is considered excellent and earns the Extended Scale badge. Scoring 300 (perfect 100 in each event) is the gold standard that few soldiers achieve.",
    },
  ],
  formula: "Total Score = Push-Up Score + Sit-Up Score + Run Score (each event max 100 points, pass = 60 per event)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const acftCalculator: CalculatorDefinition = {
  slug: "acft-calculator",
  title: "Army Combat Fitness Test (ACFT) Calculator",
  description: "Free ACFT score calculator. Calculate your Army Combat Fitness Test score across all six events with pass/fail assessment.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["acft calculator", "acft score calculator", "army combat fitness test calculator 2025"],
  variants: [{
    id: "standard",
    name: "Army Combat Fitness Test (ACFT)",
    description: "Free ACFT score calculator",
    fields: [
      { name: "deadlift", label: "3 Rep Max Deadlift (lbs)", type: "number", min: 0, max: 600, defaultValue: 0 },
      { name: "spt", label: "Standing Power Throw (m)", type: "number", min: 0, max: 15, step: 0.1, defaultValue: 0 },
      { name: "hrp", label: "Hand Release Push-Ups (reps)", type: "number", min: 0, max: 80, defaultValue: 0 },
      { name: "sdc", label: "Sprint-Drag-Carry (mm:ss)", type: "number", suffix: "seconds", min: 60, max: 300, defaultValue: 0 },
      { name: "plank", label: "Plank Hold (seconds)", type: "number", min: 0, max: 300, defaultValue: 0 },
      { name: "run", label: "2-Mile Run (seconds)", type: "number", min: 600, max: 1500, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const dl = inputs.deadlift as number;
      const spt = inputs.spt as number;
      const hrp = inputs.hrp as number;
      const sdc = inputs.sdc as number;
      const plk = inputs.plank as number;
      const run = inputs.run as number;
      if (!dl && !spt && !hrp && !sdc && !plk && !run) return null;
      const scoreDL = dl >= 340 ? 100 : dl >= 140 ? Math.min(100, Math.round(60 + (dl - 140) * 40 / 200)) : 0;
      const scoreSPT = spt >= 12.5 ? 100 : spt >= 4.5 ? Math.min(100, Math.round(60 + (spt - 4.5) * 40 / 8)) : 0;
      const scoreHRP = hrp >= 60 ? 100 : hrp >= 10 ? Math.min(100, Math.round(60 + (hrp - 10) * 40 / 50)) : 0;
      const scoreSDC = sdc <= 93 ? 100 : sdc <= 180 ? Math.min(100, Math.round(100 - (sdc - 93) * 40 / 87)) : 0;
      const scorePLK = plk >= 220 ? 100 : plk >= 120 ? Math.min(100, Math.round(60 + (plk - 120) * 40 / 100)) : 0;
      const scoreRUN = run <= 810 ? 100 : run <= 1260 ? Math.min(100, Math.round(100 - (run - 810) * 40 / 450)) : 0;
      const total = scoreDL + scoreSPT + scoreHRP + scoreSDC + scorePLK + scoreRUN;
      const minScore = Math.min(scoreDL, scoreSPT, scoreHRP, scoreSDC, scorePLK, scoreRUN);
      const pass = minScore >= 60;
      return {
        primary: { label: "Total Score", value: total + " / 600" },
        details: [
          { label: "3RM Deadlift", value: scoreDL + " pts" },
          { label: "Standing Power Throw", value: scoreSPT + " pts" },
          { label: "Hand Release Push-Ups", value: scoreHRP + " pts" },
          { label: "Sprint-Drag-Carry", value: scoreSDC + " pts" },
          { label: "Plank", value: scorePLK + " pts" },
          { label: "2-Mile Run", value: scoreRUN + " pts" },
        ],
        note: pass ? "PASS — All events ≥60 points. Total: " + total + "/600." : "FAIL — Minimum 60 points required per event. Lowest: " + minScore + " pts.",
      };
    },
  }],
  relatedSlugs: ["bmi-calculator", "bmr-calculator"],
  faq: [
    { question: "What is a passing ACFT score?", answer: "Minimum 60 points per event (360 total minimum). Maximum 100 per event (600 total). No gender/age adjustments — one standard for all." },
    { question: "What are the ACFT events?", answer: "3 Rep Max Deadlift, Standing Power Throw, Hand Release Push-Ups, Sprint-Drag-Carry, Plank, and 2-Mile Run." },
  ],
  formula: "Total = Sum of 6 event scores (0-100 each). Pass = minimum 60 per event.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crossfitScoreCalculator: CalculatorDefinition = {
  slug: "crossfit-score-calculator",
  title: "CrossFit Score Calculator",
  description:
    "Free CrossFit workout score calculator. Calculate and compare your scores for common CrossFit benchmark WODs like Fran, Grace, Murph, and more.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "crossfit calculator",
    "crossfit score",
    "wod calculator",
    "crossfit benchmark",
    "fran time calculator",
  ],
  variants: [
    {
      id: "time-wod",
      name: "For Time WOD",
      description: "Score a for-time workout (Fran, Grace, Helen, etc.)",
      fields: [
        {
          name: "workout",
          label: "Benchmark WOD",
          type: "select",
          options: [
            { label: "Fran (21-15-9 Thrusters/Pull-ups)", value: "fran" },
            { label: "Grace (30 Clean & Jerks)", value: "grace" },
            { label: "Helen (3 RFT: Run/KB Swing/Pull-ups)", value: "helen" },
            { label: "Diane (21-15-9 Deadlifts/HSPU)", value: "diane" },
            { label: "Isabel (30 Snatches)", value: "isabel" },
            { label: "Jackie (Row/Thrusters/Pull-ups)", value: "jackie" },
          ],
        },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 5", min: 0 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        {
          name: "rxOrScaled",
          label: "Rx or Scaled",
          type: "select",
          options: [
            { label: "Rx (as prescribed)", value: "rx" },
            { label: "Scaled", value: "scaled" },
          ],
          defaultValue: "rx",
        },
      ],
      calculate: (inputs) => {
        const workout = inputs.workout as string;
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        const rx = inputs.rxOrScaled as string;

        const totalSec = mins * 60 + secs;
        if (totalSec <= 0) return null;

        // Benchmark times (Rx): [elite, advanced, intermediate, beginner] in seconds
        const benchmarks: Record<string, { name: string; elite: number; advanced: number; intermediate: number; beginner: number }> = {
          fran: { name: "Fran", elite: 120, advanced: 240, intermediate: 420, beginner: 720 },
          grace: { name: "Grace", elite: 90, advanced: 180, intermediate: 330, beginner: 600 },
          helen: { name: "Helen", elite: 480, advanced: 660, intermediate: 840, beginner: 1080 },
          diane: { name: "Diane", elite: 180, advanced: 360, intermediate: 540, beginner: 900 },
          isabel: { name: "Isabel", elite: 75, advanced: 150, intermediate: 300, beginner: 540 },
          jackie: { name: "Jackie", elite: 420, advanced: 540, intermediate: 720, beginner: 960 },
        };

        const bm = benchmarks[workout];
        if (!bm) return null;

        let level = "Beginner";
        if (rx === "rx") {
          if (totalSec <= bm.elite) level = "Elite";
          else if (totalSec <= bm.advanced) level = "Advanced";
          else if (totalSec <= bm.intermediate) level = "Intermediate";
          else level = "Beginner";
        } else {
          level = `Scaled (compare Rx standards)`;
        }

        return {
          primary: { label: `${bm.name} Time`, value: `${mins}:${secs.toString().padStart(2, "0")}` },
          details: [
            { label: "Level", value: level },
            { label: "Elite Standard", value: `< ${Math.floor(bm.elite / 60)}:${(bm.elite % 60).toString().padStart(2, "0")}` },
            { label: "Advanced Standard", value: `< ${Math.floor(bm.advanced / 60)}:${(bm.advanced % 60).toString().padStart(2, "0")}` },
            { label: "Intermediate Standard", value: `< ${Math.floor(bm.intermediate / 60)}:${(bm.intermediate % 60).toString().padStart(2, "0")}` },
            { label: "Type", value: rx === "rx" ? "Rx" : "Scaled" },
          ],
        };
      },
    },
    {
      id: "amrap",
      name: "AMRAP Score",
      description: "Score an AMRAP (As Many Rounds As Possible) workout",
      fields: [
        { name: "timeLimit", label: "Time Cap (minutes)", type: "number", placeholder: "e.g. 20", min: 1 },
        { name: "rounds", label: "Full Rounds", type: "number", placeholder: "e.g. 12", min: 0 },
        { name: "extraReps", label: "Extra Reps", type: "number", placeholder: "e.g. 5", min: 0 },
        { name: "repsPerRound", label: "Reps per Round", type: "number", placeholder: "e.g. 30", min: 1 },
      ],
      calculate: (inputs) => {
        const timeLimit = inputs.timeLimit as number;
        const rounds = (inputs.rounds as number) || 0;
        const extraReps = (inputs.extraReps as number) || 0;
        const repsPerRound = inputs.repsPerRound as number;
        if (!timeLimit || !repsPerRound) return null;

        const totalReps = rounds * repsPerRound + extraReps;
        const repsPerMinute = totalReps / timeLimit;
        const avgRoundTime = rounds > 0 ? timeLimit / (rounds + extraReps / repsPerRound) : 0;

        return {
          primary: { label: "AMRAP Score", value: `${rounds} + ${extraReps}` },
          details: [
            { label: "Total Reps", value: formatNumber(totalReps, 0) },
            { label: "Reps/Minute", value: formatNumber(repsPerMinute, 1) },
            { label: "Avg Round Time", value: `${formatNumber(avgRoundTime, 1)} min` },
            { label: "Time Cap", value: `${formatNumber(timeLimit, 0)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "exercise-calorie-calculator", "training-zone-calculator"],
  faq: [
    {
      question: "What is a good Fran time?",
      answer:
        "For Rx Fran (95/65 lb thrusters, pull-ups): under 2 minutes is elite, 2-4 minutes is advanced, 4-7 minutes is intermediate, and over 7 minutes is beginner. The world record is around 1:53.",
    },
    {
      question: "What does Rx mean in CrossFit?",
      answer:
        "Rx (as prescribed) means performing the workout exactly as written with the standard weights and movements. Scaled means modifying weights or movements to match your ability level.",
    },
    {
      question: "What are CrossFit benchmark WODs?",
      answer:
        "Benchmark WODs are standardized CrossFit workouts used to measure fitness progress. They include 'The Girls' (Fran, Grace, Helen, etc.) and 'Hero WODs' (Murph, DT, etc.). They provide a consistent way to compare performance over time.",
    },
  ],
  formula: "For Time: Compare finish time to benchmark standards | AMRAP Score = Rounds + Extra Reps",
};

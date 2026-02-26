import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const swimmingTrainingCalculator: CalculatorDefinition = {
  slug: "swimming-training-calculator",
  title: "Swimming Training Set Builder",
  description: "Free swimming training set builder. Create structured swim workouts with intervals, pace calculations, and training zones based on your threshold pace.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["swim training calculator", "swim workout builder", "swim pace", "swim intervals", "swimming CSS"],
  variants: [
    {
      id: "pace",
      name: "Swimming Pace Calculator",
      description: "Calculate your pace per 100m/yd from a time trial",
      fields: [
        { name: "distance", label: "Distance Swam", type: "select", options: [
          { label: "100m / 100yd", value: "100" },
          { label: "200m / 200yd", value: "200" },
          { label: "400m / 400yd", value: "400" },
          { label: "800m / 800yd", value: "800" },
          { label: "1500m / 1500yd", value: "1500" },
        ] },
        { name: "minutes", label: "Time - Minutes", type: "number", placeholder: "e.g. 7", min: 0, max: 60 },
        { name: "seconds", label: "Time - Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "pool", label: "Pool Length", type: "select", options: [
          { label: "25m / 25yd", value: "25" },
          { label: "50m", value: "50" },
        ], defaultValue: "25" },
      ],
      calculate: (inputs) => {
        const dist = parseFloat(inputs.distance as string);
        const min = parseFloat(inputs.minutes as string);
        const sec = parseFloat(inputs.seconds as string);
        const pool = parseFloat(inputs.pool as string);
        if (isNaN(dist) || isNaN(min) || isNaN(sec)) return null;

        const totalSec = min * 60 + sec;
        const pacePer100 = (totalSec / dist) * 100;
        const paceMin = Math.floor(pacePer100 / 60);
        const paceSec = pacePer100 % 60;

        const laps = dist / pool;
        const speedMph = (dist / totalSec) * 2.237 * (pool === 50 ? 1 : 0.9144);
        const css = pacePer100 * 1.05;
        const cssMin = Math.floor(css / 60);
        const cssSec = css % 60;

        const est1500 = pacePer100 * 15 * 1.08;

        return {
          primary: { label: "Pace per 100", value: `${paceMin}:${String(Math.round(paceSec)).padStart(2, "0")}` },
          details: [
            { label: "Total Time", value: `${formatNumber(min, 0)}:${String(Math.round(sec)).padStart(2, "0")}` },
            { label: "Distance", value: `${formatNumber(dist, 0)}m` },
            { label: "Laps", value: formatNumber(laps, 0) },
            { label: "Est. CSS Pace/100", value: `${cssMin}:${String(Math.round(cssSec)).padStart(2, "0")}` },
            { label: "Speed", value: `${formatNumber(speedMph, 2)} mph` },
            { label: "Est. 1500m Time", value: `${Math.floor(est1500 / 60)}:${String(Math.round(est1500 % 60)).padStart(2, "0")}` },
          ],
        };
      },
    },
    {
      id: "workout",
      name: "Workout Set Builder",
      description: "Build a structured swim workout from your threshold pace",
      fields: [
        { name: "cssPaceMin", label: "CSS Pace /100 - Minutes", type: "number", placeholder: "e.g. 1", min: 0, max: 5 },
        { name: "cssPaceSec", label: "CSS Pace /100 - Seconds", type: "number", placeholder: "e.g. 45", min: 0, max: 59 },
        { name: "totalDistance", label: "Desired Total Distance", type: "select", options: [
          { label: "1500m (short)", value: "1500" },
          { label: "2500m (medium)", value: "2500" },
          { label: "3500m (long)", value: "3500" },
          { label: "4500m (distance)", value: "4500" },
        ], defaultValue: "2500" },
        { name: "focus", label: "Workout Focus", type: "select", options: [
          { label: "Endurance (aerobic base)", value: "endurance" },
          { label: "Threshold (race pace)", value: "threshold" },
          { label: "Speed (sprint intervals)", value: "speed" },
        ] },
      ],
      calculate: (inputs) => {
        const cssMin = parseFloat(inputs.cssPaceMin as string);
        const cssSec = parseFloat(inputs.cssPaceSec as string);
        const totalDist = parseFloat(inputs.totalDistance as string);
        const focus = inputs.focus as string;
        if (isNaN(cssMin) || isNaN(cssSec) || isNaN(totalDist)) return null;

        const cssPace = cssMin * 60 + cssSec;
        const warmup = Math.round(totalDist * 0.2 / 100) * 100;
        const cooldown = Math.round(totalDist * 0.15 / 100) * 100;
        const mainDist = totalDist - warmup - cooldown;

        let mainSet = "";
        let interval = "";
        let restSec = 15;

        if (focus === "endurance") {
          const reps = Math.round(mainDist / 200);
          const paceAdj = cssPace * 1.1;
          const pMin = Math.floor(paceAdj / 60);
          const pSec = Math.round(paceAdj % 60);
          mainSet = `${reps} x 200m @ ${pMin}:${String(pSec).padStart(2, "0")}/100`;
          interval = `${reps} x 200`;
          restSec = 20;
        } else if (focus === "threshold") {
          const reps = Math.round(mainDist / 100);
          mainSet = `${reps} x 100m @ ${cssMin}:${String(Math.round(cssSec)).padStart(2, "0")}/100`;
          interval = `${reps} x 100`;
          restSec = 15;
        } else {
          const reps = Math.round(mainDist / 50);
          const fastPace = cssPace * 0.85;
          const fMin = Math.floor(fastPace / 60);
          const fSec = Math.round(fastPace % 60);
          mainSet = `${reps} x 50m @ ${fMin}:${String(fSec).padStart(2, "0")}/100`;
          interval = `${reps} x 50`;
          restSec = 30;
        }

        const totalTimeSec = (warmup / 100 * cssPace * 1.2) + (mainDist / 100 * cssPace) + (cooldown / 100 * cssPace * 1.3) + (mainDist / (focus === "speed" ? 50 : focus === "threshold" ? 100 : 200)) * restSec;
        const totalTimeMin = totalTimeSec / 60;

        return {
          primary: { label: "Main Set", value: mainSet },
          details: [
            { label: "Warm-up", value: `${formatNumber(warmup, 0)}m easy mix` },
            { label: "Main Set Distance", value: `${formatNumber(mainDist, 0)}m` },
            { label: "Interval Pattern", value: interval },
            { label: "Rest Between Reps", value: `${formatNumber(restSec, 0)} sec` },
            { label: "Cool-down", value: `${formatNumber(cooldown, 0)}m easy` },
            { label: "Total Distance", value: `${formatNumber(totalDist, 0)}m` },
            { label: "Est. Total Time", value: `${formatNumber(totalTimeMin, 0)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "calorie-calculator", "heart-rate-calculator"],
  faq: [
    { question: "What is CSS in swimming?", answer: "Critical Swim Speed (CSS) is your threshold swimming pace - the fastest pace you can sustain without accumulating excessive fatigue. It's typically calculated from the difference between your 400m and 200m time trial times." },
    { question: "How should I structure a swim workout?", answer: "A typical swim workout includes: warm-up (15-20% of total distance), drill/technique work, a main set at target intensity, and a cool-down (10-15%). Total distance varies from 1500m for beginners to 5000m+ for competitive swimmers." },
  ],
  formula: "Pace/100 = Total Time / Distance x 100 | CSS ≈ Pace x 1.05 | Workout: Warmup 20% + Main Set + Cooldown 15%",
};

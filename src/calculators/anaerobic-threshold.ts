import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anaerobicThresholdCalculator: CalculatorDefinition = {
  slug: "anaerobic-threshold-calculator",
  title: "Anaerobic Threshold Calculator",
  description: "Free anaerobic threshold calculator. Estimate your anaerobic threshold heart rate and pace for optimizing endurance training zones.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["anaerobic threshold", "AT calculator", "threshold heart rate", "ventilatory threshold", "training zones", "endurance training"],
  variants: [
    {
      id: "at-hr",
      name: "AT from Max Heart Rate",
      description: "Estimate anaerobic threshold heart rate from max HR",
      fields: [
        { name: "method", label: "Max HR Method", type: "select", options: [
          { label: "Known Max HR", value: "known" },
          { label: "Estimate from Age", value: "age" },
        ], defaultValue: "age" },
        { name: "maxHR", label: "Max Heart Rate (if known)", type: "number", placeholder: "e.g. 190", suffix: "bpm" },
        { name: "age", label: "Age (if estimating)", type: "number", placeholder: "e.g. 30" },
        { name: "fitnessLevel", label: "Fitness Level", type: "select", options: [
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
          { label: "Elite", value: "elite" },
        ], defaultValue: "intermediate" },
      ],
      calculate: (inputs) => {
        const method = inputs.method as string;
        let maxHR = inputs.maxHR as number;
        const age = inputs.age as number;
        const fitness = inputs.fitnessLevel as string;
        if (method === "age" && !age) return null;
        if (method === "known" && !maxHR) return null;
        if (method === "age") {
          maxHR = 220 - age;
        }
        const atPct: Record<string, number> = {
          beginner: 0.80,
          intermediate: 0.85,
          advanced: 0.88,
          elite: 0.92,
        };
        const pct = atPct[fitness] || 0.85;
        const atHR = maxHR * pct;
        const zone1 = [maxHR * 0.50, maxHR * 0.60];
        const zone2 = [maxHR * 0.60, maxHR * 0.70];
        const zone3 = [maxHR * 0.70, maxHR * 0.80];
        const zone4 = [maxHR * 0.80, maxHR * 0.90];
        const zone5 = [maxHR * 0.90, maxHR * 1.00];
        return {
          primary: { label: "Anaerobic Threshold HR", value: `${formatNumber(atHR, 0)} bpm` },
          details: [
            { label: "AT as % of Max HR", value: `${formatNumber(pct * 100, 0)}%` },
            { label: "Max Heart Rate", value: `${formatNumber(maxHR, 0)} bpm` },
            { label: "Zone 1 (Recovery)", value: `${formatNumber(zone1[0], 0)}-${formatNumber(zone1[1], 0)} bpm` },
            { label: "Zone 2 (Aerobic)", value: `${formatNumber(zone2[0], 0)}-${formatNumber(zone2[1], 0)} bpm` },
            { label: "Zone 3 (Tempo)", value: `${formatNumber(zone3[0], 0)}-${formatNumber(zone3[1], 0)} bpm` },
            { label: "Zone 4 (Threshold)", value: `${formatNumber(zone4[0], 0)}-${formatNumber(zone4[1], 0)} bpm` },
            { label: "Zone 5 (VO2 Max)", value: `${formatNumber(zone5[0], 0)}-${formatNumber(zone5[1], 0)} bpm` },
          ],
          note: "The anaerobic threshold typically falls in Zone 4. Training at or slightly below this intensity improves endurance performance.",
        };
      },
    },
    {
      id: "at-pace",
      name: "AT Pace Estimation",
      description: "Estimate anaerobic threshold pace from a recent race result",
      fields: [
        { name: "raceDistance", label: "Race Distance", type: "select", options: [
          { label: "5K", value: "5" },
          { label: "10K", value: "10" },
          { label: "Half Marathon", value: "21.1" },
          { label: "Marathon", value: "42.2" },
        ], defaultValue: "10" },
        { name: "minutes", label: "Race Time (minutes)", type: "number", placeholder: "e.g. 45" },
        { name: "seconds", label: "Race Time (seconds)", type: "number", placeholder: "e.g. 30", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const dist = parseFloat(inputs.raceDistance as string);
        const mins = inputs.minutes as number;
        const secs = (inputs.seconds as number) || 0;
        if (!dist || !mins) return null;
        const totalSec = mins * 60 + secs;
        const pacePerKm = totalSec / dist;
        const atMultiplier: Record<string, number> = {
          "5": 1.06,
          "10": 1.01,
          "21.1": 0.97,
          "42.2": 0.93,
        };
        const mult = atMultiplier[String(dist)] || 1.01;
        const atPacePerKm = pacePerKm * mult;
        const atPaceMin = Math.floor(atPacePerKm / 60);
        const atPaceSec = Math.round(atPacePerKm % 60);
        const racePaceMin = Math.floor(pacePerKm / 60);
        const racePaceSec = Math.round(pacePerKm % 60);
        return {
          primary: { label: "AT Pace", value: `${atPaceMin}:${String(atPaceSec).padStart(2, "0")} /km` },
          details: [
            { label: "Race Pace", value: `${racePaceMin}:${String(racePaceSec).padStart(2, "0")} /km` },
            { label: "Race Distance", value: `${dist} km` },
            { label: "Race Time", value: `${mins}:${String(secs).padStart(2, "0")}` },
          ],
          note: "AT pace is approximately your 10K race pace or 1-hour sustained pace. It is the fastest pace you can sustain aerobically.",
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-calculator", "lactate-threshold-calculator", "vo2-max-calculator"],
  faq: [
    { question: "What is the anaerobic threshold?", answer: "The anaerobic threshold (AT) is the exercise intensity at which lactate begins to accumulate in the blood faster than it can be cleared. Below AT, exercise can be sustained for long periods. Above AT, fatigue sets in rapidly." },
    { question: "How do I find my anaerobic threshold?", answer: "Lab tests (blood lactate) are most accurate. Field estimates include: ~85% of max HR for intermediate athletes, your 10K race pace, or the pace you can sustain for about 60 minutes all-out." },
  ],
  formula: "AT HR = Max HR x threshold% (80-92% depending on fitness) | AT Pace ~ 10K race pace",
};

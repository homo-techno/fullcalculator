import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runningAgeGradeCalculator: CalculatorDefinition = {
  slug: "running-age-grade-calculator",
  title: "Running Age Grade Calculator",
  description: "Free running age grade calculator. Compare your race performance across ages and genders using age-graded scoring percentages.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["age grade running", "age graded score", "running age grade", "race age grade", "running performance score", "age adjusted time"],
  variants: [
    {
      id: "age-grade",
      name: "Age Grade Score",
      description: "Calculate your age-graded performance percentage for a race distance",
      fields: [
        { name: "distance", label: "Race Distance", type: "select", options: [
          { label: "1 Mile", value: "1609" },
          { label: "5K", value: "5000" },
          { label: "10K", value: "10000" },
          { label: "Half Marathon", value: "21097" },
          { label: "Marathon", value: "42195" },
        ], defaultValue: "5000" },
        { name: "hours", label: "Hours", type: "number", placeholder: "0", defaultValue: 0, min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 22" },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", defaultValue: 0 },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 40" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const distM = parseInt(inputs.distance as string);
        const hours = (inputs.hours as number) || 0;
        const mins = inputs.minutes as number;
        const secs = (inputs.seconds as number) || 0;
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        if (!mins && !hours) return null;
        if (!age) return null;
        const totalSec = hours * 3600 + mins * 60 + secs;
        const isMale = gender === "male";
        const openRecords: Record<number, number> = {
          1609: isMale ? 223.13 : 252.56,
          5000: isMale ? 757 : 852,
          10000: isMale ? 1577 : 1757,
          21097: isMale ? 3466 : 3909,
          42195: isMale ? 7277 : 8109,
        };
        const record = openRecords[distM] || (isMale ? 757 : 852);
        let ageFactor = 1.0;
        if (age < 30) {
          ageFactor = 1.0;
        } else if (age < 40) {
          ageFactor = 1.0 - (age - 30) * 0.004;
        } else if (age < 50) {
          ageFactor = 0.96 - (age - 40) * 0.007;
        } else if (age < 60) {
          ageFactor = 0.89 - (age - 50) * 0.009;
        } else if (age < 70) {
          ageFactor = 0.80 - (age - 60) * 0.011;
        } else if (age < 80) {
          ageFactor = 0.69 - (age - 70) * 0.013;
        } else {
          ageFactor = 0.56 - (age - 80) * 0.015;
          ageFactor = Math.max(0.2, ageFactor);
        }
        const ageAdjustedRecord = record / ageFactor;
        const ageGrade = (ageAdjustedRecord / totalSec) * 100;
        const ageAdjustedTime = totalSec * ageFactor;
        const formatTime = (s: number) => {
          const h = Math.floor(s / 3600);
          const m = Math.floor((s % 3600) / 60);
          const sec = Math.round(s % 60);
          if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
          return `${m}:${String(sec).padStart(2, "0")}`;
        };
        let level: string;
        if (ageGrade >= 90) level = "World-class";
        else if (ageGrade >= 80) level = "National class";
        else if (ageGrade >= 70) level = "Regional class";
        else if (ageGrade >= 60) level = "Local class";
        else if (ageGrade >= 50) level = "Recreational";
        else level = "Beginner";
        const distNames: Record<number, string> = {
          1609: "Mile", 5000: "5K", 10000: "10K", 21097: "Half Marathon", 42195: "Marathon",
        };
        return {
          primary: { label: "Age Grade", value: `${formatNumber(ageGrade, 1)}%` },
          details: [
            { label: "Level", value: level },
            { label: "Actual Time", value: formatTime(totalSec) },
            { label: "Age-Adjusted Time", value: formatTime(ageAdjustedTime) },
            { label: "Distance", value: distNames[distM] || `${distM}m` },
            { label: "Age Factor", value: formatNumber(ageFactor, 4) },
            { label: "Age-Group Record (est.)", value: formatTime(ageAdjustedRecord) },
          ],
          note: "Age grade compares your performance to the world record for your age and gender. 60%+ is competitive, 70%+ is regional level, 80%+ is national level, 90%+ is world-class.",
        };
      },
    },
    {
      id: "equivalent-times",
      name: "Equivalent Race Times",
      description: "Predict race times at other distances from a known result",
      fields: [
        { name: "knownDistance", label: "Known Distance", type: "select", options: [
          { label: "1 Mile", value: "1609" },
          { label: "5K", value: "5000" },
          { label: "10K", value: "10000" },
          { label: "Half Marathon", value: "21097" },
          { label: "Marathon", value: "42195" },
        ], defaultValue: "5000" },
        { name: "minutes", label: "Time (minutes)", type: "number", placeholder: "e.g. 22" },
        { name: "seconds", label: "Time (seconds)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const knownDist = parseInt(inputs.knownDistance as string);
        const mins = inputs.minutes as number;
        const secs = (inputs.seconds as number) || 0;
        if (!knownDist || !mins) return null;
        const totalSec = mins * 60 + secs;
        const distances = [
          { name: "1 Mile", m: 1609 },
          { name: "5K", m: 5000 },
          { name: "10K", m: 10000 },
          { name: "Half Marathon", m: 21097 },
          { name: "Marathon", m: 42195 },
        ];
        const formatTime = (s: number) => {
          const h = Math.floor(s / 3600);
          const m = Math.floor((s % 3600) / 60);
          const sec = Math.round(s % 60);
          if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
          return `${m}:${String(sec).padStart(2, "0")}`;
        };
        const predictions = distances
          .filter(d => d.m !== knownDist)
          .map(d => {
            const predictedTime = totalSec * Math.pow(d.m / knownDist, 1.06);
            return { label: d.name, value: formatTime(predictedTime) };
          });
        const knownName = distances.find(d => d.m === knownDist)?.name || "Known";
        return {
          primary: { label: `${knownName} Time`, value: formatTime(totalSec) },
          details: [
            { label: "Known Distance", value: knownName },
            ...predictions,
          ],
          note: "Predictions use the Riegel formula (T2 = T1 x (D2/D1)^1.06). Accuracy decreases with larger distance differences.",
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "vo2max-estimate-calculator", "calorie-calculator"],
  faq: [
    { question: "What is age grading in running?", answer: "Age grading converts your race time to a percentage score that accounts for age and gender. It compares your time to the world record for your age group. This allows fair comparison across ages and between genders." },
    { question: "What is a good age grade score?", answer: "50%+ is recreational, 60%+ is competitive for local races, 70%+ is regional level, 80%+ is national level, 90%+ is world-class. Most regular runners score 40-65%." },
  ],
  formula: "Age Grade % = (Age-adjusted record / Actual time) x 100 | Riegel: T2 = T1 x (D2/D1)^1.06",
};

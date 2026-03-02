import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicPracticeTimeCalculator: CalculatorDefinition = {
  slug: "music-practice-time-calculator",
  title: "Music Practice Time Calculator",
  description: "Plan effective practice sessions with time allocation for technique, repertoire, and theory.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["practice","music","instrument","schedule","learning"],
  variants: [{
    id: "standard",
    name: "Music Practice Time",
    description: "Plan effective practice sessions with time allocation for technique, repertoire, and theory.",
    fields: [
      { name: "totalMinutes", label: "Total Practice Time (minutes)", type: "number", min: 15, max: 240, defaultValue: 60 },
      { name: "level", label: "Skill Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }], defaultValue: "2" },
      { name: "daysPerWeek", label: "Practice Days Per Week", type: "number", min: 1, max: 7, defaultValue: 5 },
      { name: "goal", label: "Primary Goal", type: "select", options: [{ value: "1", label: "General Improvement" }, { value: "2", label: "Performance Prep" }, { value: "3", label: "Exam/Audition Prep" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const totalMinutes = inputs.totalMinutes as number;
    const level = inputs.level as number;
    const daysPerWeek = inputs.daysPerWeek as number;
    const goal = inputs.goal as number;
    const splits = {
      "1_1": { warmup: 0.20, technique: 0.30, repertoire: 0.30, theory: 0.20 },
      "1_2": { warmup: 0.15, technique: 0.20, repertoire: 0.50, theory: 0.15 },
      "1_3": { warmup: 0.15, technique: 0.25, repertoire: 0.40, theory: 0.20 },
      "2_1": { warmup: 0.15, technique: 0.25, repertoire: 0.40, theory: 0.20 },
      "2_2": { warmup: 0.10, technique: 0.15, repertoire: 0.60, theory: 0.15 },
      "2_3": { warmup: 0.10, technique: 0.25, repertoire: 0.45, theory: 0.20 },
      "3_1": { warmup: 0.10, technique: 0.20, repertoire: 0.50, theory: 0.20 },
      "3_2": { warmup: 0.10, technique: 0.10, repertoire: 0.70, theory: 0.10 },
      "3_3": { warmup: 0.10, technique: 0.20, repertoire: 0.55, theory: 0.15 }
    };
    const key = level + "_" + goal;
    const split = splits[key] || splits["2_1"];
    const warmup = Math.round(totalMinutes * split.warmup);
    const technique = Math.round(totalMinutes * split.technique);
    const repertoire = Math.round(totalMinutes * split.repertoire);
    const theory = totalMinutes - warmup - technique - repertoire;
    const weeklyHours = (totalMinutes * daysPerWeek) / 60;
    const monthlyHours = weeklyHours * 4.33;
    return {
      primary: { label: "Weekly Practice Hours", value: formatNumber(weeklyHours) + " hrs" },
      details: [
        { label: "Warm-up / Scales", value: formatNumber(warmup) + " min" },
        { label: "Technique / Etudes", value: formatNumber(technique) + " min" },
        { label: "Repertoire", value: formatNumber(repertoire) + " min" },
        { label: "Theory / Ear Training", value: formatNumber(theory) + " min" },
        { label: "Monthly Total", value: formatNumber(monthlyHours) + " hrs" }
      ]
    };
  },
  }],
  relatedSlugs: ["bpm-tempo-calculator","chord-progression-calculator","guitar-string-gauge-calculator"],
  faq: [
    { question: "How long should I practice my instrument daily?", answer: "Beginners benefit from 30-45 minutes daily. Intermediate players should aim for 1-2 hours. Advanced players often practice 3-4 hours." },
    { question: "Is it better to practice every day or skip days?", answer: "Consistent daily practice, even shorter sessions, is more effective than long sporadic sessions for building muscle memory." },
    { question: "How should I structure my practice session?", answer: "Start with warm-ups and scales, then work on technique, followed by repertoire, and end with sight-reading or theory." },
  ],
  formula: "Time allocation based on skill level and goal priorities
Weekly Hours = Daily Minutes x Days / 60",
};

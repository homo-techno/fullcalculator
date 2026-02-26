import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coldPlungeCalculator: CalculatorDefinition = {
  slug: "cold-plunge-calculator",
  title: "Cold Plunge Protocol Calculator",
  description: "Free cold plunge protocol calculator. Get personalized cold water immersion recommendations for duration, temperature, and frequency based on your experience and goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cold plunge calculator", "cold water immersion", "ice bath calculator", "cold therapy", "cold exposure protocol"],
  variants: [
    {
      id: "protocol",
      name: "Cold Plunge Protocol",
      description: "Get a personalized cold plunge protocol based on your experience",
      fields: [
        { name: "experience", label: "Cold Exposure Experience", type: "select", options: [
          { label: "Never done it", value: "none" },
          { label: "Beginner (< 1 month)", value: "beginner" },
          { label: "Intermediate (1-6 months)", value: "intermediate" },
          { label: "Advanced (6+ months)", value: "advanced" },
        ] },
        { name: "goal", label: "Primary Goal", type: "select", options: [
          { label: "Recovery / Reduce Inflammation", value: "recovery" },
          { label: "Mental Toughness / Mood", value: "mood" },
          { label: "Metabolism / Brown Fat", value: "metabolism" },
          { label: "General Wellness", value: "wellness" },
        ] },
        { name: "bodyWeight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170", min: 80, max: 400 },
        { name: "bodyFat", label: "Estimated Body Fat %", type: "number", placeholder: "e.g. 18", min: 5, max: 50 },
      ],
      calculate: (inputs) => {
        const exp = inputs.experience as string;
        const goal = inputs.goal as string;
        const weight = parseFloat(inputs.bodyWeight as string);
        const bf = parseFloat(inputs.bodyFat as string);
        if (isNaN(weight) || isNaN(bf)) return null;

        const tempRanges: Record<string, { min: number; max: number }> = {
          none: { min: 60, max: 68 },
          beginner: { min: 55, max: 62 },
          intermediate: { min: 45, max: 55 },
          advanced: { min: 38, max: 48 },
        };

        const durationRanges: Record<string, { min: number; max: number }> = {
          none: { min: 30, max: 60 },
          beginner: { min: 60, max: 120 },
          intermediate: { min: 120, max: 300 },
          advanced: { min: 180, max: 600 },
        };

        const freqMap: Record<string, string> = {
          none: "1-2x per week",
          beginner: "2-3x per week",
          intermediate: "3-5x per week",
          advanced: "5-7x per week",
        };

        const temp = tempRanges[exp] || tempRanges.beginner;
        const dur = durationRanges[exp] || durationRanges.beginner;

        const bfAdj = bf > 25 ? 1.15 : bf < 12 ? 0.85 : 1.0;
        const adjDurMin = Math.round(dur.min * bfAdj);
        const adjDurMax = Math.round(dur.max * bfAdj);

        let goalTip = "";
        if (goal === "recovery") goalTip = "Plunge within 1 hour post-exercise. Avoid on hypertrophy days if maximizing muscle growth.";
        else if (goal === "mood") goalTip = "Morning plunges boost dopamine by up to 250%. Cold showers also work.";
        else if (goal === "metabolism") goalTip = "Shiver response activates brown fat. Avoid warming up too quickly after.";
        else goalTip = "Consistency matters more than intensity. Build up gradually.";

        const weeklyMinutes = (adjDurMin + adjDurMax) / 2 / 60 * (exp === "advanced" ? 6 : exp === "intermediate" ? 4 : 2);

        return {
          primary: { label: "Recommended Temperature", value: `${formatNumber(temp.min, 0)}-${formatNumber(temp.max, 0)}°F` },
          details: [
            { label: "Duration", value: `${formatNumber(adjDurMin, 0)}-${formatNumber(adjDurMax, 0)} seconds` },
            { label: "Duration (minutes)", value: `${formatNumber(adjDurMin / 60, 1)}-${formatNumber(adjDurMax / 60, 1)} min` },
            { label: "Frequency", value: freqMap[exp] || "2-3x per week" },
            { label: "Weekly Cold Exposure", value: `~${formatNumber(weeklyMinutes, 1)} min total` },
            { label: "Body Fat Adjustment", value: `${formatNumber(bfAdj * 100, 0)}%` },
            { label: "Goal Tip", value: goalTip },
          ],
          note: "Always listen to your body. Exit immediately if you feel dizzy, confused, or experience numbness beyond hands/feet.",
        };
      },
    },
    {
      id: "weekly-plan",
      name: "Weekly Cold Exposure Plan",
      description: "Build a weekly cold plunge schedule",
      fields: [
        { name: "sessionsPerWeek", label: "Sessions Per Week", type: "number", placeholder: "e.g. 3", min: 1, max: 7 },
        { name: "sessionDuration", label: "Session Duration (seconds)", type: "number", placeholder: "e.g. 120", min: 15, max: 900 },
        { name: "temperature", label: "Water Temperature (°F)", type: "number", placeholder: "e.g. 50", min: 32, max: 70 },
      ],
      calculate: (inputs) => {
        const sessions = parseFloat(inputs.sessionsPerWeek as string);
        const duration = parseFloat(inputs.sessionDuration as string);
        const temp = parseFloat(inputs.temperature as string);
        if (isNaN(sessions) || isNaN(duration) || isNaN(temp)) return null;

        const weeklySeconds = sessions * duration;
        const weeklyMinutes = weeklySeconds / 60;
        const hubermanTarget = 11;
        const pctOfTarget = (weeklyMinutes / hubermanTarget) * 100;
        const coldStress = (70 - temp) * duration / 60;
        const caloriesBurned = coldStress * 2.5 * sessions;

        return {
          primary: { label: "Weekly Cold Exposure", value: `${formatNumber(weeklyMinutes, 1)} min` },
          details: [
            { label: "% of 11-min/week Target", value: `${formatNumber(pctOfTarget, 0)}%` },
            { label: "Sessions/Week", value: formatNumber(sessions, 0) },
            { label: "Per Session", value: `${formatNumber(duration, 0)} sec (${formatNumber(duration / 60, 1)} min)` },
            { label: "Temperature", value: `${formatNumber(temp, 0)}°F (${formatNumber((temp - 32) * 5 / 9, 1)}°C)` },
            { label: "Cold Stress Score", value: formatNumber(coldStress, 1) },
            { label: "Est. Extra Calories/Week", value: formatNumber(caloriesBurned, 0) },
          ],
          note: "Dr. Huberman recommends ~11 minutes per week of deliberate cold exposure distributed across 2-4 sessions.",
        };
      },
    },
  ],
  relatedSlugs: ["sauna-session-calculator", "muscle-recovery-calculator", "calorie-calculator"],
  faq: [
    { question: "How cold should a cold plunge be?", answer: "Beginners should start at 60-68°F and gradually decrease. Intermediate practitioners use 45-55°F, and advanced users go to 38-48°F. The key is that it should feel uncomfortable but safe." },
    { question: "How long should you stay in a cold plunge?", answer: "Start with 30-60 seconds and build up over weeks. Research suggests 11 minutes total per week (across multiple sessions) is the minimum effective dose for health benefits." },
    { question: "When should you NOT do cold plunges?", answer: "Avoid cold plunges if you have Raynaud's disease, cardiovascular issues, are pregnant, or within 4 hours of strength training if your goal is maximum hypertrophy (cold can blunt the inflammatory signal needed for muscle growth)." },
  ],
  formula: "Weekly Exposure = Sessions x Duration | Cold Stress = (70 - Temp°F) x Duration(min) | Target: ~11 min/week total",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sleepQualityScoreCalculator: CalculatorDefinition = {
  slug: "sleep-quality-score-calculator",
  title: "Sleep Quality Score Calculator",
  description: "Free sleep quality assessment calculator. Evaluate your sleep quality using a PSQI-style scoring system based on duration, latency, disturbances, and efficiency.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sleep quality calculator", "psqi calculator", "sleep score", "sleep assessment", "sleep efficiency"],
  variants: [
    {
      id: "full-assessment",
      name: "Full Sleep Assessment",
      description: "Comprehensive sleep quality evaluation based on PSQI components",
      fields: [
        { name: "bedTime", label: "Hours in Bed (total)", type: "number", placeholder: "e.g. 8", min: 1, max: 16, step: 0.5 },
        { name: "actualSleep", label: "Hours of Actual Sleep", type: "number", placeholder: "e.g. 6.5", min: 0.5, max: 14, step: 0.5 },
        { name: "latency", label: "Minutes to Fall Asleep", type: "number", placeholder: "e.g. 20", min: 0, max: 180 },
        { name: "wakeups", label: "Nighttime Awakenings", type: "select", options: [
          { label: "None", value: "0" },
          { label: "1 time", value: "1" },
          { label: "2 times", value: "2" },
          { label: "3+ times", value: "3" },
        ], defaultValue: "1" },
        { name: "subjectiveQuality", label: "Subjective Sleep Quality", type: "select", options: [
          { label: "Very Good", value: "0" },
          { label: "Fairly Good", value: "1" },
          { label: "Fairly Bad", value: "2" },
          { label: "Very Bad", value: "3" },
        ] },
        { name: "daytimeDysfunction", label: "Daytime Sleepiness Level", type: "select", options: [
          { label: "No problem", value: "0" },
          { label: "Slight problem", value: "1" },
          { label: "Moderate problem", value: "2" },
          { label: "Big problem", value: "3" },
        ] },
      ],
      calculate: (inputs) => {
        const bedHours = parseFloat(inputs.bedTime as string);
        const sleepHours = parseFloat(inputs.actualSleep as string);
        const latency = parseFloat(inputs.latency as string);
        const wakeups = parseFloat(inputs.wakeups as string);
        const subjective = parseFloat(inputs.subjectiveQuality as string);
        const daytime = parseFloat(inputs.daytimeDysfunction as string);
        if (isNaN(bedHours) || isNaN(sleepHours) || isNaN(latency)) return null;

        const efficiency = (sleepHours / bedHours) * 100;

        let efficiencyScore = 0;
        if (efficiency < 65) efficiencyScore = 3;
        else if (efficiency < 75) efficiencyScore = 2;
        else if (efficiency < 85) efficiencyScore = 1;

        let latencyScore = 0;
        if (latency > 60) latencyScore = 3;
        else if (latency > 30) latencyScore = 2;
        else if (latency > 15) latencyScore = 1;

        let durationScore = 0;
        if (sleepHours < 5) durationScore = 3;
        else if (sleepHours < 6) durationScore = 2;
        else if (sleepHours < 7) durationScore = 1;

        const disturbanceScore = Math.min(wakeups, 3);
        const totalScore = efficiencyScore + latencyScore + durationScore + disturbanceScore + subjective + daytime;
        const maxScore = 18;
        const qualityPct = Math.max(0, ((maxScore - totalScore) / maxScore) * 100);

        let rating = "Excellent";
        if (totalScore > 12) rating = "Very Poor";
        else if (totalScore > 9) rating = "Poor";
        else if (totalScore > 5) rating = "Fair";
        else if (totalScore > 2) rating = "Good";

        return {
          primary: { label: "Sleep Quality Score", value: `${formatNumber(totalScore, 0)} / ${maxScore}` },
          details: [
            { label: "Quality Rating", value: rating },
            { label: "Quality Percentage", value: `${formatNumber(qualityPct, 0)}%` },
            { label: "Sleep Efficiency", value: `${formatNumber(efficiency, 1)}%` },
            { label: "Duration Score (0-3)", value: formatNumber(durationScore, 0) },
            { label: "Latency Score (0-3)", value: formatNumber(latencyScore, 0) },
            { label: "Efficiency Score (0-3)", value: formatNumber(efficiencyScore, 0) },
            { label: "Disturbance Score (0-3)", value: formatNumber(disturbanceScore, 0) },
          ],
          note: totalScore > 5 ? "A score above 5 suggests clinically significant sleep difficulties. Consider consulting a healthcare provider." : "Your sleep quality appears to be in a healthy range.",
        };
      },
    },
    {
      id: "efficiency",
      name: "Sleep Efficiency",
      description: "Quick sleep efficiency percentage calculation",
      fields: [
        { name: "bedTime", label: "Total Time in Bed (hours)", type: "number", placeholder: "e.g. 8", min: 1, max: 16, step: 0.5 },
        { name: "sleepTime", label: "Actual Sleep Time (hours)", type: "number", placeholder: "e.g. 7", min: 0.5, max: 14, step: 0.5 },
      ],
      calculate: (inputs) => {
        const bed = parseFloat(inputs.bedTime as string);
        const sleep = parseFloat(inputs.sleepTime as string);
        if (isNaN(bed) || isNaN(sleep) || bed <= 0) return null;
        const eff = (sleep / bed) * 100;
        const wastedTime = (bed - sleep) * 60;
        let rating = "Excellent (>90%)";
        if (eff < 75) rating = "Poor (<75%)";
        else if (eff < 85) rating = "Fair (75-85%)";
        else if (eff < 90) rating = "Good (85-90%)";
        return {
          primary: { label: "Sleep Efficiency", value: `${formatNumber(eff, 1)}%` },
          details: [
            { label: "Rating", value: rating },
            { label: "Time Awake in Bed", value: `${formatNumber(wastedTime, 0)} min` },
            { label: "Sleep Cycles (~90 min)", value: formatNumber(sleep * 60 / 90, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sleep-calculator", "caffeine-nap-calculator", "stress-level-calculator"],
  faq: [
    { question: "What is a good sleep quality score?", answer: "On the PSQI-style scale, a lower score is better. A total score of 0-2 is excellent, 3-5 is good, 6-9 is fair, and above 9 indicates poor sleep quality. A score above 5 is considered clinically significant." },
    { question: "What is sleep efficiency?", answer: "Sleep efficiency is the percentage of time in bed actually spent sleeping. Above 85-90% is considered good. If your efficiency is low, you may be spending too much awake time in bed, which can worsen insomnia." },
    { question: "How can I improve my sleep quality score?", answer: "Maintain consistent sleep/wake times, limit screen exposure before bed, keep your room cool (65-68F), avoid caffeine 6+ hours before bed, and exercise regularly but not too close to bedtime." },
  ],
  formula: "Total Score = Duration + Latency + Efficiency + Disturbance + Subjective Quality + Daytime Dysfunction (each 0-3) | Efficiency = (Sleep Time / Time in Bed) x 100",
};

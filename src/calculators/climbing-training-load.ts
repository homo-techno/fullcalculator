import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const climbingTrainingLoadCalculator: CalculatorDefinition = {
  slug: "climbing-training-load-calculator",
  title: "Climbing Training Load Calculator",
  description:
    "Free climbing training volume and intensity calculator. Track your climbing training load, estimate session intensity, and plan recovery based on route grades and volume.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "climbing training calculator",
    "climbing volume",
    "bouldering training",
    "climbing intensity",
    "training load climbing",
  ],
  variants: [
    {
      id: "session-load",
      name: "Session Training Load",
      description: "Calculate training load for a climbing session",
      fields: [
        {
          name: "climbingType",
          label: "Climbing Type",
          type: "select",
          options: [
            { label: "Bouldering", value: "bouldering" },
            { label: "Sport Climbing", value: "sport" },
            { label: "Trad Climbing", value: "trad" },
          ],
          defaultValue: "bouldering",
        },
        {
          name: "maxGrade",
          label: "Hardest Grade Sent (V-scale/YDS number)",
          type: "number",
          placeholder: "e.g. 6 for V6 or 11 for 5.11",
          min: 0,
          max: 17,
        },
        {
          name: "numRoutes",
          label: "Number of Routes/Problems",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
        },
        {
          name: "avgGrade",
          label: "Average Grade (V-scale/YDS number)",
          type: "number",
          placeholder: "e.g. 4 for V4 or 10 for 5.10",
          min: 0,
          max: 17,
        },
        {
          name: "sessionDuration",
          label: "Session Duration (minutes)",
          type: "number",
          placeholder: "e.g. 90",
          min: 15,
        },
      ],
      calculate: (inputs) => {
        const climbingType = inputs.climbingType as string;
        const maxGrade = parseFloat(inputs.maxGrade as string);
        const numRoutes = parseFloat(inputs.numRoutes as string);
        const avgGrade = parseFloat(inputs.avgGrade as string);
        const duration = parseFloat(inputs.sessionDuration as string);
        if (isNaN(maxGrade) || !numRoutes || isNaN(avgGrade) || !duration) return null;

        // Intensity factor based on type
        const typeFactor = climbingType === "bouldering" ? 1.3 : climbingType === "sport" ? 1.0 : 0.9;

        // Grade intensity (exponential scaling)
        const gradeIntensity = Math.pow(1.15, avgGrade) * typeFactor;

        // Volume = routes * grade intensity
        const volume = numRoutes * gradeIntensity;

        // Training load = volume * duration factor
        const durationFactor = Math.min(duration / 60, 3);
        const trainingLoad = volume * durationFactor;

        // Intensity percentage (avg vs max)
        const intensityPct = maxGrade > 0 ? (avgGrade / maxGrade) * 100 : 0;

        // Recovery estimate (hours)
        const recoveryHours = Math.max(24, trainingLoad * 1.5);

        let loadRating = "Light";
        if (trainingLoad > 100) loadRating = "Very High";
        else if (trainingLoad > 60) loadRating = "High";
        else if (trainingLoad > 30) loadRating = "Moderate";

        return {
          primary: {
            label: "Training Load Score",
            value: formatNumber(trainingLoad, 1),
          },
          details: [
            { label: "Load Rating", value: loadRating },
            { label: "Volume Score", value: formatNumber(volume, 1) },
            { label: "Intensity", value: formatNumber(intensityPct, 0) + "% of max" },
            { label: "Routes Completed", value: formatNumber(numRoutes, 0) },
            { label: "Est. Recovery", value: formatNumber(recoveryHours, 0) + " hours" },
            { label: "Duration", value: formatNumber(duration, 0) + " min" },
          ],
          note: "Keep weekly training load consistent. Avoid increasing more than 10-15% per week to prevent overuse injuries.",
        };
      },
    },
    {
      id: "weekly-plan",
      name: "Weekly Volume Plan",
      description: "Plan weekly climbing volume based on goals",
      fields: [
        {
          name: "sessionsPerWeek",
          label: "Sessions Per Week",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 7,
        },
        {
          name: "avgSessionMinutes",
          label: "Average Session Length (min)",
          type: "number",
          placeholder: "e.g. 90",
          min: 30,
        },
        {
          name: "currentMaxGrade",
          label: "Current Max Grade (V-scale number)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 17,
        },
        {
          name: "experience",
          label: "Experience Level",
          type: "select",
          options: [
            { label: "Beginner (< 1 year)", value: "beginner" },
            { label: "Intermediate (1-3 years)", value: "intermediate" },
            { label: "Advanced (3+ years)", value: "advanced" },
          ],
          defaultValue: "intermediate",
        },
      ],
      calculate: (inputs) => {
        const sessions = parseFloat(inputs.sessionsPerWeek as string);
        const avgMinutes = parseFloat(inputs.avgSessionMinutes as string);
        const maxGrade = parseFloat(inputs.currentMaxGrade as string);
        const experience = inputs.experience as string;
        if (!sessions || !avgMinutes || isNaN(maxGrade)) return null;

        const weeklyMinutes = sessions * avgMinutes;
        const weeklyHours = weeklyMinutes / 60;

        // Recommended distribution
        const hardPct = experience === "beginner" ? 0.2 : experience === "intermediate" ? 0.25 : 0.3;
        const moderatePct = experience === "beginner" ? 0.5 : experience === "intermediate" ? 0.45 : 0.4;
        const easyPct = 1 - hardPct - moderatePct;

        const hardSessions = Math.round(sessions * hardPct);
        const moderateSessions = Math.round(sessions * moderatePct);
        const easySessions = sessions - hardSessions - moderateSessions;

        const hardGrade = maxGrade;
        const moderateGrade = Math.max(0, maxGrade - 2);
        const easyGrade = Math.max(0, maxGrade - 4);

        return {
          primary: {
            label: "Weekly Climbing Hours",
            value: formatNumber(weeklyHours, 1),
          },
          details: [
            { label: "Hard Sessions (project grade)", value: formatNumber(hardSessions, 0) + ` at V${formatNumber(hardGrade, 0)}` },
            { label: "Moderate Sessions", value: formatNumber(moderateSessions, 0) + ` at V${formatNumber(moderateGrade, 0)}` },
            { label: "Easy/Volume Sessions", value: formatNumber(easySessions, 0) + ` at V${formatNumber(easyGrade, 0)}` },
            { label: "Total Weekly Minutes", value: formatNumber(weeklyMinutes, 0) },
            { label: "Rest Days", value: formatNumber(7 - sessions, 0) },
          ],
          note: "Include at least 2 rest days per week. Supplement climbing with antagonist exercises and mobility work.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "heart-rate-calculator", "one-rep-max-calculator"],
  faq: [
    {
      question: "How many days a week should I climb?",
      answer:
        "Beginners should climb 2-3 days per week with at least one rest day between sessions. Intermediate climbers can climb 3-4 days, and advanced climbers may train 4-5 days. Rest and recovery are crucial for finger tendon health and strength gains.",
    },
    {
      question: "How do I calculate climbing training intensity?",
      answer:
        "Training intensity is measured as a percentage of your max grade. Climbing at 80-100% of your max is high intensity, 60-80% is moderate, and below 60% is low intensity. A balanced training week should include sessions at all intensity levels.",
    },
    {
      question: "What is training load in climbing?",
      answer:
        "Training load combines volume (number of routes and their difficulty) with duration. It helps track cumulative stress on your body. Gradually increasing training load by 10-15% per week is recommended to build fitness while avoiding injury.",
    },
  ],
  formula:
    "Training Load = Volume × Duration Factor | Volume = Routes × Grade Intensity | Intensity % = (Avg Grade / Max Grade) × 100",
};

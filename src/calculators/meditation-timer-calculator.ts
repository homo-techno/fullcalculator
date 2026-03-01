import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meditationTimerCalculator: CalculatorDefinition = {
  slug: "meditation-timer-calculator",
  title: "Meditation Timer Calculator",
  description: "Plan your meditation session with recommended duration and technique based on experience level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["meditation timer", "meditation session planner", "mindfulness calculator"],
  variants: [{
    id: "standard",
    name: "Meditation Timer",
    description: "Plan your meditation session with recommended duration and technique based on experience level",
    fields: [
      { name: "experience", label: "Experience Level", type: "select", options: [{value:"beginner",label:"Beginner (0-3 months)"},{value:"intermediate",label:"Intermediate (3-12 months)"},{value:"advanced",label:"Advanced (1+ years)"}], defaultValue: "beginner" },
      { name: "sessionsPerDay", label: "Sessions per Day", type: "number", suffix: "sessions", min: 1, max: 5, defaultValue: 1 },
      { name: "goal", label: "Primary Goal", type: "select", options: [{value:"stress",label:"Stress Relief"},{value:"focus",label:"Focus and Concentration"},{value:"sleep",label:"Better Sleep"},{value:"awareness",label:"Self-Awareness"}], defaultValue: "stress" },
    ],
    calculate: (inputs) => {
      const exp = inputs.experience as string;
      const sessions = inputs.sessionsPerDay as number;
      const goal = inputs.goal as string;
      if (!sessions || sessions <= 0) return null;
      const baseDuration: Record<string, number> = { beginner: 5, intermediate: 15, advanced: 30 };
      const goalMod: Record<string, number> = { stress: 1.0, focus: 1.2, sleep: 0.8, awareness: 1.3 };
      const duration = Math.round((baseDuration[exp] || 5) * (goalMod[goal] || 1.0));
      const dailyMinutes = duration * sessions;
      const weeklyMinutes = dailyMinutes * 7;
      const technique = goal === "stress" ? "Body Scan or Breathing" : goal === "focus" ? "Focused Attention" : goal === "sleep" ? "Yoga Nidra or Body Scan" : "Open Monitoring";
      return {
        primary: { label: "Recommended Session Length", value: formatNumber(duration) + " minutes" },
        details: [
          { label: "Daily Meditation Time", value: formatNumber(dailyMinutes) + " minutes" },
          { label: "Weekly Total", value: formatNumber(weeklyMinutes) + " minutes" },
          { label: "Suggested Technique", value: technique },
        ],
      };
    },
  }],
  relatedSlugs: ["eye-strain-break-calculator", "standing-desk-timer-calculator"],
  faq: [
    { question: "How long should a beginner meditate?", answer: "Beginners should start with 5 to 10 minutes per session and gradually increase as comfort grows. Consistency matters more than duration." },
    { question: "What is the best time of day to meditate?", answer: "Morning meditation helps set a calm tone for the day, while evening sessions can improve sleep. Choose a time you can maintain consistently." },
  ],
  formula: "Session Duration = Base Duration x Goal Modifier",
};

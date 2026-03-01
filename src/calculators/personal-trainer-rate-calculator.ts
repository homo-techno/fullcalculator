import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const personalTrainerRateCalculator: CalculatorDefinition = {
  slug: "personal-trainer-rate-calculator",
  title: "Personal Trainer Rate Calculator",
  description: "Calculate personal training costs based on session frequency, duration, and trainer experience.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["personal trainer rate", "personal training cost", "fitness trainer pricing"],
  variants: [{
    id: "standard",
    name: "Personal Trainer Rate",
    description: "Calculate personal training costs based on session frequency, duration, and trainer experience",
    fields: [
      { name: "sessionsPerWeek", label: "Sessions per Week", type: "number", suffix: "sessions", min: 1, max: 7, defaultValue: 3 },
      { name: "sessionLength", label: "Session Length", type: "select", options: [{value:"30",label:"30 Minutes"},{value:"45",label:"45 Minutes"},{value:"60",label:"60 Minutes"}], defaultValue: "60" },
      { name: "trainerLevel", label: "Trainer Experience", type: "select", options: [{value:"junior",label:"Junior (1-3 years)"},{value:"senior",label:"Senior (3-7 years)"},{value:"elite",label:"Elite (7+ years)"}], defaultValue: "senior" },
      { name: "weeks", label: "Number of Weeks", type: "number", suffix: "weeks", min: 1, max: 52, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const sessions = inputs.sessionsPerWeek as number;
      const length = inputs.sessionLength as string;
      const level = inputs.trainerLevel as string;
      const weeks = inputs.weeks as number;
      if (!sessions || !weeks) return null;
      const baseRates: Record<string, number> = { junior: 40, senior: 70, elite: 120 };
      const lengthMod: Record<string, number> = { "30": 0.6, "45": 0.8, "60": 1.0 };
      const perSession = (baseRates[level] || 70) * (lengthMod[length] || 1.0);
      const totalSessions = sessions * weeks;
      const totalCost = perSession * totalSessions;
      const monthlyAvg = totalCost / (weeks / 4.33);
      return {
        primary: { label: "Total Training Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Per Session Rate", value: "$" + formatNumber(Math.round(perSession * 100) / 100) },
          { label: "Total Sessions", value: formatNumber(totalSessions) },
          { label: "Monthly Average", value: "$" + formatNumber(Math.round(monthlyAvg)) },
        ],
      };
    },
  }],
  relatedSlugs: ["tutoring-rate-calculator", "massage-therapist-rate-calculator"],
  faq: [
    { question: "How much does a personal trainer cost?", answer: "Personal trainers charge $40 to $120 per hour session depending on experience and location. Package deals of 10 or more sessions often come with a 10 to 20 percent discount." },
    { question: "How many times a week should I train with a personal trainer?", answer: "For most people, 2 to 3 sessions per week provides the best balance of guided training and recovery time. Beginners may start with 1 to 2 sessions." },
  ],
  formula: "Total = Sessions per Week x Weeks x (Base Rate x Length Modifier)",
};

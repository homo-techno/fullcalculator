import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicLessonCostCalculator: CalculatorDefinition = {
  slug: "music-lesson-cost-calculator",
  title: "Music Lesson Cost Calculator",
  description: "Compare music lesson costs based on instrument, lesson duration, instructor level, and frequency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["music lesson cost", "music teacher price", "instrument lesson cost"],
  variants: [{
    id: "standard",
    name: "Music Lesson Cost",
    description: "Compare music lesson costs based on instrument, lesson duration, instructor level, and frequency",
    fields: [
      { name: "instrument", label: "Instrument", type: "select", options: [{value:"piano",label:"Piano"},{value:"guitar",label:"Guitar"},{value:"violin",label:"Violin"},{value:"voice",label:"Voice"},{value:"drums",label:"Drums"}], defaultValue: "piano" },
      { name: "duration", label: "Lesson Duration", type: "select", options: [{value:"30",label:"30 Minutes"},{value:"45",label:"45 Minutes"},{value:"60",label:"60 Minutes"}], defaultValue: "60" },
      { name: "level", label: "Instructor Level", type: "select", options: [{value:"student",label:"Student Teacher"},{value:"professional",label:"Professional"},{value:"expert",label:"Expert/Masters"}], defaultValue: "professional" },
      { name: "lessonsPerMonth", label: "Lessons per Month", type: "number", min: 1, max: 12, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const instrument = inputs.instrument as string;
      const duration = parseInt(inputs.duration as string);
      const level = inputs.level as string;
      const perMonth = inputs.lessonsPerMonth as number;
      if (!perMonth || !duration) return null;
      const baseRate: Record<string, number> = { piano: 50, guitar: 45, violin: 55, voice: 50, drums: 45 };
      const levelMult: Record<string, number> = { student: 0.6, professional: 1.0, expert: 1.6 };
      const durationMult = duration / 60;
      const perLesson = Math.round((baseRate[instrument] || 50) * (levelMult[level] || 1.0) * durationMult);
      const monthly = perLesson * perMonth;
      const annual = monthly * 12;
      return {
        primary: { label: "Cost per Lesson", value: "$" + formatNumber(perLesson) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(monthly) },
          { label: "Annual Cost", value: "$" + formatNumber(annual) },
          { label: "Lesson Duration", value: duration + " minutes" },
        ],
      };
    },
  }],
  relatedSlugs: ["piano-tuning-cost-calculator", "band-booking-calculator"],
  faq: [
    { question: "How much do music lessons cost?", answer: "Private music lessons typically range from $30 to $80 per hour depending on the instrument, instructor qualifications, and location." },
    { question: "Are shorter music lessons worth it?", answer: "Thirty-minute lessons work well for young beginners while 60-minute lessons are better for intermediate and advanced students who need more practice time." },
  ],
  formula: "Lesson Cost = Base Rate x Level Multiplier x (Duration / 60)",
};

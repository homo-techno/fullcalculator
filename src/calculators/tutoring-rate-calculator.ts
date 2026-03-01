import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tutoringRateCalculator: CalculatorDefinition = {
  slug: "tutoring-rate-calculator",
  title: "Tutoring Rate Calculator",
  description: "Calculate tutoring costs based on subject, frequency, and tutor qualifications.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tutoring rate", "tutor pricing", "tutoring cost calculator"],
  variants: [{
    id: "standard",
    name: "Tutoring Rate",
    description: "Calculate tutoring costs based on subject, frequency, and tutor qualifications",
    fields: [
      { name: "sessionsPerWeek", label: "Sessions per Week", type: "number", suffix: "sessions", min: 1, max: 7, defaultValue: 2 },
      { name: "sessionLength", label: "Session Length (minutes)", type: "number", suffix: "min", min: 30, max: 120, defaultValue: 60 },
      { name: "subject", label: "Subject Level", type: "select", options: [{value:"elementary",label:"Elementary/Middle School"},{value:"highschool",label:"High School"},{value:"college",label:"College Level"},{value:"test",label:"Test Prep (SAT/ACT)"}], defaultValue: "highschool" },
      { name: "weeks", label: "Number of Weeks", type: "number", suffix: "weeks", min: 1, max: 52, defaultValue: 16 },
    ],
    calculate: (inputs) => {
      const sessions = inputs.sessionsPerWeek as number;
      const length = inputs.sessionLength as number;
      const subject = inputs.subject as string;
      const weeks = inputs.weeks as number;
      if (!sessions || !weeks || !length) return null;
      const hourlyRates: Record<string, number> = { elementary: 35, highschool: 50, college: 75, test: 90 };
      const hourlyRate = hourlyRates[subject] || 50;
      const perSession = hourlyRate * (length / 60);
      const totalSessions = sessions * weeks;
      const totalCost = perSession * totalSessions;
      const monthlyAvg = totalCost / (weeks / 4.33);
      return {
        primary: { label: "Total Tutoring Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Per Session Cost", value: "$" + formatNumber(Math.round(perSession * 100) / 100) },
          { label: "Total Sessions", value: formatNumber(totalSessions) },
          { label: "Monthly Average", value: "$" + formatNumber(Math.round(monthlyAvg)) },
        ],
      };
    },
  }],
  relatedSlugs: ["personal-trainer-rate-calculator", "photographer-pricing-calculator"],
  faq: [
    { question: "How much does tutoring cost per hour?", answer: "Tutoring rates range from $25 to $50 per hour for elementary subjects, $40 to $80 for high school, $60 to $100 for college, and $75 to $150 for specialized test prep." },
    { question: "How often should a student have tutoring sessions?", answer: "Most students benefit from 1 to 3 sessions per week. Consistency is more important than frequency, so choose a schedule that can be maintained long-term." },
  ],
  formula: "Total = Sessions per Week x Weeks x (Hourly Rate x Session Length / 60)",
};

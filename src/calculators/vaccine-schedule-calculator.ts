import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vaccineScheduleCalculator: CalculatorDefinition = {
  slug: "vaccine-schedule-calculator",
  title: "Vaccine Schedule Calculator",
  description: "Determine recommended vaccination timing based on age and vaccine type.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["vaccine schedule", "vaccination timing", "immunization calculator"],
  variants: [{
    id: "standard",
    name: "Vaccine Schedule",
    description: "Determine recommended vaccination timing based on age and vaccine type",
    fields: [
      { name: "age", label: "Age", type: "number", suffix: "years", min: 0, max: 100, defaultValue: 30 },
      { name: "vaccine", label: "Vaccine Type", type: "select", options: [{value:"flu",label:"Influenza (Yearly)"},{value:"tdap",label:"Tdap (Every 10 Years)"},{value:"shingles",label:"Shingles (50+)"},{value:"pneumo",label:"Pneumococcal (65+)"}], defaultValue: "flu" },
      { name: "lastDose", label: "Years Since Last Dose", type: "number", suffix: "years", min: 0, max: 50, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const age = inputs.age as number;
      const vaccine = inputs.vaccine as string;
      const lastDose = inputs.lastDose as number;
      if (!age || age < 0) return null;
      const schedules: Record<string, { interval: number; minAge: number; name: string }> = {
        flu: { interval: 1, minAge: 0, name: "Influenza" },
        tdap: { interval: 10, minAge: 11, name: "Tdap Booster" },
        shingles: { interval: 0, minAge: 50, name: "Shingles (Shingrix)" },
        pneumo: { interval: 0, minAge: 65, name: "Pneumococcal" },
      };
      const s = schedules[vaccine] || schedules.flu;
      const ageEligible = age >= s.minAge;
      const dueNow = s.interval > 0 ? lastDose >= s.interval : true;
      const nextDue = s.interval > 0 ? s.interval - lastDose : 0;
      const status = !ageEligible ? "Not yet age-eligible" : dueNow ? "Due now" : "Not yet due";
      return {
        primary: { label: s.name + " Status", value: status },
        details: [
          { label: "Age Eligible", value: ageEligible ? "Yes" : "No (minimum age " + s.minAge + ")" },
          { label: "Interval", value: s.interval > 0 ? "Every " + s.interval + " years" : "One-time series" },
          { label: "Next Due In", value: dueNow || !ageEligible ? "N/A" : formatNumber(Math.max(0, nextDue)) + " years" },
        ],
      };
    },
  }],
  relatedSlugs: ["biological-age-calculator", "blood-donation-eligibility-calculator"],
  faq: [
    { question: "How often should I get a flu shot?", answer: "The influenza vaccine is recommended annually, ideally before flu season begins in October or November." },
    { question: "When should adults get the Tdap booster?", answer: "Adults should receive a Tdap booster every 10 years. The vaccine protects against tetanus, diphtheria, and pertussis." },
  ],
  formula: "Status = Age >= Minimum Age AND Years Since Last >= Interval",
};

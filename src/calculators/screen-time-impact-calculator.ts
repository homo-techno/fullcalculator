import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const screenTimeImpactCalculator: CalculatorDefinition = {
  slug: "screen-time-impact-calculator",
  title: "Screen Time Impact Calculator",
  description: "Assess the potential health effects of your daily screen time across devices.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["screen time health", "screen time calculator", "digital wellness"],
  variants: [{
    id: "standard",
    name: "Screen Time Impact",
    description: "Assess the potential health effects of your daily screen time across devices",
    fields: [
      { name: "phone", label: "Phone Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 3 },
      { name: "computer", label: "Computer Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 4 },
      { name: "tv", label: "TV Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 2 },
      { name: "breaks", label: "Break Frequency", type: "select", options: [{value:"none",label:"Rarely Take Breaks"},{value:"some",label:"Every 1 to 2 Hours"},{value:"frequent",label:"Every 20 to 30 Minutes"}], defaultValue: "some" },
    ],
    calculate: (inputs) => {
      const phone = inputs.phone as number;
      const computer = inputs.computer as number;
      const tv = inputs.tv as number;
      const breaks = inputs.breaks as string;
      const total = (phone || 0) + (computer || 0) + (tv || 0);
      if (total <= 0) return null;
      let eyeStrainScore = total * 10;
      const breakMod: Record<string, number> = { none: 1.3, some: 1.0, frequent: 0.7 };
      eyeStrainScore *= breakMod[breaks] || 1.0;
      eyeStrainScore = Math.min(100, eyeStrainScore);
      const weeklyHrs = total * 7;
      const yearlyHrs = total * 365;
      const risk = eyeStrainScore < 30 ? "Low" : eyeStrainScore < 60 ? "Moderate" : "High";
      return {
        primary: { label: "Daily Screen Time", value: formatNumber(total) + " hours" },
        details: [
          { label: "Weekly Screen Time", value: formatNumber(weeklyHrs) + " hours" },
          { label: "Yearly Screen Time", value: formatNumber(Math.round(yearlyHrs)) + " hours" },
          { label: "Eye Strain Risk Score", value: formatNumber(Math.round(eyeStrainScore)) + " / 100 (" + risk + ")" },
        ],
      };
    },
  }],
  relatedSlugs: ["biological-age-calculator", "sleep-debt-calculator"],
  faq: [
    { question: "How much screen time is too much?", answer: "For adults, more than 6 to 8 hours of non-work screen time per day is associated with negative health effects including eye strain, poor sleep, and sedentary lifestyle risks." },
    { question: "What is the 20-20-20 rule?", answer: "Every 20 minutes, look at something 20 feet away for 20 seconds. This helps reduce digital eye strain significantly." },
  ],
  formula: "Eye Strain Score = Total Hours x 10 x Break Modifier (capped at 100)",
};

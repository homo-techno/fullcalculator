import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eyeStrainBreakCalculator: CalculatorDefinition = {
  slug: "eye-strain-break-calculator",
  title: "Eye Strain Break Calculator",
  description: "Calculate your recommended screen breaks using the 20-20-20 rule and total daily strain.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["eye strain breaks", "20-20-20 rule", "screen break calculator"],
  variants: [{
    id: "standard",
    name: "Eye Strain Break",
    description: "Calculate your recommended screen breaks using the 20-20-20 rule and total daily strain",
    fields: [
      { name: "screenHours", label: "Daily Screen Time", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 8 },
      { name: "breakFrequency", label: "Break Frequency", type: "select", options: [{value:"20",label:"Every 20 Minutes (Recommended)"},{value:"30",label:"Every 30 Minutes"},{value:"60",label:"Every 60 Minutes"}], defaultValue: "20" },
      { name: "screenDistance", label: "Screen Distance", type: "select", options: [{value:"close",label:"Close (Under 20 inches)"},{value:"normal",label:"Normal (20-26 inches)"},{value:"far",label:"Far (Over 26 inches)"}], defaultValue: "normal" },
    ],
    calculate: (inputs) => {
      const hours = inputs.screenHours as number;
      const freq = inputs.breakFrequency as string;
      const distance = inputs.screenDistance as string;
      if (!hours || hours <= 0) return null;
      const freqMin = parseInt(freq) || 20;
      const totalMinutes = hours * 60;
      const breaksNeeded = Math.floor(totalMinutes / freqMin);
      const breakDuration = 20;
      const totalBreakTime = breaksNeeded * breakDuration;
      const strainRisk = distance === "close" ? "High" : distance === "normal" ? "Moderate" : "Low";
      const recommendation = freqMin <= 20 ? "Good frequency" : freqMin <= 30 ? "Acceptable but consider shorter intervals" : "Too infrequent for optimal eye health";
      return {
        primary: { label: "Breaks Needed Today", value: formatNumber(breaksNeeded) + " breaks" },
        details: [
          { label: "Break Duration", value: formatNumber(breakDuration) + " seconds each" },
          { label: "Eye Strain Risk", value: strainRisk },
          { label: "Assessment", value: recommendation },
        ],
      };
    },
  }],
  relatedSlugs: ["standing-desk-timer-calculator", "meditation-timer-calculator"],
  faq: [
    { question: "What is the 20-20-20 rule?", answer: "Every 20 minutes, look at something 20 feet away for at least 20 seconds. This reduces eye strain by allowing your eye muscles to relax from close focus work." },
    { question: "How far should a computer screen be from your eyes?", answer: "Your monitor should be 20 to 26 inches from your eyes, with the top of the screen at or slightly below eye level to reduce neck and eye strain." },
  ],
  formula: "Breaks Needed = Screen Time (minutes) / Break Interval (minutes)",
};

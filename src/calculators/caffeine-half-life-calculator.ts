import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caffeineHalfLifeCalculator: CalculatorDefinition = {
  slug: "caffeine-half-life-calculator",
  title: "Caffeine Half Life Calculator",
  description: "Track how caffeine is metabolized in your body and when it will be mostly eliminated.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["caffeine half life", "caffeine metabolism", "coffee wear off calculator"],
  variants: [{
    id: "standard",
    name: "Caffeine Half Life",
    description: "Track how caffeine is metabolized in your body and when it will be mostly eliminated",
    fields: [
      { name: "caffeineAmount", label: "Caffeine Consumed", type: "number", suffix: "mg", min: 10, max: 1000, defaultValue: 200 },
      { name: "consumeHour", label: "Time of Consumption (24h)", type: "number", suffix: "hour", min: 0, max: 23, defaultValue: 8 },
      { name: "sensitivity", label: "Caffeine Sensitivity", type: "select", options: [{value:"fast",label:"Fast Metabolizer"},{value:"normal",label:"Normal"},{value:"slow",label:"Slow Metabolizer"}], defaultValue: "normal" },
    ],
    calculate: (inputs) => {
      const caffeine = inputs.caffeineAmount as number;
      const hour = inputs.consumeHour as number;
      const sensitivity = inputs.sensitivity as string;
      if (!caffeine || caffeine <= 0) return null;
      const halfLife: Record<string, number> = { fast: 3, normal: 5, slow: 7 };
      const hl = halfLife[sensitivity] || 5;
      const hoursToSleep = 22 - hour;
      const halfLives = hoursToSleep / hl;
      const atBedtime = caffeine * Math.pow(0.5, halfLives);
      const hoursTo25mg = Math.log(25 / caffeine) / Math.log(0.5) * hl;
      const clearHour = (hour + hoursTo25mg) % 24;
      const clearTime = Math.floor(clearHour) + ":" + (Math.round((clearHour % 1) * 60) < 10 ? "0" : "") + Math.round((clearHour % 1) * 60);
      return {
        primary: { label: "Caffeine at Bedtime (10 PM)", value: formatNumber(Math.round(atBedtime)) + " mg" },
        details: [
          { label: "Half Life", value: formatNumber(hl) + " hours" },
          { label: "Time to Reach 25 mg", value: formatNumber(Math.round(hoursTo25mg * 10) / 10) + " hours" },
          { label: "Mostly Clear By", value: clearTime },
        ],
      };
    },
  }],
  relatedSlugs: ["supplement-cost-calculator", "meditation-timer-calculator"],
  faq: [
    { question: "How long does caffeine stay in your system?", answer: "Caffeine has a half life of 3 to 7 hours depending on individual metabolism. It takes 5 to 6 half lives (about 15 to 36 hours) to be nearly fully eliminated." },
    { question: "What time should I stop drinking coffee?", answer: "Most sleep experts recommend stopping caffeine intake 6 to 8 hours before bedtime. If you go to bed at 10 PM, have your last coffee by 2 PM at the latest." },
  ],
  formula: "Remaining Caffeine = Initial Amount x (0.5 ^ (Hours Elapsed / Half Life))",
};

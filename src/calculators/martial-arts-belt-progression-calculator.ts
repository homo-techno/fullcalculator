import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const martialArtsBeltProgressionCalculator: CalculatorDefinition = {
  slug: "martial-arts-belt-progression-calculator",
  title: "Martial Arts Belt Progression Calculator",
  description: "Estimate time to reach your target belt rank based on training frequency and martial art discipline.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["martial arts belt","belt progression","karate belt time","belt rank"],
  variants: [{
    id: "standard",
    name: "Martial Arts Belt Progression",
    description: "Estimate time to reach your target belt rank based on training frequency and martial art discipline.",
    fields: [
      { name: "discipline", label: "Martial Art", type: "select", options: [{ value: "1", label: "Karate" }, { value: "2", label: "Taekwondo" }, { value: "3", label: "Brazilian Jiu-Jitsu" }, { value: "4", label: "Judo" }], defaultValue: "1" },
      { name: "currentBelt", label: "Current Belt Level", type: "select", options: [{ value: "0", label: "White (Beginner)" }, { value: "1", label: "Yellow / Gray" }, { value: "2", label: "Orange / Green" }, { value: "3", label: "Blue / Purple" }, { value: "4", label: "Brown" }, { value: "5", label: "Black 1st Degree" }], defaultValue: "0" },
      { name: "targetBelt", label: "Target Belt Level", type: "select", options: [{ value: "1", label: "Yellow / Gray" }, { value: "2", label: "Orange / Green" }, { value: "3", label: "Blue / Purple" }, { value: "4", label: "Brown" }, { value: "5", label: "Black 1st Degree" }], defaultValue: "5" },
      { name: "sessionsPerWeek", label: "Training Sessions per Week", type: "number", min: 1, max: 7, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const discipline = parseInt(inputs.discipline as string);
    const currentBelt = parseInt(inputs.currentBelt as string);
    const targetBelt = parseInt(inputs.targetBelt as string);
    const sessions = inputs.sessionsPerWeek as number;
    const monthsPerLevel = discipline === 1 ? 6 : discipline === 2 ? 5 : discipline === 3 ? 18 : 8;
    const levelsToGo = Math.max(targetBelt - currentBelt, 0);
    const baseMonths = levelsToGo * monthsPerLevel;
    const frequencyFactor = sessions >= 5 ? 0.7 : sessions >= 3 ? 1 : sessions >= 2 ? 1.4 : 2;
    const adjustedMonths = Math.round(baseMonths * frequencyFactor);
    const years = Math.floor(adjustedMonths / 12);
    const months = adjustedMonths % 12;
    const totalSessions = adjustedMonths * sessions * 4;
    return {
      primary: { label: "Estimated Time", value: (years > 0 ? formatNumber(years) + " yr " : "") + formatNumber(months) + " mo" },
      details: [
        { label: "Levels to Advance", value: formatNumber(levelsToGo) },
        { label: "Total Training Sessions", value: formatNumber(totalSessions) },
        { label: "Training Frequency Factor", value: formatNumber(frequencyFactor) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["boxing-reach-advantage-calculator","running-shoe-mileage-calculator"],
  faq: [
    { question: "How long does it take to get a black belt?", answer: "It varies by discipline. Karate and Taekwondo typically take 3 to 5 years. Brazilian Jiu-Jitsu averages 8 to 12 years." },
    { question: "Does training more often speed up progression?", answer: "Yes, training 4 to 5 times per week can accelerate progression by 30 percent compared to twice weekly." },
    { question: "Are belt systems the same across martial arts?", answer: "No, each art has its own belt system. BJJ has fewer belts but takes longer per belt. Karate and Taekwondo have more intermediate ranks." },
  ],
  formula: "Time = (Levels x Months per Level) x Frequency Factor; varies by discipline",
};

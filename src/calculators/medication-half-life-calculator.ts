import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicationHalfLifeCalculator: CalculatorDefinition = {
  slug: "medication-half-life-calculator",
  title: "Medication Half Life Calculator",
  description: "Estimate drug clearance time based on half-life and doses taken.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["drug half life calculator","medication clearance time","drug elimination rate"],
  variants: [{
    id: "standard",
    name: "Medication Half Life",
    description: "Estimate drug clearance time based on half-life and doses taken.",
    fields: [
      { name: "halfLife", label: "Half-Life (hours)", type: "number", min: 0.5, max: 200, defaultValue: 6 },
      { name: "dose", label: "Last Dose (mg)", type: "number", min: 1, max: 5000, defaultValue: 500 },
      { name: "targetPercent", label: "Clearance Target (%)", type: "number", min: 90, max: 99, defaultValue: 97 },
    ],
    calculate: (inputs) => {
    const halfLife = inputs.halfLife as number;
    const dose = inputs.dose as number;
    const targetPercent = inputs.targetPercent as number;
    const targetFraction = 1 - (targetPercent / 100);
    const halfLives = Math.log(targetFraction) / Math.log(0.5);
    const totalHours = halfLives * halfLife;
    const totalDays = totalHours / 24;
    const remainingMg = dose * targetFraction;
    return {
      primary: { label: "Time to Clear", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Half-Lives Needed", value: formatNumber(Math.round(halfLives * 10) / 10) },
        { label: "Clearance Time in Days", value: formatNumber(Math.round(totalDays * 10) / 10) + " days" },
        { label: "Remaining in Body", value: formatNumber(Math.round(remainingMg * 100) / 100) + " mg" },
        { label: "Target Clearance", value: targetPercent + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["pill-dosage-calculator","liquid-medication-calculator","iv-drip-rate-calculator"],
  faq: [
    { question: "How many half-lives does it take to clear a drug?", answer: "It takes about 5 half-lives to clear approximately 97% of a drug from the body." },
    { question: "What affects drug half-life?", answer: "Liver function, kidney function, age, and body composition all affect half-life." },
    { question: "Does half-life determine dosing frequency?", answer: "Yes, drugs with shorter half-lives generally need to be taken more frequently." },
  ],
  formula: "Hours = (ln(1 - Target%/100) / ln(0.5)) x Half-Life",
};

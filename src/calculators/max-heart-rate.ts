import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const maxHeartRateCalculator: CalculatorDefinition = {
  slug: "max-heart-rate",
  title: "Maximum Heart Rate Calculator",
  description: "Free online maximum heart rate calculator. Estimate your max heart rate using multiple formulas based on age and compare the results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["max heart rate", "maximum heart rate", "MHR", "heart rate age", "220 minus age", "peak heart rate"],
  variants: [
    {
      id: "max-hr",
      name: "Calculate Max Heart Rate",
      fields: [
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 30" },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;

        const foxFormula = 220 - age;
        const tanakaFormula = 208 - 0.7 * age;
        const gulatiFormula = 206 - 0.88 * age;
        const inbarFormula = 205.8 - 0.685 * age;

        const recommended = gender === "female" ? gulatiFormula : tanakaFormula;

        const zone2Low = Math.round(recommended * 0.6);
        const zone2High = Math.round(recommended * 0.7);
        const zone4Low = Math.round(recommended * 0.8);
        const zone4High = Math.round(recommended * 0.9);

        return {
          primary: { label: "Est. Max Heart Rate", value: `${formatNumber(Math.round(recommended))} bpm` },
          details: [
            { label: "Fox Formula (220 - age)", value: `${formatNumber(Math.round(foxFormula))} bpm` },
            { label: "Tanaka Formula", value: `${formatNumber(Math.round(tanakaFormula))} bpm` },
            { label: "Gulati (women-specific)", value: `${formatNumber(Math.round(gulatiFormula))} bpm` },
            { label: "Inbar Formula", value: `${formatNumber(Math.round(inbarFormula))} bpm` },
            { label: "Aerobic Zone (60-70%)", value: `${formatNumber(zone2Low)} - ${formatNumber(zone2High)} bpm` },
            { label: "Threshold Zone (80-90%)", value: `${formatNumber(zone4Low)} - ${formatNumber(zone4High)} bpm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-zone", "fat-burning-zone", "marathon-pace"],
  faq: [
    {
      question: "How do I calculate my maximum heart rate?",
      answer: "The simplest formula is 220 minus your age. More accurate formulas include Tanaka (208 - 0.7 x age) for the general population and Gulati (206 - 0.88 x age) for women. The only truly accurate method is a maximal exercise stress test.",
    },
    {
      question: "Which max heart rate formula is most accurate?",
      answer: "The Tanaka formula (208 - 0.7 x age) is generally considered more accurate than the traditional 220 - age formula. For women, the Gulati formula (206 - 0.88 x age) may be more appropriate. Individual variation can be 10-20 bpm.",
    },
    {
      question: "Does max heart rate decrease with age?",
      answer: "Yes. Maximum heart rate naturally declines with age at a rate of about 0.7 bpm per year. This is a normal physiological change and does not necessarily indicate reduced fitness. Fitness is better measured by resting heart rate and recovery rate.",
    },
  ],
  formula: "Fox: MHR = 220 - age; Tanaka: MHR = 208 - 0.7 x age; Gulati: MHR = 206 - 0.88 x age; Inbar: MHR = 205.8 - 0.685 x age",
};

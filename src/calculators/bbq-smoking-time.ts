import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bbqSmokingTimeCalculator: CalculatorDefinition = {
  slug: "bbq-smoking-time",
  title: "BBQ Smoking Time & Temperature Calculator",
  description: "Free online BBQ smoking time calculator. Get accurate smoking times and temperatures for brisket, ribs, pork shoulder, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bbq smoking time", "smoker calculator", "brisket time", "smoking temperature", "bbq calculator", "pork shoulder time"],
  variants: [
    {
      id: "smoking-time",
      name: "Smoking Time Calculator",
      fields: [
        { name: "weight", label: "Meat Weight (lbs)", type: "number", placeholder: "e.g. 12", step: 0.5 },
        {
          name: "meat",
          label: "Type of Meat",
          type: "select",
          options: [
            { label: "Beef Brisket (Whole Packer)", value: "brisket" },
            { label: "Pork Shoulder / Butt", value: "pork_shoulder" },
            { label: "Pork Ribs (Spare)", value: "spare_ribs" },
            { label: "Pork Ribs (Baby Back)", value: "baby_back" },
            { label: "Whole Chicken", value: "chicken" },
            { label: "Turkey (Whole)", value: "turkey" },
            { label: "Beef Chuck Roast", value: "chuck_roast" },
            { label: "Pork Belly", value: "pork_belly" },
            { label: "Tri-Tip", value: "tri_tip" },
            { label: "Lamb Shoulder", value: "lamb_shoulder" },
          ],
        },
        {
          name: "smokerTemp",
          label: "Smoker Temperature (°F)",
          type: "number",
          placeholder: "e.g. 250",
          defaultValue: 250,
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const meat = inputs.meat as string;
        const smokerTemp = parseFloat(inputs.smokerTemp as string) || 250;

        // Minutes per pound at 225-250°F
        const minsPerPound: Record<string, number> = {
          brisket: 75,
          pork_shoulder: 90,
          spare_ribs: 50,
          baby_back: 45,
          chicken: 40,
          turkey: 35,
          chuck_roast: 60,
          pork_belly: 55,
          tri_tip: 30,
          lamb_shoulder: 65,
        };

        const targetInternal: Record<string, number> = {
          brisket: 203,
          pork_shoulder: 205,
          spare_ribs: 195,
          baby_back: 195,
          chicken: 165,
          turkey: 165,
          chuck_roast: 200,
          pork_belly: 200,
          tri_tip: 135,
          lamb_shoulder: 195,
        };

        const idealSmokerTemp: Record<string, number> = {
          brisket: 250,
          pork_shoulder: 225,
          spare_ribs: 250,
          baby_back: 250,
          chicken: 275,
          turkey: 275,
          chuck_roast: 250,
          pork_belly: 250,
          tri_tip: 225,
          lamb_shoulder: 250,
        };

        const baseMins = minsPerPound[meat] || 60;
        // Adjust for smoker temperature difference from 250
        const tempAdjust = smokerTemp > 0 ? 250 / smokerTemp : 1;
        const totalMinutes = baseMins * weight * tempAdjust;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        const restTime = weight > 8 ? 60 : 30;
        const target = targetInternal[meat] || 200;
        const ideal = idealSmokerTemp[meat] || 250;

        return {
          primary: { label: "Estimated Smoke Time", value: `${hours}h ${minutes}m` },
          details: [
            { label: "Meat Weight", value: `${formatNumber(weight)} lbs` },
            { label: "Smoker Temperature", value: `${formatNumber(smokerTemp)}°F` },
            { label: "Ideal Smoker Temp", value: `${formatNumber(ideal)}°F` },
            { label: "Target Internal Temp", value: `${formatNumber(target)}°F` },
            { label: "Recommended Rest Time", value: `${formatNumber(restTime)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steak-cooking-time", "ham-cooking-time", "brine-calculator"],
  faq: [
    {
      question: "How long does it take to smoke a brisket?",
      answer: "A full packer brisket takes about 60-90 minutes per pound at 250°F. A 12-pound brisket will take roughly 12-18 hours. Always cook to internal temperature (203°F), not time alone.",
    },
    {
      question: "What is the stall when smoking meat?",
      answer: "The stall occurs when the internal temperature plateaus around 150-170°F. This is caused by evaporative cooling. You can wrap the meat in foil or butcher paper (the Texas Crutch) to push through the stall faster.",
    },
    {
      question: "What temperature should I smoke pork shoulder?",
      answer: "Smoke pork shoulder at 225-250°F until it reaches an internal temperature of 195-205°F. At 225°F, plan for about 90 minutes per pound.",
    },
  ],
  formula: "smoke_time = weight_lbs × minutes_per_pound × (250 / actual_smoker_temp)",
};

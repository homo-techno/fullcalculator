import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bbqCookingTimeCalculator: CalculatorDefinition = {
  slug: "bbq-cooking-time-calculator",
  title: "BBQ Cooking Time Calculator",
  description:
    "Free BBQ cooking time calculator. Estimate smoking and grilling times based on meat type, weight, and cooking temperature.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bbq cooking time",
    "smoking time",
    "grill calculator",
    "barbecue timer",
    "meat smoking",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "weight",
          label: "Meat Weight (lbs)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "meatType",
          label: "Meat Type",
          type: "select",
          options: [
            { label: "Brisket", value: "brisket" },
            { label: "Pork Shoulder/Butt", value: "pork_shoulder" },
            { label: "Ribs (Rack)", value: "ribs" },
            { label: "Whole Chicken", value: "chicken" },
            { label: "Pork Loin", value: "pork_loin" },
            { label: "Beef Ribs", value: "beef_ribs" },
          ],
        },
        {
          name: "smokerTemp",
          label: "Smoker Temperature (°F)",
          type: "select",
          options: [
            { label: "225°F (Low & Slow)", value: "225" },
            { label: "250°F (Standard)", value: "250" },
            { label: "275°F (Hot & Fast)", value: "275" },
            { label: "325°F (High Heat)", value: "325" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const meatType = inputs.meatType as string;
        const smokerTemp = parseFloat(inputs.smokerTemp as string) || 250;
        if (!weight || weight <= 0) return null;

        const minsPerLbAt225: Record<string, number> = {
          brisket: 90,
          pork_shoulder: 90,
          ribs: 75,
          chicken: 45,
          pork_loin: 40,
          beef_ribs: 60,
        };

        const targetTemp: Record<string, number> = {
          brisket: 203,
          pork_shoulder: 205,
          ribs: 195,
          chicken: 165,
          pork_loin: 145,
          beef_ribs: 200,
        };

        const baseMinsPerLb = minsPerLbAt225[meatType] || 90;
        const tempFactor = 225 / smokerTemp;
        const adjustedMinsPerLb = baseMinsPerLb * tempFactor;
        const totalMinutes = Math.round(adjustedMinsPerLb * weight);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const target = targetTemp[meatType] || 200;
        const restTime = weight >= 5 ? 30 : 15;

        return {
          primary: {
            label: "Estimated Cook Time",
            value: hours + "h " + mins + "m",
          },
          details: [
            { label: "Target Internal Temp", value: target + " °F" },
            { label: "Smoker Temperature", value: smokerTemp + " °F" },
            { label: "Meat Weight", value: formatNumber(weight, 1) + " lbs" },
            { label: "Minutes per Pound", value: formatNumber(adjustedMinsPerLb, 0) + " min" },
            { label: "Recommended Rest Time", value: restTime + " min" },
            { label: "Total with Rest", value: hours + "h " + (mins + restTime) + "m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "cooking-temp-calculator"],
  faq: [
    {
      question: "How long does it take to smoke a brisket?",
      answer:
        "At 225°F, plan for approximately 1 to 1.5 hours per pound. A 12-pound brisket can take 12-18 hours. Always cook to internal temperature (203°F), not just by time.",
    },
    {
      question: "What is the 3-2-1 method for ribs?",
      answer:
        "The 3-2-1 method involves 3 hours of smoking unwrapped, 2 hours wrapped in foil, and 1 hour unwrapped with sauce. This works well for spare ribs at 225°F.",
    },
  ],
  formula:
    "Cook Time = Weight × Minutes per Pound × (225 / Smoker Temp). Minutes per pound at 225°F: Brisket 90, Pork Shoulder 90, Ribs 75, Chicken 45, Pork Loin 40, Beef Ribs 60.",
};

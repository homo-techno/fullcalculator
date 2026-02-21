import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turkeyCookingTimeCalculator: CalculatorDefinition = {
  slug: "turkey-cooking-time-calculator",
  title: "Turkey Cooking Time Calculator",
  description:
    "Free turkey cooking time calculator. Calculate roasting time and temperature based on turkey weight, stuffed or unstuffed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "turkey cooking time",
    "turkey roasting time",
    "how long to cook turkey",
    "thanksgiving turkey time",
    "turkey temperature",
    "roast turkey calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Turkey Cooking Time",
      fields: [
        {
          name: "weight",
          label: "Turkey Weight (lbs)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "stuffed",
          label: "Stuffed?",
          type: "select",
          options: [
            { label: "Unstuffed", value: "unstuffed" },
            { label: "Stuffed", value: "stuffed" },
          ],
        },
        {
          name: "method",
          label: "Cooking Method",
          type: "select",
          options: [
            { label: "Conventional (325\u00B0F)", value: "conventional" },
            { label: "High Heat (425\u00B0F start)", value: "high_heat" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const stuffed = inputs.stuffed as string;
        const method = inputs.method as string;
        if (!weight || !stuffed || !method) return null;

        let minPerLb: number;
        let ovenTemp: string;

        if (method === "high_heat") {
          // High heat method: start at 425 for 30 min, then reduce to 325
          minPerLb = stuffed === "stuffed" ? 15 : 13;
          ovenTemp = "425\u00B0F for 30 min, then 325\u00B0F";
        } else {
          // Conventional 325F
          if (stuffed === "stuffed") {
            if (weight <= 10) minPerLb = 20;
            else if (weight <= 18) minPerLb = 18;
            else minPerLb = 16;
          } else {
            if (weight <= 10) minPerLb = 17;
            else if (weight <= 18) minPerLb = 15;
            else minPerLb = 13;
          }
          ovenTemp = "325\u00B0F";
        }

        const totalMinutes = minPerLb * weight;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        const timeStr = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

        // Range: +/- 15 minutes
        const lowMin = totalMinutes - 15;
        const highMin = totalMinutes + 15;
        const lowHr = Math.floor(lowMin / 60);
        const lowRem = Math.round(lowMin % 60);
        const highHr = Math.floor(highMin / 60);
        const highRem = Math.round(highMin % 60);
        const rangeStr = `${lowHr}:${String(lowRem).padStart(2, "0")} - ${highHr}:${String(highRem).padStart(2, "0")}`;

        const servings = Math.floor(weight * 1.0); // ~1 lb per person with leftovers

        return {
          primary: {
            label: "Estimated Cooking Time",
            value: timeStr,
          },
          details: [
            { label: "Time Range", value: rangeStr },
            { label: "Oven Temperature", value: ovenTemp },
            { label: "Turkey Weight", value: weight + " lbs" },
            { label: "Type", value: stuffed === "stuffed" ? "Stuffed" : "Unstuffed" },
            { label: "Internal Temp (Thigh)", value: "165\u00B0F (74\u00B0C)" },
            { label: "Internal Temp (Stuffing)", value: stuffed === "stuffed" ? "165\u00B0F" : "N/A" },
            { label: "Rest Time", value: "30-45 min" },
            { label: "Approx. Servings", value: formatNumber(servings, 0) + " people" },
          ],
          note: "Always verify doneness with a meat thermometer. The thickest part of the thigh should read 165\u00B0F.",
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "party-food-calculator"],
  faq: [
    {
      question: "How long do you cook a turkey per pound?",
      answer:
        "At 325\u00B0F, an unstuffed turkey takes about 13-17 minutes per pound depending on size. A stuffed turkey takes 15-20 minutes per pound. Smaller turkeys require more minutes per pound than larger ones.",
    },
    {
      question: "What temperature should a turkey be when done?",
      answer:
        "The USDA recommends an internal temperature of 165\u00B0F (74\u00B0C) in the thickest part of the thigh, away from bone. If stuffed, the stuffing must also reach 165\u00B0F.",
    },
    {
      question: "Should I cook the turkey stuffed or unstuffed?",
      answer:
        "Unstuffed turkeys cook faster and more evenly. The USDA recommends cooking stuffing separately for food safety, as a stuffed turkey requires longer cooking time, which can dry out the breast meat.",
    },
    {
      question: "How long should a turkey rest before carving?",
      answer:
        "Let the turkey rest for 30-45 minutes after removing from the oven. This allows the juices to redistribute, resulting in moister meat that's easier to carve.",
    },
  ],
  formula:
    "Unstuffed Turkey at 325\u00B0F: 8-12 lbs = 17 min/lb, 12-18 lbs = 15 min/lb, 18-24 lbs = 13 min/lb. Stuffed Turkey at 325\u00B0F: 8-12 lbs = 20 min/lb, 12-18 lbs = 18 min/lb, 18-24 lbs = 16 min/lb. Internal temperature must reach 165\u00B0F.",
};

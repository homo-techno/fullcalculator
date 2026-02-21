import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meatCookingTimeCalculator: CalculatorDefinition = {
  slug: "meat-cooking-time-calculator",
  title: "Meat Cooking Time Calculator",
  description:
    "Free meat cooking time calculator. Calculate oven roasting time and internal temperature for beef, pork, chicken, and lamb by weight and doneness.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "meat cooking time",
    "roasting time",
    "cooking time by weight",
    "how long to cook beef",
    "pork cooking time",
    "chicken cooking time",
    "lamb cooking time",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Cooking Time",
      fields: [
        {
          name: "weight",
          label: "Weight (lbs)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "meat",
          label: "Type of Meat",
          type: "select",
          options: [
            { label: "Beef Roast", value: "beef" },
            { label: "Pork Roast", value: "pork" },
            { label: "Whole Chicken", value: "chicken" },
            { label: "Lamb Leg", value: "lamb" },
            { label: "Pork Tenderloin", value: "pork_tenderloin" },
            { label: "Beef Tenderloin", value: "beef_tenderloin" },
          ],
        },
        {
          name: "doneness",
          label: "Doneness",
          type: "select",
          options: [
            { label: "Rare", value: "rare" },
            { label: "Medium Rare", value: "medium_rare" },
            { label: "Medium", value: "medium" },
            { label: "Medium Well", value: "medium_well" },
            { label: "Well Done", value: "well_done" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const meat = inputs.meat as string;
        const doneness = inputs.doneness as string;
        if (!weight || !meat || !doneness) return null;

        // Minutes per pound at 325-350F by meat type and doneness
        const cookingData: Record<string, Record<string, { minPerLb: number; ovenTemp: number; internalTemp: number }>> = {
          beef: {
            rare: { minPerLb: 15, ovenTemp: 325, internalTemp: 125 },
            medium_rare: { minPerLb: 18, ovenTemp: 325, internalTemp: 135 },
            medium: { minPerLb: 20, ovenTemp: 325, internalTemp: 145 },
            medium_well: { minPerLb: 23, ovenTemp: 325, internalTemp: 150 },
            well_done: { minPerLb: 27, ovenTemp: 325, internalTemp: 160 },
          },
          pork: {
            rare: { minPerLb: 20, ovenTemp: 325, internalTemp: 145 },
            medium_rare: { minPerLb: 22, ovenTemp: 325, internalTemp: 145 },
            medium: { minPerLb: 25, ovenTemp: 325, internalTemp: 150 },
            medium_well: { minPerLb: 28, ovenTemp: 325, internalTemp: 155 },
            well_done: { minPerLb: 30, ovenTemp: 325, internalTemp: 160 },
          },
          chicken: {
            rare: { minPerLb: 20, ovenTemp: 350, internalTemp: 165 },
            medium_rare: { minPerLb: 20, ovenTemp: 350, internalTemp: 165 },
            medium: { minPerLb: 20, ovenTemp: 350, internalTemp: 165 },
            medium_well: { minPerLb: 20, ovenTemp: 350, internalTemp: 165 },
            well_done: { minPerLb: 22, ovenTemp: 350, internalTemp: 175 },
          },
          lamb: {
            rare: { minPerLb: 15, ovenTemp: 325, internalTemp: 125 },
            medium_rare: { minPerLb: 17, ovenTemp: 325, internalTemp: 130 },
            medium: { minPerLb: 20, ovenTemp: 325, internalTemp: 140 },
            medium_well: { minPerLb: 23, ovenTemp: 325, internalTemp: 150 },
            well_done: { minPerLb: 27, ovenTemp: 325, internalTemp: 160 },
          },
          pork_tenderloin: {
            rare: { minPerLb: 15, ovenTemp: 425, internalTemp: 145 },
            medium_rare: { minPerLb: 17, ovenTemp: 425, internalTemp: 145 },
            medium: { minPerLb: 20, ovenTemp: 425, internalTemp: 150 },
            medium_well: { minPerLb: 22, ovenTemp: 425, internalTemp: 155 },
            well_done: { minPerLb: 25, ovenTemp: 425, internalTemp: 160 },
          },
          beef_tenderloin: {
            rare: { minPerLb: 12, ovenTemp: 425, internalTemp: 125 },
            medium_rare: { minPerLb: 14, ovenTemp: 425, internalTemp: 135 },
            medium: { minPerLb: 16, ovenTemp: 425, internalTemp: 145 },
            medium_well: { minPerLb: 18, ovenTemp: 425, internalTemp: 150 },
            well_done: { minPerLb: 22, ovenTemp: 425, internalTemp: 160 },
          },
        };

        const data = cookingData[meat]?.[doneness];
        if (!data) return null;

        const totalMinutes = data.minPerLb * weight;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        const restTime = meat === "chicken" ? 15 : 20;

        const timeStr = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

        const donenessLabel = doneness.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const meatLabel = meat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        // Chicken always must be fully cooked
        const note =
          meat === "chicken"
            ? "Chicken must always reach 165\u00B0F internal temperature for food safety."
            : undefined;

        return {
          primary: {
            label: "Total Cooking Time",
            value: timeStr,
          },
          details: [
            { label: "Meat", value: meatLabel },
            { label: "Weight", value: weight + " lbs" },
            { label: "Doneness", value: donenessLabel },
            { label: "Oven Temperature", value: data.ovenTemp + "\u00B0F" },
            { label: "Target Internal Temp", value: data.internalTemp + "\u00B0F" },
            { label: "Rest Time After Cooking", value: restTime + " min" },
            { label: "Minutes per Pound", value: data.minPerLb + " min/lb" },
          ],
          note,
        };
      },
    },
  ],
  relatedSlugs: ["turkey-cooking-time-calculator", "grill-temperature-calculator", "smoke-meat-time-calculator"],
  faq: [
    {
      question: "Why should I let meat rest after cooking?",
      answer:
        "Resting allows juices to redistribute throughout the meat. During cooking, juices are pushed to the center. A 15-20 minute rest gives them time to even out, resulting in juicier, more flavorful meat.",
    },
    {
      question: "Should I use a meat thermometer?",
      answer:
        "Yes, always use an instant-read meat thermometer for accuracy. Insert it into the thickest part of the meat, avoiding bones. Cooking times are estimates; internal temperature is the only reliable way to check doneness.",
    },
    {
      question: "Does the temperature rise after removing meat from the oven?",
      answer:
        "Yes, this is called carryover cooking. The internal temperature can rise 5-10\u00B0F after removing meat from the oven. Remove meat when it's about 5\u00B0F below your target temperature.",
    },
  ],
  formula:
    "Cooking Time = Weight (lbs) x Minutes per Pound. Oven temperatures and minutes per pound vary by meat type and desired doneness. Always verify with an internal meat thermometer.",
};

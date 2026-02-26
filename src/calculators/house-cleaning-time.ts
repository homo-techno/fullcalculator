import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const houseCleaningTimeCalculator: CalculatorDefinition = {
  slug: "house-cleaning-time-calculator",
  title: "House Cleaning Time Estimator",
  description:
    "Free house cleaning time calculator. Estimate how long it takes to clean your home by room count, cleaning depth, and house size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "house cleaning time",
    "cleaning time estimator",
    "how long to clean house",
    "cleaning schedule calculator",
    "room cleaning time",
  ],
  variants: [
    {
      id: "by-rooms",
      name: "By Room Count",
      description: "Estimate cleaning time by number and type of rooms",
      fields: [
        {
          name: "bedrooms",
          label: "Bedrooms",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 10,
          step: 1,
          defaultValue: 3,
        },
        {
          name: "bathrooms",
          label: "Bathrooms",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 8,
          step: 1,
          defaultValue: 2,
        },
        {
          name: "otherRooms",
          label: "Other Rooms (kitchen, living, etc.)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 10,
          step: 1,
          defaultValue: 3,
        },
        {
          name: "cleaningDepth",
          label: "Cleaning Depth",
          type: "select",
          options: [
            { label: "Quick Tidy (surface clean)", value: "quick" },
            { label: "Standard Clean", value: "standard" },
            { label: "Deep Clean", value: "deep" },
          ],
          defaultValue: "standard",
        },
        {
          name: "messLevel",
          label: "Current Mess Level",
          type: "select",
          options: [
            { label: "Tidy (maintained regularly)", value: "tidy" },
            { label: "Average", value: "average" },
            { label: "Messy", value: "messy" },
          ],
          defaultValue: "average",
        },
      ],
      calculate: (inputs) => {
        const bedrooms = parseFloat(inputs.bedrooms as string);
        const bathrooms = parseFloat(inputs.bathrooms as string);
        const otherRooms = parseFloat(inputs.otherRooms as string);
        const depth = inputs.cleaningDepth as string;
        const mess = inputs.messLevel as string;
        if (isNaN(bedrooms) || isNaN(bathrooms) || isNaN(otherRooms)) return null;

        // Base minutes per room type (standard clean, average mess)
        const bedroomMin = 20;
        const bathroomMin = 30;
        const kitchenMin = 35;
        const otherMin = 20;

        // Assume first "other room" is kitchen
        const kitchenCount = otherRooms >= 1 ? 1 : 0;
        const remainingOther = Math.max(0, otherRooms - kitchenCount);

        let totalMin = bedrooms * bedroomMin + bathrooms * bathroomMin + kitchenCount * kitchenMin + remainingOther * otherMin;

        // Depth multiplier
        const depthMult = depth === "quick" ? 0.5 : depth === "deep" ? 1.8 : 1.0;
        totalMin *= depthMult;

        // Mess multiplier
        const messMult = mess === "tidy" ? 0.8 : mess === "messy" ? 1.4 : 1.0;
        totalMin *= messMult;

        totalMin = Math.round(totalMin);
        const hours = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

        return {
          primary: { label: "Estimated Cleaning Time", value: timeStr },
          details: [
            { label: "Total Minutes", value: formatNumber(totalMin, 0) },
            { label: "Bedrooms", value: `${formatNumber(bedrooms, 0)} rooms` },
            { label: "Bathrooms", value: `${formatNumber(bathrooms, 0)} rooms` },
            { label: "Other Rooms", value: `${formatNumber(otherRooms, 0)} rooms` },
            { label: "Cleaning Type", value: depth === "quick" ? "Quick Tidy" : depth === "deep" ? "Deep Clean" : "Standard" },
          ],
          note: "Times are for one person cleaning. With two people, divide time by approximately 1.7 (not exactly half due to coordination).",
        };
      },
    },
    {
      id: "by-sqft",
      name: "By Square Footage",
      description: "Estimate cleaning time by home size",
      fields: [
        {
          name: "sqft",
          label: "Home Size",
          type: "number",
          placeholder: "e.g. 2000",
          suffix: "sq ft",
          min: 200,
          max: 10000,
          step: 100,
        },
        {
          name: "cleaningDepth",
          label: "Cleaning Depth",
          type: "select",
          options: [
            { label: "Quick Tidy", value: "quick" },
            { label: "Standard Clean", value: "standard" },
            { label: "Deep Clean", value: "deep" },
          ],
          defaultValue: "standard",
        },
        {
          name: "cleaners",
          label: "Number of Cleaners",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 5,
          step: 1,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const sqft = parseFloat(inputs.sqft as string);
        const depth = inputs.cleaningDepth as string;
        const cleaners = parseFloat(inputs.cleaners as string);
        if (!sqft || !cleaners) return null;

        // Approx: 1 hour per 1000 sqft for standard clean (1 person)
        const baseRate = depth === "quick" ? 0.5 : depth === "deep" ? 1.5 : 1.0;
        const totalMinutes = Math.round((sqft / 1000) * 60 * baseRate);
        const adjustedMinutes = Math.round(totalMinutes / Math.pow(cleaners, 0.8)); // diminishing returns

        const hours = Math.floor(adjustedMinutes / 60);
        const mins = adjustedMinutes % 60;
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

        return {
          primary: { label: "Estimated Cleaning Time", value: timeStr },
          details: [
            { label: "Total Person-Minutes", value: formatNumber(totalMinutes, 0) },
            { label: "With Cleaners", value: `${formatNumber(cleaners, 0)} people` },
            { label: "Home Size", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "Cleaning Depth", value: depth === "quick" ? "Quick Tidy" : depth === "deep" ? "Deep Clean" : "Standard" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["laundry-cost-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "How long does it take to clean a 3-bedroom house?",
      answer:
        "A standard clean of a 3-bedroom, 2-bathroom house typically takes 2-3 hours for one person. A quick tidy might take 1-1.5 hours, while a deep clean could take 4-6 hours.",
    },
    {
      question: "How often should I deep clean my house?",
      answer:
        "Most experts recommend a deep clean every 3-6 months, with standard cleaning weekly or biweekly. High-traffic areas like kitchens and bathrooms benefit from more frequent attention.",
    },
    {
      question: "What rooms take the longest to clean?",
      answer:
        "Kitchens and bathrooms typically take the longest due to appliances, fixtures, and the need for disinfection. A kitchen deep clean can take 45-60 minutes, while bathrooms take 30-45 minutes each.",
    },
  ],
  formula:
    "Time ≈ (Bedrooms x 20 + Bathrooms x 30 + Kitchen x 35 + Other x 20) x Depth Multiplier x Mess Multiplier",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turkeySizeCalculator: CalculatorDefinition = {
  slug: "turkey-size-calculator",
  title: "Turkey Size Calculator",
  description:
    "Free turkey size calculator. Determine how big a turkey to buy based on number of guests, whether you want leftovers, and serving style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "turkey size calculator",
    "how big turkey",
    "turkey per person",
    "thanksgiving turkey size",
    "turkey weight guests",
    "turkey pounds per person",
  ],
  variants: [
    {
      id: "by-guests",
      name: "By Number of Guests",
      description:
        "Calculate the ideal turkey size based on your guest count and preferences",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          step: 1,
        },
        {
          name: "leftovers",
          label: "Leftover Preference",
          type: "select",
          options: [
            { label: "No leftovers", value: "none" },
            { label: "Some leftovers", value: "some" },
            { label: "Generous leftovers", value: "generous" },
          ],
          defaultValue: "some",
        },
        {
          name: "eaters",
          label: "Appetite Level",
          type: "select",
          options: [
            { label: "Light eaters / many kids", value: "light" },
            { label: "Average eaters", value: "average" },
            { label: "Big eaters", value: "big" },
          ],
          defaultValue: "average",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const leftovers = inputs.leftovers as string;
        const eaters = inputs.eaters as string;
        if (!guests || guests <= 0) return null;

        // Base: 1 lb per person for light, 1.25 for average, 1.5 for big
        let lbsPerPerson = 1.25;
        if (eaters === "light") lbsPerPerson = 1.0;
        if (eaters === "big") lbsPerPerson = 1.5;

        // Leftover multiplier
        let leftoverMult = 1.0;
        if (leftovers === "some") leftoverMult = 1.25;
        if (leftovers === "generous") leftoverMult = 1.5;

        const totalLbs = guests * lbsPerPerson * leftoverMult;
        const totalKg = totalLbs * 0.453592;
        const cookTimeHours = totalLbs <= 12 ? totalLbs * (15 / 60) : 12 * (15 / 60) + (totalLbs - 12) * (12 / 60);
        const servingsOfMeat = totalLbs * 0.7 * 16 / 6; // ~70% yield, 6 oz servings

        return {
          primary: {
            label: `Turkey for ${formatNumber(guests)} guests`,
            value: `${formatNumber(totalLbs, 1)} lbs`,
          },
          details: [
            {
              label: "Recommended Turkey Weight",
              value: `${formatNumber(totalLbs, 1)} lbs (${formatNumber(totalKg, 1)} kg)`,
            },
            {
              label: "Pounds per Person",
              value: formatNumber(lbsPerPerson * leftoverMult, 2),
            },
            {
              label: "Estimated Servings (6 oz each)",
              value: formatNumber(servingsOfMeat, 0),
            },
            {
              label: "Approx Roasting Time (unstuffed, 325\u00b0F)",
              value: `${formatNumber(cookTimeHours, 1)} hours`,
            },
          ],
          note:
            totalLbs > 22
              ? "Consider buying two smaller turkeys instead of one very large one for more even cooking."
              : undefined,
        };
      },
    },
    {
      id: "by-weight",
      name: "By Turkey Weight",
      description:
        "Calculate how many guests a specific turkey size will feed",
      fields: [
        {
          name: "weight",
          label: "Turkey Weight (lbs)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          step: 0.5,
        },
        {
          name: "appetite",
          label: "Appetite Level",
          type: "select",
          options: [
            { label: "Light eaters", value: "light" },
            { label: "Average eaters", value: "average" },
            { label: "Big eaters", value: "big" },
          ],
          defaultValue: "average",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const appetite = inputs.appetite as string;
        if (!weight || weight <= 0) return null;

        let lbsPerPerson = 1.25;
        if (appetite === "light") lbsPerPerson = 1.0;
        if (appetite === "big") lbsPerPerson = 1.5;

        const guestsNoLeftovers = weight / lbsPerPerson;
        const guestsWithLeftovers = weight / (lbsPerPerson * 1.25);
        const cookTimeHours = weight <= 12 ? weight * (15 / 60) : 12 * (15 / 60) + (weight - 12) * (12 / 60);

        return {
          primary: {
            label: `${formatNumber(weight, 1)} lb turkey`,
            value: `Feeds ${formatNumber(guestsNoLeftovers, 0)} guests`,
          },
          details: [
            {
              label: "Guests (no leftovers)",
              value: formatNumber(guestsNoLeftovers, 0),
            },
            {
              label: "Guests (with leftovers)",
              value: formatNumber(guestsWithLeftovers, 0),
            },
            {
              label: "Approx Roasting Time (unstuffed, 325\u00b0F)",
              value: `${formatNumber(cookTimeHours, 1)} hours`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "turkey-defrost-calculator",
    "ham-per-person-calculator",
    "potluck-planner-calculator",
  ],
  faq: [
    {
      question: "How many pounds of turkey per person?",
      answer:
        "Plan for about 1.25 pounds of uncooked turkey per person. This accounts for bone weight and yields about 6 oz of meat per serving. For big eaters or if you want leftovers, increase to 1.5 lbs per person.",
    },
    {
      question: "What if I need a turkey larger than 22 lbs?",
      answer:
        "Turkeys larger than 22 lbs cook unevenly and are harder to handle. If you need more meat, buy two smaller turkeys (e.g., two 14 lb birds instead of one 28 lb). They cook faster and more evenly.",
    },
    {
      question: "How long does it take to cook a turkey?",
      answer:
        "At 325\u00b0F, an unstuffed turkey takes approximately 13-15 minutes per pound for birds under 12 lbs and 12-13 minutes per pound for larger birds. Always use a meat thermometer and cook to 165\u00b0F internal temperature.",
    },
  ],
  formula:
    "Turkey Weight (lbs) = Guests x Lbs per Person x Leftover Multiplier | Roasting ~13-15 min/lb at 325\u00b0F",
};

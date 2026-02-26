import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hamPerPersonCalculator: CalculatorDefinition = {
  slug: "ham-per-person-calculator",
  title: "Ham Per Person Calculator",
  description:
    "Free ham per person calculator. Determine the right ham size for your holiday meal based on number of guests, bone-in vs boneless, and whether you want leftovers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ham per person",
    "ham size calculator",
    "how much ham",
    "ham for crowd",
    "holiday ham calculator",
    "ham pounds per person",
  ],
  variants: [
    {
      id: "by-guests",
      name: "By Number of Guests",
      description:
        "Calculate how much ham to buy based on your guest count",
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
          name: "hamType",
          label: "Ham Type",
          type: "select",
          options: [
            { label: "Bone-in Ham", value: "bone_in" },
            { label: "Boneless Ham", value: "boneless" },
            { label: "Spiral-Cut Ham (bone-in)", value: "spiral" },
          ],
          defaultValue: "bone_in",
        },
        {
          name: "leftovers",
          label: "Leftovers",
          type: "select",
          options: [
            { label: "No leftovers", value: "none" },
            { label: "Some leftovers", value: "some" },
            { label: "Generous leftovers", value: "generous" },
          ],
          defaultValue: "some",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const hamType = inputs.hamType as string;
        const leftovers = inputs.leftovers as string;
        if (!guests || guests <= 0) return null;

        // Bone-in: ~3/4 lb per person, Boneless: ~1/3 lb per person
        let lbsPerPerson = 0.75;
        if (hamType === "boneless") lbsPerPerson = 0.33;
        if (hamType === "spiral") lbsPerPerson = 0.75;

        let leftoverMult = 1.0;
        if (leftovers === "some") leftoverMult = 1.25;
        if (leftovers === "generous") leftoverMult = 1.5;

        const totalLbs = guests * lbsPerPerson * leftoverMult;
        const totalKg = totalLbs * 0.453592;

        // Cooking time: bone-in ~15-18 min/lb at 325F, boneless ~10-14 min/lb
        const cookMinPerLb = hamType === "boneless" ? 12 : 16;
        const cookTimeMin = totalLbs * cookMinPerLb;
        const cookTimeHrs = cookTimeMin / 60;

        // Yield: bone-in ~60% meat, boneless ~90% meat
        const yieldPct = hamType === "boneless" ? 0.9 : 0.6;
        const meatLbs = totalLbs * yieldPct;
        const servings6oz = (meatLbs * 16) / 6;

        return {
          primary: {
            label: `Ham for ${formatNumber(guests)} guests`,
            value: `${formatNumber(totalLbs, 1)} lbs`,
          },
          details: [
            {
              label: "Recommended Ham Weight",
              value: `${formatNumber(totalLbs, 1)} lbs (${formatNumber(totalKg, 1)} kg)`,
            },
            {
              label: "Edible Meat",
              value: `~${formatNumber(meatLbs, 1)} lbs`,
            },
            {
              label: "Estimated Servings (6 oz)",
              value: formatNumber(servings6oz, 0),
            },
            {
              label: "Approx Heating Time (325\u00b0F)",
              value: `${formatNumber(cookTimeHrs, 1)} hours`,
            },
          ],
          note: "Most store-bought hams are pre-cooked. You only need to heat them to 140\u00b0F internal temperature. An uncooked ham must reach 160\u00b0F.",
        };
      },
    },
    {
      id: "by-weight",
      name: "By Ham Weight",
      description: "Calculate how many guests a specific ham will feed",
      fields: [
        {
          name: "weight",
          label: "Ham Weight (lbs)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          step: 0.5,
        },
        {
          name: "hamType",
          label: "Ham Type",
          type: "select",
          options: [
            { label: "Bone-in Ham", value: "bone_in" },
            { label: "Boneless Ham", value: "boneless" },
          ],
          defaultValue: "bone_in",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const hamType = inputs.hamType as string;
        if (!weight || weight <= 0) return null;

        const lbsPerPerson = hamType === "boneless" ? 0.33 : 0.75;
        const yieldPct = hamType === "boneless" ? 0.9 : 0.6;

        const guestsNoLeftovers = weight / lbsPerPerson;
        const guestsWithLeftovers = weight / (lbsPerPerson * 1.25);
        const meatLbs = weight * yieldPct;

        return {
          primary: {
            label: `${formatNumber(weight, 1)} lb ${hamType === "boneless" ? "boneless" : "bone-in"} ham`,
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
              label: "Usable Meat",
              value: `~${formatNumber(meatLbs, 1)} lbs`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "turkey-size-calculator",
    "mashed-potatoes-serving-calculator",
    "potluck-planner-calculator",
  ],
  faq: [
    {
      question: "How many pounds of ham per person?",
      answer:
        "For bone-in ham, plan 3/4 pound per person. For boneless ham, plan 1/3 pound per person. If you want leftovers, add 25-50% more. A 10 lb bone-in ham feeds about 13 people.",
    },
    {
      question: "What is the difference between bone-in and boneless ham?",
      answer:
        "Bone-in ham has more flavor because the bone adds richness during cooking, but about 40% of the weight is bone and fat. Boneless ham is easier to slice and has about 90% usable meat, but may have slightly less flavor.",
    },
  ],
  formula:
    "Ham Weight (lbs) = Guests x Lbs per Person x Leftover Multiplier | Bone-in: 3/4 lb/person | Boneless: 1/3 lb/person",
};

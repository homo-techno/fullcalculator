import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const guineaPigFoodCalculator: CalculatorDefinition = {
  slug: "guinea-pig-food-calculator",
  title: "Guinea Pig Food Calculator",
  description:
    "Free guinea pig food calculator. Determine the right amount of hay, pellets, vegetables, and vitamin C for your guinea pig based on weight and age.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "guinea pig food calculator",
    "guinea pig diet",
    "how much to feed guinea pig",
    "guinea pig pellets",
    "guinea pig vitamin C",
  ],
  variants: [
    {
      id: "daily-diet",
      name: "Daily Diet Plan",
      description: "Calculate daily food amounts for your guinea pig",
      fields: [
        {
          name: "weight",
          label: "Guinea Pig Weight",
          type: "number",
          placeholder: "e.g. 900",
          suffix: "grams",
          min: 200,
          max: 1500,
          step: 10,
          defaultValue: 900,
        },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Baby (under 6 months)", value: "baby" },
            { label: "Young (6-12 months)", value: "young" },
            { label: "Adult (1-5 years)", value: "adult" },
            { label: "Senior (over 5 years)", value: "senior" },
          ],
          defaultValue: "adult",
        },
        {
          name: "numPigs",
          label: "Number of Guinea Pigs",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const ageGroup = inputs.ageGroup as string;
        const numPigs = parseFloat(inputs.numPigs as string);
        if (!weight || !ageGroup || !numPigs) return null;

        // Hay: unlimited, but approx body size pile per day
        const hayGrams = Math.round(weight * 0.8);

        // Pellets: 1/8 cup per pig per day for adults, more for babies
        let pelletsTablespoons: number;
        if (ageGroup === "baby" || ageGroup === "young") {
          pelletsTablespoons = 4; // ~1/4 cup
        } else {
          pelletsTablespoons = 2; // ~1/8 cup
        }

        // Vegetables: 1 cup per pig per day
        const vegCups = 1;

        // Vitamin C: 10-30 mg/day
        let vitaminC: number;
        if (ageGroup === "baby") vitaminC = 30;
        else if (ageGroup === "senior") vitaminC = 25;
        else vitaminC = 15;

        // Water: 80-100 ml per day
        const waterMl = Math.round(weight * 0.1);

        const totalHay = hayGrams * numPigs;
        const totalPellets = pelletsTablespoons * numPigs;
        const totalVeg = vegCups * numPigs;
        const totalWater = waterMl * numPigs;

        return {
          primary: { label: "Daily Hay (per pig)", value: `${formatNumber(hayGrams, 0)} g (unlimited)` },
          details: [
            { label: "Pellets (per pig)", value: `${formatNumber(pelletsTablespoons, 0)} tbsp (~1/8 cup)` },
            { label: "Fresh Vegetables (per pig)", value: `${formatNumber(vegCups, 0)} cup` },
            { label: "Vitamin C Needed", value: `${formatNumber(vitaminC, 0)} mg/day` },
            { label: "Water (per pig)", value: `${formatNumber(waterMl, 0)} ml/day` },
            { label: "Total Hay (all pigs)", value: `${formatNumber(totalHay, 0)} g` },
            { label: "Total Vegetables", value: `${formatNumber(totalVeg, 0)} cups` },
          ],
          note: "Timothy hay should make up 80% of the diet and be available at all times. Alfalfa hay is suitable only for babies and pregnant/nursing guinea pigs.",
        };
      },
    },
    {
      id: "monthly-cost",
      name: "Monthly Food Cost",
      description: "Estimate monthly food costs for guinea pigs",
      fields: [
        {
          name: "numPigs",
          label: "Number of Guinea Pigs",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 2,
        },
        {
          name: "hayCostPerBag",
          label: "Hay Cost (per bag/bale)",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 1,
          max: 100,
          step: 0.5,
          defaultValue: 15,
        },
        {
          name: "pelletCost",
          label: "Pellet Cost (per bag)",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          min: 1,
          max: 50,
          step: 0.5,
          defaultValue: 8,
        },
        {
          name: "vegWeeklyCost",
          label: "Fresh Veggies (weekly cost)",
          type: "number",
          placeholder: "e.g. 10",
          prefix: "$",
          min: 1,
          max: 100,
          step: 0.5,
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const numPigs = parseFloat(inputs.numPigs as string);
        const hayCost = parseFloat(inputs.hayCostPerBag as string);
        const pelletCost = parseFloat(inputs.pelletCost as string);
        const vegWeekly = parseFloat(inputs.vegWeeklyCost as string);
        if (!numPigs || !hayCost || !pelletCost || !vegWeekly) return null;

        // Estimates: 1 bag hay lasts 1 pig ~2 weeks, pellets ~2 months
        const hayBagsPerMonth = numPigs * 2;
        const pelletBagsPerMonth = numPigs * 0.5;
        const monthlyHay = hayBagsPerMonth * hayCost;
        const monthlyPellets = pelletBagsPerMonth * pelletCost;
        const monthlyVeg = vegWeekly * 4.33;
        const monthlyBedding = numPigs * 10;
        const total = monthlyHay + monthlyPellets + monthlyVeg + monthlyBedding;

        return {
          primary: { label: "Monthly Food Cost", value: `$${formatNumber(total)}` },
          details: [
            { label: "Hay", value: `$${formatNumber(monthlyHay)}/month` },
            { label: "Pellets", value: `$${formatNumber(monthlyPellets)}/month` },
            { label: "Fresh Vegetables", value: `$${formatNumber(monthlyVeg)}/month` },
            { label: "Bedding (estimated)", value: `$${formatNumber(monthlyBedding)}/month` },
            { label: "Yearly Estimate", value: `$${formatNumber(total * 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pet-age-comparison-calculator", "hamster-wheel-calculator"],
  faq: [
    {
      question: "What should guinea pigs eat daily?",
      answer:
        "Guinea pigs need unlimited timothy hay (80% of diet), 1/8 cup of quality pellets, 1 cup of fresh vegetables (bell peppers, romaine lettuce, cilantro), and fresh water daily. They also need 10-30 mg of vitamin C since they cannot produce it themselves.",
    },
    {
      question: "Do guinea pigs need vitamin C supplements?",
      answer:
        "Yes! Guinea pigs, like humans, cannot synthesize vitamin C and must get it from diet. Bell peppers, kale, and parsley are excellent sources. Vitamin C drops can supplement if dietary intake is insufficient. Deficiency causes scurvy.",
    },
  ],
  formula:
    "Hay: unlimited (~80% body weight pile/day) | Pellets: 1/8 cup/day | Vegetables: 1 cup/day | Vitamin C: 10-30 mg/day",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const bottleSizeOptions = [
  { label: "12 oz (355 ml)", value: "12" },
  { label: "16.9 oz (500 ml)", value: "16.9" },
  { label: "20 oz (591 ml)", value: "20" },
  { label: "24 oz (710 ml)", value: "24" },
  { label: "32 oz (946 ml)", value: "32" },
];

export const waterBottleRefillCalculator: CalculatorDefinition = {
  slug: "water-bottle-refill-calculator",
  title: "Water Bottle Refills Saved Calculator",
  description:
    "Free water bottle refill calculator. See how many single-use plastic bottles you save by using a reusable bottle, plus the money and plastic waste you prevent.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "water bottle refill",
    "plastic bottle savings",
    "reusable bottle",
    "environmental savings",
    "plastic waste reduction",
    "bottle calculator",
  ],
  variants: [
    {
      id: "refill-savings",
      name: "Refill Savings",
      description:
        "Calculate plastic bottles saved and money saved with a reusable bottle",
      fields: [
        {
          name: "refillsPerDay",
          label: "Refills per Day",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 20,
        },
        {
          name: "bottleSize",
          label: "Reusable Bottle Size",
          type: "select",
          options: bottleSizeOptions,
        },
        {
          name: "costPerBottle",
          label: "Cost of a Disposable Bottle ($)",
          type: "number",
          placeholder: "e.g. 1.50",
          min: 0.01,
          step: 0.01,
          prefix: "$",
          defaultValue: 1.5,
        },
        {
          name: "years",
          label: "Time Period (years)",
          type: "number",
          placeholder: "e.g. 1",
          min: 0.1,
          max: 50,
          step: 0.5,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const refills = inputs.refillsPerDay as number;
        const bottleSizeStr = (inputs.bottleSize as string) || "16.9";
        const costPerBottle = (inputs.costPerBottle as number) || 1.5;
        const years = (inputs.years as number) || 1;

        if (!refills) return null;

        const bottleSizeOz = parseFloat(bottleSizeStr);
        const daysInPeriod = years * 365.25;
        const totalRefills = refills * daysInPeriod;

        // A standard disposable bottle is 16.9 oz
        const disposableOz = 16.9;
        const ozPerDay = refills * bottleSizeOz;
        const disposablesPerDay = ozPerDay / disposableOz;
        const totalDisposablesSaved = disposablesPerDay * daysInPeriod;
        const moneySaved = totalDisposablesSaved * costPerBottle;

        // Plastic stats: avg bottle weighs ~12.7g
        const plasticSavedLbs = (totalDisposablesSaved * 12.7) / 453.592;
        const waterSavedGallons = totalRefills * (bottleSizeOz / 128);

        return {
          primary: {
            label: "Plastic Bottles Saved",
            value: formatNumber(totalDisposablesSaved, 0),
            suffix: "bottles",
          },
          details: [
            { label: "Total refills", value: formatNumber(totalRefills, 0) },
            { label: "Water consumed", value: `${formatNumber(waterSavedGallons, 1)} gallons` },
            { label: "Money saved", value: `$${formatNumber(moneySaved, 2)}` },
            { label: "Plastic saved", value: `${formatNumber(plasticSavedLbs, 1)} lbs` },
            { label: "Bottles saved per month", value: formatNumber(totalDisposablesSaved / (years * 12), 1) },
            { label: "Bottles saved per week", value: formatNumber(disposablesPerDay * 7, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "water-intake-calculator",
    "carbon-footprint-calculator",
    "plastic-footprint-calculator",
  ],
  faq: [
    {
      question: "How many plastic bottles can I save per year?",
      answer:
        "A person who drinks 3 refills per day from a 24 oz reusable bottle saves roughly 1,500 disposable bottles per year.",
    },
    {
      question: "How much money does a reusable bottle save?",
      answer:
        "At $1.50 per disposable bottle and 3 refills per day, you save over $2,200 per year by using a reusable bottle.",
    },
  ],
  formula:
    "Bottles Saved = (Refills/Day x Bottle Size / 16.9 oz) x Days. Money Saved = Bottles Saved x Cost per Bottle.",
};

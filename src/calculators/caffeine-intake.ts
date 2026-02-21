import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caffeineIntakeCalculator: CalculatorDefinition = {
  slug: "caffeine-intake-calculator",
  title: "Daily Caffeine Intake Calculator",
  description:
    "Free caffeine intake calculator. Track your daily caffeine consumption from coffee, tea, energy drinks, and soda. Check if you're within safe limits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "caffeine intake calculator",
    "daily caffeine",
    "caffeine limit",
    "how much caffeine",
    "caffeine in coffee",
    "caffeine safe limit",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Daily Caffeine",
      fields: [
        {
          name: "coffee",
          label: "Cups of Coffee (8 oz)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "coffeeType",
          label: "Coffee Type",
          type: "select",
          options: [
            { label: "Drip/Brewed (95mg)", value: "95" },
            { label: "Espresso Shot (63mg)", value: "63" },
            { label: "Instant (62mg)", value: "62" },
            { label: "Cold Brew (200mg)", value: "200" },
            { label: "Decaf (2mg)", value: "2" },
          ],
        },
        {
          name: "tea",
          label: "Cups of Tea (8 oz)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "teaType",
          label: "Tea Type",
          type: "select",
          options: [
            { label: "Black Tea (47mg)", value: "47" },
            { label: "Green Tea (28mg)", value: "28" },
            { label: "White Tea (15mg)", value: "15" },
            { label: "Matcha (70mg)", value: "70" },
            { label: "Herbal Tea (0mg)", value: "0" },
          ],
        },
        {
          name: "energyDrinks",
          label: "Energy Drinks (16 oz cans)",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "soda",
          label: "Sodas (12 oz cans)",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const coffee = (inputs.coffee as number) || 0;
        const coffeeType = parseFloat(inputs.coffeeType as string) || 95;
        const tea = (inputs.tea as number) || 0;
        const teaType = parseFloat(inputs.teaType as string) || 47;
        const energyDrinks = (inputs.energyDrinks as number) || 0;
        const soda = (inputs.soda as number) || 0;

        const coffeeCaffeine = coffee * coffeeType;
        const teaCaffeine = tea * teaType;
        const energyCaffeine = energyDrinks * 160; // average energy drink
        const sodaCaffeine = soda * 34; // average cola

        const totalCaffeine = coffeeCaffeine + teaCaffeine + energyCaffeine + sodaCaffeine;
        const dailyLimit = 400; // FDA recommended limit for adults
        const percentOfLimit = (totalCaffeine / dailyLimit) * 100;

        let status: string;
        if (totalCaffeine <= 200) status = "Low - Well within safe limits";
        else if (totalCaffeine <= 400) status = "Moderate - Within FDA guidelines";
        else if (totalCaffeine <= 600) status = "High - Exceeds recommended daily limit";
        else status = "Very High - May cause adverse effects";

        // Caffeine half-life is ~5 hours
        const halfLife = 5;
        const after5hrs = totalCaffeine / 2;
        const after10hrs = totalCaffeine / 4;

        return {
          primary: {
            label: "Total Daily Caffeine",
            value: formatNumber(totalCaffeine, 0) + " mg",
          },
          details: [
            { label: "From Coffee", value: formatNumber(coffeeCaffeine, 0) + " mg" },
            { label: "From Tea", value: formatNumber(teaCaffeine, 0) + " mg" },
            { label: "From Energy Drinks", value: formatNumber(energyCaffeine, 0) + " mg" },
            { label: "From Soda", value: formatNumber(sodaCaffeine, 0) + " mg" },
            { label: "% of Daily Limit (400mg)", value: formatNumber(percentOfLimit, 0) + "%" },
            { label: "Status", value: status },
            { label: "In System After 5 hrs", value: formatNumber(after5hrs, 0) + " mg" },
            { label: "In System After 10 hrs", value: formatNumber(after10hrs, 0) + " mg" },
          ],
          note: totalCaffeine > 400 ? "The FDA recommends a maximum of 400mg caffeine per day for healthy adults. Consider reducing intake." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["coffee-ratio-calculator", "water-intake-calculator"],
  faq: [
    {
      question: "How much caffeine is safe per day?",
      answer:
        "The FDA recommends up to 400mg of caffeine per day for healthy adults, equivalent to about 4 cups of brewed coffee. Pregnant women should limit to 200mg. Children and adolescents should consume significantly less.",
    },
    {
      question: "How long does caffeine stay in your system?",
      answer:
        "Caffeine has a half-life of about 5 hours, meaning half the caffeine is still in your system 5 hours later. It can take 10+ hours to fully clear. This is why experts recommend avoiding caffeine after 2 PM for better sleep.",
    },
    {
      question: "Which has more caffeine: coffee or tea?",
      answer:
        "Coffee generally has 2-3x more caffeine than tea per cup. An 8 oz cup of brewed coffee has about 95mg, while black tea has about 47mg and green tea about 28mg. However, matcha (70mg per serving) comes close to coffee.",
    },
  ],
  formula:
    "Total Caffeine (mg) = (Coffee cups x mg per cup) + (Tea cups x mg per cup) + (Energy drinks x 160mg) + (Sodas x 34mg). FDA daily limit: 400mg for adults. Caffeine half-life: ~5 hours.",
};

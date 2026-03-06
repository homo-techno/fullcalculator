import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hotelPointsValueCalculator: CalculatorDefinition = {
  slug: "hotel-points-value-calculator",
  title: "Hotel Points Value Calculator",
  description: "Determine the value of your hotel loyalty points by comparing point redemptions against cash rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hotel points value","hotel loyalty","hotel reward points","hotel redemption value"],
  variants: [{
    id: "standard",
    name: "Hotel Points Value",
    description: "Determine the value of your hotel loyalty points by comparing point redemptions against cash rates.",
    fields: [
      { name: "pointsRequired", label: "Points Required Per Night", type: "number", min: 1000, max: 200000, defaultValue: 30000 },
      { name: "cashRate", label: "Cash Rate Per Night ($)", type: "number", min: 30, max: 5000, defaultValue: 200 },
      { name: "nights", label: "Number of Nights", type: "number", min: 1, max: 30, defaultValue: 3 },
      { name: "freeNightThreshold", label: "Free Night After X Paid Nights", type: "number", min: 0, max: 10, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const pointsPerNight = inputs.pointsRequired as number;
    const cashRate = inputs.cashRate as number;
    const nights = inputs.nights as number;
    const freeNightThreshold = inputs.freeNightThreshold as number;
    const totalPointsNeeded = pointsPerNight * nights;
    const totalCashCost = cashRate * nights;
    const centsPerPoint = (cashRate / pointsPerNight) * 100;
    const freeNights = freeNightThreshold > 0 ? Math.floor(nights / freeNightThreshold) : 0;
    const freeNightSavings = freeNights * cashRate;
    const effectiveSavings = totalCashCost;
    return {
      primary: { label: "Point Value", value: formatNumber(Math.round(centsPerPoint * 100) / 100) + " cents/point" },
      details: [
        { label: "Total Points Needed", value: formatNumber(totalPointsNeeded) },
        { label: "Cash Equivalent", value: "$" + formatNumber(Math.round(totalCashCost)) },
        { label: "Bonus Free Nights Earned", value: formatNumber(freeNights) },
        { label: "Free Night Savings", value: "$" + formatNumber(Math.round(freeNightSavings)) }
      ]
    };
  },
  }],
  relatedSlugs: ["points-value-calculator","hotel-vs-airbnb-calculator","travel-budget-calculator"],
  faq: [
    { question: "How much are hotel points worth?", answer: "Hotel points typically range from 0.4 to 1.2 cents per point. Marriott Bonvoy points average about 0.7 cents, Hilton Honors about 0.5 cents, and Hyatt points about 1.5 to 2 cents." },
    { question: "When should I use hotel points?", answer: "Points are most valuable during peak seasons, at luxury properties, or when cash rates are high relative to the points required." },
    { question: "Do hotel points expire?", answer: "Most hotel programs keep points active as long as you have account activity every 12 to 24 months, which includes earning or redeeming points." },
  ],
  formula: "Cents Per Point = (Cash Rate Per Night / Points Per Night) x 100; Total Points Needed = Points Per Night x Nights",
};

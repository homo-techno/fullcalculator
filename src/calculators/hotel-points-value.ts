import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hotelPointsValue: CalculatorDefinition = {
  slug: "hotel-points-value",
  title: "Hotel Points Value Calculator",
  description:
    "Free online hotel points value calculator. Calculate the dollar value of your hotel loyalty points and compare redemption options.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "hotel points",
    "hotel loyalty",
    "marriott points",
    "hilton points",
    "hotel rewards",
  ],
  variants: [
    {
      id: "points-value",
      name: "Calculate Points Value",
      fields: [
        {
          name: "points",
          label: "Number of Points",
          type: "number",
          placeholder: "e.g. 100000",
        },
        {
          name: "program",
          label: "Hotel Loyalty Program",
          type: "select",
          options: [
            { label: "Marriott Bonvoy", value: "marriott" },
            { label: "Hilton Honors", value: "hilton" },
            { label: "IHG One Rewards", value: "ihg" },
            { label: "World of Hyatt", value: "hyatt" },
            { label: "Wyndham Rewards", value: "wyndham" },
            { label: "Choice Privileges", value: "choice" },
            { label: "Best Western Rewards", value: "bestwestern" },
            { label: "Accor Live Limitless", value: "accor" },
          ],
        },
      ],
      calculate: (inputs) => {
        const points = parseFloat(inputs.points as string) || 0;
        const program = inputs.program as string;

        // Average cents per point
        const cpp: Record<string, number> = {
          marriott: 0.87,
          hilton: 0.50,
          ihg: 0.55,
          hyatt: 1.70,
          wyndham: 1.10,
          choice: 0.72,
          bestwestern: 0.60,
          accor: 2.0,
        };

        // Typical points needed for one night
        const typicalNight: Record<string, number> = {
          marriott: 25000,
          hilton: 40000,
          ihg: 25000,
          hyatt: 12000,
          wyndham: 15000,
          choice: 12000,
          bestwestern: 16000,
          accor: 4000,
        };

        const centsPerPoint = cpp[program] || 0.8;
        const dollarValue = (points * centsPerPoint) / 100;
        const nightsAchievable = points / (typicalNight[program] || 20000);
        const valuePerNight = dollarValue / Math.max(nightsAchievable, 1);

        return {
          primary: { label: "Estimated Value", value: "$" + formatNumber(dollarValue, 2) },
          details: [
            { label: "Cents per Point", value: formatNumber(centsPerPoint, 2) + " cpp" },
            { label: "Total Points", value: formatNumber(points) },
            { label: "Estimated Free Nights", value: formatNumber(nightsAchievable, 1) },
            { label: "Value per Night", value: "$" + formatNumber(valuePerNight, 2) },
            { label: "Points per Night (avg)", value: formatNumber(typicalNight[program] || 20000) },
          ],
        };
      },
    },
    {
      id: "redemption-compare",
      name: "Compare Redemption Value",
      fields: [
        {
          name: "pointsNeeded",
          label: "Points Needed for Stay",
          type: "number",
          placeholder: "e.g. 40000",
        },
        {
          name: "cashRate",
          label: "Cash Rate for Same Stay ($)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const pointsNeeded = parseFloat(inputs.pointsNeeded as string) || 0;
        const cashRate = parseFloat(inputs.cashRate as string) || 0;
        const nights = parseFloat(inputs.nights as string) || 1;

        if (pointsNeeded === 0) return null;

        const totalCash = cashRate * nights;
        const centsPerPoint = (totalCash / pointsNeeded) * 100;
        const pointsPerNight = pointsNeeded / nights;
        const isGood = centsPerPoint >= 0.8;

        return {
          primary: {
            label: "Cents per Point",
            value: formatNumber(centsPerPoint, 2) + " cpp",
          },
          details: [
            { label: "Total Cash Value", value: "$" + formatNumber(totalCash, 2) },
            { label: "Total Points Needed", value: formatNumber(pointsNeeded) },
            { label: "Points per Night", value: formatNumber(pointsPerNight, 0) },
            { label: "Cash Rate per Night", value: "$" + formatNumber(cashRate, 2) },
            { label: "Verdict", value: isGood ? "Good redemption value" : "Below average value" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["airline-miles-value", "travel-points-value", "travel-budget-daily"],
  faq: [
    {
      question: "Which hotel program has the most valuable points?",
      answer:
        "World of Hyatt consistently offers the highest value at around 1.7 cents per point. Accor points are also valuable at ~2 cents per point. Hilton and IHG points have the lowest per-point value but are easier to accumulate.",
    },
    {
      question: "How many hotel points do I need for a free night?",
      answer:
        "It varies by program and hotel category. Marriott requires 7,500-100,000 points, Hilton 5,000-120,000, Hyatt 5,000-40,000, and IHG 10,000-70,000 per night.",
    },
    {
      question: "Should I earn hotel points or airline miles?",
      answer:
        "Hotel points are generally best for frequent travelers who value free stays. Airline miles are better for infrequent travelers who want to offset large flight costs. Flexible programs like Chase UR or Amex MR give you both options.",
    },
  ],
  formula:
    "Dollar Value = (Points x Cents per Point) / 100\nRedemption Value (cpp) = (Cash Price / Points Required) x 100",
};

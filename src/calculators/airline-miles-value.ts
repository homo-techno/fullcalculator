import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airlineMilesValue: CalculatorDefinition = {
  slug: "airline-miles-value",
  title: "Airline Miles Value Calculator",
  description:
    "Free online airline miles value calculator. Calculate the dollar value of your airline miles and frequent flyer points to maximize redemption.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "airline miles",
    "frequent flyer",
    "points value",
    "miles redemption",
    "travel rewards",
  ],
  variants: [
    {
      id: "miles-to-dollars",
      name: "Miles to Dollar Value",
      fields: [
        {
          name: "miles",
          label: "Number of Miles/Points",
          type: "number",
          placeholder: "e.g. 50000",
        },
        {
          name: "airline",
          label: "Airline Program",
          type: "select",
          options: [
            { label: "Delta SkyMiles", value: "delta" },
            { label: "United MileagePlus", value: "united" },
            { label: "American AAdvantage", value: "american" },
            { label: "Southwest Rapid Rewards", value: "southwest" },
            { label: "JetBlue TrueBlue", value: "jetblue" },
            { label: "Alaska Mileage Plan", value: "alaska" },
            { label: "Chase Ultimate Rewards", value: "chase" },
            { label: "Amex Membership Rewards", value: "amex" },
          ],
        },
      ],
      calculate: (inputs) => {
        const miles = parseFloat(inputs.miles as string) || 0;
        const airline = inputs.airline as string;

        const centsPerMile: Record<string, number> = {
          delta: 1.2,
          united: 1.3,
          american: 1.4,
          southwest: 1.4,
          jetblue: 1.3,
          alaska: 1.8,
          chase: 2.0,
          amex: 1.5,
        };

        const rate = centsPerMile[airline] || 1.3;
        const dollarValue = (miles * rate) / 100;
        const cashBackEquiv = (miles * 1.0) / 100;
        const premium = dollarValue - cashBackEquiv;

        return {
          primary: { label: "Estimated Value", value: "$" + formatNumber(dollarValue, 2) },
          details: [
            { label: "Cents per Mile", value: formatNumber(rate, 1) + " cents" },
            { label: "Total Miles", value: formatNumber(miles) },
            { label: "Cash Back Equivalent", value: "$" + formatNumber(cashBackEquiv, 2) },
            { label: "Premium over Cash Back", value: "$" + formatNumber(premium, 2) },
          ],
        };
      },
    },
    {
      id: "compare-redemption",
      name: "Compare Redemption Value",
      fields: [
        {
          name: "milesRequired",
          label: "Miles Required for Booking",
          type: "number",
          placeholder: "e.g. 25000",
        },
        {
          name: "cashPrice",
          label: "Cash Price of Same Booking ($)",
          type: "number",
          placeholder: "e.g. 350",
        },
        {
          name: "taxes",
          label: "Taxes/Fees on Award Booking ($)",
          type: "number",
          placeholder: "e.g. 25",
        },
      ],
      calculate: (inputs) => {
        const milesRequired = parseFloat(inputs.milesRequired as string) || 0;
        const cashPrice = parseFloat(inputs.cashPrice as string) || 0;
        const taxes = parseFloat(inputs.taxes as string) || 0;

        if (milesRequired === 0) return null;

        const netValue = cashPrice - taxes;
        const centsPerMile = (netValue / milesRequired) * 100;
        const isGoodDeal = centsPerMile >= 1.5;

        return {
          primary: {
            label: "Cents per Mile Value",
            value: formatNumber(centsPerMile, 2) + " cpp",
          },
          details: [
            { label: "Cash Price", value: "$" + formatNumber(cashPrice, 2) },
            { label: "Award Taxes/Fees", value: "$" + formatNumber(taxes, 2) },
            { label: "Net Value", value: "$" + formatNumber(netValue, 2) },
            { label: "Miles Required", value: formatNumber(milesRequired) },
            { label: "Verdict", value: isGoodDeal ? "Good redemption" : "Below average redemption" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hotel-points-value", "travel-points-value", "travel-budget-daily"],
  faq: [
    {
      question: "How much are airline miles worth?",
      answer:
        "Airline miles are typically worth between 1.0 and 2.0 cents each, depending on the airline program and how you redeem them. Premium cabin redemptions often provide the best value.",
    },
    {
      question: "What is a good cents-per-mile redemption?",
      answer:
        "Generally, anything above 1.5 cents per mile is considered a good redemption. Values above 2.0 cents per mile are excellent, often achieved through business or first class awards.",
    },
    {
      question: "Should I save miles or use them?",
      answer:
        "Miles can devalue over time through program changes, so it is generally advisable to use them within a reasonable timeframe rather than hoarding indefinitely.",
    },
  ],
  formula: "Dollar Value = (Number of Miles x Cents per Mile) / 100",
};

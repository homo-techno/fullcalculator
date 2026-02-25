import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelPointsValue: CalculatorDefinition = {
  slug: "travel-points-value",
  title: "Travel Points Value Calculator",
  description:
    "Free online travel points value calculator. Calculate the overall value of your travel rewards points across different programs and optimize redemptions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel points",
    "rewards points",
    "points value",
    "credit card points",
    "travel rewards",
  ],
  variants: [
    {
      id: "points-portfolio",
      name: "Calculate Points Portfolio Value",
      fields: [
        {
          name: "program",
          label: "Rewards Program",
          type: "select",
          options: [
            { label: "Chase Ultimate Rewards", value: "chase" },
            { label: "Amex Membership Rewards", value: "amex" },
            { label: "Citi ThankYou Points", value: "citi" },
            { label: "Capital One Miles", value: "capone" },
            { label: "Bilt Rewards", value: "bilt" },
            { label: "Wells Fargo Rewards", value: "wells" },
          ],
        },
        {
          name: "points",
          label: "Total Points Balance",
          type: "number",
          placeholder: "e.g. 100000",
        },
        {
          name: "redemptionType",
          label: "Redemption Method",
          type: "select",
          options: [
            { label: "Transfer to Airline Partner", value: "airline" },
            { label: "Transfer to Hotel Partner", value: "hotel" },
            { label: "Travel Portal Booking", value: "portal" },
            { label: "Cash Back / Statement Credit", value: "cashback" },
            { label: "Gift Cards", value: "giftcard" },
          ],
        },
      ],
      calculate: (inputs) => {
        const points = parseFloat(inputs.points as string) || 0;
        const program = inputs.program as string;
        const redemptionType = inputs.redemptionType as string;

        // Cents per point by program and redemption type
        const values: Record<string, Record<string, number>> = {
          chase: { airline: 2.0, hotel: 1.5, portal: 1.5, cashback: 1.0, giftcard: 1.0 },
          amex: { airline: 1.8, hotel: 1.2, portal: 1.0, cashback: 0.6, giftcard: 0.7 },
          citi: { airline: 1.6, hotel: 1.2, portal: 1.0, cashback: 1.0, giftcard: 0.8 },
          capone: { airline: 1.7, hotel: 1.3, portal: 1.0, cashback: 0.5, giftcard: 0.8 },
          bilt: { airline: 1.8, hotel: 1.5, portal: 1.25, cashback: 0.5, giftcard: 0.8 },
          wells: { airline: 1.5, hotel: 1.0, portal: 1.0, cashback: 0.67, giftcard: 0.8 },
        };

        const programValues = values[program] || values.chase;
        const cpp = programValues[redemptionType] || 1.0;
        const dollarValue = (points * cpp) / 100;

        // Calculate best and worst redemption
        const allValues = Object.entries(programValues);
        const best = allValues.reduce((a, b) => (b[1] > a[1] ? b : a));
        const worst = allValues.reduce((a, b) => (b[1] < a[1] ? b : a));
        const bestValue = (points * best[1]) / 100;
        const worstValue = (points * worst[1]) / 100;
        const difference = bestValue - worstValue;

        return {
          primary: { label: "Estimated Value", value: "$" + formatNumber(dollarValue, 2) },
          details: [
            { label: "Cents per Point", value: formatNumber(cpp, 2) + " cpp" },
            { label: "Total Points", value: formatNumber(points) },
            { label: "Best Redemption", value: best[0] + " at " + formatNumber(best[1], 2) + " cpp = $" + formatNumber(bestValue, 2) },
            { label: "Worst Redemption", value: worst[0] + " at " + formatNumber(worst[1], 2) + " cpp = $" + formatNumber(worstValue, 2) },
            { label: "Value Difference", value: "$" + formatNumber(difference, 2) },
          ],
        };
      },
    },
    {
      id: "earning-rate",
      name: "Points Earning Rate",
      fields: [
        {
          name: "monthlySpend",
          label: "Monthly Credit Card Spend ($)",
          type: "number",
          placeholder: "e.g. 3000",
        },
        {
          name: "earningRate",
          label: "Points per Dollar Spent",
          type: "select",
          options: [
            { label: "1x points per dollar", value: "1" },
            { label: "1.5x points per dollar", value: "1.5" },
            { label: "2x points per dollar", value: "2" },
            { label: "3x points per dollar", value: "3" },
            { label: "5x points per dollar", value: "5" },
          ],
        },
        {
          name: "pointValue",
          label: "Estimated Point Value (cents)",
          type: "number",
          placeholder: "e.g. 1.8",
        },
      ],
      calculate: (inputs) => {
        const monthlySpend = parseFloat(inputs.monthlySpend as string) || 0;
        const earningRate = parseFloat(inputs.earningRate as string) || 1;
        const pointValue = parseFloat(inputs.pointValue as string) || 1.5;

        const monthlyPoints = monthlySpend * earningRate;
        const yearlyPoints = monthlyPoints * 12;
        const monthlyValue = (monthlyPoints * pointValue) / 100;
        const yearlyValue = monthlyValue * 12;
        const effectiveCashBack = (earningRate * pointValue) / 100;

        return {
          primary: { label: "Yearly Points Earned", value: formatNumber(yearlyPoints) },
          details: [
            { label: "Monthly Points", value: formatNumber(monthlyPoints) },
            { label: "Monthly Value", value: "$" + formatNumber(monthlyValue, 2) },
            { label: "Yearly Value", value: "$" + formatNumber(yearlyValue, 2) },
            { label: "Effective Cash Back Rate", value: formatNumber(effectiveCashBack * 100, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["airline-miles-value", "hotel-points-value", "travel-budget-daily"],
  faq: [
    {
      question: "Which travel rewards program is the most valuable?",
      answer:
        "Chase Ultimate Rewards and Amex Membership Rewards are generally considered the most valuable due to their airline and hotel transfer partners. Chase offers the best all-around value, while Amex has the most transfer partners.",
    },
    {
      question: "Should I transfer points to partners or book through the portal?",
      answer:
        "Transferring to airline partners typically yields the best value (1.5-2.5 cpp), especially for premium cabin flights. Portal bookings offer a guaranteed 1.0-1.5 cpp. Transfer for high-value bookings; use the portal for simple trips.",
    },
    {
      question: "Do points expire?",
      answer:
        "Chase, Amex, and Citi points do not expire as long as your account is open. Some hotel and airline programs have expiration policies (typically 18-24 months of inactivity).",
    },
  ],
  formula:
    "Dollar Value = (Points x Cents per Point) / 100\nYearly Points = Monthly Spend x Earning Rate x 12\nEffective Cash Back = (Earning Rate x Point Value) / 100",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carryOnWeight: CalculatorDefinition = {
  slug: "carry-on-weight",
  title: "Carry-On Weight Calculator",
  description:
    "Free online carry-on weight calculator. Check carry-on luggage weight limits by airline and see how much more you can pack.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "carry-on weight",
    "luggage weight",
    "airline baggage",
    "hand luggage",
    "cabin baggage",
  ],
  variants: [
    {
      id: "weight-check",
      name: "Check Carry-On Weight Limit",
      fields: [
        {
          name: "airline",
          label: "Airline",
          type: "select",
          options: [
            { label: "Delta Air Lines", value: "delta" },
            { label: "United Airlines", value: "united" },
            { label: "American Airlines", value: "american" },
            { label: "Southwest Airlines", value: "southwest" },
            { label: "JetBlue Airways", value: "jetblue" },
            { label: "Alaska Airlines", value: "alaska" },
            { label: "Spirit Airlines", value: "spirit" },
            { label: "Ryanair", value: "ryanair" },
            { label: "EasyJet", value: "easyjet" },
            { label: "British Airways", value: "british" },
            { label: "Lufthansa", value: "lufthansa" },
            { label: "Emirates", value: "emirates" },
          ],
        },
        {
          name: "currentWeight",
          label: "Your Bag Weight",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "weightUnit",
          label: "Weight Unit",
          type: "select",
          options: [
            { label: "Pounds (lbs)", value: "lbs" },
            { label: "Kilograms (kg)", value: "kg" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentWeight = parseFloat(inputs.currentWeight as string) || 0;
        const airline = inputs.airline as string;
        const weightUnit = inputs.weightUnit as string;

        // Carry-on weight limits in kg
        const limitsKg: Record<string, number> = {
          delta: 99, // No weight limit, technically unlimited
          united: 99,
          american: 99,
          southwest: 99,
          jetblue: 99,
          alaska: 99,
          spirit: 18,
          ryanair: 10,
          easyjet: 15,
          british: 23,
          lufthansa: 8,
          emirates: 7,
        };

        const noWeightLimit = ["delta", "united", "american", "southwest", "jetblue", "alaska"];
        const hasNoLimit = noWeightLimit.includes(airline);

        const limitKg = limitsKg[airline] || 10;
        const limitLbs = limitKg * 2.20462;

        const currentKg = weightUnit === "kg" ? currentWeight : currentWeight / 2.20462;
        const currentLbs = weightUnit === "lbs" ? currentWeight : currentWeight * 2.20462;

        const remainingKg = limitKg - currentKg;
        const remainingLbs = limitLbs - currentLbs;
        const isOver = remainingKg < 0;

        const statusText = hasNoLimit
          ? "No strict weight limit (must lift into overhead bin)"
          : isOver
            ? "OVER LIMIT by " + formatNumber(Math.abs(remainingKg), 1) + " kg"
            : "Within limit - " + formatNumber(remainingKg, 1) + " kg remaining";

        return {
          primary: { label: "Status", value: statusText },
          details: [
            { label: "Your Bag", value: formatNumber(currentKg, 1) + " kg / " + formatNumber(currentLbs, 1) + " lbs" },
            { label: "Airline Limit", value: hasNoLimit ? "No strict limit" : formatNumber(limitKg, 1) + " kg / " + formatNumber(limitLbs, 1) + " lbs" },
            { label: "Remaining Capacity", value: hasNoLimit ? "N/A" : formatNumber(Math.max(0, remainingKg), 1) + " kg / " + formatNumber(Math.max(0, remainingLbs), 1) + " lbs" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["luggage-size", "customs-duty", "duty-free-savings"],
  faq: [
    {
      question: "Do US airlines have carry-on weight limits?",
      answer:
        "Most major US airlines (Delta, United, American, Southwest, JetBlue, Alaska) do not enforce strict carry-on weight limits. However, you must be able to lift the bag into the overhead bin yourself.",
    },
    {
      question: "Which airlines have strict carry-on weight limits?",
      answer:
        "Budget European carriers like Ryanair (10 kg) and EasyJet (15 kg) enforce strict limits. Asian carriers like AirAsia (7 kg) also have tight limits. Lufthansa limits carry-ons to 8 kg.",
    },
    {
      question: "What happens if my carry-on is overweight?",
      answer:
        "If your carry-on exceeds the weight limit on airlines that enforce it, you may be asked to check the bag and pay a checked baggage fee, which can range from $30 to $75 or more.",
    },
  ],
  formula: "Remaining Capacity = Airline Weight Limit - Current Bag Weight",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recipeScalerCalculator: CalculatorDefinition = {
  slug: "recipe-scaler-calculator",
  title: "Recipe Scaler Calculator",
  description:
    "Free recipe scaler calculator. Scale ingredient amounts up or down based on original and desired serving sizes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "recipe scaler",
    "recipe converter",
    "serving size",
    "ingredient calculator",
    "scale recipe",
  ],
  variants: [
    {
      id: "calc",
      name: "Scale Recipe",
      fields: [
        {
          name: "originalServings",
          label: "Original Servings",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "desiredServings",
          label: "Desired Servings",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "ingredientAmount",
          label: "Ingredient Amount",
          type: "number",
          placeholder: "e.g. 2.5",
        },
      ],
      calculate: (inputs) => {
        const original = inputs.originalServings as number;
        const desired = inputs.desiredServings as number;
        const amount = inputs.ingredientAmount as number;

        if (!original || !desired) return null;
        if (original <= 0 || desired <= 0) return null;
        if (amount === undefined || amount === null) return null;

        const scaleFactor = desired / original;
        const scaledAmount = amount * scaleFactor;

        // Provide common fraction approximations for the scaled amount
        const fractionPart = scaledAmount - Math.floor(scaledAmount);
        let fractionStr = "";
        if (fractionPart < 0.0625) fractionStr = "";
        else if (fractionPart < 0.1875) fractionStr = " 1/8";
        else if (fractionPart < 0.2917) fractionStr = " 1/4";
        else if (fractionPart < 0.375) fractionStr = " 1/3";
        else if (fractionPart < 0.4583) fractionStr = " 3/8";
        else if (fractionPart < 0.5417) fractionStr = " 1/2";
        else if (fractionPart < 0.625) fractionStr = " 5/8";
        else if (fractionPart < 0.7083) fractionStr = " 2/3";
        else if (fractionPart < 0.7917) fractionStr = " 3/4";
        else if (fractionPart < 0.9375) fractionStr = " 7/8";
        else fractionStr = "";

        const wholePart =
          fractionPart >= 0.9375
            ? Math.floor(scaledAmount) + 1
            : Math.floor(scaledAmount);
        const friendlyAmount =
          wholePart > 0
            ? `${wholePart}${fractionStr}`
            : fractionStr.trim() || "0";

        let scaleDescription = "";
        if (scaleFactor > 1)
          scaleDescription = `Scaling up by ${formatNumber(scaleFactor, 2)}x`;
        else if (scaleFactor < 1)
          scaleDescription = `Scaling down by ${formatNumber(scaleFactor, 2)}x`;
        else scaleDescription = "No scaling needed (1:1)";

        return {
          primary: {
            label: "Scaled Amount",
            value: formatNumber(scaledAmount, 2),
          },
          details: [
            {
              label: "Original Servings",
              value: formatNumber(original, 0),
            },
            {
              label: "Desired Servings",
              value: formatNumber(desired, 0),
            },
            {
              label: "Scale Factor",
              value: `${formatNumber(scaleFactor, 3)}x`,
            },
            { label: "Scale Direction", value: scaleDescription },
            {
              label: "Original Amount",
              value: formatNumber(amount, 2),
            },
            {
              label: "Scaled Amount (decimal)",
              value: formatNumber(scaledAmount, 3),
            },
            {
              label: "Scaled Amount (approx fraction)",
              value: friendlyAmount,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["currency-tip-calculator"],
  faq: [
    {
      question: "How does recipe scaling work?",
      answer:
        "Recipe scaling multiplies each ingredient amount by a scale factor: Scale Factor = Desired Servings / Original Servings. For example, scaling from 4 to 8 servings doubles every ingredient.",
    },
    {
      question: "Do all ingredients scale linearly?",
      answer:
        "Most ingredients scale linearly, but seasonings, spices, leavening agents, and cooking times may not scale proportionally. It is often recommended to use slightly less than the scaled amount for spices and adjust to taste.",
    },
  ],
  formula:
    "Scale Factor = Desired Servings / Original Servings. Scaled Amount = Original Amount x Scale Factor.",
};

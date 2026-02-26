import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cookingAltitudeAdjustCalculator: CalculatorDefinition = {
  slug: "cooking-altitude-adjust",
  title: "Cooking Altitude Adjustment Calculator",
  description: "Free online cooking altitude adjustment calculator. Adjust baking temperatures, times, and ingredient amounts for high altitude cooking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["altitude adjustment", "high altitude baking", "altitude cooking", "high elevation baking", "altitude recipe adjustment"],
  variants: [
    {
      id: "baking-adjustment",
      name: "Baking Altitude Adjustment",
      fields: [
        { name: "altitude", label: "Your Altitude (feet)", type: "number", placeholder: "e.g. 5000" },
        { name: "originalTemp", label: "Original Oven Temp (°F)", type: "number", placeholder: "e.g. 350" },
        { name: "originalTime", label: "Original Bake Time (minutes)", type: "number", placeholder: "e.g. 30" },
        { name: "sugarCups", label: "Sugar in Recipe (cups)", type: "number", placeholder: "e.g. 1", step: 0.25 },
        { name: "flourCups", label: "Flour in Recipe (cups)", type: "number", placeholder: "e.g. 2", step: 0.25 },
        { name: "liquidCups", label: "Liquid in Recipe (cups)", type: "number", placeholder: "e.g. 0.5", step: 0.25 },
      ],
      calculate: (inputs) => {
        const altitude = parseFloat(inputs.altitude as string) || 0;
        const originalTemp = parseFloat(inputs.originalTemp as string) || 350;
        const originalTime = parseFloat(inputs.originalTime as string) || 30;
        const sugarCups = parseFloat(inputs.sugarCups as string) || 0;
        const flourCups = parseFloat(inputs.flourCups as string) || 0;
        const liquidCups = parseFloat(inputs.liquidCups as string) || 0;

        // Adjustments based on altitude
        let tempIncrease = 0;
        let sugarReduction = 0;
        let flourIncrease = 0;
        let liquidIncrease = 0;
        let timeReduction = 0;
        let leavenReduction = 0;

        if (altitude >= 3000 && altitude < 5000) {
          tempIncrease = 15;
          sugarReduction = 0.05;
          flourIncrease = 0.05;
          liquidIncrease = 0.1;
          timeReduction = 0.05;
          leavenReduction = 0.125;
        } else if (altitude >= 5000 && altitude < 7000) {
          tempIncrease = 25;
          sugarReduction = 0.1;
          flourIncrease = 0.1;
          liquidIncrease = 0.15;
          timeReduction = 0.1;
          leavenReduction = 0.25;
        } else if (altitude >= 7000 && altitude < 9000) {
          tempIncrease = 25;
          sugarReduction = 0.15;
          flourIncrease = 0.15;
          liquidIncrease = 0.2;
          timeReduction = 0.15;
          leavenReduction = 0.33;
        } else if (altitude >= 9000) {
          tempIncrease = 25;
          sugarReduction = 0.2;
          flourIncrease = 0.2;
          liquidIncrease = 0.25;
          timeReduction = 0.2;
          leavenReduction = 0.5;
        }

        const newTemp = originalTemp + tempIncrease;
        const newTime = originalTime * (1 - timeReduction);
        const newSugar = sugarCups * (1 - sugarReduction);
        const newFlour = flourCups * (1 + flourIncrease);
        const newLiquid = liquidCups * (1 + liquidIncrease);
        const boilingPoint = 212 - (altitude / 500);

        return {
          primary: { label: "Adjusted Oven Temp", value: `${formatNumber(newTemp)}°F` },
          details: [
            { label: "Adjusted Bake Time", value: `${formatNumber(newTime)} min` },
            { label: "Adjusted Sugar", value: `${formatNumber(newSugar)} cups` },
            { label: "Adjusted Flour", value: `${formatNumber(newFlour)} cups` },
            { label: "Adjusted Liquid", value: `${formatNumber(newLiquid)} cups` },
            { label: "Reduce Leavening By", value: `${formatNumber(leavenReduction * 100)}%` },
            { label: "Boiling Point at Altitude", value: `${formatNumber(boilingPoint)}°F` },
            { label: "Altitude", value: `${formatNumber(altitude)} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["self-rising-flour", "sourdough-calc", "pancake-batch"],
  faq: [
    {
      question: "Why do I need to adjust recipes at high altitude?",
      answer: "At higher altitudes, air pressure is lower, which causes water to boil at a lower temperature and leavening gases to expand faster. This can cause baked goods to rise too quickly and then collapse, and foods may dry out faster.",
    },
    {
      question: "At what altitude should I start adjusting recipes?",
      answer: "Start making adjustments at 3,000 feet above sea level. The higher the altitude, the more significant the adjustments needed.",
    },
    {
      question: "What are the most important adjustments for high altitude baking?",
      answer: "Increase oven temperature by 15-25°F, increase liquid by 10-25%, reduce sugar by 5-20%, reduce leavening by 12-50%, and reduce baking time by 5-20%. Exact amounts depend on altitude.",
    },
  ],
  formula: "oven_temp = original + 15-25°F; sugar = original × (1 - reduction); liquid = original × (1 + increase)",
};

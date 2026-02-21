import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jumpHeightCalculator: CalculatorDefinition = {
  slug: "jump-height-calculator",
  title: "Vertical Jump Calculator",
  description:
    "Free vertical jump height calculator. Calculate jump height, leg power, and athletic performance rating from your vertical jump test.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "vertical jump calculator",
    "jump height",
    "vertical leap",
    "leg power calculator",
    "jump test",
  ],
  variants: [
    {
      id: "standing-reach",
      name: "Standing Reach Method",
      description: "Calculate jump height from standing reach and max reach",
      fields: [
        { name: "standingReach", label: "Standing Reach (inches)", type: "number", placeholder: "e.g. 90" },
        { name: "jumpReach", label: "Jump Reach (inches)", type: "number", placeholder: "e.g. 115" },
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 175" },
      ],
      calculate: (inputs) => {
        const standingReach = inputs.standingReach as number;
        const jumpReach = inputs.jumpReach as number;
        const weight = inputs.weight as number;
        if (!standingReach || !jumpReach || !weight) return null;

        const jumpHeight = jumpReach - standingReach;
        if (jumpHeight <= 0) return null;

        const jumpHeightCm = jumpHeight * 2.54;
        const weightKg = weight * 0.453592;

        // Lewis formula for power
        const power = Math.sqrt(4.9) * weightKg * Math.sqrt(jumpHeightCm / 100) * 9.81;

        // Sayers peak power
        const sayersPeak = 60.7 * jumpHeightCm + 45.3 * weightKg - 2055;

        let rating = "Below Average";
        if (jumpHeight >= 36) rating = "Excellent (Elite)";
        else if (jumpHeight >= 28) rating = "Very Good";
        else if (jumpHeight >= 24) rating = "Good (Above Average)";
        else if (jumpHeight >= 20) rating = "Average";
        else if (jumpHeight >= 16) rating = "Below Average";
        else rating = "Poor";

        return {
          primary: { label: "Vertical Jump", value: `${formatNumber(jumpHeight, 1)}`, suffix: "inches" },
          details: [
            { label: "Jump Height (cm)", value: formatNumber(jumpHeightCm, 1) },
            { label: "Lewis Power", value: `${formatNumber(power, 0)} W` },
            { label: "Sayers Peak Power", value: `${formatNumber(sayersPeak, 0)} W` },
            { label: "Rating (Male)", value: rating },
          ],
        };
      },
    },
    {
      id: "flight-time",
      name: "Flight Time Method",
      description: "Calculate jump height from flight time (force plate or app)",
      fields: [
        { name: "flightTime", label: "Flight Time (milliseconds)", type: "number", placeholder: "e.g. 550" },
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 175" },
      ],
      calculate: (inputs) => {
        const flightTime = inputs.flightTime as number;
        const weight = inputs.weight as number;
        if (!flightTime || !weight) return null;

        const flightSec = flightTime / 1000;
        const heightM = 9.81 * Math.pow(flightSec, 2) / 8;
        const heightIn = heightM * 39.3701;
        const heightCm = heightM * 100;

        const weightKg = weight * 0.453592;
        const sayersPeak = 60.7 * heightCm + 45.3 * weightKg - 2055;

        return {
          primary: { label: "Vertical Jump", value: formatNumber(heightIn, 1), suffix: "inches" },
          details: [
            { label: "Jump Height (cm)", value: formatNumber(heightCm, 1) },
            { label: "Flight Time", value: `${formatNumber(flightTime, 0)} ms` },
            { label: "Sayers Peak Power", value: `${formatNumber(sayersPeak, 0)} W` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "exercise-calorie-calculator"],
  faq: [
    {
      question: "What is a good vertical jump?",
      answer:
        "For adult males: 16-20 inches is average, 20-24 is above average, 24-28 is good, 28+ is very good, 36+ is elite. For females, subtract about 4-6 inches from each range. NBA players average 28-34 inches.",
    },
    {
      question: "How is vertical jump measured?",
      answer:
        "The most common method is the standing reach test: measure your reach while standing flat-footed, then subtract it from your maximum jump reach. Other methods include force plates (flight time) and jump mats.",
    },
    {
      question: "How can I improve my vertical jump?",
      answer:
        "Focus on plyometric exercises (box jumps, depth jumps), strength training (squats, deadlifts, lunges), and explosive training. Consistent training can improve vertical jump by 2-6 inches over several months.",
    },
  ],
  formula: "Jump Height = Jump Reach - Standing Reach | Flight Time Method: h = g × t² / 8 | Sayers Power = 60.7 × height(cm) + 45.3 × mass(kg) - 2055",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paddleboardSizeCalculator: CalculatorDefinition = {
  slug: "paddleboard-size-calculator",
  title: "Paddleboard Size Calculator",
  description: "Find the right stand-up paddleboard dimensions based on your weight, skill level, and paddling style for optimal stability and performance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paddleboard size","SUP size guide","paddleboard volume","stand up paddle board dimensions"],
  variants: [{
    id: "standard",
    name: "Paddleboard Size",
    description: "Find the right stand-up paddleboard dimensions based on your weight, skill level, and paddling style for optimal stability and performance.",
    fields: [
      { name: "riderWeight", label: "Rider Weight (lbs)", type: "number", min: 50, max: 400, defaultValue: 170 },
      { name: "skillLevel", label: "Skill Level", type: "select", options: [{ value: "1.2", label: "Beginner" }, { value: "1.0", label: "Intermediate" }, { value: "0.85", label: "Advanced" }], defaultValue: "1.2" },
      { name: "paddleStyle", label: "Paddling Style", type: "select", options: [{ value: "1", label: "All-Around" }, { value: "2", label: "Touring" }, { value: "3", label: "Surfing" }, { value: "4", label: "Yoga / Fitness" }, { value: "5", label: "Racing" }], defaultValue: "1" },
      { name: "gearWeight", label: "Gear Weight (lbs)", type: "number", min: 0, max: 100, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const weight = inputs.riderWeight as number;
    const skill = parseFloat(inputs.skillLevel as string);
    const style = parseInt(inputs.paddleStyle as string);
    const gear = inputs.gearWeight as number;
    const totalWeight = weight + gear;
    const volumeMultiplier = skill * (style === 4 ? 1.15 : style === 3 ? 0.9 : 1.0);
    const volume = Math.round(totalWeight * volumeMultiplier);
    const widths = [0, 32, 30, 29, 34, 27];
    const boardWidth = widths[style];
    const boardLength = style === 2 ? 12.5 : style === 3 ? 9.0 : style === 5 ? 14.0 : style === 4 ? 10.5 : totalWeight > 200 ? 11.0 : 10.5;
    const thickness = totalWeight > 200 ? 6 : 5;
    const capacityLbs = volume * 1.0;
    return {
      primary: { label: "Recommended Volume", value: formatNumber(volume) + " liters" },
      details: [
        { label: "Board Length", value: boardLength + " feet" },
        { label: "Board Width", value: boardWidth + " inches" },
        { label: "Board Thickness", value: thickness + " inches" },
        { label: "Total Rider + Gear Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Weight Capacity", value: formatNumber(capacityLbs) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["scuba-tank-duration-calculator","boat-fuel-consumption-calculator"],
  faq: [
    { question: "How do I choose the right paddleboard size?", answer: "Your paddleboard volume in liters should roughly equal your body weight in pounds, adjusted for skill level. Beginners need 10 to 20 percent more volume for stability, while advanced paddlers can use less." },
    { question: "What width paddleboard do I need?", answer: "Wider boards (32 to 34 inches) are more stable for beginners and yoga. Touring boards are typically 30 to 31 inches. Surfing SUPs are 28 to 30 inches. Racing boards are narrow at 25 to 28 inches." },
    { question: "Does board thickness matter?", answer: "Yes, thicker boards (6 inches) support more weight and perform better with heavier riders. Standard 5-inch boards work well for riders under 200 pounds. Inflatable boards should always be 6 inches for rigidity." },
  ],
  formula: "Volume (liters) = (Rider Weight + Gear) x Skill Multiplier x Style Factor
Board dimensions are selected based on paddling style and weight class
Beginners: add 20% volume | Advanced: subtract 15% volume",
};

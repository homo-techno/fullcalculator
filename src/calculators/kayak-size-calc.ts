import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kayakSizeCalculator: CalculatorDefinition = {
  slug: "kayak-size-calculator",
  title: "Kayak Size & Type Calculator",
  description: "Free kayak size calculator. Find the right kayak length, width, and type based on your weight, height, paddling style, and experience level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kayak size calculator", "kayak length", "kayak type", "paddle size", "kayak weight capacity"],
  variants: [
    {
      id: "kayak-size",
      name: "Kayak Size Finder",
      description: "Get recommended kayak dimensions and type",
      fields: [
        { name: "weight", label: "Paddler Weight (lbs)", type: "number", placeholder: "e.g. 180", min: 50, max: 400 },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 70", min: 48, max: 84 },
        { name: "paddlingType", label: "Paddling Type", type: "select", options: [
          { label: "Recreational / Lake", value: "recreational" },
          { label: "Touring / Sea", value: "touring" },
          { label: "Whitewater", value: "whitewater" },
          { label: "Fishing", value: "fishing" },
        ] },
        { name: "experience", label: "Experience Level", type: "select", options: [
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
        ], defaultValue: "beginner" },
        { name: "gearWeight", label: "Estimated Gear Weight (lbs)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const height = parseFloat(inputs.height as string);
        const type = inputs.paddlingType as string;
        const exp = inputs.experience as string;
        const gear = parseFloat(inputs.gearWeight as string);
        if (isNaN(weight) || isNaN(height) || isNaN(gear)) return null;

        const totalWeight = weight + gear;
        const capacity = totalWeight * 1.5;

        let lengthFt = 10;
        let widthIn = 28;
        let cockpitType = "Sit-on-top";

        if (type === "recreational") {
          lengthFt = weight > 220 ? 12 : weight > 160 ? 10.5 : 10;
          widthIn = exp === "beginner" ? 30 : 28;
          cockpitType = exp === "beginner" ? "Sit-on-top" : "Sit-inside";
        } else if (type === "touring") {
          lengthFt = weight > 220 ? 17 : weight > 160 ? 16 : 14.5;
          widthIn = exp === "beginner" ? 25 : 23;
          cockpitType = "Sit-inside with skirt";
        } else if (type === "whitewater") {
          lengthFt = weight > 200 ? 9 : weight > 150 ? 8 : 7.5;
          widthIn = 26;
          cockpitType = "Sit-inside with skirt";
        } else if (type === "fishing") {
          lengthFt = weight > 220 ? 13 : weight > 160 ? 12 : 10.5;
          widthIn = exp === "beginner" ? 34 : 32;
          cockpitType = "Sit-on-top";
        }

        const paddleLength = height <= 60 ? 210 : height <= 66 ? 220 : height <= 72 ? 230 : 240;
        const paddleLengthAdj = widthIn > 30 ? paddleLength + 10 : paddleLength;

        return {
          primary: { label: "Recommended Length", value: `${formatNumber(lengthFt, 1)} ft` },
          details: [
            { label: "Width", value: `${formatNumber(widthIn, 0)}"` },
            { label: "Cockpit Style", value: cockpitType },
            { label: "Min Weight Capacity", value: `${formatNumber(capacity, 0)} lbs` },
            { label: "Total Paddler + Gear", value: `${formatNumber(totalWeight, 0)} lbs` },
            { label: "Paddle Length", value: `${formatNumber(paddleLengthAdj, 0)} cm` },
            { label: "Kayak Type", value: type.charAt(0).toUpperCase() + type.slice(1) },
          ],
          note: exp === "beginner" ? "Wider, more stable kayaks are recommended for beginners." : undefined,
        };
      },
    },
    {
      id: "paddle-size",
      name: "Paddle Size Calculator",
      description: "Find the right paddle length for your kayak",
      fields: [
        { name: "height", label: "Paddler Height (inches)", type: "number", placeholder: "e.g. 70", min: 48, max: 84 },
        { name: "kayakWidth", label: "Kayak Width (inches)", type: "number", placeholder: "e.g. 28", min: 18, max: 40 },
        { name: "paddleStyle", label: "Paddle Style", type: "select", options: [
          { label: "Low-angle (relaxed)", value: "low" },
          { label: "High-angle (aggressive)", value: "high" },
        ], defaultValue: "low" },
      ],
      calculate: (inputs) => {
        const height = parseFloat(inputs.height as string);
        const kayakWidth = parseFloat(inputs.kayakWidth as string);
        const style = inputs.paddleStyle as string;
        if (isNaN(height) || isNaN(kayakWidth)) return null;

        let base = height <= 60 ? 210 : height <= 66 ? 220 : height <= 72 ? 230 : 240;
        if (kayakWidth > 30) base += 10;
        else if (kayakWidth < 24) base -= 10;
        if (style === "high") base -= 10;

        return {
          primary: { label: "Paddle Length", value: `${formatNumber(base, 0)} cm` },
          details: [
            { label: "Paddle Length (inches)", value: `${formatNumber(base / 2.54, 1)}"` },
            { label: "Paddle Style", value: style === "low" ? "Low-angle" : "High-angle" },
            { label: "Range", value: `${formatNumber(base - 5, 0)} - ${formatNumber(base + 5, 0)} cm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["surfboard-size-calculator", "bmi-calculator", "calorie-calculator"],
  faq: [
    { question: "What length kayak do I need?", answer: "Recreational kayaks are typically 9-12 feet. Touring/sea kayaks run 14-18 feet for speed and tracking. Whitewater kayaks are short (6-9 feet) for maneuverability. Longer kayaks are faster but harder to turn." },
    { question: "How much weight capacity do I need?", answer: "Your kayak should have at least 50% more capacity than your total loaded weight (body + gear). Being too close to capacity makes the kayak sluggish and unstable." },
    { question: "Sit-on-top vs sit-inside?", answer: "Sit-on-top kayaks are more stable, self-draining, and easier for beginners. Sit-inside kayaks are drier, faster, and better for cold water or long touring with a spray skirt." },
  ],
  formula: "Min Capacity = (Body Weight + Gear) x 1.5 | Paddle Length = f(Height, Kayak Width, Stroke Style)",
};

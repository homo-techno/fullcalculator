import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const athleticTapeUsageCalculator: CalculatorDefinition = {
  slug: "athletic-tape-usage-calculator",
  title: "Athletic Tape Usage Calculator",
  description: "Calculate the amount of athletic tape needed for common sports taping applications.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["athletic tape","sports tape","kinesiology tape","taping guide"],
  variants: [{
    id: "standard",
    name: "Athletic Tape Usage",
    description: "Calculate the amount of athletic tape needed for common sports taping applications.",
    fields: [
      { name: "application", label: "Taping Application", type: "select", options: [{ value: "1", label: "Ankle Stabilization" }, { value: "2", label: "Knee Support" }, { value: "3", label: "Wrist Support" }, { value: "4", label: "Shoulder / Rotator Cuff" }, { value: "5", label: "Shin Splints" }], defaultValue: "1" },
      { name: "tapeType", label: "Tape Type", type: "select", options: [{ value: "1", label: "Athletic (1.5in rigid)" }, { value: "2", label: "Kinesiology (2in elastic)" }, { value: "3", label: "Elastic Bandage (3in)" }], defaultValue: "1" },
      { name: "joints", label: "Number of Joints to Tape", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "sessions", label: "Sessions per Week", type: "number", min: 1, max: 14, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const application = parseInt(inputs.application as string);
    const tapeType = parseInt(inputs.tapeType as string);
    const joints = inputs.joints as number;
    const sessions = inputs.sessions as number;
    const inchesPerApp = application === 1 ? 120 : application === 2 ? 96 : application === 3 ? 60 : application === 4 ? 80 : 72;
    const tapeWidthFactor = tapeType === 1 ? 1 : tapeType === 2 ? 0.8 : 0.6;
    const inchesPerSession = Math.round(inchesPerApp * tapeWidthFactor * joints);
    const inchesPerWeek = inchesPerSession * sessions;
    const rollLength = tapeType === 1 ? 360 : tapeType === 2 ? 240 : 180;
    const rollsPerWeek = Math.ceil(inchesPerWeek / rollLength * 10) / 10;
    const rollsPerMonth = Math.ceil(rollsPerWeek * 4.33);
    const costPerRoll = tapeType === 1 ? 4 : tapeType === 2 ? 12 : 3;
    const monthlyCost = Math.round(rollsPerMonth * costPerRoll);
    return {
      primary: { label: "Tape per Session", value: formatNumber(Math.round(inchesPerSession / 12)) + " ft (" + formatNumber(inchesPerSession) + " in)" },
      details: [
        { label: "Weekly Usage", value: formatNumber(Math.round(inchesPerWeek / 12)) + " ft" },
        { label: "Rolls per Month", value: formatNumber(rollsPerMonth) },
        { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["sports-drink-hydration-calculator","running-shoe-mileage-calculator"],
  faq: [
    { question: "How much tape do I need for an ankle?", answer: "A standard ankle taping uses about 8 to 12 feet of 1.5 inch rigid athletic tape including anchors and stirrups." },
    { question: "What is the difference between athletic tape and kinesiology tape?", answer: "Athletic tape is rigid and restricts movement for support. Kinesiology tape is elastic and allows movement while providing proprioceptive feedback." },
    { question: "Can I reuse athletic tape?", answer: "No, athletic tape should not be reused. Kinesiology tape can stay on for 2 to 5 days if applied properly." },
  ],
  formula: "Tape per Session = Base Inches x Width Factor x Joints; Rolls/Month = Weekly Usage / Roll Length x 4.33",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const servoMotorCalculator: CalculatorDefinition = {
  slug: "servo-motor-calculator",
  title: "Servo Motor Calculator",
  description: "Calculate servo torque needed for a given load.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["servo torque","servo motor","servo sizing"],
  variants: [{
    id: "standard",
    name: "Servo Motor",
    description: "Calculate servo torque needed for a given load.",
    fields: [
      { name: "load", label: "Load Weight (g)", type: "number", min: 1, max: 10000, defaultValue: 200 },
      { name: "armLength", label: "Arm Length (cm)", type: "number", min: 1, max: 50, defaultValue: 5 },
      { name: "safetyFactor", label: "Safety Factor", type: "number", min: 1, max: 5, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const load = inputs.load as number;
      const arm = inputs.armLength as number;
      const sf = inputs.safetyFactor as number;
      if (!load || !arm || !sf) return null;
      const torqueGcm = load * arm;
      const torqueKgcm = torqueGcm / 1000;
      const recommended = torqueKgcm * sf;
      return {
        primary: { label: "Required Torque", value: formatNumber(Math.round(recommended * 100) / 100) + " kg-cm" },
        details: [
          { label: "Raw Torque", value: formatNumber(Math.round(torqueKgcm * 100) / 100) + " kg-cm" },
          { label: "Safety Factor", value: formatNumber(sf) + "x" },
          { label: "Torque (g-cm)", value: formatNumber(torqueGcm) },
        ],
      };
  },
  }],
  relatedSlugs: ["arduino-power-calculator","relay-sizing-calculator"],
  faq: [
    { question: "How do I calculate servo torque?", answer: "Torque = Load Weight x Arm Length, then apply a safety factor." },
    { question: "What is a good safety factor for servos?", answer: "Use a safety factor of 2x for most hobby projects." },
  ],
  formula: "Torque = Load x Arm Length x Safety Factor / 1000",
};

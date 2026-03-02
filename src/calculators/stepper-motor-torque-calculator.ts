import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stepperMotorTorqueCalculator: CalculatorDefinition = {
  slug: "stepper-motor-torque-calculator",
  title: "Stepper Motor Torque Calculator",
  description: "Calculate stepper motor torque needed for a given load.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["stepper motor torque","motor sizing calculator"],
  variants: [{
    id: "standard",
    name: "Stepper Motor Torque",
    description: "Calculate stepper motor torque needed for a given load.",
    fields: [
      { name: "loadWeight", label: "Load Weight (kg)", type: "number", min: 0.01, max: 500, defaultValue: 2 },
      { name: "leadScrew", label: "Lead Screw Pitch (mm/rev)", type: "number", min: 1, max: 50, defaultValue: 8 },
      { name: "acceleration", label: "Acceleration (mm/s2)", type: "number", min: 1, max: 50000, defaultValue: 1000 },
      { name: "friction", label: "Friction Coefficient", type: "number", min: 0.01, max: 1, defaultValue: 0.15 },
    ],
    calculate: (inputs) => {
      const mass = inputs.loadWeight as number;
      const pitch = inputs.leadScrew as number;
      const accel = inputs.acceleration as number;
      const mu = inputs.friction as number;
      if (!mass || !pitch || !accel || !mu) return null;
      const gravity = 9.81;
      const frictionForce = mass * gravity * mu;
      const accelForce = mass * accel / 1000;
      const totalForce = frictionForce + accelForce;
      const torqueNm = Math.round(totalForce * pitch / (2 * Math.PI * 1000) * 10000) / 10000;
      const torqueOzIn = Math.round(torqueNm * 141.612 * 10) / 10;
      const safetyTorque = Math.round(torqueNm * 2 * 10000) / 10000;
      return {
        primary: { label: "Required Torque", value: formatNumber(torqueOzIn) + " oz-in" },
        details: [
          { label: "Torque (Nm)", value: formatNumber(torqueNm) + " Nm" },
          { label: "With 2x Safety Factor", value: formatNumber(Math.round(safetyTorque * 141.612 * 10) / 10) + " oz-in" },
          { label: "Total Linear Force", value: formatNumber(Math.round(totalForce * 100) / 100) + " N" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What safety factor should I use?", answer: "Use a 2x safety factor to ensure the motor handles peak loads." },
    { question: "Does speed affect torque?", answer: "Yes. Stepper motors lose torque as speed increases." },
  ],
  formula: "Torque = Total Force x Pitch / (2 x PI x 1000)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerPhysicsCalculator: CalculatorDefinition = {
  slug: "power-physics",
  title: "Power (Physics) Calculator",
  description:
    "Calculate mechanical power using the formula P = W/t. Determine the rate at which work is done or energy is transferred.",
  category: "Science",
  categorySlug: "science",
  icon: "Gauge",
  keywords: [
    "power",
    "work",
    "time",
    "watts",
    "energy",
    "rate",
    "physics",
    "mechanical power",
  ],
  variants: [
    {
      id: "power-from-work-time",
      name: "Power from Work & Time",
      fields: [
        {
          name: "work",
          label: "Work Done (J)",
          type: "number",
          placeholder: "Enter work done in joules",
        },
        {
          name: "time",
          label: "Time (s)",
          type: "number",
          placeholder: "Enter time in seconds",
        },
      ],
      calculate: (inputs) => {
        const work = parseFloat(inputs.work as string);
        const time = parseFloat(inputs.time as string);
        if (isNaN(work) || isNaN(time) || time <= 0) {
          return { primary: { label: "Power", value: "Invalid input" }, details: [] };
        }
        const power = work / time;
        return {
          primary: { label: "Power", value: `${formatNumber(power)} W` },
          details: [
            { label: "Work Done", value: `${formatNumber(work)} J` },
            { label: "Time", value: `${formatNumber(time)} s` },
            { label: "Power (kW)", value: `${formatNumber(power / 1000)} kW` },
            { label: "Power (hp)", value: `${formatNumber(power / 745.7)} hp` },
          ],
        };
      },
    },
    {
      id: "power-from-force-velocity",
      name: "Power from Force & Velocity",
      fields: [
        {
          name: "force",
          label: "Force (N)",
          type: "number",
          placeholder: "Enter force in newtons",
        },
        {
          name: "velocity",
          label: "Velocity (m/s)",
          type: "number",
          placeholder: "Enter velocity in m/s",
        },
      ],
      calculate: (inputs) => {
        const force = parseFloat(inputs.force as string);
        const velocity = parseFloat(inputs.velocity as string);
        if (isNaN(force) || isNaN(velocity)) {
          return { primary: { label: "Power", value: "Invalid input" }, details: [] };
        }
        const power = force * velocity;
        return {
          primary: { label: "Power", value: `${formatNumber(power)} W` },
          details: [
            { label: "Force", value: `${formatNumber(force)} N` },
            { label: "Velocity", value: `${formatNumber(velocity)} m/s` },
            { label: "Power (kW)", value: `${formatNumber(power / 1000)} kW` },
            { label: "Power (hp)", value: `${formatNumber(power / 745.7)} hp` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["work-done", "kinetic-energy-calc", "potential-energy-calc"],
  faq: [
    {
      question: "What is power in physics?",
      answer:
        "Power is the rate at which work is done or energy is transferred. It is measured in watts (W), where 1 watt equals 1 joule per second.",
    },
    {
      question: "What is the difference between power and energy?",
      answer:
        "Energy is the total amount of work that can be done, measured in joules. Power is how quickly that energy is used or transferred, measured in watts (joules per second).",
    },
  ],
  formula:
    "P = W/t or P = Fv, where P is power in watts, W is work in joules, t is time in seconds, F is force in newtons, and v is velocity in m/s.",
};

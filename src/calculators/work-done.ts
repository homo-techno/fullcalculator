import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workDoneCalculator: CalculatorDefinition = {
  slug: "work-done",
  title: "Work Done Calculator",
  description:
    "Calculate the work done by a force on an object over a displacement using the formula W = Fd cos(θ).",
  category: "Science",
  categorySlug: "science",
  icon: "Hammer",
  keywords: [
    "work",
    "force",
    "displacement",
    "angle",
    "physics",
    "energy",
    "joules",
  ],
  variants: [
    {
      id: "work-from-force-displacement",
      name: "Work from Force & Displacement",
      fields: [
        {
          name: "force",
          label: "Force (N)",
          type: "number",
          placeholder: "Enter force in newtons",
        },
        {
          name: "displacement",
          label: "Displacement (m)",
          type: "number",
          placeholder: "Enter displacement in meters",
        },
        {
          name: "angle",
          label: "Angle (degrees)",
          type: "number",
          placeholder: "Enter angle between force and displacement (default 0)",
        },
      ],
      calculate: (inputs) => {
        const force = parseFloat(inputs.force as string);
        const displacement = parseFloat(inputs.displacement as string);
        const angleDeg = parseFloat(inputs.angle as string) || 0;
        if (isNaN(force) || isNaN(displacement)) {
          return { primary: { label: "Work Done", value: "Invalid input" }, details: [] };
        }
        const angleRad = (angleDeg * Math.PI) / 180;
        const work = force * displacement * Math.cos(angleRad);
        return {
          primary: { label: "Work Done", value: `${formatNumber(work)} J` },
          details: [
            { label: "Force", value: `${formatNumber(force)} N` },
            { label: "Displacement", value: `${formatNumber(displacement)} m` },
            { label: "Angle", value: `${formatNumber(angleDeg)}°` },
            { label: "cos(θ)", value: formatNumber(Math.cos(angleRad)) },
            { label: "Work Done (kJ)", value: `${formatNumber(work / 1000)} kJ` },
          ],
        };
      },
    },
    {
      id: "force-from-work-displacement",
      name: "Force from Work & Displacement",
      fields: [
        {
          name: "work",
          label: "Work Done (J)",
          type: "number",
          placeholder: "Enter work in joules",
        },
        {
          name: "displacement",
          label: "Displacement (m)",
          type: "number",
          placeholder: "Enter displacement in meters",
        },
        {
          name: "angle",
          label: "Angle (degrees)",
          type: "number",
          placeholder: "Enter angle (default 0)",
        },
      ],
      calculate: (inputs) => {
        const work = parseFloat(inputs.work as string);
        const displacement = parseFloat(inputs.displacement as string);
        const angleDeg = parseFloat(inputs.angle as string) || 0;
        if (isNaN(work) || isNaN(displacement) || displacement === 0) {
          return { primary: { label: "Force", value: "Invalid input" }, details: [] };
        }
        const angleRad = (angleDeg * Math.PI) / 180;
        const cosAngle = Math.cos(angleRad);
        if (cosAngle === 0) {
          return { primary: { label: "Force", value: "Undefined (cos(θ) = 0)" }, details: [] };
        }
        const force = work / (displacement * cosAngle);
        return {
          primary: { label: "Force", value: `${formatNumber(force)} N` },
          details: [
            { label: "Work Done", value: `${formatNumber(work)} J` },
            { label: "Displacement", value: `${formatNumber(displacement)} m` },
            { label: "Angle", value: `${formatNumber(angleDeg)}°` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kinetic-energy-calc", "potential-energy-calc", "power-physics"],
  faq: [
    {
      question: "What is work in physics?",
      answer:
        "In physics, work is the transfer of energy that occurs when a force causes an object to move in the direction of the force. It is measured in joules (J).",
    },
    {
      question: "When is no work done?",
      answer:
        "No work is done when the force is perpendicular to the displacement (θ = 90°), when there is no displacement, or when no force is applied.",
    },
  ],
  formula:
    "W = Fd cos(θ), where W is work in joules, F is force in newtons, d is displacement in meters, and θ is the angle between the force and displacement vectors.",
};

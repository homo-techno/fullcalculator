import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snellsLawCalculator: CalculatorDefinition = {
  slug: "snells-law",
  title: "Snell's Law Calculator",
  description:
    "Calculate the angle of refraction when light passes between two media using Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂).",
  category: "Science",
  categorySlug: "science",
  icon: "Lightbulb",
  keywords: [
    "snells law",
    "refraction",
    "refractive index",
    "angle",
    "light",
    "optics",
    "physics",
  ],
  variants: [
    {
      id: "refraction-angle",
      name: "Angle of Refraction",
      fields: [
        {
          name: "n1",
          label: "Refractive Index n₁",
          type: "number",
          placeholder: "Enter refractive index of medium 1 (e.g. 1.0 for air)",
        },
        {
          name: "theta1",
          label: "Angle of Incidence θ₁ (degrees)",
          type: "number",
          placeholder: "Enter angle of incidence in degrees",
        },
        {
          name: "n2",
          label: "Refractive Index n₂",
          type: "number",
          placeholder: "Enter refractive index of medium 2 (e.g. 1.5 for glass)",
        },
      ],
      calculate: (inputs) => {
        const n1 = parseFloat(inputs.n1 as string);
        const theta1Deg = parseFloat(inputs.theta1 as string);
        const n2 = parseFloat(inputs.n2 as string);
        if (isNaN(n1) || isNaN(theta1Deg) || isNaN(n2) || n2 === 0) {
          return { primary: { label: "Angle of Refraction", value: "Invalid input" }, details: [] };
        }
        const theta1Rad = (theta1Deg * Math.PI) / 180;
        const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
        if (Math.abs(sinTheta2) > 1) {
          const criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI);
          return {
            primary: { label: "Result", value: "Total Internal Reflection" },
            details: [
              { label: "Critical Angle", value: `${formatNumber(criticalAngle)}°` },
              { label: "sin(θ₂)", value: formatNumber(sinTheta2) },
            ],
          };
        }
        const theta2Rad = Math.asin(sinTheta2);
        const theta2Deg = (theta2Rad * 180) / Math.PI;
        return {
          primary: { label: "Angle of Refraction", value: `${formatNumber(theta2Deg)}°` },
          details: [
            { label: "n₁", value: formatNumber(n1) },
            { label: "θ₁", value: `${formatNumber(theta1Deg)}°` },
            { label: "n₂", value: formatNumber(n2) },
            { label: "sin(θ₂)", value: formatNumber(sinTheta2) },
          ],
        };
      },
    },
    {
      id: "critical-angle",
      name: "Critical Angle",
      fields: [
        {
          name: "n1",
          label: "Refractive Index n₁ (denser medium)",
          type: "number",
          placeholder: "Enter refractive index of denser medium",
        },
        {
          name: "n2",
          label: "Refractive Index n₂ (less dense medium)",
          type: "number",
          placeholder: "Enter refractive index of less dense medium",
        },
      ],
      calculate: (inputs) => {
        const n1 = parseFloat(inputs.n1 as string);
        const n2 = parseFloat(inputs.n2 as string);
        if (isNaN(n1) || isNaN(n2) || n1 <= 0 || n2 <= 0 || n2 >= n1) {
          return { primary: { label: "Critical Angle", value: "Invalid input (n₁ must be > n₂)" }, details: [] };
        }
        const criticalAngleRad = Math.asin(n2 / n1);
        const criticalAngleDeg = (criticalAngleRad * 180) / Math.PI;
        return {
          primary: { label: "Critical Angle", value: `${formatNumber(criticalAngleDeg)}°` },
          details: [
            { label: "n₁ (denser)", value: formatNumber(n1) },
            { label: "n₂ (less dense)", value: formatNumber(n2) },
            { label: "n₂/n₁", value: formatNumber(n2 / n1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["thin-lens", "mirror-equation", "frequency-wavelength"],
  faq: [
    {
      question: "What is Snell's Law?",
      answer:
        "Snell's Law describes how light bends when passing from one medium to another. It states that the ratio of the sines of the angles of incidence and refraction equals the inverse ratio of the refractive indices: n₁ sin(θ₁) = n₂ sin(θ₂).",
    },
    {
      question: "What is total internal reflection?",
      answer:
        "Total internal reflection occurs when light traveling in a denser medium hits the boundary with a less dense medium at an angle greater than the critical angle. All light is reflected back into the denser medium instead of being refracted.",
    },
  ],
  formula:
    "n₁ sin(θ₁) = n₂ sin(θ₂), where n₁ and n₂ are refractive indices and θ₁ and θ₂ are the angles of incidence and refraction respectively.",
};

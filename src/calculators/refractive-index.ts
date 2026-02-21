import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const refractiveIndexCalculator: CalculatorDefinition = {
  slug: "refractive-index-calculator",
  title: "Refractive Index Calculator",
  description:
    "Free refractive index calculator. Apply Snell's law n1×sin(θ1) = n2×sin(θ2) to find refraction angle and check for total internal reflection.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "snells law",
    "refractive index",
    "refraction",
    "total internal reflection",
    "optics",
  ],
  variants: [
    {
      id: "find-theta2",
      name: "Find Refraction Angle (θ2)",
      fields: [
        {
          name: "n1",
          label: "Refractive Index n1",
          type: "number",
          placeholder: "e.g. 1.5 (glass)",
        },
        {
          name: "theta1",
          label: "Angle of Incidence θ1 (degrees)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "n2",
          label: "Refractive Index n2",
          type: "number",
          placeholder: "e.g. 1.0 (air)",
        },
      ],
      calculate: (inputs) => {
        const n1 = inputs.n1 as number;
        const theta1Deg = inputs.theta1 as number;
        const n2 = inputs.n2 as number;
        if (!n1 || theta1Deg === undefined || theta1Deg === null || !n2) return null;
        if (n2 <= 0) return null;

        const theta1Rad = (theta1Deg * Math.PI) / 180;
        const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;

        // Check for total internal reflection
        if (Math.abs(sinTheta2) > 1) {
          const criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI);
          return {
            primary: {
              label: "Result",
              value: "Total Internal Reflection",
            },
            details: [
              { label: "n1", value: formatNumber(n1, 4) },
              { label: "n2", value: formatNumber(n2, 4) },
              { label: "θ1", value: formatNumber(theta1Deg, 2) + "°" },
              {
                label: "Critical Angle",
                value: formatNumber(criticalAngle, 2) + "°",
              },
              {
                label: "Note",
                value: "θ1 exceeds the critical angle; light is totally reflected.",
              },
            ],
          };
        }

        const theta2Rad = Math.asin(sinTheta2);
        const theta2Deg = theta2Rad * (180 / Math.PI);

        const details = [
          { label: "n1", value: formatNumber(n1, 4) },
          { label: "θ1", value: formatNumber(theta1Deg, 2) + "°" },
          { label: "n2", value: formatNumber(n2, 4) },
          { label: "sin(θ2)", value: formatNumber(sinTheta2, 6) },
        ];

        // Show critical angle if n1 > n2
        if (n1 > n2) {
          const criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI);
          details.push({
            label: "Critical Angle",
            value: formatNumber(criticalAngle, 2) + "°",
          });
        }

        return {
          primary: {
            label: "Refraction Angle (θ2)",
            value: formatNumber(theta2Deg, 4) + "°",
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["doppler-effect-calculator", "beer-lambert-calculator"],
  faq: [
    {
      question: "What is Snell's Law?",
      answer:
        "Snell's Law describes refraction: n1×sin(θ1) = n2×sin(θ2). When light passes from one medium to another, it bends according to the ratio of refractive indices.",
    },
    {
      question: "What is total internal reflection?",
      answer:
        "Total internal reflection occurs when light travels from a denser medium to a less dense medium at an angle exceeding the critical angle. All light is reflected back into the denser medium.",
    },
  ],
  formula:
    "n1 × sin(θ1) = n2 × sin(θ2). Critical angle: θc = arcsin(n2/n1) when n1 > n2.",
};

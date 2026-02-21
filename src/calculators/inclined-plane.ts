import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inclinedPlaneCalculator: CalculatorDefinition = {
  slug: "inclined-plane-calculator",
  title: "Inclined Plane Calculator",
  description:
    "Free inclined plane calculator. Calculate the force needed to move an object up an incline. F = mg sin(theta). Find force, mechanical advantage, and more.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "inclined plane",
    "ramp calculator",
    "slope force",
    "incline force",
    "simple machines",
    "mechanical advantage",
  ],
  variants: [
    {
      id: "from-mass-angle",
      name: "Force from Mass and Angle",
      description: "F = m × g × sin(θ)",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "angle",
          label: "Angle of Incline (degrees)",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
          max: 90,
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const angleDeg = inputs.angle as number;
        if (!mass || angleDeg === undefined || angleDeg === null) return null;
        if (angleDeg < 0 || angleDeg > 90) return null;

        const g = 9.80665;
        const angleRad = (angleDeg * Math.PI) / 180;
        const weight = mass * g;
        const forceParallel = weight * Math.sin(angleRad); // Force along incline
        const forceNormal = weight * Math.cos(angleRad); // Normal force
        const ma = angleDeg > 0 ? 1 / Math.sin(angleRad) : Infinity; // Mechanical advantage = length/height
        const forceLbs = forceParallel * 0.224809;

        return {
          primary: {
            label: "Force Along Incline",
            value: `${formatNumber(forceParallel, 4)} N`,
          },
          details: [
            { label: "Force Along Incline", value: `${formatNumber(forceParallel, 4)} N (${formatNumber(forceLbs, 4)} lbs)` },
            { label: "Normal Force", value: `${formatNumber(forceNormal, 4)} N` },
            { label: "Weight (mg)", value: `${formatNumber(weight, 4)} N` },
            { label: "Mechanical Advantage", value: angleDeg > 0 ? formatNumber(ma, 4) : "Infinite" },
            { label: "Angle", value: `${formatNumber(angleDeg, 2)}°` },
          ],
        };
      },
    },
    {
      id: "from-dimensions",
      name: "Force from Ramp Dimensions",
      description: "MA = ramp length / ramp height",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "rampLength",
          label: "Ramp Length (m)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "rampHeight",
          label: "Ramp Height (m)",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const length = inputs.rampLength as number;
        const height = inputs.rampHeight as number;
        if (!mass || !length || !height) return null;
        if (height > length) {
          return {
            primary: { label: "Error", value: "Height cannot exceed ramp length" },
            details: [],
          };
        }

        const g = 9.80665;
        const weight = mass * g;
        const ma = length / height;
        const forceNeeded = weight / ma;
        const angleRad = Math.asin(height / length);
        const angleDeg = (angleRad * 180) / Math.PI;
        const normalForce = weight * Math.cos(angleRad);
        const horizontalDist = Math.sqrt(length * length - height * height);

        return {
          primary: {
            label: "Force Along Incline",
            value: `${formatNumber(forceNeeded, 4)} N`,
          },
          details: [
            { label: "Force Along Incline", value: `${formatNumber(forceNeeded, 4)} N` },
            { label: "Normal Force", value: `${formatNumber(normalForce, 4)} N` },
            { label: "Weight (mg)", value: `${formatNumber(weight, 4)} N` },
            { label: "Mechanical Advantage", value: `${formatNumber(ma, 4)}:1` },
            { label: "Incline Angle", value: `${formatNumber(angleDeg, 2)}°` },
            { label: "Horizontal Distance", value: `${formatNumber(horizontalDist, 4)} m` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lever-calculator", "pulley-calculator", "force-calculator"],
  faq: [
    {
      question: "How do I calculate force on an inclined plane?",
      answer:
        "The force needed to push an object up an incline (ignoring friction) is F = mg × sin(θ), where m is mass, g is gravity (9.81 m/s²), and θ is the angle. The mechanical advantage is the ramp length divided by the height.",
    },
    {
      question: "What is the mechanical advantage of a ramp?",
      answer:
        "MA = ramp length / ramp height. A 10-meter ramp rising 2 meters has MA = 5. This means you need only 1/5 the force compared to lifting straight up, but you must push the object 5 times farther.",
    },
  ],
  formula: "F = mg × sin(θ) | MA = length / height",
};

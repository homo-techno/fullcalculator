import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const torqueCalculator: CalculatorDefinition = {
  slug: "torque-calculator",
  title: "Torque Calculator",
  description: "Free torque calculator. Calculate torque from force and distance, or convert between torque units (Nm, lb-ft, kg-cm).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["torque calculator", "torque converter", "nm to lb ft", "torque formula", "rotational force"],
  variants: [
    {
      id: "calculate",
      name: "Calculate Torque",
      fields: [
        { name: "force", label: "Force (N)", type: "number", placeholder: "e.g. 100" },
        { name: "distance", label: "Distance from Pivot (m)", type: "number", placeholder: "e.g. 0.5" },
        { name: "angle", label: "Angle (degrees, 90 = perpendicular)", type: "number", placeholder: "e.g. 90", defaultValue: 90 },
      ],
      calculate: (inputs) => {
        const f = inputs.force as number, d = inputs.distance as number;
        const angle = (inputs.angle as number) || 90;
        if (!f || !d) return null;
        const rad = angle * Math.PI / 180;
        const torque = f * d * Math.sin(rad);
        return {
          primary: { label: "Torque", value: `${formatNumber(torque, 4)} N·m` },
          details: [
            { label: "lb-ft", value: formatNumber(torque * 0.73756, 4) },
            { label: "kg-cm", value: formatNumber(torque * 10.1972, 4) },
            { label: "Force", value: `${f} N` },
            { label: "Lever arm", value: `${d} m` },
          ],
        };
      },
    },
    {
      id: "convert",
      name: "Convert Torque Units",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 100" },
        {
          name: "from", label: "From Unit", type: "select",
          options: [
            { label: "N·m (Newton-meters)", value: "nm" },
            { label: "lb-ft (Pound-feet)", value: "lbft" },
            { label: "kg-cm", value: "kgcm" },
            { label: "in-lbs", value: "inlb" },
          ],
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number, from = (inputs.from as string) || "nm";
        if (!val) return null;
        const toNm: Record<string, number> = { nm: 1, lbft: 1.35582, kgcm: 0.0980665, inlb: 0.112985 };
        const nm = val * (toNm[from] || 1);
        return {
          primary: { label: "Conversions", value: `${formatNumber(nm, 4)} N·m` },
          details: [
            { label: "N·m", value: formatNumber(nm, 4) },
            { label: "lb-ft", value: formatNumber(nm / 1.35582, 4) },
            { label: "kg-cm", value: formatNumber(nm / 0.0980665, 4) },
            { label: "in-lbs", value: formatNumber(nm / 0.112985, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["horsepower-calculator", "force-calculator", "acceleration-calculator"],
  faq: [{ question: "What is torque?", answer: "Torque is a rotational force: τ = F × d × sin(θ), where F is force, d is distance from the pivot, and θ is the angle. Measured in Newton-meters (N·m) or pound-feet (lb-ft). 1 N·m = 0.7376 lb-ft." }],
  formula: "τ = F × d × sin(θ) | 1 N·m = 0.7376 lb-ft",
};

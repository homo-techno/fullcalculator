import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coulombsLawCalculator: CalculatorDefinition = {
  slug: "coulombs-law-calculator",
  title: "Coulomb's Law Calculator",
  description: "Free Coulomb's law calculator. Calculate the electrostatic force between two charged particles.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["coulombs law calculator", "electrostatic force", "electric force", "charge force", "coulomb constant"],
  variants: [
    {
      id: "force",
      name: "Calculate Electrostatic Force",
      fields: [
        { name: "q1", label: "Charge 1 (C)", type: "number", placeholder: "e.g. 1e-6" },
        { name: "q2", label: "Charge 2 (C)", type: "number", placeholder: "e.g. 2e-6" },
        { name: "r", label: "Distance (m)", type: "number", placeholder: "e.g. 0.05" },
      ],
      calculate: (inputs) => {
        const q1 = inputs.q1 as number, q2 = inputs.q2 as number, r = inputs.r as number;
        if (q1 === undefined || q2 === undefined || !r) return null;
        const k = 8.9875e9;
        const F = k * Math.abs(q1 * q2) / (r * r);
        const direction = (q1 > 0) === (q2 > 0) ? "Repulsive" : "Attractive";
        return {
          primary: { label: "Force", value: `${F.toExponential(4)} N` },
          details: [
            { label: "Direction", value: direction },
            { label: "q₁", value: `${q1.toExponential(3)} C` },
            { label: "q₂", value: `${q2.toExponential(3)} C` },
            { label: "Distance", value: `${r} m` },
            { label: "k (Coulomb constant)", value: "8.9875 × 10⁹ N·m²/C²" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "electrical-power-calculator", "force-calculator"],
  faq: [{ question: "What is Coulomb's Law?", answer: "F = k × |q₁q₂| / r², where k = 8.9875 × 10⁹ N·m²/C². Like charges repel, unlike charges attract. The force is proportional to the product of charges and inversely proportional to the square of the distance." }],
  formula: "F = k|q₁q₂|/r² | k = 8.988×10⁹ N·m²/C²",
};

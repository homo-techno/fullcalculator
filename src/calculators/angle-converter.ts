import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const angleConverter: CalculatorDefinition = {
  slug: "angle-converter",
  title: "Angle Converter",
  description: "Free angle converter. Convert between degrees, radians, gradians, and turns. Calculate arc length and sector area.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["angle converter", "degrees to radians", "radians to degrees", "angle calculator", "arc length calculator"],
  variants: [
    {
      id: "convert",
      name: "Convert Angle",
      fields: [
        { name: "value", label: "Angle Value", type: "number", placeholder: "e.g. 90" },
        { name: "from", label: "From", type: "select", options: [
          { label: "Degrees", value: "deg" },
          { label: "Radians", value: "rad" },
          { label: "Gradians", value: "grad" },
          { label: "Turns", value: "turn" },
        ], defaultValue: "deg" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const from = inputs.from as string;
        if (value === undefined) return null;
        const toDeg: Record<string, number> = { deg: 1, rad: 180 / Math.PI, grad: 0.9, turn: 360 };
        const deg = value * (toDeg[from] || 1);
        const rad = deg * Math.PI / 180;
        return {
          primary: { label: `${value} ${from}`, value: from === "deg" ? `${formatNumber(rad, 6)} rad` : `${formatNumber(deg, 4)}°` },
          details: [
            { label: "Degrees", value: `${formatNumber(deg, 6)}°` },
            { label: "Radians", value: formatNumber(rad, 8) },
            { label: "Gradians", value: formatNumber(deg / 0.9, 4) },
            { label: "Turns", value: formatNumber(deg / 360, 6) },
            { label: "As π", value: `${formatNumber(rad / Math.PI, 6)}π` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "unit-converter", "pythagorean-theorem-calculator"],
  faq: [
    { question: "How do I convert degrees to radians?", answer: "Multiply by π/180. So 90° = 90 × π/180 = π/2 ≈ 1.5708 rad. Key angles: 30°=π/6, 45°=π/4, 60°=π/3, 90°=π/2, 180°=π, 360°=2π." },
  ],
  formula: "Radians = Degrees × π/180 | Degrees = Radians × 180/π",
};

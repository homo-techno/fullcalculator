import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawOfSinesCalculator: CalculatorDefinition = {
  slug: "law-of-sines-calculator",
  title: "Law of Sines Calculator",
  description: "Free law of sines calculator. Solve triangles using the sine rule to find unknown sides and angles including the ambiguous case (SSA).",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["law of sines calculator", "sine rule calculator", "triangle solver", "ASA triangle", "ambiguous case"],
  variants: [
    {
      id: "find-side",
      name: "Find Unknown Side (AAS/ASA)",
      description: "Find side b given side a, angle A, and angle B",
      fields: [
        { name: "a", label: "Known side a", type: "number", placeholder: "e.g. 10", min: 0.001 },
        { name: "A", label: "Angle A (opposite side a, degrees)", type: "number", placeholder: "e.g. 30", min: 0.01, max: 179.99 },
        { name: "B", label: "Angle B (degrees)", type: "number", placeholder: "e.g. 45", min: 0.01, max: 179.99 },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const A = inputs.A as number;
        const B = inputs.B as number;
        if (!a || !A || !B || A + B >= 180) return null;

        const C = 180 - A - B;
        const Arad = (A * Math.PI) / 180;
        const Brad = (B * Math.PI) / 180;
        const Crad = (C * Math.PI) / 180;

        const b = (a * Math.sin(Brad)) / Math.sin(Arad);
        const c = (a * Math.sin(Crad)) / Math.sin(Arad);
        const area = 0.5 * a * b * Math.sin(Crad);

        return {
          primary: { label: "Side b", value: formatNumber(b, 6) },
          details: [
            { label: "Side a", value: formatNumber(a, 6) },
            { label: "Side b", value: formatNumber(b, 6) },
            { label: "Side c", value: formatNumber(c, 6) },
            { label: "Angle A", value: formatNumber(A, 4) + "°" },
            { label: "Angle B", value: formatNumber(B, 4) + "°" },
            { label: "Angle C", value: formatNumber(C, 4) + "°" },
            { label: "Area", value: formatNumber(area, 4) },
            { label: "Perimeter", value: formatNumber(a + b + c, 4) },
            { label: "Formula", value: "b/sin(B) = a/sin(A)" },
          ],
        };
      },
    },
    {
      id: "find-angle",
      name: "Find Unknown Angle (SSA)",
      description: "Find angle B given sides a, b and angle A (ambiguous case)",
      fields: [
        { name: "a", label: "Side a (opposite known angle)", type: "number", placeholder: "e.g. 8", min: 0.001 },
        { name: "b", label: "Side b (opposite unknown angle)", type: "number", placeholder: "e.g. 6", min: 0.001 },
        { name: "A", label: "Angle A (degrees)", type: "number", placeholder: "e.g. 40", min: 0.01, max: 179.99 },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const A = inputs.A as number;
        if (!a || !b || !A) return null;

        const Arad = (A * Math.PI) / 180;
        const sinB = (b * Math.sin(Arad)) / a;

        if (sinB > 1) {
          return {
            primary: { label: "Result", value: "No triangle exists" },
            details: [
              { label: "sin(B)", value: formatNumber(sinB, 6) + " > 1" },
              { label: "Reason", value: "The given sides and angle cannot form a triangle" },
            ],
          };
        }

        const B1 = (Math.asin(sinB) * 180) / Math.PI;
        const B2 = 180 - B1;
        const C1 = 180 - A - B1;
        const C2 = 180 - A - B2;

        const details: { label: string; value: string }[] = [
          { label: "sin(B)", value: formatNumber(sinB, 8) },
        ];

        // Solution 1
        if (C1 > 0) {
          const c1 = (a * Math.sin((C1 * Math.PI) / 180)) / Math.sin(Arad);
          details.push({ label: "--- Solution 1 ---", value: "" });
          details.push({ label: "Angle B₁", value: formatNumber(B1, 4) + "°" });
          details.push({ label: "Angle C₁", value: formatNumber(C1, 4) + "°" });
          details.push({ label: "Side c₁", value: formatNumber(c1, 6) });
        }

        // Solution 2 (ambiguous case)
        const hasTwoSolutions = C2 > 0 && Math.abs(B1 - B2) > 0.001;
        if (hasTwoSolutions) {
          const c2 = (a * Math.sin((C2 * Math.PI) / 180)) / Math.sin(Arad);
          details.push({ label: "--- Solution 2 ---", value: "" });
          details.push({ label: "Angle B₂", value: formatNumber(B2, 4) + "°" });
          details.push({ label: "Angle C₂", value: formatNumber(C2, 4) + "°" });
          details.push({ label: "Side c₂", value: formatNumber(c2, 6) });
        }

        details.push({ label: "Ambiguous case?", value: hasTwoSolutions ? "Yes (two valid triangles)" : "No (one solution)" });

        return {
          primary: { label: "Angle B", value: hasTwoSolutions ? `${formatNumber(B1, 4)}° or ${formatNumber(B2, 4)}°` : formatNumber(B1, 4) + "°" },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["law-of-cosines-calculator", "trig-calculator", "triangle-area-calculator"],
  faq: [
    { question: "What is the Law of Sines?", answer: "The Law of Sines states: a/sin(A) = b/sin(B) = c/sin(C), where a, b, c are sides and A, B, C are opposite angles. It relates the ratio of each side to the sine of its opposite angle." },
    { question: "What is the ambiguous case (SSA)?", answer: "When given two sides and a non-included angle (SSA), there may be 0, 1, or 2 valid triangles. This occurs because sin(B) = sin(180°-B), creating two possible angles. You must check if both angles produce valid triangles (all angles positive and summing to 180°)." },
  ],
  formula: "a/sin(A) = b/sin(B) = c/sin(C) | sin(B) = b·sin(A)/a",
};

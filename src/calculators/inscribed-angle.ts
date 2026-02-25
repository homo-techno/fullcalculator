import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inscribedAngleCalculator: CalculatorDefinition = {
  slug: "inscribed-angle-calculator",
  title: "Inscribed Angle Calculator",
  description: "Free inscribed angle calculator. Calculate the inscribed angle, central angle, arc length, and intercepted arc from circle properties.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["inscribed angle calculator", "inscribed angle", "central angle", "intercepted arc", "circle angle theorem"],
  variants: [
    {
      id: "fromCentralAngle",
      name: "From Central Angle",
      fields: [
        { name: "centralAngle", label: "Central Angle (degrees)", type: "number", placeholder: "e.g. 120" },
        { name: "radius", label: "Radius (optional for arc)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const central = inputs.centralAngle as number;
        const r = inputs.radius as number;
        if (!central) return null;
        const inscribed = central / 2;
        const details: { label: string; value: string }[] = [
          { label: "Central angle", value: formatNumber(central, 6) + "\u00b0" },
          { label: "Intercepted arc", value: formatNumber(central, 6) + "\u00b0" },
        ];
        if (r) {
          const rad = (central * Math.PI) / 180;
          details.push({ label: "Arc length", value: formatNumber(r * rad, 6) });
          details.push({ label: "Chord length", value: formatNumber(2 * r * Math.sin(rad / 2), 6) });
        }
        return {
          primary: { label: "Inscribed Angle", value: formatNumber(inscribed, 6) + "\u00b0" },
          details,
        };
      },
    },
    {
      id: "fromInscribedAngle",
      name: "From Inscribed Angle",
      fields: [
        { name: "inscribedAngle", label: "Inscribed Angle (degrees)", type: "number", placeholder: "e.g. 60" },
        { name: "radius", label: "Radius (optional for arc)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const inscribed = inputs.inscribedAngle as number;
        const r = inputs.radius as number;
        if (!inscribed) return null;
        const central = 2 * inscribed;
        const details: { label: string; value: string }[] = [
          { label: "Inscribed angle", value: formatNumber(inscribed, 6) + "\u00b0" },
          { label: "Intercepted arc", value: formatNumber(central, 6) + "\u00b0" },
        ];
        if (r) {
          const rad = (central * Math.PI) / 180;
          details.push({ label: "Arc length", value: formatNumber(r * rad, 6) });
          details.push({ label: "Chord length", value: formatNumber(2 * r * Math.sin(rad / 2), 6) });
        }
        return {
          primary: { label: "Central Angle", value: formatNumber(central, 6) + "\u00b0" },
          details,
        };
      },
    },
    {
      id: "fromArc",
      name: "From Intercepted Arc",
      fields: [
        { name: "arc", label: "Intercepted Arc (degrees)", type: "number", placeholder: "e.g. 120" },
      ],
      calculate: (inputs) => {
        const arc = inputs.arc as number;
        if (!arc) return null;
        const inscribed = arc / 2;
        const central = arc;
        return {
          primary: { label: "Inscribed Angle", value: formatNumber(inscribed, 6) + "\u00b0" },
          details: [
            { label: "Central angle", value: formatNumber(central, 6) + "\u00b0" },
            { label: "Intercepted arc", value: formatNumber(arc, 6) + "\u00b0" },
            { label: "Remaining arc", value: formatNumber(360 - arc, 6) + "\u00b0" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["arc-length-calculator", "chord-length-calculator", "sector-area-calculator"],
  faq: [
    { question: "What is the inscribed angle theorem?", answer: "The inscribed angle theorem states that an inscribed angle is half of the central angle that subtends the same arc. Inscribed angle = central angle / 2." },
    { question: "What is an inscribed angle?", answer: "An inscribed angle is formed by two chords that share an endpoint on the circle. The vertex is on the circle, unlike a central angle whose vertex is at the center." },
  ],
  formula: "Inscribed angle = Central angle / 2 = Intercepted arc / 2",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const magneticForceCalculator: CalculatorDefinition = {
  slug: "magnetic-force",
  title: "Magnetic Force Calculator",
  description:
    "Calculate the magnetic force on a moving charged particle using F = qvB sin(θ), the Lorentz force law.",
  category: "Science",
  categorySlug: "science",
  icon: "Magnet",
  keywords: [
    "magnetic force",
    "lorentz force",
    "charge",
    "magnetic field",
    "velocity",
    "physics",
    "tesla",
  ],
  variants: [
    {
      id: "force-on-charge",
      name: "Force on a Moving Charge",
      fields: [
        {
          name: "charge",
          label: "Charge q (C)",
          type: "number",
          placeholder: "Enter charge in coulombs",
        },
        {
          name: "velocity",
          label: "Velocity v (m/s)",
          type: "number",
          placeholder: "Enter velocity in m/s",
        },
        {
          name: "magneticField",
          label: "Magnetic Field B (T)",
          type: "number",
          placeholder: "Enter magnetic field in tesla",
        },
        {
          name: "angle",
          label: "Angle θ (degrees)",
          type: "number",
          placeholder: "Enter angle between v and B (default 90)",
        },
      ],
      calculate: (inputs) => {
        const q = parseFloat(inputs.charge as string);
        const v = parseFloat(inputs.velocity as string);
        const B = parseFloat(inputs.magneticField as string);
        const angleDeg = parseFloat(inputs.angle as string) || 90;
        if (isNaN(q) || isNaN(v) || isNaN(B)) {
          return { primary: { label: "Magnetic Force", value: "Invalid input" }, details: [] };
        }
        const angleRad = (angleDeg * Math.PI) / 180;
        const force = Math.abs(q) * v * B * Math.sin(angleRad);
        const radius = v !== 0 && B !== 0 ? (Math.abs(q) > 0 ? (parseFloat((inputs.mass as string) || "0") || Math.abs(q)) * v / (Math.abs(q) * B) : 0) : 0;
        return {
          primary: { label: "Magnetic Force", value: `${formatNumber(force)} N` },
          details: [
            { label: "Charge", value: `${formatNumber(q)} C` },
            { label: "Velocity", value: `${formatNumber(v)} m/s` },
            { label: "Magnetic Field", value: `${formatNumber(B)} T` },
            { label: "Angle", value: `${formatNumber(angleDeg)}°` },
            { label: "sin(θ)", value: formatNumber(Math.sin(angleRad)) },
          ],
        };
      },
    },
    {
      id: "force-on-wire",
      name: "Force on a Current-Carrying Wire",
      fields: [
        {
          name: "current",
          label: "Current I (A)",
          type: "number",
          placeholder: "Enter current in amperes",
        },
        {
          name: "length",
          label: "Wire Length L (m)",
          type: "number",
          placeholder: "Enter length of wire in meters",
        },
        {
          name: "magneticField",
          label: "Magnetic Field B (T)",
          type: "number",
          placeholder: "Enter magnetic field in tesla",
        },
        {
          name: "angle",
          label: "Angle θ (degrees)",
          type: "number",
          placeholder: "Enter angle between wire and B (default 90)",
        },
      ],
      calculate: (inputs) => {
        const I = parseFloat(inputs.current as string);
        const L = parseFloat(inputs.length as string);
        const B = parseFloat(inputs.magneticField as string);
        const angleDeg = parseFloat(inputs.angle as string) || 90;
        if (isNaN(I) || isNaN(L) || isNaN(B)) {
          return { primary: { label: "Force", value: "Invalid input" }, details: [] };
        }
        const angleRad = (angleDeg * Math.PI) / 180;
        const force = I * L * B * Math.sin(angleRad);
        return {
          primary: { label: "Magnetic Force", value: `${formatNumber(force)} N` },
          details: [
            { label: "Current", value: `${formatNumber(I)} A` },
            { label: "Wire Length", value: `${formatNumber(L)} m` },
            { label: "Magnetic Field", value: `${formatNumber(B)} T` },
            { label: "Angle", value: `${formatNumber(angleDeg)}°` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electric-field", "faraday-law", "capacitor-energy"],
  faq: [
    {
      question: "What is the magnetic force on a moving charge?",
      answer:
        "A charged particle moving through a magnetic field experiences a force perpendicular to both its velocity and the magnetic field. The magnitude is F = qvB sin(θ), where θ is the angle between v and B.",
    },
    {
      question: "Why is the magnetic force always perpendicular to velocity?",
      answer:
        "The magnetic force is given by the cross product F = qv × B, which by definition produces a vector perpendicular to both v and B. This means the magnetic force does no work on the charged particle and only changes its direction, not its speed.",
    },
  ],
  formula:
    "F = qvB sin(θ) for a moving charge; F = ILB sin(θ) for a current-carrying wire, where q is charge, v is velocity, I is current, L is wire length, B is magnetic field, and θ is the angle.",
};

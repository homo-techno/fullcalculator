import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricFieldCalculator: CalculatorDefinition = {
  slug: "electric-field",
  title: "Electric Field Calculator",
  description:
    "Calculate the electric field due to a point charge using Coulomb's Law: E = kQ/r², where k is Coulomb's constant.",
  category: "Science",
  categorySlug: "science",
  icon: "Zap",
  keywords: [
    "electric field",
    "coulomb",
    "point charge",
    "electrostatics",
    "physics",
    "electric force",
  ],
  variants: [
    {
      id: "field-from-charge-distance",
      name: "Electric Field from Charge & Distance",
      fields: [
        {
          name: "charge",
          label: "Charge Q (C)",
          type: "number",
          placeholder: "Enter charge in coulombs (e.g. 1e-6 for 1 μC)",
        },
        {
          name: "distance",
          label: "Distance r (m)",
          type: "number",
          placeholder: "Enter distance from charge in meters",
        },
      ],
      calculate: (inputs) => {
        const Q = parseFloat(inputs.charge as string);
        const r = parseFloat(inputs.distance as string);
        if (isNaN(Q) || isNaN(r) || r <= 0) {
          return { primary: { label: "Electric Field", value: "Invalid input" }, details: [] };
        }
        const k = 8.9875e9;
        const E = (k * Math.abs(Q)) / (r * r);
        const direction = Q >= 0 ? "Away from charge (radially outward)" : "Toward charge (radially inward)";
        return {
          primary: { label: "Electric Field", value: `${formatNumber(E)} N/C` },
          details: [
            { label: "Charge", value: `${formatNumber(Q)} C` },
            { label: "Distance", value: `${formatNumber(r)} m` },
            { label: "Coulomb's Constant k", value: "8.9875 × 10⁹ N·m²/C²" },
            { label: "Direction", value: direction },
            { label: "Electric Field (V/m)", value: `${formatNumber(E)} V/m` },
          ],
        };
      },
    },
    {
      id: "force-on-test-charge",
      name: "Force on a Test Charge",
      fields: [
        {
          name: "electricField",
          label: "Electric Field E (N/C)",
          type: "number",
          placeholder: "Enter electric field strength",
        },
        {
          name: "testCharge",
          label: "Test Charge q (C)",
          type: "number",
          placeholder: "Enter test charge in coulombs",
        },
      ],
      calculate: (inputs) => {
        const E = parseFloat(inputs.electricField as string);
        const q = parseFloat(inputs.testCharge as string);
        if (isNaN(E) || isNaN(q)) {
          return { primary: { label: "Force", value: "Invalid input" }, details: [] };
        }
        const force = E * q;
        return {
          primary: { label: "Electric Force", value: `${formatNumber(Math.abs(force))} N` },
          details: [
            { label: "Electric Field", value: `${formatNumber(E)} N/C` },
            { label: "Test Charge", value: `${formatNumber(q)} C` },
            { label: "Force Direction", value: force >= 0 ? "Same as E field" : "Opposite to E field" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["magnetic-force", "capacitor-energy", "faraday-law"],
  faq: [
    {
      question: "What is an electric field?",
      answer:
        "An electric field is a region around a charged particle where other charged particles experience a force. It is a vector field pointing away from positive charges and toward negative charges.",
    },
    {
      question: "What is the unit of electric field?",
      answer:
        "The electric field is measured in newtons per coulomb (N/C) or equivalently in volts per meter (V/m). Both units are identical.",
    },
  ],
  formula:
    "E = kQ/r², where E is the electric field in N/C, k = 8.9875 × 10⁹ N·m²/C² (Coulomb's constant), Q is charge in coulombs, and r is distance in meters.",
};

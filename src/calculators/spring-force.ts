import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const springForceCalculator: CalculatorDefinition = {
  slug: "spring-force",
  title: "Spring Force (Hooke's Law) Calculator",
  description:
    "Calculate the force exerted by a spring using Hooke's Law: F = -kx. Also compute the elastic potential energy stored in the spring.",
  category: "Science",
  categorySlug: "science",
  icon: "Waves",
  keywords: [
    "spring force",
    "hookes law",
    "spring constant",
    "displacement",
    "elasticity",
    "physics",
  ],
  variants: [
    {
      id: "force-from-k-x",
      name: "Spring Force from Constant & Displacement",
      fields: [
        {
          name: "springConstant",
          label: "Spring Constant k (N/m)",
          type: "number",
          placeholder: "Enter spring constant in N/m",
        },
        {
          name: "displacement",
          label: "Displacement x (m)",
          type: "number",
          placeholder: "Enter displacement from equilibrium in meters",
        },
      ],
      calculate: (inputs) => {
        const k = parseFloat(inputs.springConstant as string);
        const x = parseFloat(inputs.displacement as string);
        if (isNaN(k) || isNaN(x)) {
          return { primary: { label: "Spring Force", value: "Invalid input" }, details: [] };
        }
        const force = -k * x;
        const energy = 0.5 * k * x * x;
        return {
          primary: { label: "Spring Force", value: `${formatNumber(force)} N` },
          details: [
            { label: "Spring Constant", value: `${formatNumber(k)} N/m` },
            { label: "Displacement", value: `${formatNumber(x)} m` },
            { label: "Force Magnitude", value: `${formatNumber(Math.abs(force))} N` },
            { label: "Elastic PE Stored", value: `${formatNumber(energy)} J` },
          ],
        };
      },
    },
    {
      id: "spring-constant-from-force-displacement",
      name: "Spring Constant from Force & Displacement",
      fields: [
        {
          name: "force",
          label: "Force (N)",
          type: "number",
          placeholder: "Enter force magnitude in newtons",
        },
        {
          name: "displacement",
          label: "Displacement x (m)",
          type: "number",
          placeholder: "Enter displacement in meters",
        },
      ],
      calculate: (inputs) => {
        const force = parseFloat(inputs.force as string);
        const x = parseFloat(inputs.displacement as string);
        if (isNaN(force) || isNaN(x) || x === 0) {
          return { primary: { label: "Spring Constant", value: "Invalid input" }, details: [] };
        }
        const k = Math.abs(force / x);
        const energy = 0.5 * k * x * x;
        return {
          primary: { label: "Spring Constant", value: `${formatNumber(k)} N/m` },
          details: [
            { label: "Force", value: `${formatNumber(force)} N` },
            { label: "Displacement", value: `${formatNumber(x)} m` },
            { label: "Elastic PE Stored", value: `${formatNumber(energy)} J` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["work-done", "potential-energy-calc", "wave-speed"],
  faq: [
    {
      question: "What is Hooke's Law?",
      answer:
        "Hooke's Law states that the force exerted by a spring is proportional to its displacement from equilibrium: F = -kx. The negative sign indicates the force is a restoring force that opposes the displacement.",
    },
    {
      question: "When does Hooke's Law break down?",
      answer:
        "Hooke's Law is valid only within the elastic limit of the material. Beyond this limit, the material deforms permanently and the relationship between force and displacement is no longer linear.",
    },
  ],
  formula:
    "F = -kx, where F is the spring force in newtons, k is the spring constant in N/m, and x is the displacement from equilibrium in meters. Elastic PE = ½kx².",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const angularMomentumCalculator: CalculatorDefinition = {
  slug: "angular-momentum-calculator",
  title: "Angular Momentum Calculator",
  description: "Free angular momentum calculator. Compute angular momentum, torque, and rotational kinetic energy for rotating objects and orbiting bodies.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["angular momentum", "rotational momentum", "torque", "angular velocity", "rotational kinetic energy", "moment of inertia"],
  variants: [
    {
      id: "rotational",
      name: "Rotational Angular Momentum",
      description: "Calculate L = Iω for a rotating object",
      fields: [
        { name: "momentOfInertia", label: "Moment of Inertia (kg·m²)", type: "number", placeholder: "e.g. 2.5", min: 0.0001 },
        { name: "angularVelocity", label: "Angular Velocity (rad/s)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const I = parseFloat(inputs.momentOfInertia as string);
        const omega = parseFloat(inputs.angularVelocity as string);
        if (isNaN(I) || isNaN(omega)) return null;
        if (I <= 0) return null;

        const L = I * omega;
        const KE = 0.5 * I * omega * omega;
        const rpm = (Math.abs(omega) * 60) / (2 * Math.PI);
        const period = omega !== 0 ? (2 * Math.PI) / Math.abs(omega) : Infinity;
        const frequency = omega !== 0 ? Math.abs(omega) / (2 * Math.PI) : 0;

        return {
          primary: { label: "Angular Momentum (L)", value: `${formatNumber(L, 6)} kg·m²/s` },
          details: [
            { label: "Angular Momentum (L)", value: `${formatNumber(L, 6)} kg·m²/s` },
            { label: "Rotational KE", value: `${formatNumber(KE, 6)} J` },
            { label: "Angular Velocity", value: `${formatNumber(omega, 4)} rad/s` },
            { label: "RPM", value: formatNumber(rpm, 2) },
            { label: "Period", value: period === Infinity ? "∞" : `${formatNumber(period, 4)} s` },
            { label: "Frequency", value: `${formatNumber(frequency, 4)} Hz` },
          ],
        };
      },
    },
    {
      id: "orbital",
      name: "Orbital Angular Momentum",
      description: "Calculate L = mvr for an object in circular orbit",
      fields: [
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 2", min: 0.0001 },
        { name: "velocity", label: "Tangential Velocity (m/s)", type: "number", placeholder: "e.g. 5" },
        { name: "radius", label: "Orbital Radius (m)", type: "number", placeholder: "e.g. 3", min: 0.0001 },
      ],
      calculate: (inputs) => {
        const m = parseFloat(inputs.mass as string);
        const v = parseFloat(inputs.velocity as string);
        const r = parseFloat(inputs.radius as string);
        if (isNaN(m) || isNaN(v) || isNaN(r)) return null;
        if (m <= 0 || r <= 0) return null;

        const L = m * v * r;
        const omega = v / r;
        const KE = 0.5 * m * v * v;
        const centripetalAccel = (v * v) / r;
        const centripetalForce = m * centripetalAccel;
        const period = (2 * Math.PI * r) / Math.abs(v);

        return {
          primary: { label: "Angular Momentum (L)", value: `${formatNumber(L, 6)} kg·m²/s` },
          details: [
            { label: "Angular Momentum (L = mvr)", value: `${formatNumber(L, 6)} kg·m²/s` },
            { label: "Angular Velocity (ω = v/r)", value: `${formatNumber(omega, 6)} rad/s` },
            { label: "Kinetic Energy", value: `${formatNumber(KE, 4)} J` },
            { label: "Centripetal Acceleration", value: `${formatNumber(centripetalAccel, 4)} m/s²` },
            { label: "Centripetal Force", value: `${formatNumber(centripetalForce, 4)} N` },
            { label: "Orbital Period", value: `${formatNumber(period, 4)} s` },
          ],
        };
      },
    },
    {
      id: "conservation",
      name: "Conservation of Angular Momentum",
      description: "Given initial state and new moment of inertia, find new angular velocity",
      fields: [
        { name: "i1", label: "Initial Moment of Inertia (kg·m²)", type: "number", placeholder: "e.g. 5", min: 0.0001 },
        { name: "omega1", label: "Initial Angular Velocity (rad/s)", type: "number", placeholder: "e.g. 10" },
        { name: "i2", label: "Final Moment of Inertia (kg·m²)", type: "number", placeholder: "e.g. 2", min: 0.0001 },
      ],
      calculate: (inputs) => {
        const I1 = parseFloat(inputs.i1 as string);
        const omega1 = parseFloat(inputs.omega1 as string);
        const I2 = parseFloat(inputs.i2 as string);
        if (isNaN(I1) || isNaN(omega1) || isNaN(I2)) return null;
        if (I1 <= 0 || I2 <= 0) return null;

        const L = I1 * omega1;
        const omega2 = L / I2;
        const KE1 = 0.5 * I1 * omega1 * omega1;
        const KE2 = 0.5 * I2 * omega2 * omega2;
        const deltaKE = KE2 - KE1;

        return {
          primary: { label: "Final Angular Velocity", value: `${formatNumber(omega2, 4)} rad/s` },
          details: [
            { label: "Conserved L", value: `${formatNumber(L, 6)} kg·m²/s` },
            { label: "Initial ω", value: `${formatNumber(omega1, 4)} rad/s` },
            { label: "Final ω", value: `${formatNumber(omega2, 4)} rad/s` },
            { label: "Speed Change Factor", value: `${formatNumber(omega2 / omega1, 4)}×` },
            { label: "Initial KE", value: `${formatNumber(KE1, 4)} J` },
            { label: "Final KE", value: `${formatNumber(KE2, 4)} J` },
            { label: "ΔKE", value: `${formatNumber(deltaKE, 4)} J` },
          ],
          note: "Angular momentum is conserved (L = Iω = const). When I decreases, ω increases (like a spinning ice skater pulling in their arms).",
        };
      },
    },
  ],
  relatedSlugs: ["moment-of-inertia-calculator", "momentum-calculator", "force-calculator"],
  faq: [
    { question: "What is angular momentum?", answer: "Angular momentum (L) measures the rotational motion of an object. For a rotating body: L = Iω (moment of inertia times angular velocity). For an orbiting particle: L = mvr (mass times velocity times radius). It is measured in kg·m²/s." },
    { question: "What is conservation of angular momentum?", answer: "In the absence of external torques, the total angular momentum of a system remains constant. This means I₁ω₁ = I₂ω₂. When a spinning skater pulls in their arms (reducing I), they spin faster (increasing ω)." },
    { question: "What is the relationship between torque and angular momentum?", answer: "Torque is the rate of change of angular momentum: τ = dL/dt. If no net torque acts on a system, angular momentum is conserved. This is the rotational analog of Newton's second law (F = dp/dt)." },
  ],
  formula: "L = Iω | L = mvr | τ = dL/dt | KE_rot = ½Iω² | Conservation: I₁ω₁ = I₂ω₂",
};

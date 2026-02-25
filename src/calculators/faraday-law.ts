import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const faradayLawCalculator: CalculatorDefinition = {
  slug: "faraday-law",
  title: "Faraday's Law Calculator",
  description:
    "Calculate the induced electromotive force (EMF) using Faraday's Law of electromagnetic induction: EMF = -NΔΦ/Δt.",
  category: "Science",
  categorySlug: "science",
  icon: "RotateCw",
  keywords: [
    "faraday",
    "electromagnetic induction",
    "emf",
    "magnetic flux",
    "coil",
    "voltage",
    "physics",
  ],
  variants: [
    {
      id: "emf-from-flux-change",
      name: "EMF from Flux Change",
      fields: [
        {
          name: "turns",
          label: "Number of Turns N",
          type: "number",
          placeholder: "Enter number of coil turns",
        },
        {
          name: "fluxChange",
          label: "Change in Magnetic Flux ΔΦ (Wb)",
          type: "number",
          placeholder: "Enter change in magnetic flux in webers",
        },
        {
          name: "timeChange",
          label: "Time Interval Δt (s)",
          type: "number",
          placeholder: "Enter time interval in seconds",
        },
      ],
      calculate: (inputs) => {
        const N = parseFloat(inputs.turns as string);
        const deltaPhi = parseFloat(inputs.fluxChange as string);
        const deltaT = parseFloat(inputs.timeChange as string);
        if (isNaN(N) || isNaN(deltaPhi) || isNaN(deltaT) || deltaT === 0) {
          return { primary: { label: "Induced EMF", value: "Invalid input" }, details: [] };
        }
        const emf = -N * (deltaPhi / deltaT);
        return {
          primary: { label: "Induced EMF", value: `${formatNumber(Math.abs(emf))} V` },
          details: [
            { label: "Number of Turns", value: formatNumber(N) },
            { label: "Flux Change", value: `${formatNumber(deltaPhi)} Wb` },
            { label: "Time Interval", value: `${formatNumber(deltaT)} s` },
            { label: "EMF (signed)", value: `${formatNumber(emf)} V` },
            { label: "Rate of Flux Change", value: `${formatNumber(deltaPhi / deltaT)} Wb/s` },
          ],
        };
      },
    },
    {
      id: "emf-from-field-area",
      name: "EMF from Changing Magnetic Field",
      fields: [
        {
          name: "turns",
          label: "Number of Turns N",
          type: "number",
          placeholder: "Enter number of coil turns",
        },
        {
          name: "area",
          label: "Coil Area A (m²)",
          type: "number",
          placeholder: "Enter coil area in m²",
        },
        {
          name: "fieldChange",
          label: "Change in Magnetic Field ΔB (T)",
          type: "number",
          placeholder: "Enter change in magnetic field in tesla",
        },
        {
          name: "timeChange",
          label: "Time Interval Δt (s)",
          type: "number",
          placeholder: "Enter time interval in seconds",
        },
      ],
      calculate: (inputs) => {
        const N = parseFloat(inputs.turns as string);
        const A = parseFloat(inputs.area as string);
        const deltaB = parseFloat(inputs.fieldChange as string);
        const deltaT = parseFloat(inputs.timeChange as string);
        if (isNaN(N) || isNaN(A) || isNaN(deltaB) || isNaN(deltaT) || deltaT === 0) {
          return { primary: { label: "Induced EMF", value: "Invalid input" }, details: [] };
        }
        const deltaPhi = deltaB * A;
        const emf = -N * (deltaPhi / deltaT);
        return {
          primary: { label: "Induced EMF", value: `${formatNumber(Math.abs(emf))} V` },
          details: [
            { label: "Number of Turns", value: formatNumber(N) },
            { label: "Coil Area", value: `${formatNumber(A)} m²` },
            { label: "ΔB", value: `${formatNumber(deltaB)} T` },
            { label: "ΔΦ", value: `${formatNumber(deltaPhi)} Wb` },
            { label: "Time Interval", value: `${formatNumber(deltaT)} s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["magnetic-force", "electric-field", "capacitor-energy"],
  faq: [
    {
      question: "What is Faraday's Law of induction?",
      answer:
        "Faraday's Law states that a changing magnetic flux through a coil induces an electromotive force (EMF) proportional to the rate of change of flux and the number of turns in the coil.",
    },
    {
      question: "What does the negative sign in Faraday's Law mean?",
      answer:
        "The negative sign represents Lenz's Law, which states that the induced EMF always opposes the change in flux that caused it. This is a consequence of conservation of energy.",
    },
  ],
  formula:
    "EMF = -N(ΔΦ/Δt), where N is the number of turns, ΔΦ is the change in magnetic flux in webers, and Δt is the time interval in seconds. Magnetic flux Φ = BA cos(θ).",
};

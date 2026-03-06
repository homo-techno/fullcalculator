import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const schwarzschildRadiusAdvancedCalculator: CalculatorDefinition = {
  slug: "schwarzschild-radius-advanced-calculator",
  title: "Black Hole Properties Calculator",
  description: "Calculate key properties of a non-rotating black hole including Schwarzschild radius, event horizon area, Hawking temperature, and evaporation time.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["black hole","schwarzschild radius","hawking radiation","event horizon"],
  variants: [{
    id: "standard",
    name: "Black Hole Properties",
    description: "Calculate key properties of a non-rotating black hole including Schwarzschild radius, event horizon area, Hawking temperature, and evaporation time.",
    fields: [
      { name: "mass", label: "Black Hole Mass (solar masses)", type: "number", min: 0.0001, max: 1e15, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const Msun = inputs.mass as number;
    const M = Msun * 1.989e30;
    const G = 6.674e-11;
    const c = 3e8;
    const hbar = 1.055e-34;
    const kB = 1.381e-23;
    const Rs = 2 * G * M / (c * c);
    const area = 4 * Math.PI * Rs * Rs;
    const hawkingTemp = hbar * c * c * c / (8 * Math.PI * G * M * kB);
    const evapTime = 5120 * Math.PI * G * G * M * M * M / (hbar * c * c * c * c);
    const evapYears = evapTime / (365.25 * 24 * 3600);
    return {
      primary: { label: "Schwarzschild Radius", value: formatNumber(Math.round(Rs * 1000) / 1000) + " m" },
      details: [
        { label: "Event Horizon Area", value: formatNumber(area) + " m2" },
        { label: "Hawking Temperature", value: formatNumber(hawkingTemp) + " K" },
        { label: "Evaporation Time", value: formatNumber(evapYears) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["roche-limit-calculator","gravitational-lensing-calculator"],
  faq: [
    { question: "What is the Schwarzschild radius?", answer: "The Schwarzschild radius is the radius of the event horizon of a non-rotating black hole. Any object compressed within its Schwarzschild radius becomes a black hole from which nothing can escape." },
    { question: "What is Hawking radiation?", answer: "Hawking radiation is the theoretical thermal radiation emitted by black holes due to quantum effects near the event horizon. It causes black holes to slowly lose mass and eventually evaporate." },
    { question: "How long would a solar-mass black hole take to evaporate?", answer: "A black hole of one solar mass would take approximately 2 x 10^67 years to evaporate through Hawking radiation, vastly longer than the current age of the universe." },
  ],
  formula: "Rs = 2GM / c^2; Hawking Temperature = hbar x c^3 / (8 x pi x G x M x kB); Evaporation Time = 5120 x pi x G^2 x M^3 / (hbar x c^4)",
};

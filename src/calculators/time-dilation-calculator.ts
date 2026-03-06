import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeDilationCalculator: CalculatorDefinition = {
  slug: "time-dilation-calculator",
  title: "Relativistic Time Dilation Calculator",
  description: "Calculate the time dilation effects from special and gravitational relativity for objects traveling at high speeds or near massive bodies.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["time dilation","special relativity","lorentz factor","twin paradox"],
  variants: [{
    id: "standard",
    name: "Relativistic Time Dilation",
    description: "Calculate the time dilation effects from special and gravitational relativity for objects traveling at high speeds or near massive bodies.",
    fields: [
      { name: "velocity", label: "Travel Velocity (% of c)", type: "number", min: 0.01, max: 99.9999, defaultValue: 90 },
      { name: "properTime", label: "Proper Time (years)", type: "number", min: 0.01, max: 10000, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const vPercent = inputs.velocity as number;
    const tau = inputs.properTime as number;
    const beta = vPercent / 100;
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    const earthTime = tau * gamma;
    const lengthContract = 1 / gamma;
    const distanceLY = beta * earthTime;
    return {
      primary: { label: "Earth Time Elapsed", value: formatNumber(Math.round(earthTime * 1000) / 1000) + " years" },
      details: [
        { label: "Lorentz Factor", value: formatNumber(Math.round(gamma * 10000) / 10000) },
        { label: "Length Contraction", value: formatNumber(Math.round(lengthContract * 10000) / 10000) },
        { label: "Distance Traveled", value: formatNumber(Math.round(distanceLY * 100) / 100) + " light years" }
      ]
    };
  },
  }],
  relatedSlugs: ["space-travel-time-calculator","cosmic-redshift-distance-calculator"],
  faq: [
    { question: "What is time dilation?", answer: "Time dilation is the effect where time passes more slowly for an object moving at high speed relative to a stationary observer. At 90 percent of light speed, 10 years of traveler time corresponds to about 22.9 years on Earth." },
    { question: "Has time dilation been proven?", answer: "Yes. Time dilation has been confirmed by many experiments, including muon decay observations, atomic clocks on aircraft, and GPS satellites which must account for both velocity and gravitational time dilation." },
    { question: "What is the twin paradox?", answer: "The twin paradox describes how one twin traveling at high speed would age less than the twin who stayed on Earth. It is not actually a paradox since the traveling twin experiences acceleration, breaking the symmetry." },
  ],
  formula: "Lorentz Factor: gamma = 1 / sqrt(1 - v^2/c^2); Earth Time = Proper Time x gamma; Length Contraction = 1 / gamma",
};

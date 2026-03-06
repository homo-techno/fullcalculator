import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tsunamiWaveSpeedCalculator: CalculatorDefinition = {
  slug: "tsunami-wave-speed-calculator",
  title: "Tsunami Wave Speed Calculator",
  description: "Calculate tsunami wave speed, wavelength, and arrival time based on ocean depth and distance using shallow water wave theory.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tsunami speed","tsunami wave","shallow water wave","tsunami arrival time","ocean wave calculator"],
  variants: [{
    id: "standard",
    name: "Tsunami Wave Speed",
    description: "Calculate tsunami wave speed, wavelength, and arrival time based on ocean depth and distance using shallow water wave theory.",
    fields: [
      { name: "oceanDepth", label: "Average Ocean Depth (meters)", type: "number", min: 10, max: 11000, defaultValue: 4000 },
      { name: "distance", label: "Distance to Coast (km)", type: "number", min: 1, max: 20000, defaultValue: 1000 },
      { name: "wavePeriod", label: "Wave Period (minutes)", type: "number", min: 5, max: 120, defaultValue: 20 },
      { name: "initialHeight", label: "Initial Wave Height (m)", type: "number", min: 0.1, max: 30, defaultValue: 1 },
      { name: "coastalDepth", label: "Coastal Shelf Depth (m)", type: "number", min: 1, max: 200, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const d = inputs.oceanDepth as number;
    const dist = inputs.distance as number;
    const T = inputs.wavePeriod as number * 60;
    const H0 = inputs.initialHeight as number;
    const dCoast = inputs.coastalDepth as number;
    const g = 9.81;
    const speed = Math.sqrt(g * d);
    const speedKmh = speed * 3.6;
    const wavelength = speed * T / 1000;
    const arrivalMinutes = (dist * 1000 / speed) / 60;
    const arrivalHours = arrivalMinutes / 60;
    const coastalSpeed = Math.sqrt(g * dCoast);
    const amplification = Math.pow(d / dCoast, 0.25);
    const coastalHeight = H0 * amplification;
    return {
      primary: { label: "Deep Water Speed", value: formatNumber(Math.round(speedKmh)) + " km/h" },
      details: [
        { label: "Wave Speed (m/s)", value: formatNumber(parseFloat(speed.toFixed(1))) + " m/s" },
        { label: "Wavelength", value: formatNumber(Math.round(wavelength)) + " km" },
        { label: "Arrival Time", value: formatNumber(parseFloat(arrivalHours.toFixed(2))) + " hours" },
        { label: "Coastal Wave Height", value: formatNumber(parseFloat(coastalHeight.toFixed(1))) + " m" },
        { label: "Amplification Factor", value: formatNumber(parseFloat(amplification.toFixed(2))) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["earthquake-magnitude-converter","seismic-wave-velocity-calculator","volcanic-eruption-index-calculator"],
  faq: [
    { question: "How fast do tsunamis travel?", answer: "In deep ocean (4000m depth), tsunamis travel at about 700 km/h, as fast as a jet airplane. In shallow coastal waters, they slow to about 40-50 km/h but grow much taller." },
    { question: "Why do tsunamis grow taller near shore?", answer: "As a tsunami enters shallow water, it slows down but its energy is compressed into a smaller volume. The wave height increases proportionally to the fourth root of the depth ratio, a process called shoaling." },
    { question: "Can you feel a tsunami in deep ocean?", answer: "No. In deep water, a tsunami may be only 0.5 to 1 meter tall with a wavelength of hundreds of kilometers. Ships at sea would barely notice it passing underneath." },
  ],
  formula: "Speed = sqrt(g x depth); Wavelength = Speed x Period; Arrival Time = Distance / Speed; Coastal Height = Initial Height x (Ocean Depth / Coastal Depth)^0.25",
};

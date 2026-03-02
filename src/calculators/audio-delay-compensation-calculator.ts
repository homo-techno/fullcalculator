import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const audioDelayCompensationCalculator: CalculatorDefinition = {
  slug: "audio-delay-compensation-calculator",
  title: "Audio Delay Compensation Calculator",
  description: "Calculate audio delay times for live sound and studio synchronization based on distance and temperature.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["audio delay","latency","speed of sound","live sound","sync"],
  variants: [{
    id: "standard",
    name: "Audio Delay Compensation",
    description: "Calculate audio delay times for live sound and studio synchronization based on distance and temperature.",
    fields: [
      { name: "distance", label: "Distance (feet)", type: "number", min: 1, max: 5000, defaultValue: 50 },
      { name: "temperature", label: "Temperature (F)", type: "number", min: 0, max: 120, defaultValue: 72 },
      { name: "sampleRate", label: "Sample Rate", type: "select", options: [{ value: "44100", label: "44.1 kHz (CD)" }, { value: "48000", label: "48 kHz (Video)" }, { value: "96000", label: "96 kHz (Hi-Res)" }], defaultValue: "48000" },
      { name: "humidity", label: "Humidity (%)", type: "number", min: 0, max: 100, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const distance = inputs.distance as number;
    const temperature = inputs.temperature as number;
    const sampleRate = inputs.sampleRate as number;
    const humidity = inputs.humidity as number;
    const tempC = (temperature - 32) * 5 / 9;
    const speedOfSound = 331.3 + (0.606 * tempC) + (0.0124 * humidity);
    const distanceM = distance * 0.3048;
    const delayMs = (distanceM / speedOfSound) * 1000;
    const delaySamples = Math.round(delayMs * sampleRate / 1000);
    const speedFtPerSec = speedOfSound * 3.28084;
    const wavelength1k = speedOfSound / 1000;
    return {
      primary: { label: "Delay Time", value: formatNumber(delayMs) + " ms" },
      details: [
        { label: "Delay in Samples", value: formatNumber(delaySamples) + " samples" },
        { label: "Speed of Sound", value: formatNumber(speedFtPerSec) + " ft/s" },
        { label: "Distance", value: formatNumber(distance) + " ft (" + formatNumber(distanceM) + " m)" },
        { label: "1 kHz Wavelength", value: formatNumber(wavelength1k) + " m" }
      ]
    };
  },
  }],
  relatedSlugs: ["speaker-wattage-calculator","concert-venue-capacity-calculator","microphone-sensitivity-calculator"],
  faq: [
    { question: "Why does audio need delay compensation?", answer: "Sound travels at roughly 1 foot per millisecond. In large venues, delayed speakers must be timed to match the main system." },
    { question: "Does temperature affect the speed of sound?", answer: "Yes, sound travels faster in warmer air. At 72F sound travels about 1128 ft/s versus 1087 ft/s at 32F." },
    { question: "How do I set delay on PA speakers?", answer: "Measure the distance between main and delay speakers, then calculate the delay time using distance divided by speed of sound." },
  ],
  formula: "Delay (ms) = (Distance m / Speed of Sound) x 1000
Speed = 331.3 + 0.606 x Temperature C",
};

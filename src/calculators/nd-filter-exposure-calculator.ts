import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ndFilterExposureCalculator: CalculatorDefinition = {
  slug: "nd-filter-exposure-calculator",
  title: "ND Filter Exposure Calculator",
  description: "Calculate adjusted exposure settings when using neutral density filters for long exposure photography.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ND filter","neutral density filter","long exposure calculator","ND stops","ND filter exposure"],
  variants: [{
    id: "standard",
    name: "ND Filter Exposure",
    description: "Calculate adjusted exposure settings when using neutral density filters for long exposure photography.",
    fields: [
      { name: "baseShutter", label: "Base Shutter Speed (1/x sec)", type: "number", min: 1, max: 8000, defaultValue: 125 },
      { name: "ndStops", label: "ND Filter Strength (stops)", type: "select", options: [{ value: "1", label: "1 stop (ND2)" }, { value: "2", label: "2 stops (ND4)" }, { value: "3", label: "3 stops (ND8)" }, { value: "6", label: "6 stops (ND64)" }, { value: "10", label: "10 stops (ND1000)" }, { value: "15", label: "15 stops (ND32768)" }], defaultValue: "6" },
      { name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 11 },
      { name: "iso", label: "ISO", type: "number", min: 50, max: 12800, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const baseShutter = inputs.baseShutter as number;
    const ndStops = parseInt(inputs.ndStops as string);
    const aperture = inputs.aperture as number;
    const iso = inputs.iso as number;
    const baseSeconds = 1 / baseShutter;
    const newSeconds = baseSeconds * Math.pow(2, ndStops);
    const ndFactor = Math.pow(2, ndStops);
    let shutterStr;
    if (newSeconds < 1) {
      shutterStr = "1/" + Math.round(1 / newSeconds) + " sec";
    } else if (newSeconds < 60) {
      shutterStr = Math.round(newSeconds * 10) / 10 + " seconds";
    } else {
      const mins = Math.floor(newSeconds / 60);
      const secs = Math.round(newSeconds % 60);
      shutterStr = mins + "m " + secs + "s";
    }
    return {
      primary: { label: "New Shutter Speed", value: shutterStr },
      details: [
        { label: "Base Shutter", value: "1/" + formatNumber(baseShutter) + " sec" },
        { label: "ND Factor", value: formatNumber(ndFactor) + "x (ND" + formatNumber(ndFactor) + ")" },
        { label: "Stops of Reduction", value: formatNumber(ndStops) + " stops" },
        { label: "New Exposure Time", value: formatNumber(Math.round(newSeconds * 100) / 100) + " sec" }
      ]
    };
  },
  }],
  relatedSlugs: ["exposure-triangle-calculator","motion-blur-shutter-speed-calculator"],
  faq: [
    { question: "What ND filter should I buy first?", answer: "A 6-stop (ND64) is the most versatile choice. It allows long exposures in daylight for smooth water and cloud effects while still being usable in lower light." },
    { question: "Can I stack ND filters?", answer: "Yes, stacking filters adds their stop values together. A 3-stop and 6-stop stacked equals 9 stops. However, stacking can introduce vignetting and reduce image quality." },
    { question: "What is a 10-stop ND filter used for?", answer: "A 10-stop ND filter is used for extreme long exposures in bright daylight — turning a 1/125 second exposure into about 8 seconds, creating smooth water and streaked clouds." },
  ],
  formula: "New Shutter Speed = Base Shutter Speed x 2^(ND stops)
ND Factor = 2^(stops)
Example: ND64 = 6 stops = 64x light reduction",
};

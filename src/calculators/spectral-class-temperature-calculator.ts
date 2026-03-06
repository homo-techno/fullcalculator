import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spectralClassTemperatureCalculator: CalculatorDefinition = {
  slug: "spectral-class-temperature-calculator",
  title: "Spectral Class Temperature Calculator",
  description: "Estimate the surface temperature, color, and luminosity class of a star based on its spectral classification or convert a known temperature to spectral type.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["spectral class","stellar temperature","star color","hertzsprung-russell"],
  variants: [{
    id: "standard",
    name: "Spectral Class Temperature",
    description: "Estimate the surface temperature, color, and luminosity class of a star based on its spectral classification or convert a known temperature to spectral type.",
    fields: [
      { name: "spectralType", label: "Spectral Type", type: "select", options: [{ value: "1", label: "O - Blue" }, { value: "2", label: "B - Blue-White" }, { value: "3", label: "A - White" }, { value: "4", label: "F - Yellow-White" }, { value: "5", label: "G - Yellow (Sun)" }, { value: "6", label: "K - Orange" }, { value: "7", label: "M - Red" }], defaultValue: "5" },
      { name: "subclass", label: "Subclass (0-9)", type: "number", min: 0, max: 9, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const sType = parseInt(inputs.spectralType as string);
    const sub = inputs.subclass as number;
    const tempRanges = { 1: [30000, 50000], 2: [10000, 30000], 3: [7500, 10000], 4: [6000, 7500], 5: [5200, 6000], 6: [3700, 5200], 7: [2400, 3700] };
    const names = { 1: "O", 2: "B", 3: "A", 4: "F", 5: "G", 6: "K", 7: "M" };
    const colors = { 1: "Blue", 2: "Blue-White", 3: "White", 4: "Yellow-White", 5: "Yellow", 6: "Orange", 7: "Red" };
    const range = tempRanges[sType] || [5200, 6000];
    const temp = Math.round(range[1] - (sub / 10) * (range[1] - range[0]));
    const peakWavelength = Math.round(2897771 / temp);
    const luminosityRatio = Math.pow(temp / 5778, 4);
    const spectralName = (names[sType] || "G") + sub;
    return {
      primary: { label: "Surface Temperature", value: formatNumber(temp) + " K" },
      details: [
        { label: "Spectral Type", value: spectralName },
        { label: "Star Color", value: colors[sType] || "Yellow" },
        { label: "Peak Wavelength", value: formatNumber(peakWavelength) + " nm" }
      ]
    };
  },
  }],
  relatedSlugs: ["star-magnitude-calculator","bolometric-magnitude-calculator"],
  faq: [
    { question: "What are stellar spectral classes?", answer: "Stars are classified by spectral type using the sequence O, B, A, F, G, K, M from hottest to coolest. Each type is subdivided into subclasses 0-9, with 0 being the hottest within each class." },
    { question: "What spectral class is the Sun?", answer: "The Sun is a G2V star with a surface temperature of about 5,778 K. The G means it is a yellow main-sequence star and the V indicates it is on the main sequence." },
    { question: "How does spectral class relate to luminosity?", answer: "Hotter spectral classes are generally more luminous. An O-type star can be millions of times more luminous than the Sun, while an M-type red dwarf may be less than one-thousandth as luminous." },
  ],
  formula: "Temperature = interpolation within spectral class range; Peak Wavelength = 2,897,771 / Temperature (Wien law)",
};

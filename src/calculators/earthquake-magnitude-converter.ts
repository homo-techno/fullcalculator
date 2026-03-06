import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earthquakeMagnitudeConverterCalculator: CalculatorDefinition = {
  slug: "earthquake-magnitude-converter",
  title: "Earthquake Magnitude Converter",
  description: "Convert between earthquake magnitude scales including Richter, moment magnitude, surface wave, and body wave magnitude with energy equivalents.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["earthquake magnitude","Richter scale","moment magnitude","seismic scale converter"],
  variants: [{
    id: "standard",
    name: "Earthquake Magnitude Converter",
    description: "Convert between earthquake magnitude scales including Richter, moment magnitude, surface wave, and body wave magnitude with energy equivalents.",
    fields: [
      { name: "magnitude", label: "Earthquake Magnitude", type: "number", min: 0, max: 10, defaultValue: 5 },
      { name: "inputScale", label: "Input Scale", type: "select", options: [{ value: "1", label: "Moment Magnitude (Mw)" }, { value: "2", label: "Richter / Local (ML)" }, { value: "3", label: "Surface Wave (Ms)" }, { value: "4", label: "Body Wave (mb)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const mag = inputs.magnitude as number;
    const scale = parseFloat(inputs.inputScale as unknown as string);
    let mw = mag;
    if (scale === 2) mw = mag * 0.98 + 0.08;
    if (scale === 3) mw = (mag + 1.07) / 1.03;
    if (scale === 4) mw = (mag - 0.39) / 0.77;
    const ml = (mw - 0.08) / 0.98;
    const ms = mw * 1.03 - 1.07;
    const mb = mw * 0.77 + 0.39;
    const energyJoules = Math.pow(10, 1.5 * mw + 4.8);
    const tntTons = energyJoules / 4.184e9;
    let tntLabel = "";
    if (tntTons < 1000) tntLabel = formatNumber(Math.round(tntTons)) + " tons TNT";
    else if (tntTons < 1e6) tntLabel = formatNumber(Math.round(tntTons / 1000)) + " kilotons TNT";
    else tntLabel = formatNumber(Math.round(tntTons / 1e6)) + " megatons TNT";
    return {
      primary: { label: "Moment Magnitude (Mw)", value: formatNumber(parseFloat(mw.toFixed(2))) },
      details: [
        { label: "Richter / Local (ML)", value: formatNumber(parseFloat(ml.toFixed(2))) },
        { label: "Surface Wave (Ms)", value: formatNumber(parseFloat(ms.toFixed(2))) },
        { label: "Body Wave (mb)", value: formatNumber(parseFloat(mb.toFixed(2))) },
        { label: "Energy Released", value: tntLabel },
        { label: "Energy (Joules)", value: energyJoules.toExponential(2) + " J" }
      ]
    };
  },
  }],
  relatedSlugs: ["seismic-wave-velocity-calculator","tsunami-wave-speed-calculator","volcanic-eruption-index-calculator"],
  faq: [
    { question: "What is the difference between Richter and moment magnitude?", answer: "The Richter scale (local magnitude ML) was the original earthquake scale but saturates above 6.5. Moment magnitude (Mw) is more accurate for large earthquakes and is now the standard used by seismologists worldwide." },
    { question: "How much stronger is each whole number increase?", answer: "Each whole number increase in magnitude represents roughly 31.6 times more energy released. A magnitude 7 earthquake releases about 1,000 times more energy than a magnitude 5." },
    { question: "What magnitude can humans feel?", answer: "Most people can feel earthquakes starting around magnitude 3. Earthquakes below 2.5 are typically not felt but are recorded by instruments." },
  ],
  formula: "Mw (from ML) = ML x 0.98 + 0.08
Mw (from Ms) = (Ms + 1.07) / 1.03
Mw (from mb) = (mb - 0.39) / 0.77
Energy (Joules) = 10^(1.5 x Mw + 4.8)",
};

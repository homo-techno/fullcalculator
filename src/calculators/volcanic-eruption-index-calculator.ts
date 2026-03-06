import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const volcanicEruptionIndexCalculator: CalculatorDefinition = {
  slug: "volcanic-eruption-index-calculator",
  title: "Volcanic Eruption Index Calculator",
  description: "Estimate the Volcanic Explosivity Index (VEI) and eruption characteristics from ejected volume, plume height, and eruption duration.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["volcanic eruption index","VEI calculator","eruption magnitude","volcanic explosivity","volcano eruption size"],
  variants: [{
    id: "standard",
    name: "Volcanic Eruption Index",
    description: "Estimate the Volcanic Explosivity Index (VEI) and eruption characteristics from ejected volume, plume height, and eruption duration.",
    fields: [
      { name: "ejectaVolume", label: "Ejected Volume (cubic km)", type: "number", min: 0.00001, max: 10000, defaultValue: 1 },
      { name: "plumeHeight", label: "Plume Height (km)", type: "number", min: 0.1, max: 50, defaultValue: 15 },
      { name: "durationHours", label: "Eruption Duration (hours)", type: "number", min: 0.1, max: 10000, defaultValue: 12 },
      { name: "eruptionType", label: "Eruption Style", type: "select", options: [{ value: "1", label: "Effusive (Lava Flow)" }, { value: "2", label: "Explosive (Strombolian)" }, { value: "3", label: "Plinian" }, { value: "4", label: "Ultra-Plinian" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const vol = inputs.ejectaVolume as number;
    const plume = inputs.plumeHeight as number;
    const duration = inputs.durationHours as number;
    const style = parseFloat(inputs.eruptionType as unknown as string);
    let vei = 0;
    if (vol >= 1000) vei = 8;
    else if (vol >= 100) vei = 7;
    else if (vol >= 10) vei = 6;
    else if (vol >= 1) vei = 5;
    else if (vol >= 0.1) vei = 4;
    else if (vol >= 0.01) vei = 3;
    else if (vol >= 0.001) vei = 2;
    else if (vol >= 0.0001) vei = 1;
    const descriptions = { 0: "Non-explosive", 1: "Gentle", 2: "Explosive", 3: "Severe", 4: "Cataclysmic", 5: "Paroxysmal", 6: "Colossal", 7: "Super-colossal", 8: "Mega-colossal" } as Record<number, string>;
    const energyJoules = vol * 1e9 * 2500 * 1000 * 9.81 * plume * 1000;
    const megatons = energyJoules / 4.184e15;
    const dischargeRate = vol / (duration / 3600);
    return {
      primary: { label: "Volcanic Explosivity Index", value: "VEI " + formatNumber(vei) },
      details: [
        { label: "Classification", value: descriptions[vei] || "Unknown" },
        { label: "Ejecta Volume", value: formatNumber(parseFloat(vol.toFixed(4))) + " km3" },
        { label: "Plume Height", value: formatNumber(plume) + " km" },
        { label: "Energy Equivalent", value: formatNumber(Math.round(megatons)) + " megatons TNT" },
        { label: "Discharge Rate", value: formatNumber(parseFloat(dischargeRate.toFixed(4))) + " km3/s" }
      ]
    };
  },
  }],
  relatedSlugs: ["earthquake-magnitude-converter","tsunami-wave-speed-calculator","geothermal-gradient-calculator"],
  faq: [
    { question: "What is the Volcanic Explosivity Index?", answer: "The VEI is a scale from 0 to 8 that measures the explosiveness of volcanic eruptions based primarily on the volume of ejected material. Each level represents a tenfold increase in ejecta volume." },
    { question: "What was the largest volcanic eruption in history?", answer: "The largest known eruption was the Toba supervolcano about 75,000 years ago (VEI 8, ~2,800 km3). In recorded history, the 1815 eruption of Mount Tambora (VEI 7) was the largest, causing the Year Without a Summer." },
    { question: "How often do large eruptions occur?", answer: "VEI 2-3 eruptions happen weekly to monthly worldwide. VEI 5 eruptions occur roughly once per decade. VEI 7 eruptions happen every few centuries, and VEI 8 supervolcano events occur every 50,000 to 100,000 years." },
  ],
  formula: "VEI = log10(Ejecta Volume in m3) - 6 (approximately); Energy = Volume x Density x g x Plume Height; Discharge Rate = Volume / Duration",
};

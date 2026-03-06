import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const colorTemperatureConverterCalculator: CalculatorDefinition = {
  slug: "color-temperature-converter-calculator",
  title: "Color Temperature Converter",
  description: "Convert between color temperatures in Kelvin, mired values, and CRI ratings for photography and videography white balance.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["color temperature","kelvin to mired","white balance","CTO CTO gel","color temperature converter"],
  variants: [{
    id: "standard",
    name: "Color Temperature Converter",
    description: "Convert between color temperatures in Kelvin, mired values, and CRI ratings for photography and videography white balance.",
    fields: [
      { name: "kelvin", label: "Color Temperature (Kelvin)", type: "number", min: 1000, max: 20000, defaultValue: 5600 },
      { name: "targetKelvin", label: "Target Temperature (Kelvin)", type: "number", min: 1000, max: 20000, defaultValue: 3200 },
      { name: "lightSource", label: "Light Source Reference", type: "select", options: [{ value: "1", label: "Daylight (5600K)" }, { value: "2", label: "Tungsten (3200K)" }, { value: "3", label: "Fluorescent (4000K)" }, { value: "4", label: "LED Panel (5000K)" }, { value: "5", label: "Candlelight (1900K)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const kelvin = inputs.kelvin as number;
    const target = inputs.targetKelvin as number;
    const source = parseInt(inputs.lightSource as string);
    const mired = Math.round(1000000 / kelvin);
    const targetMired = Math.round(1000000 / target);
    const miredShift = targetMired - mired;
    const gelNeeded = Math.abs(miredShift) > 100 ? "Full CTO/CTB" : Math.abs(miredShift) > 50 ? "1/2 CTO/CTB" : Math.abs(miredShift) > 25 ? "1/4 CTO/CTB" : "None or 1/8 gel";
    const direction = miredShift > 0 ? "Warming (CTO)" : miredShift < 0 ? "Cooling (CTB)" : "No shift needed";
    return {
      primary: { label: "Mired Shift Required", value: formatNumber(miredShift) + " mired" },
      details: [
        { label: "Source Mired Value", value: formatNumber(mired) },
        { label: "Target Mired Value", value: formatNumber(targetMired) },
        { label: "Gel Recommendation", value: gelNeeded },
        { label: "Direction", value: direction }
      ]
    };
  },
  }],
  relatedSlugs: ["exposure-triangle-calculator","lighting-setup-cost-calculator"],
  faq: [
    { question: "What is mired value?", answer: "Mired (micro reciprocal degree) equals 1,000,000 divided by the color temperature in Kelvin. Mired shifts are more perceptually uniform than Kelvin differences." },
    { question: "What is the difference between CTO and CTB gels?", answer: "CTO (Color Temperature Orange) warms light, shifting it toward tungsten. CTB (Color Temperature Blue) cools light, shifting it toward daylight." },
    { question: "What white balance should I set for mixed lighting?", answer: "Set your camera to match the dominant light source, then use gels on secondary lights to match. Or shoot RAW and adjust in post-production." },
  ],
  formula: "Mired = 1,000,000 / Kelvin; Mired Shift = Target Mired - Source Mired; Positive shift = warming, Negative shift = cooling",
};

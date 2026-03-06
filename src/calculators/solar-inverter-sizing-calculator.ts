import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarInverterSizingCalculator: CalculatorDefinition = {
  slug: "solar-inverter-sizing-calculator",
  title: "Solar Inverter Sizing Calculator",
  description: "Calculate the correct solar inverter size based on panel array capacity, system voltage, temperature derating, and desired DC-to-AC ratio for optimal solar performance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["solar inverter sizing","inverter calculator","solar system inverter","DC to AC ratio solar"],
  variants: [{
    id: "standard",
    name: "Solar Inverter Sizing",
    description: "Calculate the correct solar inverter size based on panel array capacity, system voltage, temperature derating, and desired DC-to-AC ratio for optimal solar performance.",
    fields: [
      { name: "arrayKW", label: "Solar Array Size (kW DC)", type: "number", min: 1, max: 500, defaultValue: 10 },
      { name: "dcAcRatio", label: "DC-to-AC Ratio", type: "select", options: [{ value: "1.0", label: "1.0 (conservative)" }, { value: "1.15", label: "1.15 (standard)" }, { value: "1.25", label: "1.25 (moderate clipping)" }, { value: "1.35", label: "1.35 (aggressive)" }], defaultValue: "1.25" },
      { name: "inverterType", label: "Inverter Type", type: "select", options: [{ value: "1", label: "String Inverter" }, { value: "2", label: "Microinverters" }, { value: "3", label: "Power Optimizers + String" }], defaultValue: "1" },
      { name: "maxTemp", label: "Max Ambient Temperature (F)", type: "number", min: 70, max: 130, defaultValue: 95 },
    ],
    calculate: (inputs) => {
    const arrayKW = inputs.arrayKW as number;
    const dcAcRatio = parseFloat(inputs.dcAcRatio as string);
    const invType = parseInt(inputs.inverterType as string);
    const maxTemp = inputs.maxTemp as number;
    const inverterKW = arrayKW / dcAcRatio;
    const tempDerate = maxTemp > 95 ? Math.max(0.8, 1 - (maxTemp - 95) * 0.005) : 1.0;
    const deratedKW = inverterKW / tempDerate;
    const stdSizes = [3, 3.8, 5, 6, 7.6, 8, 10, 11.4, 12, 15, 20, 25, 30, 33.3, 40, 50, 60, 75, 100, 125];
    let invSize = 3;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= deratedKW) { invSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) invSize = stdSizes[i];
    }
    const actualRatio = arrayKW / invSize;
    const microCount = invType === 2 ? Math.ceil(arrayKW / 0.4) : 0;
    const annualKWh = arrayKW * 1400 * (invType === 2 ? 0.98 : 0.96);
    const clippingLoss = actualRatio > 1.3 ? (actualRatio - 1.0) * 2 : actualRatio > 1.15 ? (actualRatio - 1.0) * 0.5 : 0;
    return {
      primary: { label: invType === 2 ? "Microinverters Needed" : "Inverter Size", value: invType === 2 ? formatNumber(microCount) + " units" : formatNumber(invSize) + " kW" },
      details: [
        { label: "Actual DC/AC Ratio", value: formatNumber(Math.round(actualRatio * 100) / 100) },
        { label: "Temperature Derating", value: formatNumber(Math.round(tempDerate * 100)) + "%" },
        { label: "Est. Annual Production", value: formatNumber(Math.round(annualKWh)) + " kWh" },
        { label: "Est. Clipping Loss", value: formatNumber(Math.round(clippingLoss * 100) / 100) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["electrical-panel-load-calculator","power-factor-correction-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Inverter kW = Array kW / DC-to-AC Ratio; Temp Derate = 1 - (Temp - 95) x 0.005 (if above 95F); Derated Size = Inverter kW / Temp Derate Factor; Annual Production = Array kW x 1400 hrs x System Efficiency",
};

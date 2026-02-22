import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatPumpCopCalculator: CalculatorDefinition = {
  slug: "heat-pump-cop-calculator",
  title: "Heat Pump COP Calculator",
  description: "Free heat pump COP calculator. Calculate coefficient of performance and energy cost for heat pump systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["heat pump COP calculator", "coefficient of performance", "SEER calculator", "HSPF calculator", "heat pump efficiency"],
  variants: [
    {
      id: "cop-calc",
      name: "COP from Energy Data",
      description: "Calculate COP from heating output and power input",
      fields: [
        { name: "heatingOutput", label: "Heating Output (BTU/hr)", type: "number", placeholder: "e.g. 36000" },
        { name: "powerInput", label: "Electrical Input (Watts)", type: "number", placeholder: "e.g. 3000" },
        { name: "electricRate", label: "Electric Rate (dollars/kWh)", type: "number", placeholder: "e.g. 0.12", defaultValue: 0.12 },
      ],
      calculate: (inputs) => {
        const heatingOutput = inputs.heatingOutput as number;
        const powerInput = inputs.powerInput as number;
        const electricRate = inputs.electricRate as number;
        if (!heatingOutput || !powerInput) return null;
        const outputWatts = heatingOutput / 3.412;
        const cop = outputWatts / powerInput;
        const seerEquiv = cop * 3.412;
        const costPerHour = (powerInput / 1000) * (electricRate || 0.12);
        return {
          primary: { label: "COP", value: `${formatNumber(cop, 2)}` },
          details: [
            { label: "SEER Equivalent", value: `${formatNumber(seerEquiv, 1)}` },
            { label: "Output (kW)", value: `${formatNumber(outputWatts / 1000, 2)}` + " kW" },
            { label: "Input (kW)", value: `${formatNumber(powerInput / 1000, 2)}` + " kW" },
            { label: "Cost per Hour", value: `${formatNumber(costPerHour, 3)}` },
          ],
        };
      },
    },
    {
      id: "seer-to-cop",
      name: "SEER/HSPF to COP",
      description: "Convert between efficiency ratings",
      fields: [
        { name: "ratingType", label: "Rating Type", type: "select", options: [
          { label: "SEER (cooling)", value: "seer" },
          { label: "HSPF (heating)", value: "hspf" },
          { label: "EER", value: "eer" },
        ], defaultValue: "seer" },
        { name: "ratingValue", label: "Rating Value", type: "number", placeholder: "e.g. 16" },
      ],
      calculate: (inputs) => {
        const ratingType = inputs.ratingType as string;
        const ratingValue = inputs.ratingValue as number;
        if (!ratingValue) return null;
        const cop = ratingValue / 3.412;
        const eer = cop * 3.412;
        return {
          primary: { label: "COP", value: `${formatNumber(cop, 2)}` },
          details: [
            { label: "EER", value: `${formatNumber(eer, 1)}` },
            { label: "Input Rating", value: `${formatNumber(ratingValue, 1)}` + " " + ratingType.toUpperCase() },
            { label: "Efficiency", value: `${formatNumber(cop * 100, 0)}` + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooling-load-calculator", "heat-loss-calculator", "refrigerant-charge-calculator"],
  faq: [
    { question: "What is COP?", answer: "COP is the ratio of useful heating or cooling provided to electrical energy consumed. A COP of 3 means 3 units of heat for every 1 unit of electricity." },
    { question: "What is a good COP?", answer: "Modern heat pumps achieve COP of 3-5 in mild conditions. COP decreases as outdoor temperature drops. Above 2.5 is generally good for heating." },
  ],
  formula: "COP = Heating Output (W) / Electrical Input (W) | SEER = COP x 3.412",
};
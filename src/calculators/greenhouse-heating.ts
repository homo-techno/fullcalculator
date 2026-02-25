import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greenhouseHeatingCalculator: CalculatorDefinition = {
  slug: "greenhouse-heating-calculator",
  title: "Greenhouse Heating Calculator",
  description: "Free greenhouse heating calculator. Estimate the BTU heating requirement for your greenhouse based on size, material, and desired temperature.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["greenhouse heating calculator", "greenhouse BTU calculator", "greenhouse heater size", "greenhouse heat loss", "greenhouse temperature"],
  variants: [
    {
      id: "btu",
      name: "Greenhouse BTU Requirement",
      description: "Calculate heating BTUs needed for your greenhouse",
      fields: [
        { name: "length", label: "Greenhouse Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Greenhouse Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "height", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "material", label: "Glazing Material", type: "select", options: [
          { label: "Single glass (U=1.13)", value: "1.13" },
          { label: "Double glass (U=0.65)", value: "0.65" },
          { label: "Single poly film (U=1.15)", value: "1.15" },
          { label: "Double poly film (U=0.70)", value: "0.70" },
          { label: "Polycarbonate twin-wall (U=0.58)", value: "0.58" },
          { label: "Polycarbonate triple-wall (U=0.50)", value: "0.50" },
        ], defaultValue: "0.58" },
        { name: "insideTemp", label: "Desired Inside Temp (\u00B0F)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
        { name: "outsideTemp", label: "Coldest Outside Temp (\u00B0F)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = (inputs.height as number) || 8;
        const uValue = parseFloat(inputs.material as string) || 0.58;
        const insideTemp = (inputs.insideTemp as number) || 60;
        const outsideTemp = inputs.outsideTemp as number;
        if (!length || !width) return null;
        if (outsideTemp === undefined && outsideTemp !== 0) return null;

        const wallArea = 2 * (length + width) * height;
        const roofArea = length * width * 1.15;
        const totalArea = wallArea + roofArea;
        const deltaT = insideTemp - (outsideTemp as number);
        const btu = totalArea * uValue * deltaT;
        const watts = btu * 0.293;
        const kw = watts / 1000;

        return {
          primary: { label: "Heating Required", value: `${formatNumber(btu)} BTU/hr` },
          details: [
            { label: "Electric equivalent", value: `${formatNumber(kw, 1)} kW` },
            { label: "Total surface area", value: `${formatNumber(totalArea)} sq ft` },
            { label: "Wall area", value: `${formatNumber(wallArea)} sq ft` },
            { label: "Roof area (estimated)", value: `${formatNumber(roofArea)} sq ft` },
            { label: "Temperature difference", value: `${deltaT}\u00B0F` },
            { label: "U-value used", value: `${uValue}` },
          ],
          note: "Add 10-25% for wind exposure and door openings. Insulating the north wall can significantly reduce heating costs.",
        };
      },
    },
  ],
  relatedSlugs: ["electricity-calculator", "energy-calculator", "soil-volume-calculator"],
  faq: [
    { question: "How do I calculate greenhouse heating needs?", answer: "Multiply the total surface area of the greenhouse by the U-value of the glazing material and the temperature difference between inside and outside. This gives BTU per hour needed." },
    { question: "What temperature should a greenhouse be kept at?", answer: "Most plants thrive at 55-75\u00B0F. Cool-season crops can handle 45-55\u00B0F at night. Tropical plants need 60-70\u00B0F minimum. The key is to avoid freezing (32\u00B0F)." },
  ],
  formula: "BTU/hr = Surface Area (sq ft) \u00D7 U-value \u00D7 \u0394T (\u00B0F)",
};

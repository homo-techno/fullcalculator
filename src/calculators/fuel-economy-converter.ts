import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelEconomyConverterCalculator: CalculatorDefinition = {
  slug: "fuel-economy-converter",
  title: "Fuel Economy Converter",
  description:
    "Free fuel economy converter. Convert between MPG, L/100km, km/L, and miles/imperial gallon. Compare fuel efficiency across standards.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "fuel economy converter",
    "MPG to L/100km",
    "km per liter",
    "fuel efficiency",
    "miles per gallon",
    "gas mileage converter",
    "fuel consumption calculator",
  ],
  variants: [
    {
      id: "fuel-convert",
      name: "Fuel Economy Converter",
      description: "Convert between fuel economy units",
      fields: [
        {
          name: "value",
          label: "Fuel Economy Value",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "from",
          label: "From Unit",
          type: "select",
          options: [
            { label: "MPG (US)", value: "mpg_us" },
            { label: "MPG (Imperial)", value: "mpg_imp" },
            { label: "L/100km", value: "l100km" },
            { label: "km/L", value: "kml" },
          ],
          defaultValue: "mpg_us",
        },
        {
          name: "to",
          label: "To Unit",
          type: "select",
          options: [
            { label: "MPG (US)", value: "mpg_us" },
            { label: "MPG (Imperial)", value: "mpg_imp" },
            { label: "L/100km", value: "l100km" },
            { label: "km/L", value: "kml" },
          ],
          defaultValue: "l100km",
        },
      ],
      calculate: (inputs) => {
        const value = parseFloat(inputs.value as string);
        const from = inputs.from as string;
        const to = inputs.to as string;
        if (isNaN(value) || value <= 0) return null;

        // Convert everything to km/L first
        let kml: number;
        switch (from) {
          case "mpg_us": kml = value * 0.425144; break;
          case "mpg_imp": kml = value * 0.354006; break;
          case "l100km": kml = 100 / value; break;
          case "kml": kml = value; break;
          default: return null;
        }

        let result: number;
        let suffix: string;
        switch (to) {
          case "mpg_us": result = kml / 0.425144; suffix = "MPG (US)"; break;
          case "mpg_imp": result = kml / 0.354006; suffix = "MPG (Imp)"; break;
          case "l100km": result = 100 / kml; suffix = "L/100km"; break;
          case "kml": result = kml; suffix = "km/L"; break;
          default: return null;
        }

        return {
          primary: {
            label: "Converted Fuel Economy",
            value: formatNumber(result, 2),
            suffix,
          },
          details: [
            { label: "MPG (US)", value: formatNumber(kml / 0.425144, 2) },
            { label: "MPG (Imperial)", value: formatNumber(kml / 0.354006, 2) },
            { label: "L/100km", value: formatNumber(100 / kml, 2) },
            { label: "km/L", value: formatNumber(kml, 2) },
          ],
        };
      },
    },
    {
      id: "fuel-cost-compare",
      name: "Fuel Cost Comparison",
      description: "Compare annual fuel costs between two vehicles",
      fields: [
        {
          name: "mpg1",
          label: "Vehicle 1 Fuel Economy (MPG US)",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "mpg2",
          label: "Vehicle 2 Fuel Economy (MPG US)",
          type: "number",
          placeholder: "e.g. 35",
        },
        {
          name: "annualMiles",
          label: "Annual Miles Driven",
          type: "number",
          placeholder: "e.g. 12000",
          defaultValue: 12000,
        },
        {
          name: "fuelPrice",
          label: "Fuel Price ($/gallon)",
          type: "number",
          placeholder: "e.g. 3.50",
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const mpg1 = parseFloat(inputs.mpg1 as string);
        const mpg2 = parseFloat(inputs.mpg2 as string);
        const annualMiles = parseFloat(inputs.annualMiles as string);
        const fuelPrice = parseFloat(inputs.fuelPrice as string);
        if (isNaN(mpg1) || isNaN(mpg2) || isNaN(annualMiles) || isNaN(fuelPrice)) return null;
        if (mpg1 <= 0 || mpg2 <= 0 || annualMiles <= 0 || fuelPrice <= 0) return null;

        const gallons1 = annualMiles / mpg1;
        const gallons2 = annualMiles / mpg2;
        const cost1 = gallons1 * fuelPrice;
        const cost2 = gallons2 * fuelPrice;
        const savings = Math.abs(cost1 - cost2);

        return {
          primary: {
            label: "Annual Fuel Savings",
            value: formatNumber(savings, 2),
            suffix: "$/year",
          },
          details: [
            { label: "Vehicle 1 Annual Cost", value: "$" + formatNumber(cost1, 2) },
            { label: "Vehicle 1 Gallons/Year", value: formatNumber(gallons1, 1) },
            { label: "Vehicle 2 Annual Cost", value: "$" + formatNumber(cost2, 2) },
            { label: "Vehicle 2 Gallons/Year", value: formatNumber(gallons2, 1) },
            { label: "5-Year Savings", value: "$" + formatNumber(savings * 5, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "unit-converter", "speed-calculator"],
  faq: [
    {
      question: "How do I convert MPG to L/100km?",
      answer:
        "Divide 235.215 by the MPG value. For example, 30 MPG = 235.215 / 30 = 7.84 L/100km. Note: this uses US gallons. For imperial MPG, divide 282.481 by the MPG value.",
    },
    {
      question: "What is the difference between US MPG and Imperial MPG?",
      answer:
        "A US gallon is 3.785 liters while an Imperial gallon is 4.546 liters. So Imperial MPG values are about 20% higher than US MPG for the same vehicle. A car rated 30 US MPG equals about 36 Imperial MPG.",
    },
  ],
  formula:
    "L/100km = 235.215 / MPG(US) | km/L = MPG(US) x 0.4251 | 1 US gal = 3.785 L | 1 Imp gal = 4.546 L",
};

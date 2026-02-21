import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelEfficiencyConverter: CalculatorDefinition = {
  slug: "fuel-efficiency-converter",
  title: "Fuel Efficiency Converter",
  description: "Free fuel efficiency converter. Convert between MPG, L/100km, km/L, and miles per liter.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["fuel efficiency converter", "mpg to l/100km", "km per liter", "fuel economy converter", "gas mileage converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Fuel Efficiency",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 30" },
        {
          name: "from", label: "From", type: "select",
          options: [
            { label: "MPG (US)", value: "mpg_us" },
            { label: "MPG (UK)", value: "mpg_uk" },
            { label: "L/100km", value: "l100km" },
            { label: "km/L", value: "kml" },
          ],
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "mpg_us";
        if (!val) return null;
        let kml: number;
        switch (from) {
          case "mpg_us": kml = val * 0.425144; break;
          case "mpg_uk": kml = val * 0.354006; break;
          case "l100km": kml = 100 / val; break;
          default: kml = val;
        }
        const mpgUs = kml / 0.425144;
        const mpgUk = kml / 0.354006;
        const l100km = 100 / kml;
        return {
          primary: { label: "Conversions", value: `${formatNumber(mpgUs, 2)} MPG (US)` },
          details: [
            { label: "MPG (US)", value: formatNumber(mpgUs, 2) },
            { label: "MPG (UK)", value: formatNumber(mpgUk, 2) },
            { label: "L/100km", value: formatNumber(l100km, 2) },
            { label: "km/L", value: formatNumber(kml, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gas-mileage-calculator", "fuel-cost-calculator", "speed-converter"],
  faq: [{ question: "How do I convert MPG to L/100km?", answer: "L/100km = 235.215 / MPG (US). For example, 30 MPG = 235.215/30 = 7.84 L/100km. Lower L/100km = better efficiency. US MPG and UK MPG differ because US gallons (3.785L) are smaller than UK gallons (4.546L)." }],
  formula: "L/100km = 235.215 / MPG (US) | km/L = MPG × 0.4251",
};

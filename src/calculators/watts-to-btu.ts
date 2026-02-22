import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wattsToBtuConverter: CalculatorDefinition = {
  slug: "watts-to-btu-converter",
  title: "Watts to BTU Converter",
  description: "Free watts to BTU converter. Convert watts to BTU/hr and BTU/hr to watts instantly. Essential for HVAC, heating, and cooling calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["watts to btu", "w to btu", "btu per hour", "hvac converter", "heating power converter", "watt btu conversion"],
  variants: [
    {
      id: "convert",
      name: "Convert Watts to BTU/hr",
      fields: [
        { name: "value", label: "Watts (W)", type: "number", placeholder: "e.g. 1000" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Watts to BTU/hr", value: "w_to_btu" },
          { label: "BTU/hr to Watts", value: "btu_to_w" },
        ], defaultValue: "w_to_btu" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        const wattToBtu = 3.41214;
        if (direction === "btu_to_w") {
          const watts = value / wattToBtu;
          return {
            primary: { label: `${formatNumber(value)} BTU/hr`, value: `${formatNumber(watts, 2)} W` },
            details: [
              { label: "Watts (W)", value: formatNumber(watts, 4) },
              { label: "Kilowatts (kW)", value: formatNumber(watts / 1000, 4) },
              { label: "Horsepower (HP)", value: formatNumber(watts / 745.7, 4) },
              { label: "Tons of Cooling", value: formatNumber(value / 12000, 4) },
              { label: "Calories/hr", value: formatNumber(watts * 860.421, 2) },
            ],
          };
        }
        const btu = value * wattToBtu;
        return {
          primary: { label: `${formatNumber(value)} W`, value: `${formatNumber(btu, 2)} BTU/hr` },
          details: [
            { label: "BTU/hr", value: formatNumber(btu, 4) },
            { label: "BTU/min", value: formatNumber(btu / 60, 4) },
            { label: "Kilowatts (kW)", value: formatNumber(value / 1000, 4) },
            { label: "Tons of Cooling", value: formatNumber(btu / 12000, 4) },
            { label: "Horsepower (HP)", value: formatNumber(value / 745.7, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["btu-to-watts-converter", "kw-to-hp-converter", "energy-calculator"],
  faq: [
    { question: "How do I convert watts to BTU?", answer: "Multiply watts by 3.41214 to get BTU/hr. For example, 1000 watts = 3,412.14 BTU/hr. This conversion is essential for sizing HVAC systems and understanding heating/cooling capacity." },
    { question: "What is a BTU?", answer: "A BTU (British Thermal Unit) is the amount of heat needed to raise the temperature of one pound of water by one degree Fahrenheit. BTU/hr measures the rate of energy transfer, commonly used for HVAC ratings." },
  ],
  formula: "1 W = 3.41214 BTU/hr | 1 kW = 3,412.14 BTU/hr | 1 ton of cooling = 12,000 BTU/hr = 3,517 W",
};

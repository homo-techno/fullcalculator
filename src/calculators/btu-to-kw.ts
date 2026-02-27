import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const btuToKwCalculator: CalculatorDefinition = {
  slug: "btu-to-kw",
  title: "BTU to Kilowatts Converter",
  description:
    "Convert between BTU/h and kilowatts (kW) for HVAC, heating, cooling, and energy applications. Supports multiple energy and power units.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "BTU",
    "kilowatts",
    "kW",
    "HVAC",
    "heating",
    "cooling",
    "energy",
    "power",
    "thermal",
    "British thermal unit",
  ],
  variants: [
    {
      slug: "btu-to-kw",
      title: "BTU/h to Kilowatts",
      fields: [
        {
          name: "btu",
          label: "Power (BTU/h)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const btu = parseFloat(inputs.btu as string);
        if (isNaN(btu)) return { error: "Please enter a valid BTU/h value." };

        const kw = btu * 0.000293071;
        const watts = kw * 1000;
        const hp = btu * 0.000393015;
        const tons = btu / 12000;
        const kcalH = btu * 0.251996;

        return {
          results: [
            { label: "Kilowatts (kW)", value: formatNumber(kw) },
            { label: "Watts (W)", value: formatNumber(watts) },
            { label: "Horsepower (HP)", value: formatNumber(hp) },
            { label: "Tons of Refrigeration", value: formatNumber(tons) },
            { label: "Kilocalories/hour", value: formatNumber(kcalH) },
          ],
        };
      },
    },
    {
      slug: "kw-to-btu",
      title: "Kilowatts to BTU/h",
      fields: [
        {
          name: "kw",
          label: "Power (kW)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const kw = parseFloat(inputs.kw as string);
        if (isNaN(kw)) return { error: "Please enter a valid kW value." };

        const btu = kw * 3412.14;
        const watts = kw * 1000;
        const hp = kw * 1.34102;
        const tons = btu / 12000;
        const kcalH = btu * 0.251996;

        return {
          results: [
            { label: "BTU/h", value: formatNumber(btu) },
            { label: "Watts (W)", value: formatNumber(watts) },
            { label: "Horsepower (HP)", value: formatNumber(hp) },
            { label: "Tons of Refrigeration", value: formatNumber(tons) },
            { label: "Kilocalories/hour", value: formatNumber(kcalH) },
          ],
        };
      },
    },
    {
      slug: "hvac-sizing",
      title: "HVAC Sizing Estimate",
      fields: [
        {
          name: "sqft",
          label: "Room Area (sq ft)",
          type: "number",
        },
        {
          name: "climate",
          label: "Climate Zone",
          type: "select",
          options: [
            { label: "Cool (20 BTU/sqft)", value: "20" },
            { label: "Moderate (30 BTU/sqft)", value: "30" },
            { label: "Warm (40 BTU/sqft)", value: "40" },
            { label: "Hot/Humid (50 BTU/sqft)", value: "50" },
          ],
        },
      ],
      calculate(inputs) {
        const sqft = parseFloat(inputs.sqft as string);
        const btuPerSqft = parseFloat(inputs.climate as string);
        if (isNaN(sqft) || isNaN(btuPerSqft)) return { error: "Please enter valid inputs." };

        const totalBtu = sqft * btuPerSqft;
        const kw = totalBtu * 0.000293071;
        const tons = totalBtu / 12000;
        const hp = totalBtu * 0.000393015;

        return {
          results: [
            { label: "Required Capacity (BTU/h)", value: formatNumber(totalBtu) },
            { label: "Required Capacity (kW)", value: formatNumber(kw) },
            { label: "Required Capacity (Tons)", value: formatNumber(tons) },
            { label: "Required Capacity (HP)", value: formatNumber(hp) },
            { label: "Area (sq ft)", value: formatNumber(sqft) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["horsepower-to-torque", "newtons-to-pounds", "gallons-per-minute"],
  faq: [
    {
      question: "How many BTU/h are in 1 kilowatt?",
      answer:
        "One kilowatt equals approximately 3,412.14 BTU/h. Conversely, 1 BTU/h equals approximately 0.000293071 kW.",
    },
    {
      question: "What is a ton of refrigeration in BTU?",
      answer:
        "One ton of refrigeration equals 12,000 BTU/h. This unit is commonly used in the HVAC industry to rate air conditioning capacity. A typical home central AC unit is 2-5 tons.",
    },
    {
      question: "How do I size an HVAC system for my room?",
      answer:
        "A general rule of thumb is 20-50 BTU per square foot depending on climate, insulation, ceiling height, window area, and sun exposure. A professional Manual J calculation provides a more accurate result.",
    },
  ],
  formula:
    "kW = BTU/h x 0.000293071 | BTU/h = kW x 3412.14 | 1 Ton = 12,000 BTU/h | 1 HP = 2,545 BTU/h",
};

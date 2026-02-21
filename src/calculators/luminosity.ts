import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const toLumens: Record<string, number> = {
  "lm": 1,
  "lx": 1,       // lux = lumens/m², treated as 1:1 for base conversion with area=1m²
  "cd": 12.566,   // candela to lumens (assuming isotropic: 1 cd = 4π lm)
  "fc": 10.764,   // foot-candle = 10.764 lux (lumens/m² equivalent)
};

const unitLabels: Record<string, string> = {
  "lm": "Lumens",
  "lx": "Lux (lm/m²)",
  "cd": "Candela",
  "fc": "Foot-candles",
};

const unitOptions = Object.keys(toLumens).map((u) => ({ label: `${unitLabels[u]}`, value: u }));

export const luminosityConverter: CalculatorDefinition = {
  slug: "luminosity-converter",
  title: "Luminosity Converter",
  description: "Free luminosity converter. Convert between lumens, lux, candela, and foot-candles for lighting calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["luminosity", "lumens", "lux", "candela", "foot-candle", "lighting", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 500" },
        { name: "from", label: "From", type: "select", options: unitOptions },
        { name: "to", label: "To", type: "select", options: unitOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "lm";
        const to = (inputs.to as string) || "lx";
        if (!val) return null;
        const baseLumens = val * toLumens[from];
        const result = baseLumens / toLumens[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${unitLabels[from]}`, value: `${formatNumber(result, 6)} ${unitLabels[to]}` },
          details: [
            { label: "Base value (lumens-equivalent)", value: formatNumber(baseLumens, 6) },
            { label: "Note", value: "Lux and foot-candle conversions assume 1 m² area" },
            { label: "1 foot-candle", value: "10.764 lux" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["color-temperature-calculator", "power-unit-converter"],
  faq: [
    { question: "What is the difference between lumens and lux?", answer: "Lumens measure total light output, while lux measures light intensity per square metre (lumens/m²)." },
    { question: "How do foot-candles relate to lux?", answer: "1 foot-candle equals approximately 10.764 lux." },
  ],
  formula: "result = value × (fromFactor / toFactor). 1 cd ≈ 4π lumens (isotropic). 1 fc = 10.764 lux.",
};

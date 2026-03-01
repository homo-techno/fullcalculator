import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const braSizeConverterCalculator: CalculatorDefinition = {
  slug: "bra-size-converter",
  title: "Bra Size Converter",
  description: "Convert bra sizes between US, UK, EU, and French sizing systems.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["bra size converter", "international bra sizes", "bra size chart"],
  variants: [{
    id: "standard",
    name: "Bra Size",
    description: "Convert bra sizes between US, UK, EU, and French sizing systems",
    fields: [
      { name: "band", label: "Band Size (US)", type: "number", suffix: "inches", min: 28, max: 48, defaultValue: 34 },
      { name: "cup", label: "Cup Size (US)", type: "select", options: [{value:"A",label:"A"},{value:"B",label:"B"},{value:"C",label:"C"},{value:"D",label:"D"},{value:"DD",label:"DD"},{value:"DDD",label:"DDD/F"},{value:"G",label:"G"}], defaultValue: "C" },
    ],
    calculate: (inputs) => {
      const band = inputs.band as number;
      const cup = inputs.cup as string;
      if (!band || !cup) return null;
      const euBand = Math.round(band * 2.54);
      const frBand = euBand + 15;
      const cupMap: Record<string, string> = { A: "A", B: "B", C: "C", D: "D", DD: "DD", DDD: "E", G: "F" };
      const ukCupMap: Record<string, string> = { A: "A", B: "B", C: "C", D: "D", DD: "DD", DDD: "E", G: "F" };
      const euCup = cupMap[cup] || cup;
      const ukCup = ukCupMap[cup] || cup;
      return {
        primary: { label: "US Size", value: band + cup },
        details: [
          { label: "UK Size", value: band + ukCup },
          { label: "EU Size", value: euBand + euCup },
          { label: "French Size", value: frBand + euCup },
          { label: "Band in cm", value: formatNumber(euBand) + " cm" },
        ],
      };
    },
  }],
  relatedSlugs: ["ring-size-converter", "shoe-size-converter"],
  faq: [
    { question: "How do bra sizes differ between countries?", answer: "Band sizes vary: US and UK use inches, EU uses centimeters, and French adds 15 cm to the EU measurement. Cup letters may also differ between systems." },
    { question: "How do I measure my bra size?", answer: "Measure your underbust for the band size (in inches for US). Then measure the fullest part of your bust. The difference in inches determines your cup size (1 inch = A, 2 inches = B, etc)." },
  ],
  formula: "EU Band = US Band x 2.54; French Band = EU Band + 15; Cup conversions vary by system",
};

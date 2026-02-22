import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parsecConverterCalculator: CalculatorDefinition = {
  slug: "parsec-converter-calculator",
  title: "Parsec to Light Year Converter",
  description: "Free parsec converter. Convert between parsecs, light years, astronomical units, and kilometers.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["parsec converter", "parsec to light year", "light year to parsec", "astronomical unit converter"],
  variants: [
    {
      id: "parsec-to-ly",
      name: "Parsec to Other Units",
      fields: [
        { name: "parsecs", label: "Distance in Parsecs (pc)", type: "number", placeholder: "e.g. 1", step: 0.001 },
      ],
      calculate: (inputs) => {
        const pc = inputs.parsecs as number;
        if (!pc && pc !== 0) return null;
        const ly = pc * 3.26156;
        const au = pc * 206265;
        const km = pc * 3.0857e13;
        return {
          primary: { label: "Light Years", value: formatNumber(ly, 4) },
          details: [
            { label: "Parsecs", value: formatNumber(pc, 4) },
            { label: "Astronomical Units (AU)", value: formatNumber(au, 2) },
            { label: "Kilometers", value: `${km.toExponential(4)} km` },
          ],
        };
      },
    },
    {
      id: "ly-to-parsec",
      name: "Light Year to Other Units",
      fields: [
        { name: "lightYears", label: "Distance in Light Years (ly)", type: "number", placeholder: "e.g. 4.24", step: 0.001 },
      ],
      calculate: (inputs) => {
        const ly = inputs.lightYears as number;
        if (!ly && ly !== 0) return null;
        const pc = ly / 3.26156;
        const au = ly * 63241.1;
        const km = ly * 9.461e12;
        return {
          primary: { label: "Parsecs", value: formatNumber(pc, 4) },
          details: [
            { label: "Light Years", value: formatNumber(ly, 4) },
            { label: "Astronomical Units (AU)", value: formatNumber(au, 2) },
            { label: "Kilometers", value: `${km.toExponential(4)} km` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stellar-parallax-calculator", "cosmic-distance-calculator", "light-travel-calculator"],
  faq: [
    { question: "What is a parsec?", answer: "A parsec is about 3.26 light years. It is the distance at which 1 AU subtends 1 arcsecond." },
    { question: "How far is a light year?", answer: "A light year is about 9.461 trillion km, the distance light travels in one year." },
  ],
  formula: "1 parsec = 3.26156 light years = 206,265 AU = 3.0857 x 10^13 km",
};

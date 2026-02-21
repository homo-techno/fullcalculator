import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ringSizeCalculator: CalculatorDefinition = {
  slug: "ring-size-calculator",
  title: "Ring Size Calculator",
  description: "Free ring size calculator. Convert finger circumference or diameter to US, UK, and EU ring sizes instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ring size calculator", "ring size chart", "ring size converter", "finger size", "ring measurement"],
  variants: [
    {
      id: "circumference",
      name: "From Circumference",
      fields: [
        { name: "circ", label: "Finger Circumference", type: "number", placeholder: "e.g. 52", suffix: "mm", step: 0.1 },
      ],
      calculate: (inputs) => {
        const circ = inputs.circ as number;
        if (!circ) return null;

        // US ring size from circumference in mm
        // Approximate: US size = (circ mm - 36.5) / 2.55
        const usSize = (circ - 36.5) / 2.55;
        const usRounded = Math.round(usSize * 2) / 2; // round to nearest 0.5

        // UK size: A=1, B=2... offset from US
        const ukLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        const ukIndex = Math.round((circ - 37.8) / 1.25);
        const ukSize = ukIndex >= 0 && ukIndex < ukLetters.length ? ukLetters[ukIndex] : "N/A";

        // EU size ≈ circumference in mm (rounded)
        const euSize = Math.round(circ);

        const diameter = circ / Math.PI;

        return {
          primary: { label: "US Ring Size", value: formatNumber(usRounded, 1) },
          details: [
            { label: "UK Ring Size", value: ukSize },
            { label: "EU Ring Size", value: `${euSize}` },
            { label: "Inner Circumference", value: `${formatNumber(circ, 1)} mm` },
            { label: "Inner Diameter", value: `${formatNumber(diameter, 1)} mm` },
          ],
          note: "Measure at end of day when fingers are warmest. Size can vary by 0.5–1 size between morning and evening.",
        };
      },
    },
    {
      id: "diameter",
      name: "From Diameter",
      fields: [
        { name: "diam", label: "Inner Diameter", type: "number", placeholder: "e.g. 16.5", suffix: "mm", step: 0.1 },
      ],
      calculate: (inputs) => {
        const diam = inputs.diam as number;
        if (!diam) return null;

        const circ = diam * Math.PI;
        const usSize = (circ - 36.5) / 2.55;
        const usRounded = Math.round(usSize * 2) / 2;

        const ukLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        const ukIndex = Math.round((circ - 37.8) / 1.25);
        const ukSize = ukIndex >= 0 && ukIndex < ukLetters.length ? ukLetters[ukIndex] : "N/A";

        const euSize = Math.round(circ);

        return {
          primary: { label: "US Ring Size", value: formatNumber(usRounded, 1) },
          details: [
            { label: "UK Ring Size", value: ukSize },
            { label: "EU Ring Size", value: `${euSize}` },
            { label: "Inner Diameter", value: `${formatNumber(diam, 1)} mm` },
            { label: "Inner Circumference", value: `${formatNumber(circ, 1)} mm` },
          ],
          note: "Place an existing ring on a ruler to measure its inner diameter in mm.",
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter", "bra-size-calculator"],
  faq: [
    { question: "How do I measure my ring size at home?", answer: "Wrap a thin strip of paper around your finger, mark where it overlaps, and measure the length in mm. That is your circumference. Alternatively, measure the inner diameter of a ring that fits well." },
    { question: "What is the most common ring size?", answer: "The most common women's ring size is US 6 (circumference ~52mm). The most common men's ring size is US 10 (circumference ~62.1mm)." },
    { question: "Do US and EU ring sizes differ?", answer: "Yes. EU sizes are based on the inner circumference in mm (e.g., EU 52). US sizes use a numbered scale (e.g., US 6 ≈ EU 52)." },
  ],
  formula: "US size ≈ (circumference mm − 36.5) / 2.55 | EU size ≈ circumference mm",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const braSizeCalculator: CalculatorDefinition = {
  slug: "bra-size-calculator",
  title: "Bra Size Calculator",
  description: "Free bra size calculator. Measure your band and bust to find your perfect bra size in US and UK sizing systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bra size calculator", "bra fitting", "bra measurement", "cup size calculator", "band size calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Bra Size",
      description: "Enter your underbust and bust measurements in inches",
      fields: [
        { name: "underbust", label: "Under-Bust Measurement", type: "number", placeholder: "e.g. 32", suffix: "in", min: 20, max: 60 },
        { name: "bust", label: "Bust Measurement", type: "number", placeholder: "e.g. 36", suffix: "in", min: 20, max: 70 },
      ],
      calculate: (inputs) => {
        const underbust = inputs.underbust as number;
        const bust = inputs.bust as number;
        if (!underbust || !bust) return null;

        // Band size: round to nearest even number
        let band = Math.round(underbust);
        if (band % 2 !== 0) band += 1;

        const diff = Math.round(bust - band);
        const cupSizesUS = ["AA", "A", "B", "C", "D", "DD", "DDD/F", "G", "H", "I", "J"];
        const cupSizesUK = ["AA", "A", "B", "C", "D", "DD", "E", "F", "FF", "G", "GG", "H"];

        const cupIndex = Math.max(0, Math.min(diff, cupSizesUS.length - 1));
        const usCup = cupSizesUS[cupIndex] || "N/A";
        const ukCup = cupSizesUK[cupIndex] || "N/A";

        const usSize = `${band}${usCup}`;
        const ukSize = `${band}${ukCup}`;

        const sisterUp = `${band + 2}${cupSizesUS[Math.max(0, cupIndex - 1)] || "AA"}`;
        const sisterDown = cupIndex + 1 < cupSizesUS.length ? `${Math.max(28, band - 2)}${cupSizesUS[cupIndex + 1]}` : "N/A";

        return {
          primary: { label: "US Bra Size", value: usSize },
          details: [
            { label: "UK Bra Size", value: ukSize },
            { label: "Band Size", value: `${band}` },
            { label: "Cup Size (US)", value: usCup },
            { label: "Cup Size (UK)", value: ukCup },
            { label: "Bust-Band Difference", value: `${diff}"` },
            { label: "Sister Size (up)", value: sisterUp },
            { label: "Sister Size (down)", value: sisterDown },
          ],
          note: "For best results, measure while wearing a non-padded bra. Sizing varies between brands — always try before buying.",
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter", "body-fat-calculator"],
  faq: [
    { question: "How do I measure my bra size?", answer: "Measure your underbust (ribcage directly under your breasts) and your bust (fullest part) with a soft tape measure. Keep the tape snug but not tight. Round the underbust to the nearest even number for your band size, and the difference between bust and band determines your cup size." },
    { question: "What is a sister size?", answer: "Sister sizes are bra sizes with the same cup volume but different band sizes. For example, 34C, 32D, and 36B all hold the same cup volume. Going up a band means going down a cup, and vice versa." },
    { question: "Do US and UK bra sizes differ?", answer: "Band sizes are the same in US and UK systems, but cup sizes diverge after D. US uses DD, DDD/F, G... while UK uses DD, E, F, FF, G, GG..." },
  ],
  formula: "Band = round underbust to nearest even number | Cup = bust − band (1\"=A, 2\"=B, 3\"=C, 4\"=D, 5\"=DD)",
};

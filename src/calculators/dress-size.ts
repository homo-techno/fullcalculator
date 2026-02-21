import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dressSizeCalculator: CalculatorDefinition = {
  slug: "dress-size-calculator",
  title: "Dress Size Calculator",
  description: "Free dress size calculator. Convert body measurements to US, UK, and EU dress sizes for women.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dress size calculator", "dress size chart", "US to UK dress size", "EU dress size converter", "women's dress size"],
  variants: [
    {
      id: "measurements-inches",
      name: "From Measurements (inches)",
      description: "Find your dress size from bust, waist, and hip measurements in inches",
      fields: [
        { name: "bust", label: "Bust", type: "number", placeholder: "e.g. 36", suffix: "in", step: 0.5 },
        { name: "waist", label: "Waist", type: "number", placeholder: "e.g. 28", suffix: "in", step: 0.5 },
        { name: "hips", label: "Hips", type: "number", placeholder: "e.g. 38", suffix: "in", step: 0.5 },
      ],
      calculate: (inputs) => {
        const bust = inputs.bust as number;
        const waist = inputs.waist as number;
        const hips = inputs.hips as number;
        if (!bust || !waist || !hips) return null;

        // US dress sizes based on bust measurement primarily
        // Standard US sizing: size 0 starts at ~31" bust, each size +1" bust
        const sizeChart = [
          { us: 0, uk: 4, eu: 32, bust: [31, 32], waist: [23, 24], hips: [33.5, 34.5] },
          { us: 2, uk: 6, eu: 34, bust: [32, 33], waist: [24, 25], hips: [34.5, 35.5] },
          { us: 4, uk: 8, eu: 36, bust: [33, 34], waist: [25, 26], hips: [35.5, 36.5] },
          { us: 6, uk: 10, eu: 38, bust: [34, 35], waist: [26, 27], hips: [36.5, 37.5] },
          { us: 8, uk: 12, eu: 40, bust: [35, 36], waist: [27, 28], hips: [37.5, 38.5] },
          { us: 10, uk: 14, eu: 42, bust: [36, 37], waist: [28, 29], hips: [38.5, 39.5] },
          { us: 12, uk: 16, eu: 44, bust: [37.5, 39], waist: [29.5, 31], hips: [40, 41.5] },
          { us: 14, uk: 18, eu: 46, bust: [39, 40.5], waist: [31, 32.5], hips: [41.5, 43] },
          { us: 16, uk: 20, eu: 48, bust: [40.5, 42], waist: [32.5, 34], hips: [43, 44.5] },
          { us: 18, uk: 22, eu: 50, bust: [42, 44], waist: [34, 36], hips: [44.5, 46.5] },
          { us: 20, uk: 24, eu: 52, bust: [44, 46], waist: [36, 38], hips: [46.5, 48.5] },
        ];

        // Find best match based on bust
        let bestMatch = sizeChart[0];
        let minDiff = Infinity;
        for (const size of sizeChart) {
          const mid = (size.bust[0] + size.bust[1]) / 2;
          const diff = Math.abs(bust - mid);
          if (diff < minDiff) {
            minDiff = diff;
            bestMatch = size;
          }
        }

        // Check if waist/hips suggest a different size
        let fitNote = "Standard fit";
        const bustMid = (bestMatch.bust[0] + bestMatch.bust[1]) / 2;
        const waistMid = (bestMatch.waist[0] + bestMatch.waist[1]) / 2;
        const hipMid = (bestMatch.hips[0] + bestMatch.hips[1]) / 2;

        if (waist > bestMatch.waist[1] + 1) fitNote = "Consider sizing up — waist runs larger than bust size suggests";
        else if (hips > bestMatch.hips[1] + 1) fitNote = "Consider sizing up — hips run larger than bust size suggests";
        else if (waist < bestMatch.waist[0] - 1 && hips < bestMatch.hips[0] - 1) fitNote = "May need tailoring — waist and hips run smaller than bust";

        return {
          primary: { label: "US Dress Size", value: `${bestMatch.us}` },
          details: [
            { label: "UK Size", value: `${bestMatch.uk}` },
            { label: "EU Size", value: `${bestMatch.eu}` },
            { label: "Size Range Bust", value: `${bestMatch.bust[0]}-${bestMatch.bust[1]} in` },
            { label: "Size Range Waist", value: `${bestMatch.waist[0]}-${bestMatch.waist[1]} in` },
            { label: "Size Range Hips", value: `${bestMatch.hips[0]}-${bestMatch.hips[1]} in` },
            { label: "Fit Note", value: fitNote },
          ],
          note: "Dress sizes vary significantly between brands. Always check the brand's specific size chart. When between sizes, size up for comfort.",
        };
      },
    },
    {
      id: "measurements-cm",
      name: "From Measurements (cm)",
      description: "Find your dress size from bust, waist, and hip measurements in centimeters",
      fields: [
        { name: "bustCm", label: "Bust", type: "number", placeholder: "e.g. 91", suffix: "cm", step: 1 },
        { name: "waistCm", label: "Waist", type: "number", placeholder: "e.g. 71", suffix: "cm", step: 1 },
        { name: "hipsCm", label: "Hips", type: "number", placeholder: "e.g. 97", suffix: "cm", step: 1 },
      ],
      calculate: (inputs) => {
        const bustCm = inputs.bustCm as number;
        const waistCm = inputs.waistCm as number;
        const hipsCm = inputs.hipsCm as number;
        if (!bustCm || !waistCm || !hipsCm) return null;

        const bust = bustCm / 2.54;
        const waist = waistCm / 2.54;
        const hips = hipsCm / 2.54;

        const sizeChart = [
          { us: 0, uk: 4, eu: 32, bust: [31, 32], waist: [23, 24], hips: [33.5, 34.5] },
          { us: 2, uk: 6, eu: 34, bust: [32, 33], waist: [24, 25], hips: [34.5, 35.5] },
          { us: 4, uk: 8, eu: 36, bust: [33, 34], waist: [25, 26], hips: [35.5, 36.5] },
          { us: 6, uk: 10, eu: 38, bust: [34, 35], waist: [26, 27], hips: [36.5, 37.5] },
          { us: 8, uk: 12, eu: 40, bust: [35, 36], waist: [27, 28], hips: [37.5, 38.5] },
          { us: 10, uk: 14, eu: 42, bust: [36, 37], waist: [28, 29], hips: [38.5, 39.5] },
          { us: 12, uk: 16, eu: 44, bust: [37.5, 39], waist: [29.5, 31], hips: [40, 41.5] },
          { us: 14, uk: 18, eu: 46, bust: [39, 40.5], waist: [31, 32.5], hips: [41.5, 43] },
          { us: 16, uk: 20, eu: 48, bust: [40.5, 42], waist: [32.5, 34], hips: [43, 44.5] },
          { us: 18, uk: 22, eu: 50, bust: [42, 44], waist: [34, 36], hips: [44.5, 46.5] },
          { us: 20, uk: 24, eu: 52, bust: [44, 46], waist: [36, 38], hips: [46.5, 48.5] },
        ];

        let bestMatch = sizeChart[0];
        let minDiff = Infinity;
        for (const size of sizeChart) {
          const mid = (size.bust[0] + size.bust[1]) / 2;
          const diff = Math.abs(bust - mid);
          if (diff < minDiff) {
            minDiff = diff;
            bestMatch = size;
          }
        }

        return {
          primary: { label: "US Dress Size", value: `${bestMatch.us}` },
          details: [
            { label: "UK Size", value: `${bestMatch.uk}` },
            { label: "EU Size", value: `${bestMatch.eu}` },
            { label: "Your Measurements", value: `${formatNumber(bustCm, 0)}-${formatNumber(waistCm, 0)}-${formatNumber(hipsCm, 0)} cm` },
            { label: "Converted (inches)", value: `${formatNumber(bust, 1)}-${formatNumber(waist, 1)}-${formatNumber(hips, 1)} in` },
          ],
          note: "Sizing varies between brands and designers. EU sizes are generally US + 30 (e.g., US 6 = EU 36). UK sizes are US + 4.",
        };
      },
    },
  ],
  relatedSlugs: ["body-measurement-calculator", "belt-size-calculator", "bra-size-calculator"],
  faq: [
    { question: "How do US, UK, and EU dress sizes compare?", answer: "US to UK: add 4 (US 6 = UK 10). US to EU: add ~30 (US 6 = EU 36). These are general guidelines — always check the specific brand's size chart." },
    { question: "How do I measure myself for a dress?", answer: "Bust: measure around the fullest part. Waist: measure at the natural waistline (narrowest point). Hips: measure around the fullest part of your hips/buttocks. Keep the tape level and snug but not tight." },
    { question: "What if I am between dress sizes?", answer: "If you are between sizes, generally size up for comfort. Many dresses can be altered. If your bust and hips suggest different sizes, choose based on the larger measurement and have the other areas tailored." },
  ],
  formula: "US to UK: add 4 | US to EU: add 30 | Size determined by bust, waist, and hip measurements",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyShapeCalculator: CalculatorDefinition = {
  slug: "body-shape-calculator",
  title: "Body Shape Calculator",
  description: "Free body shape calculator. Determine your body shape from bust, waist, and hip measurements with styling tips.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["body shape calculator", "body type calculator", "hourglass body", "pear shaped body", "apple body shape", "body measurements"],
  variants: [
    {
      id: "calc",
      name: "Determine Body Shape",
      fields: [
        { name: "bust", label: "Bust / Chest", type: "number", placeholder: "e.g. 36", suffix: "in", step: 0.5 },
        { name: "waist", label: "Waist (natural waist)", type: "number", placeholder: "e.g. 28", suffix: "in", step: 0.5 },
        { name: "hip", label: "Hips (widest point)", type: "number", placeholder: "e.g. 38", suffix: "in", step: 0.5 },
      ],
      calculate: (inputs) => {
        const bust = inputs.bust as number;
        const waist = inputs.waist as number;
        const hip = inputs.hip as number;
        if (!bust || !waist || !hip) return null;

        const bustHipRatio = bust / hip;
        const waistHipRatio = waist / hip;
        const waistBustRatio = waist / bust;

        // Determine body shape
        let shape: string;
        let description: string;
        let stylingTips: string;

        const bustHipDiff = Math.abs(bust - hip);
        const bustWaistDiff = bust - waist;
        const hipWaistDiff = hip - waist;

        if (bustHipDiff <= 2 && waist < bust - 6 && waist < hip - 6) {
          shape = "Hourglass";
          description = "Bust and hips are similar, with a well-defined, smaller waist. Classic proportional figure.";
          stylingTips = "Fitted styles, wrap dresses, belted waists, V-necks, and A-line skirts highlight your balanced proportions.";
        } else if (hip > bust + 3.6 && waist < hip - 6) {
          shape = "Pear (Triangle)";
          description = "Hips are wider than bust, with a defined waist. Weight tends to be carried in the lower body.";
          stylingTips = "Emphasize upper body with boat necks, structured shoulders, bright tops. A-line skirts and bootcut pants balance proportions.";
        } else if (waist >= hip - 4 && waist >= bust - 4) {
          shape = "Apple (Round)";
          description = "Waist is similar to or larger than bust and hips. Weight tends to be carried in the midsection.";
          stylingTips = "Empire waists, V-necks, vertical lines, structured jackets. Avoid clingy fabrics at the midsection. Highlight legs and neckline.";
        } else if (bustHipDiff <= 3.6 && bustWaistDiff < 6 && hipWaistDiff < 6) {
          shape = "Rectangle (Straight)";
          description = "Bust, waist, and hips are relatively similar in measurement. Athletic, straight-line figure.";
          stylingTips = "Create curves with peplum tops, belted dresses, ruffled necklines, and layered outfits. High-waisted bottoms add definition.";
        } else if (bust > hip + 3.6) {
          shape = "Inverted Triangle";
          description = "Shoulders and bust are wider than hips. Athletic upper body with narrower lower body.";
          stylingTips = "V-necks, scoop necklines, A-line skirts, wide-leg pants, and bold bottoms balance proportions. Avoid shoulder pads and boat necks.";
        } else if (bustHipDiff <= 3.6 && waist < bust - 4) {
          shape = "Hourglass";
          description = "Bust and hips are balanced with a noticeably smaller waist.";
          stylingTips = "Fitted, tailored clothes that follow your natural curves. Wrap dresses, belts, and structured garments work well.";
        } else {
          shape = "Spoon";
          description = "Hips are noticeably larger than bust, with a defined waist. Similar to pear but with a more pronounced shelf hip.";
          stylingTips = "Similar to pear — emphasize your upper body and waist. Structured tops, statement necklines, and A-line bottoms.";
        }

        return {
          primary: { label: "Body Shape", value: shape },
          details: [
            { label: "Description", value: description },
            { label: "Bust", value: `${formatNumber(bust, 1)} in` },
            { label: "Waist", value: `${formatNumber(waist, 1)} in` },
            { label: "Hips", value: `${formatNumber(hip, 1)} in` },
            { label: "Bust-to-Hip Ratio", value: formatNumber(bustHipRatio, 2) },
            { label: "Waist-to-Hip Ratio (WHR)", value: formatNumber(waistHipRatio, 2) },
            { label: "Waist-to-Bust Ratio", value: formatNumber(waistBustRatio, 2) },
            { label: "Styling Tips", value: stylingTips },
          ],
          note: "Body shapes are general categories. Most people are a blend of types. A healthy waist-to-hip ratio is typically below 0.85 for women and 0.90 for men.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "bmi-prime-calculator", "body-fat-calculator", "waist-hip-ratio-calculator", "bra-size-calculator"],
  faq: [
    { question: "What are the main body shapes?", answer: "The five main body shapes are: Hourglass (bust ≈ hips, small waist), Pear/Triangle (hips wider than bust), Apple/Round (waist ≈ bust and hips), Rectangle (all measurements similar), and Inverted Triangle (bust wider than hips)." },
    { question: "How do I measure my bust, waist, and hips?", answer: "Bust: around the fullest part of the chest. Waist: at the natural waistline (narrowest point, usually above the belly button). Hips: around the widest part of the hip/buttock area. Measure with a soft tape, snug but not tight." },
    { question: "What is a healthy waist-to-hip ratio?", answer: "A WHR below 0.85 for women and below 0.90 for men is associated with lower health risks. Higher ratios may indicate increased risk of cardiovascular disease and diabetes, regardless of overall weight." },
  ],
  formula: "Hourglass: bust ≈ hip, waist < bust−6\" | Pear: hip > bust+3.6\" | Apple: waist ≈ bust ≈ hip | Rectangle: all within 5% | Inverted Triangle: bust > hip+3.6\"",
};

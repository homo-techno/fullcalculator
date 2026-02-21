import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uvIndexCalculator: CalculatorDefinition = {
  slug: "uv-index-calculator",
  title: "UV Index Calculator",
  description: "Free UV index calculator. Understand UV risk levels, recommended SPF, and safe sun exposure times for different skin types.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["uv index calculator", "uv index scale", "sun exposure calculator", "spf calculator", "uv risk level"],
  variants: [
    {
      id: "calc",
      name: "UV Index Risk Assessment",
      fields: [
        { name: "uvIndex", label: "UV Index Value", type: "number", placeholder: "e.g. 7", min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const uv = inputs.uvIndex as number;
        if (uv === undefined || uv === null || uv < 0) return null;

        let riskLevel: string;
        let riskColor: string;
        let precautions: string;
        let spf: string;

        if (uv <= 2) {
          riskLevel = "Low";
          riskColor = "Green";
          precautions = "Minimal protection needed. Wear sunglasses on bright days.";
          spf = "SPF 15 if outside for extended periods";
        } else if (uv <= 5) {
          riskLevel = "Moderate";
          riskColor = "Yellow";
          precautions = "Stay in shade near midday. Wear protective clothing, hat, sunglasses, and sunscreen.";
          spf = "SPF 30+";
        } else if (uv <= 7) {
          riskLevel = "High";
          riskColor = "Orange";
          precautions = "Reduce sun exposure 10am–4pm. Apply SPF 30+ sunscreen, wear hat and protective clothing.";
          spf = "SPF 30–50";
        } else if (uv <= 10) {
          riskLevel = "Very High";
          riskColor = "Red";
          precautions = "Minimize sun exposure 10am–4pm. Seek shade, wear protective clothing, apply SPF 50+ sunscreen liberally.";
          spf = "SPF 50+";
        } else {
          riskLevel = "Extreme";
          riskColor = "Purple";
          precautions = "Avoid sun exposure 10am–4pm if possible. Full protection essential: shade, clothing, SPF 50+, hat, sunglasses.";
          spf = "SPF 50+ (reapply every 60–80 min)";
        }

        // Safe exposure time estimates (minutes) by skin type
        // Approximate: base MED (Minimal Erythemal Dose) / UV index
        const skinType1 = Math.max(5, Math.round(200 / (uv * 2.5))); // Very fair
        const skinType2 = Math.max(5, Math.round(250 / (uv * 2.5))); // Fair
        const skinType3 = Math.max(10, Math.round(350 / (uv * 2.5))); // Medium
        const skinType4 = Math.max(15, Math.round(450 / (uv * 2.5))); // Olive
        const skinType5 = Math.max(20, Math.round(600 / (uv * 2.5))); // Brown
        const skinType6 = Math.max(30, Math.round(800 / (uv * 2.5))); // Dark

        // Vitamin D production time (rough estimate)
        const vitDMin = Math.max(5, Math.round(100 / uv));

        return {
          primary: { label: "Risk Level", value: `${riskLevel} (${riskColor})` },
          details: [
            { label: "UV Index", value: `${uv}` },
            { label: "Recommended SPF", value: spf },
            { label: "Precautions", value: precautions },
            { label: "Safe Exposure — Very Fair Skin", value: `~${skinType1} min` },
            { label: "Safe Exposure — Fair Skin", value: `~${skinType2} min` },
            { label: "Safe Exposure — Medium Skin", value: `~${skinType3} min` },
            { label: "Safe Exposure — Olive Skin", value: `~${skinType4} min` },
            { label: "Safe Exposure — Brown Skin", value: `~${skinType5} min` },
            { label: "Safe Exposure — Dark Skin", value: `~${skinType6} min` },
            { label: "Vitamin D Production", value: `~${vitDMin} min of midday sun (arms/face exposed)` },
          ],
          note: "Exposure times are rough estimates and depend on many factors including skin type, time of day, altitude, and reflection from surfaces. Always err on the side of caution.",
        };
      },
    },
  ],
  relatedSlugs: ["beaufort-scale-calculator", "humidity-calculator", "bmi-calculator"],
  faq: [
    { question: "What UV index is dangerous?", answer: "UV Index 6–7 is considered high risk. UV 8–10 is very high risk, and UV 11+ is extreme. Even moderate UV (3–5) can cause sunburn with prolonged exposure, especially for fair-skinned individuals." },
    { question: "What does UV index mean?", answer: "The UV index is a measure of the strength of ultraviolet radiation from the sun at a particular place and time. Higher values mean greater risk of skin and eye damage. It ranges from 0 (nighttime) to 11+ (extreme)." },
    { question: "When is UV index highest?", answer: "UV is typically highest between 10am and 4pm, especially from late spring to early fall. UV is stronger at higher altitudes, near the equator, and around reflective surfaces like water, sand, and snow." },
  ],
  formula: "Risk: Low (1-2), Moderate (3-5), High (6-7), Very High (8-10), Extreme (11+) | Safe exposure ≈ MED / (UV × 2.5) minutes",
};

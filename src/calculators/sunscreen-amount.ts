import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sunscreenAmountCalculator: CalculatorDefinition = {
  slug: "sunscreen-amount-calculator",
  title: "Sunscreen Amount Calculator",
  description: "Free sunscreen calculator. Calculate how much sunscreen to apply for proper SPF protection based on body area and activity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sunscreen calculator", "how much sunscreen to use", "SPF calculator", "sunscreen amount", "sunblock calculator"],
  variants: [
    {
      id: "body-coverage",
      name: "Full Body Application",
      description: "Calculate sunscreen needed for your body based on areas exposed",
      fields: [
        { name: "coverage", label: "Body Areas Exposed", type: "select", options: [
          { label: "Face & neck only", value: "face" },
          { label: "Face, neck & arms", value: "upper" },
          { label: "Upper body (face, neck, arms, chest)", value: "upperbody" },
          { label: "Full body (beach/pool)", value: "full" },
        ], defaultValue: "upper" },
        { name: "buildSize", label: "Body Build", type: "select", options: [
          { label: "Small / petite", value: "0.8" },
          { label: "Average", value: "1.0" },
          { label: "Large / tall", value: "1.2" },
        ], defaultValue: "1.0" },
        { name: "hoursOutdoors", label: "Hours Outdoors", type: "number", placeholder: "e.g. 4", suffix: "hours", min: 1, max: 12, step: 0.5 },
        { name: "spf", label: "SPF Level", type: "select", options: [
          { label: "SPF 15", value: "15" },
          { label: "SPF 30", value: "30" },
          { label: "SPF 50", value: "50" },
          { label: "SPF 70+", value: "70" },
        ], defaultValue: "30" },
      ],
      calculate: (inputs) => {
        const coverage = inputs.coverage as string;
        const buildMultiplier = parseFloat(inputs.buildSize as string);
        const hours = inputs.hoursOutdoors as number;
        const spf = parseInt(inputs.spf as string);
        if (!hours) return null;

        // FDA recommendation: 2mg/cm² of sunscreen
        // Average adult body surface area ~18,000 cm²
        // Face+neck ~600cm², Arms ~2500cm², Chest/back ~3600cm², Legs ~6000cm²
        let areaCm2: number;
        if (coverage === "face") areaCm2 = 600;
        else if (coverage === "upper") areaCm2 = 3100;
        else if (coverage === "upperbody") areaCm2 = 6700;
        else areaCm2 = 15000;

        areaCm2 *= buildMultiplier;

        // 2mg/cm² = recommended density
        const amountMgPerApp = areaCm2 * 2;
        const amountMlPerApp = amountMgPerApp / 1000; // roughly 1g/ml for sunscreen
        const amountOzPerApp = amountMlPerApp / 29.5735;
        const teaspoonsPerApp = amountMlPerApp / 5;

        // Reapply every 2 hours
        const applications = Math.ceil(hours / 2);
        const totalMl = amountMlPerApp * applications;
        const totalOz = totalMl / 29.5735;

        // UVB protection percentage
        const uvbProtection = ((spf - 1) / spf) * 100;

        return {
          primary: { label: "Per Application", value: formatNumber(amountMlPerApp, 1), suffix: "ml" },
          details: [
            { label: "Per Application (tsp)", value: `${formatNumber(teaspoonsPerApp, 1)} tsp` },
            { label: "Per Application (oz)", value: `${formatNumber(amountOzPerApp, 1)} fl oz` },
            { label: "Reapplications Needed", value: `${applications} times` },
            { label: "Total for Day", value: `${formatNumber(totalMl, 0)} ml (${formatNumber(totalOz, 1)} fl oz)` },
            { label: `SPF ${spf} UVB Block`, value: `${formatNumber(uvbProtection, 1)}%` },
          ],
          note: "Reapply every 2 hours, or immediately after swimming or sweating. Most people apply only 25-50% of the recommended amount.",
        };
      },
    },
    {
      id: "face-only",
      name: "Face & Neck Only",
      description: "Quick calculation for daily facial sunscreen",
      fields: [
        { name: "productType", label: "Product Type", type: "select", options: [
          { label: "Lotion / cream", value: "lotion" },
          { label: "Spray", value: "spray" },
          { label: "Stick", value: "stick" },
        ], defaultValue: "lotion" },
      ],
      calculate: (inputs) => {
        const productType = inputs.productType as string;

        // Face ~300cm², neck ~300cm² = 600cm² at 2mg/cm²
        const amountMl = 1.2; // approximately 1/4 teaspoon for face, plus neck
        const fingerTips = 2; // two finger-length strips

        let applicationTip: string;
        if (productType === "lotion") {
          applicationTip = "Apply two finger-length strips (from tip to first crease) — one for face, one for neck.";
        } else if (productType === "spray") {
          applicationTip = "Spray generously until skin glistens, then rub in evenly. Sprays require more product for adequate coverage.";
        } else {
          applicationTip = "Apply 4+ passes over each area of your face. Sticks tend to apply less product, so be generous.";
        }

        return {
          primary: { label: "Amount Needed", value: `~${formatNumber(amountMl, 1)} ml` },
          details: [
            { label: "Finger-tip Units", value: `${fingerTips} strips` },
            { label: "Teaspoon Equivalent", value: "~1/4 teaspoon" },
            { label: "Nickel-size Dollops", value: "~2 dollops" },
            { label: "Application Tip", value: applicationTip },
          ],
          note: "Apply sunscreen as the last step of skincare, before makeup. Wait 15 minutes before sun exposure for chemical sunscreens.",
        };
      },
    },
  ],
  relatedSlugs: ["skin-type-calculator", "skincare-routine-calculator"],
  faq: [
    { question: "How much sunscreen should I apply to my face?", answer: "Apply about 1/4 teaspoon (1.2 ml) to your face, or two finger-length strips of product. Most people under-apply by 50-75%, which significantly reduces protection." },
    { question: "How often should I reapply sunscreen?", answer: "Reapply every 2 hours when outdoors, and immediately after swimming, sweating, or towel-drying. Even water-resistant sunscreen should be reapplied after 40-80 minutes of water activity." },
    { question: "What is the difference between SPF 30 and SPF 50?", answer: "SPF 30 blocks about 96.7% of UVB rays, while SPF 50 blocks about 98%. The difference is small but meaningful. SPF 15 blocks ~93.3%. No sunscreen blocks 100% of UV rays." },
    { question: "Does higher SPF mean I can stay out longer?", answer: "Technically yes, but dermatologists recommend reapplying every 2 hours regardless of SPF level. Higher SPF provides better protection at the same application thickness, especially since most people under-apply." },
  ],
  formula: "Sunscreen amount = Body surface area (cm²) × 2 mg/cm² | Face ≈ 1.2 ml (~1/4 tsp) | Full body ≈ 30 ml (~1 oz) | Reapply every 2 hours",
};

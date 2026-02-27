import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skinAgeCalculator: CalculatorDefinition = {
  slug: "skin-age-calculator",
  title: "Biological Skin Age Estimator",
  description:
    "Estimate your biological skin age based on lifestyle, sun exposure, skincare habits, and environmental factors. Identify areas for improvement to slow skin aging.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "skin age calculator",
    "biological skin age",
    "skin aging calculator",
    "how old does my skin look",
    "skin health calculator",
    "anti-aging calculator",
  ],
  variants: [
    {
      id: "assessment",
      name: "Skin Age Assessment",
      description: "Estimate biological skin age based on lifestyle factors",
      fields: [
        {
          name: "chronologicalAge",
          label: "Actual Age",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "years",
          min: 18,
          max: 90,
        },
        {
          name: "sunExposure",
          label: "Lifetime Sun Exposure",
          type: "select",
          options: [
            { label: "Minimal (mostly indoor, always SPF)", value: "minimal" },
            { label: "Low (occasional outdoor, usually SPF)", value: "low" },
            { label: "Moderate (regular outdoor, sometimes SPF)", value: "moderate" },
            { label: "High (frequent outdoor, rarely SPF)", value: "high" },
            { label: "Very high (outdoor work, tanning history)", value: "very_high" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "smoking",
          label: "Smoking History",
          type: "select",
          options: [
            { label: "Never smoked", value: "never" },
            { label: "Former smoker (quit 5+ years ago)", value: "former_long" },
            { label: "Former smoker (quit <5 years ago)", value: "former_recent" },
            { label: "Current smoker", value: "current" },
          ],
          defaultValue: "never",
        },
        {
          name: "skincare",
          label: "Skincare Routine",
          type: "select",
          options: [
            { label: "None / minimal", value: "none" },
            { label: "Basic (cleanser + moisturizer)", value: "basic" },
            { label: "Good (+ SPF daily + retinoid)", value: "good" },
            { label: "Comprehensive (+ serums, treatments)", value: "comprehensive" },
          ],
          defaultValue: "basic",
        },
        {
          name: "sleep",
          label: "Average Sleep Quality",
          type: "select",
          options: [
            { label: "Poor (<5 hours regularly)", value: "poor" },
            { label: "Fair (5-6 hours)", value: "fair" },
            { label: "Good (7-8 hours)", value: "good" },
            { label: "Excellent (7-9 hours, consistent)", value: "excellent" },
          ],
          defaultValue: "good",
        },
        {
          name: "hydration",
          label: "Hydration / Diet Quality",
          type: "select",
          options: [
            { label: "Poor (low water, high sugar/processed)", value: "poor" },
            { label: "Average", value: "average" },
            { label: "Good (adequate water, balanced diet)", value: "good" },
            { label: "Excellent (antioxidant-rich, well-hydrated)", value: "excellent" },
          ],
          defaultValue: "good",
        },
        {
          name: "stress",
          label: "Chronic Stress Level",
          type: "select",
          options: [
            { label: "Low", value: "low" },
            { label: "Moderate", value: "moderate" },
            { label: "High", value: "high" },
            { label: "Very high / chronic", value: "very_high" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.chronologicalAge as string);
        const sun = inputs.sunExposure as string;
        const smoking = inputs.smoking as string;
        const skincare = inputs.skincare as string;
        const sleep = inputs.sleep as string;
        const hydration = inputs.hydration as string;
        const stress = inputs.stress as string;
        if (!age) return null;

        // Each factor adds or subtracts years from chronological age
        let adjustment = 0;

        // Sun exposure (biggest aging factor -- photoaging accounts for ~80% of visible aging)
        const sunAdj: Record<string, number> = { minimal: -3, low: -1, moderate: 1, high: 4, very_high: 8 };
        adjustment += sunAdj[sun] || 0;

        // Smoking
        const smokingAdj: Record<string, number> = { never: 0, former_long: 1, former_recent: 3, current: 6 };
        adjustment += smokingAdj[smoking] || 0;

        // Skincare routine
        const skincareAdj: Record<string, number> = { none: 3, basic: 1, good: -2, comprehensive: -4 };
        adjustment += skincareAdj[skincare] || 0;

        // Sleep
        const sleepAdj: Record<string, number> = { poor: 4, fair: 2, good: 0, excellent: -2 };
        adjustment += sleepAdj[sleep] || 0;

        // Hydration / diet
        const hydrationAdj: Record<string, number> = { poor: 3, average: 1, good: 0, excellent: -2 };
        adjustment += hydrationAdj[hydration] || 0;

        // Stress
        const stressAdj: Record<string, number> = { low: -1, moderate: 1, high: 3, very_high: 5 };
        adjustment += stressAdj[stress] || 0;

        const skinAge = Math.max(age - 10, Math.min(age + 20, age + adjustment));
        const difference = skinAge - age;

        let verdict: string;
        if (difference <= -5) verdict = "Excellent -- skin aging much slower than average";
        else if (difference <= -2) verdict = "Good -- skin aging slower than average";
        else if (difference <= 2) verdict = "Average -- skin aging at normal rate";
        else if (difference <= 5) verdict = "Above average aging -- room for improvement";
        else verdict = "Accelerated aging -- lifestyle changes recommended";

        // Top recommendation
        const recommendations: string[] = [];
        if (sunAdj[sun]! > 0) recommendations.push("Daily SPF 30+ sunscreen");
        if (smokingAdj[smoking]! > 2) recommendations.push("Quit smoking");
        if (skincareAdj[skincare]! > 0) recommendations.push("Add retinoid and SPF to routine");
        if (sleepAdj[sleep]! > 1) recommendations.push("Improve sleep quality and duration");
        if (hydrationAdj[hydration]! > 1) recommendations.push("Increase water and antioxidant-rich foods");
        if (stressAdj[stress]! > 2) recommendations.push("Stress management practices");

        return {
          primary: { label: "Estimated Skin Age", value: `${formatNumber(skinAge, 0)} years` },
          details: [
            { label: "Actual Age", value: `${formatNumber(age, 0)} years` },
            { label: "Difference", value: `${difference > 0 ? "+" : ""}${formatNumber(difference, 0)} years` },
            { label: "Assessment", value: verdict },
            { label: "Top Recommendation", value: recommendations[0] || "Maintain current habits" },
            { label: "Biggest Factor", value: "Sun exposure (accounts for ~80% of visible skin aging)" },
          ],
          note: "This is an educational estimate based on known skin aging factors, not a clinical assessment. The single most impactful change for skin aging is daily broad-spectrum SPF 30+ sunscreen. Retinoids (tretinoin) are the most evidence-backed anti-aging ingredient.",
        };
      },
    },
  ],
  relatedSlugs: ["botox-cost-calculator", "collagen-intake-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What causes skin to age faster?",
      answer:
        "UV sun exposure is the leading cause of premature skin aging (photoaging), responsible for up to 80% of visible aging signs. Other major factors include smoking, poor sleep, chronic stress, dehydration, high-sugar diets, pollution, and lack of skincare. Genetics also play a role but are less modifiable.",
    },
    {
      question: "What is the most effective anti-aging skincare ingredient?",
      answer:
        "Retinoids (tretinoin/retinol) have the most clinical evidence for anti-aging. They boost collagen production, increase cell turnover, and reduce fine lines. Sunscreen is technically the most important product for preventing aging. Other effective ingredients include vitamin C, niacinamide, and peptides.",
    },
    {
      question: "At what age should you start an anti-aging routine?",
      answer:
        "Prevention is best -- daily sunscreen should start in childhood. A retinoid can be introduced in the mid-to-late 20s, when collagen production begins declining (~1% per year after 25). A basic routine of cleanser, sunscreen, and moisturizer benefits everyone regardless of age.",
    },
  ],
  formula:
    "Skin Age = Chronological Age + Sun Adjustment + Smoking Adj + Skincare Adj + Sleep Adj + Diet Adj + Stress Adj",
};
